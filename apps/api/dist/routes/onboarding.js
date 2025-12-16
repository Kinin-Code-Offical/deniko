"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.onboardingRoutes = onboardingRoutes;
const zod_1 = require("zod");
const db_1 = require("../db");
const argon2 = __importStar(require("argon2"));
const logger_1 = require("../logger");
const onboardingSchema = zod_1.z.object({
    role: zod_1.z.enum(["TEACHER", "STUDENT"]),
    phoneNumber: zod_1.z.string().min(1),
    password: zod_1.z.string().min(8)
        .regex(/[a-z]/, "Must contain lowercase")
        .regex(/[A-Z]/, "Must contain uppercase")
        .regex(/\d/, "Must contain number")
        .regex(/[@$!%*?&]/, "Must contain symbol"),
    confirmPassword: zod_1.z.string().min(8),
    terms: zod_1.z.boolean().refine(val => val === true, "Must accept terms"),
    marketingConsent: zod_1.z.boolean().optional(),
    preferredTimezone: zod_1.z.string().optional(),
    preferredCountry: zod_1.z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});
async function onboardingRoutes(fastify) {
    fastify.post("/complete", async (request, reply) => {
        const userId = request.headers["x-user-id"];
        if (!userId) {
            return reply.code(401).send({ error: "Unauthorized" });
        }
        const result = onboardingSchema.safeParse(request.body);
        if (!result.success) {
            const issue = result.error.issues[0];
            let error = "invalid_input";
            if (issue.path.includes("password"))
                error = "password_complexity";
            if (issue.path.includes("confirmPassword"))
                error = "passwords_mismatch";
            if (issue.path.includes("terms"))
                error = "accept_terms";
            if (issue.path.includes("phoneNumber"))
                error = "phone_required";
            return reply.code(400).send({ error, details: result.error.flatten() });
        }
        const { role, phoneNumber, password, marketingConsent, preferredTimezone, preferredCountry } = result.data;
        try {
            // Check if user already has a profile
            const existingUser = await db_1.db.user.findUnique({
                where: { id: userId },
                include: {
                    teacherProfile: true,
                    studentProfile: true,
                },
            });
            if (existingUser?.teacherProfile || existingUser?.studentProfile) {
                return { success: true };
            }
            const hashedPassword = await argon2.hash(password);
            await db_1.db.$transaction(async (tx) => {
                // 1. Update User
                await tx.user.update({
                    where: { id: userId },
                    data: {
                        role,
                        phoneNumber,
                        password: hashedPassword,
                        isOnboardingCompleted: true,
                        emailVerified: new Date(),
                        isMarketingConsent: marketingConsent || false,
                        preferredTimezone: preferredTimezone || "UTC",
                        preferredCountry: preferredCountry || "US",
                    },
                });
                // 2. Create Profile
                if (role === "TEACHER") {
                    await tx.teacherProfile.create({
                        data: {
                            userId,
                            branch: "Genel",
                        },
                    });
                }
                else if (role === "STUDENT") {
                    await tx.studentProfile.create({
                        data: {
                            userId,
                            isClaimed: true,
                        },
                    });
                }
            });
            logger_1.logger.info({ event: "onboarding_completed", userId, role });
            return { success: true };
        }
        catch (error) {
            logger_1.logger.error({ event: "onboarding_error", error, userId });
            return reply.code(500).send({ error: "onboarding_error" });
        }
    });
}
