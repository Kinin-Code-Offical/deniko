import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { db } from '../db';
import * as argon2 from 'argon2';
import { randomBytes } from 'crypto';
import { generateUniqueUsername } from '../lib/username';

// Schemas
const userSchema = z.object({
    name: z.string().nullable().optional(),
    email: z.string().email().nullable().optional(),
    emailVerified: z.string().datetime().nullable().optional(), // Date as string
    image: z.string().nullable().optional(),
    firstName: z.string().nullable().optional(),
    lastName: z.string().nullable().optional(),
    username: z.string().nullable().optional(),
});

const accountSchema = z.object({
    userId: z.string(),
    type: z.string(),
    provider: z.string(),
    providerAccountId: z.string(),
    refresh_token: z.string().nullable().optional(),
    access_token: z.string().nullable().optional(),
    expires_at: z.number().nullable().optional(),
    token_type: z.string().nullable().optional(),
    scope: z.string().nullable().optional(),
    id_token: z.string().nullable().optional(),
    session_state: z.string().nullable().optional(),
});

const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    role: z.enum(["TEACHER", "STUDENT"]),
    phoneNumber: z.string().optional(),
    marketingConsent: z.boolean().optional(),
    preferredCountry: z.string().optional(),
    preferredTimezone: z.string().optional(),
});

const verifyEmailSchema = z.object({
    token: z.string(),
});

const resendVerificationSchema = z.object({
    email: z.string().email(),
});

const forgotPasswordSchema = z.object({
    email: z.string().email(),
});

const resetPasswordSchema = z.object({
    token: z.string(),
    password: z.string().min(8),
});

const verifyEmailChangeSchema = z.object({
    token: z.string(),
});

