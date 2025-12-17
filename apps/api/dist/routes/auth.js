"use strict";
let __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        let desc = Object.getOwnPropertyDescriptor(m, k);
        if (
          !desc ||
          ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)
        ) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            },
          };
        }
        Object.defineProperty(o, k2, desc);
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
let __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
      }
    : function (o, v) {
        o["default"] = v;
      });
let __importStar =
  (this && this.__importStar) ||
  (function () {
    let ownKeys = function (o) {
      ownKeys =
        Object.getOwnPropertyNames ||
        function (o) {
          let ar = [];
          for (var k in o)
            if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
          return ar;
        };
      return ownKeys(o);
    };
    return function (mod) {
      if (mod && mod.__esModule) return mod;
      let result = {};
      if (mod != null)
        for (var k = ownKeys(mod), i = 0; i < k.length; i++)
          if (k[i] !== "default") __createBinding(result, mod, k[i]);
      __setModuleDefault(result, mod);
      return result;
    };
  })();
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = authRoutes;
const zod_1 = require("zod");
const db_1 = require("../db");
const argon2 = __importStar(require("argon2"));
const crypto_1 = require("crypto");
const username_1 = require("../lib/username");
const rate_limit_1 = require("../lib/rate-limit");
// Schemas
const userSchema = zod_1.z.object({
  name: zod_1.z.string().nullable().optional(),
  email: zod_1.z.string().email().nullable().optional(),
  emailVerified: zod_1.z.string().datetime().nullable().optional(), // Date as string
  image: zod_1.z.string().nullable().optional(),
  firstName: zod_1.z.string().nullable().optional(),
  lastName: zod_1.z.string().nullable().optional(),
  username: zod_1.z.string().nullable().optional(),
});
const accountSchema = zod_1.z.object({
  userId: zod_1.z.string(),
  type: zod_1.z.string(),
  provider: zod_1.z.string(),
  providerAccountId: zod_1.z.string(),
  refresh_token: zod_1.z.string().nullable().optional(),
  access_token: zod_1.z.string().nullable().optional(),
  expires_at: zod_1.z.number().nullable().optional(),
  token_type: zod_1.z.string().nullable().optional(),
  scope: zod_1.z.string().nullable().optional(),
  id_token: zod_1.z.string().nullable().optional(),
  session_state: zod_1.z.string().nullable().optional(),
});
const registerSchema = zod_1.z.object({
  email: zod_1.z.string().email(),
  password: zod_1.z.string().min(8),
  firstName: zod_1.z.string().min(2),
  lastName: zod_1.z.string().min(2),
  role: zod_1.z.enum(["TEACHER", "STUDENT"]),
  phoneNumber: zod_1.z.string().optional(),
  marketingConsent: zod_1.z.boolean().optional(),
  preferredCountry: zod_1.z.string().optional(),
  preferredTimezone: zod_1.z.string().optional(),
});
const verifyEmailSchema = zod_1.z.object({
  token: zod_1.z.string(),
});
const resendVerificationSchema = zod_1.z.object({
  email: zod_1.z.string().email(),
});
const forgotPasswordSchema = zod_1.z.object({
  email: zod_1.z.string().email(),
});
const resetPasswordSchema = zod_1.z.object({
  token: zod_1.z.string(),
  password: zod_1.z.string().min(8),
});
const verifyEmailChangeSchema = zod_1.z.object({
  token: zod_1.z.string(),
});
async function authRoutes(fastify) {
  // --- Adapter Routes ---
  // Create User
  fastify.post("/adapter/user", async (request, reply) => {
    const data = userSchema.parse(request.body);
    return await db_1.db.user.create({
      data: {
        ...data,
        emailVerified: data.emailVerified ? new Date(data.emailVerified) : null,
      },
    });
  });
  // Get User by ID
  fastify.get("/adapter/user/:id", async (request, reply) => {
    const { id } = request.params;
    const user = await db_1.db.user.findUnique({ where: { id } });
    if (!user) return reply.code(404).send(null);
    return user;
  });
  // Get User by Email
  fastify.get("/adapter/user/email/:email", async (request, reply) => {
    const { email } = request.params;
    const user = await db_1.db.user.findUnique({ where: { email } });
    if (!user) return reply.code(404).send(null);
    return user;
  });
  // Verify Credentials
  fastify.post("/adapter/verify-credentials", async (request, reply) => {
    const { ip } = request;
    const { success } = await rate_limit_1.loginRateLimit.limit(ip);
    if (!success) {
      return reply.code(429).send({ error: "Too many requests" });
    }
    const { email, password } = zod_1.z
      .object({ email: zod_1.z.string().email(), password: zod_1.z.string() })
      .parse(request.body);
    const user = await db_1.db.user.findUnique({ where: { email } });
    if (!user || !user.password) {
      return reply.code(401).send(null);
    }
    const valid = await argon2.verify(user.password, password);
    if (!valid) {
      return reply.code(401).send(null);
    }
    return user;
  });
  // Get User by Account
  fastify.get(
    "/adapter/user/account/:provider/:providerAccountId",
    async (request, reply) => {
      const { provider, providerAccountId } = request.params;
      const account = await db_1.db.account.findUnique({
        where: { provider_providerAccountId: { provider, providerAccountId } },
        include: { user: true },
      });
      if (!account) return reply.code(404).send(null);
      return account.user;
    }
  );
  // Get User by Username
  fastify.get("/adapter/user/username/:username", async (request, reply) => {
    const { username } = request.params;
    const user = await db_1.db.user.findUnique({ where: { username } });
    if (!user) return reply.code(404).send(null);
    return user;
  });
  // Update User
  fastify.patch("/adapter/user/:id", async (request, reply) => {
    const { id } = request.params;
    const data = userSchema.partial().parse(request.body);
    return await db_1.db.user.update({
      where: { id },
      data: {
        ...data,
        emailVerified: data.emailVerified
          ? new Date(data.emailVerified)
          : undefined,
      },
    });
  });
  // Delete User
  fastify.delete("/adapter/user/:id", async (request, reply) => {
    const { id } = request.params;
    await db_1.db.user.delete({ where: { id } });
    return { success: true };
  });
  // Link Account
  fastify.post("/adapter/account", async (request, reply) => {
    const data = accountSchema.parse(request.body);
    return await db_1.db.account.create({ data });
  });
  // Unlink Account
  fastify.delete(
    "/adapter/account/:provider/:providerAccountId",
    async (request, reply) => {
      const { provider, providerAccountId } = request.params;
      await db_1.db.account.delete({
        where: { provider_providerAccountId: { provider, providerAccountId } },
      });
      return { success: true };
    }
  );
  // --- Auth Actions ---
  // Register
  fastify.post("/register", async (request, reply) => {
    const data = registerSchema.parse(request.body);
    const existingUser = await db_1.db.user.findUnique({
      where: { email: data.email },
    });
    if (existingUser) return reply.code(400).send({ error: "user_exists" });
    const hashedPassword = await argon2.hash(data.password);
    const username = await (0, username_1.generateUniqueUsername)(
      data.firstName,
      data.lastName
    );
    const token = (0, crypto_1.randomBytes)(32).toString("hex");
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await db_1.db.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: data.email,
          username,
          password: hashedPassword,
          firstName: data.firstName,
          lastName: data.lastName,
          role: data.role,
          phoneNumber: data.phoneNumber,
          name: `${data.firstName} ${data.lastName}`,
          isOnboardingCompleted: true,
          isMarketingConsent: data.marketingConsent || false,
          preferredCountry: data.preferredCountry || "US",
          preferredTimezone: data.preferredTimezone || "UTC",
        },
      });
      if (data.role === "TEACHER") {
        await tx.teacherProfile.create({
          data: { userId: user.id, branch: "Genel" },
        });
      } else {
        await tx.studentProfile.create({
          data: { userId: user.id, isClaimed: true },
        });
      }
      await tx.verificationToken.create({
        data: { identifier: data.email, token, expires },
      });
    });
    return { success: true, token };
  });
  // Verify Email
  fastify.post("/verify-email", async (request, reply) => {
    const { token } = verifyEmailSchema.parse(request.body);
    const verificationToken = await db_1.db.verificationToken.findUnique({
      where: { token },
    });
    if (!verificationToken)
      return reply.code(400).send({ error: "invalid_token" });
    const hasExpired = new Date(verificationToken.expires) < new Date();
    if (hasExpired) return reply.code(400).send({ error: "token_expired" });
    const existingUser = await db_1.db.user.findUnique({
      where: { email: verificationToken.identifier },
    });
    if (!existingUser) return reply.code(400).send({ error: "user_not_found" });
    await db_1.db.user.update({
      where: { id: existingUser.id },
      data: { emailVerified: new Date(), email: verificationToken.identifier },
    });
    await db_1.db.verificationToken.delete({ where: { token } });
    return { success: true };
  });
  // Resend Verification
  fastify.post("/resend-verification", async (request, reply) => {
    const { email } = resendVerificationSchema.parse(request.body);
    const existingUser = await db_1.db.user.findUnique({ where: { email } });
    if (!existingUser) return reply.code(400).send({ error: "user_not_found" });
    if (existingUser.emailVerified)
      return reply.code(400).send({ error: "already_verified" });
    await db_1.db.verificationToken.deleteMany({
      where: { identifier: email },
    });
    const token = (0, crypto_1.randomBytes)(32).toString("hex");
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await db_1.db.verificationToken.create({
      data: { identifier: email, token, expires },
    });
    return { success: true, token };
  });
  // Forgot Password
  fastify.post("/forgot-password", async (request, reply) => {
    const { email } = forgotPasswordSchema.parse(request.body);
    const user = await db_1.db.user.findUnique({ where: { email } });
    if (!user) return reply.code(400).send({ error: "user_not_found" });
    await db_1.db.passwordResetToken.deleteMany({ where: { email } });
    const token = (0, crypto_1.randomBytes)(32).toString("hex");
    const expires = new Date(Date.now() + 3600 * 1000); // 1 hour
    await db_1.db.passwordResetToken.create({
      data: { email, token, expires },
    });
    return { success: true, token };
  });
  // Reset Password
  fastify.post("/reset-password", async (request, reply) => {
    const { token, password } = resetPasswordSchema.parse(request.body);
    const existingToken = await db_1.db.passwordResetToken.findUnique({
      where: { token },
    });
    if (!existingToken) return reply.code(400).send({ error: "invalid_token" });
    const hasExpired = new Date(existingToken.expires) < new Date();
    if (hasExpired) return reply.code(400).send({ error: "token_expired" });
    const existingUser = await db_1.db.user.findUnique({
      where: { email: existingToken.email },
    });
    if (!existingUser) return reply.code(400).send({ error: "user_not_found" });
    const hashedPassword = await argon2.hash(password);
    await db_1.db.user.update({
      where: { id: existingUser.id },
      data: { password: hashedPassword },
    });
    await db_1.db.passwordResetToken.delete({ where: { token } });
    return { success: true };
  });
  // Verify Email Change
  fastify.post("/verify-email-change", async (request, reply) => {
    const { token } = verifyEmailChangeSchema.parse(request.body);
    const emailChangeRequest = await db_1.db.emailChangeRequest.findUnique({
      where: { token },
    });
    if (!emailChangeRequest)
      return reply.code(400).send({ error: "invalid_token" });
    const hasExpired = new Date(emailChangeRequest.expires) < new Date();
    if (hasExpired) return reply.code(400).send({ error: "token_expired" });
    const existingUser = await db_1.db.user.findUnique({
      where: { email: emailChangeRequest.newEmail },
    });
    if (existingUser) return reply.code(400).send({ error: "email_in_use" });
    await db_1.db.user.update({
      where: { id: emailChangeRequest.userId },
      data: { email: emailChangeRequest.newEmail, emailVerified: new Date() },
    });
    await db_1.db.emailChangeRequest.delete({ where: { token } });
    return { success: true };
  });
  fastify.get("/reset-password/validate", async (request, reply) => {
    const { token } = request.query;
    if (!token) return reply.status(400).send({ error: "Token required" });
    const existingToken = await db_1.db.passwordResetToken.findUnique({
      where: { token },
    });
    if (!existingToken || new Date() > existingToken.expires) {
      return reply.status(400).send({ valid: false });
    }
    return reply.send({ valid: true });
  });
}
