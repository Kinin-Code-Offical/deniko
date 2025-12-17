import { FastifyInstance } from 'fastify';
import { z } from "zod";
import { db } from '../db';
import { Prisma } from '@deniko/db';
import * as argon2 from "argon2";
import { logger } from "../logger";

const onboardingSchema = z.object({
    role: z.enum(["TEACHER", "STUDENT"]),
    phoneNumber: z.string().min(1),
    password: z.string().min(8)
        .regex(/[a-z]/, "Must contain lowercase")
        .regex(/[A-Z]/, "Must contain uppercase")
        .regex(/\d/, "Must contain number")
        .regex(/[@$!%*?&]/, "Must contain symbol"),
    confirmPassword: z.string().min(8),
    terms: z.boolean().refine(val => val === true, "Must accept terms"),
    marketingConsent: z.boolean().optional(),
    preferredTimezone: z.string().optional(),
    preferredCountry: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export async function onboardingRoutes(fastify: FastifyInstance) {
    fastify.post("/complete", async (request, reply) => {
        const userId = request.headers["x-user-id"] as string;
        if (!userId) {
            return reply.code(401).send({ error: "Unauthorized" });
        }

        const result = onboardingSchema.safeParse(request.body);

        if (!result.success) {
            const issue = result.error.issues[0];
            let error = "invalid_input";
            if (issue.path.includes("password")) error = "password_complexity";
            if (issue.path.includes("confirmPassword")) error = "passwords_mismatch";
            if (issue.path.includes("terms")) error = "accept_terms";
            if (issue.path.includes("phoneNumber")) error = "phone_required";

            return reply.code(400).send({ error, details: result.error.flatten() });
        }

        const { role, phoneNumber, password, marketingConsent, preferredTimezone, preferredCountry } = result.data;

        try {
            // Check if user already has a profile
            const existingUser = await db.user.findUnique({
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

            await db.$transaction(async (tx: Prisma.TransactionClient) => {
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
                } else if (role === "STUDENT") {
                    await tx.studentProfile.create({
                        data: {
                            userId,
                            isClaimed: true,
                        },
                    });
                }
            });

            logger.info({ event: "onboarding_completed", userId, role });
            return { success: true };

        } catch (error) {
            logger.error({ event: "onboarding_error", error, userId });
            return reply.code(500).send({ error: "onboarding_error" });
        }
    });
}