export async function authRoutes(fastify: FastifyInstance) {
    // --- Adapter Routes ---

    // Create User
    fastify.post('/adapter/user', async (request, reply) => {
        const data = userSchema.parse(request.body);
        return await db.user.create({
            data: {
                ...data,
                emailVerified: data.emailVerified ? new Date(data.emailVerified) : null,
            }
        });
    });

    // Get User by ID
    fastify.get('/adapter/user/:id', async (request, reply) => {
        const { id } = request.params as { id: string };
        const user = await db.user.findUnique({ where: { id } });
        if (!user) return reply.code(404).send(null);
        return user;
    });

    // Get User by Email
    fastify.get('/adapter/user/email/:email', async (request, reply) => {
        const { email } = request.params as { email: string };
        const user = await db.user.findUnique({ where: { email } });
        if (!user) return reply.code(404).send(null);
        return user;
    });

    // Get User by Account
    fastify.get('/adapter/user/account/:provider/:providerAccountId', async (request, reply) => {
        const { provider, providerAccountId } = request.params as { provider: string, providerAccountId: string };
        const account = await db.account.findUnique({
            where: { provider_providerAccountId: { provider, providerAccountId } },
            include: { user: true }
        });
        if (!account) return reply.code(404).send(null);
        return account.user;
    });

    // Get User by Username
    fastify.get('/adapter/user/username/:username', async (request, reply) => {
        const { username } = request.params as { username: string };
        const user = await db.user.findUnique({ where: { username } });
        if (!user) return reply.code(404).send(null);
        return user;
    });

    // Update User
    fastify.patch('/adapter/user/:id', async (request, reply) => {
        const { id } = request.params as { id: string };
        const data = userSchema.partial().parse(request.body);
        return await db.user.update({
            where: { id },
            data: {
                ...data,
                emailVerified: data.emailVerified ? new Date(data.emailVerified) : undefined,
            }
        });
    });

    // Delete User
    fastify.delete('/adapter/user/:id', async (request, reply) => {
        const { id } = request.params as { id: string };
        await db.user.delete({ where: { id } });
        return { success: true };
    });

    // Link Account
    fastify.post('/adapter/account', async (request, reply) => {
        const data = accountSchema.parse(request.body);
        return await db.account.create({ data });
    });

    // Unlink Account
    fastify.delete('/adapter/account/:provider/:providerAccountId', async (request, reply) => {
        const { provider, providerAccountId } = request.params as { provider: string, providerAccountId: string };
        await db.account.delete({
            where: { provider_providerAccountId: { provider, providerAccountId } }
        });
        return { success: true };
    });

    // --- Auth Actions ---

    // Register
    fastify.post('/register', async (request, reply) => {
        const data = registerSchema.parse(request.body);

        const existingUser = await db.user.findUnique({ where: { email: data.email } });
        if (existingUser) return reply.code(400).send({ error: 'user_exists' });

        const hashedPassword = await argon2.hash(data.password);
        const username = await generateUniqueUsername(data.firstName, data.lastName);

        const token = randomBytes(32).toString("hex");
        const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);

        await db.$transaction(async (tx) => {
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
                await tx.teacherProfile.create({ data: { userId: user.id, branch: "Genel" } });
            } else {
                await tx.studentProfile.create({ data: { userId: user.id, isClaimed: true } });
            }

            await tx.verificationToken.create({
                data: { identifier: data.email, token, expires }
            });
        });

        return { success: true, token };
    });

    // Verify Email
    fastify.post('/verify-email', async (request, reply) => {
        const { token } = verifyEmailSchema.parse(request.body);

        const verificationToken = await db.verificationToken.findUnique({
            where: { token },
        });

        if (!verificationToken) return reply.code(400).send({ error: 'invalid_token' });

        const hasExpired = new Date(verificationToken.expires) < new Date();
        if (hasExpired) return reply.code(400).send({ error: 'token_expired' });

        const existingUser = await db.user.findUnique({
            where: { email: verificationToken.identifier },
        });

        if (!existingUser) return reply.code(400).send({ error: 'user_not_found' });

        await db.user.update({
            where: { id: existingUser.id },
            data: { emailVerified: new Date(), email: verificationToken.identifier },
        });

        await db.verificationToken.delete({ where: { token } });

        return { success: true };
    });

    // Resend Verification
    fastify.post('/resend-verification', async (request, reply) => {
        const { email } = resendVerificationSchema.parse(request.body);

        const existingUser = await db.user.findUnique({ where: { email } });
        if (!existingUser) return reply.code(400).send({ error: 'user_not_found' });
        if (existingUser.emailVerified) return reply.code(400).send({ error: 'already_verified' });

        await db.verificationToken.deleteMany({ where: { identifier: email } });

        const token = randomBytes(32).toString("hex");
        const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);

        await db.verificationToken.create({
            data: { identifier: email, token, expires }
        });

        return { success: true, token };
    });

    // Forgot Password
    fastify.post('/forgot-password', async (request, reply) => {
        const { email } = forgotPasswordSchema.parse(request.body);

        const user = await db.user.findUnique({ where: { email } });
        if (!user) return reply.code(400).send({ error: 'user_not_found' });

        await db.passwordResetToken.deleteMany({ where: { email } });

        const token = randomBytes(32).toString("hex");
        const expires = new Date(Date.now() + 3600 * 1000); // 1 hour

        await db.passwordResetToken.create({
            data: { email, token, expires }
        });

        return { success: true, token };
    });

    // Reset Password
    fastify.post('/reset-password', async (request, reply) => {
        const { token, password } = resetPasswordSchema.parse(request.body);

        const existingToken = await db.passwordResetToken.findUnique({
            where: { token },
        });

        if (!existingToken) return reply.code(400).send({ error: 'invalid_token' });

        const hasExpired = new Date(existingToken.expires) < new Date();
        if (hasExpired) return reply.code(400).send({ error: 'token_expired' });

        const existingUser = await db.user.findUnique({
            where: { email: existingToken.email },
        });

        if (!existingUser) return reply.code(400).send({ error: 'user_not_found' });

        const hashedPassword = await argon2.hash(password);

        await db.user.update({
            where: { id: existingUser.id },
            data: { password: hashedPassword },
        });

        await db.passwordResetToken.delete({ where: { token } });

        return { success: true };
    });

    // Verify Email Change
    fastify.post('/verify-email-change', async (request, reply) => {
        const { token } = verifyEmailChangeSchema.parse(request.body);

        const emailChangeRequest = await db.emailChangeRequest.findUnique({
            where: { token },
        });

        if (!emailChangeRequest) return reply.code(400).send({ error: 'invalid_token' });

        const hasExpired = new Date(emailChangeRequest.expires) < new Date();
        if (hasExpired) return reply.code(400).send({ error: 'token_expired' });

        const existingUser = await db.user.findUnique({
            where: { email: emailChangeRequest.newEmail },
        });

        if (existingUser) return reply.code(400).send({ error: 'email_in_use' });

        await db.user.update({
            where: { id: emailChangeRequest.userId },
            data: { email: emailChangeRequest.newEmail, emailVerified: new Date() },
        });

        await db.emailChangeRequest.delete({ where: { token } });

        return { success: true };
    });

    fastify.get('/reset-password/validate', async (request, reply) => {
        const { token } = request.query as { token: string };
        if (!token) return reply.status(400).send({ error: "Token required" });

        const existingToken = await db.passwordResetToken.findUnique({
            where: { token },
        });

        if (!existingToken || new Date() > existingToken.expires) {
            return reply.status(400).send({ valid: false });
        }

        return reply.send({ valid: true });
    });
}
