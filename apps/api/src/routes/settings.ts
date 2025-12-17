import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { db } from '../db';
import { Prisma } from '@deniko/db';
import { storage } from '../services';
import * as argon2 from 'argon2';
import { deleteUserAndRelatedData } from '../lib/account-deletion';
import { passwordChangeRateLimit } from '../lib/rate-limit';

// --- Schemas ---

const profileBasicSchema = z.object({
    firstName: z.string().min(2).max(50).optional(),
    lastName: z.string().min(2).max(50).optional(),
    username: z.string().min(3).max(30).optional(),
    phoneNumber: z.string().optional().nullable(),
    preferredCountry: z.string().optional().nullable(),
    preferredTimezone: z.string().optional().nullable(),
    notificationEmailEnabled: z.boolean().optional(),
    notificationInAppEnabled: z.boolean().optional(),
    isMarketingConsent: z.boolean().optional(),
    // Teacher fields
    branch: z.string().optional().nullable(),
    bio: z.string().optional().nullable(),
    // Student fields
    studentNo: z.string().optional().nullable(),
    gradeLevel: z.string().optional().nullable(),
    parentName: z.string().optional().nullable(),
    parentPhone: z.string().optional().nullable(),
    parentEmail: z.string().email().optional().nullable().or(z.literal("")),
});

const changePasswordSchema = z.object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(8),
});

const emailChangeSchema = z.object({
    newEmail: z.string().email(),
    token: z.string(),
    expires: z.string().datetime().or(z.date()), // Accept string or Date
});

const notificationPreferencesSchema = z.object({
    emailEnabled: z.boolean(),
    inAppEnabled: z.boolean(),
});

const regionTimezoneSchema = z.object({
    country: z.string(),
    timezone: z.string(),
});

const cookiePreferencesSchema = z.object({
    analyticsEnabled: z.boolean(),
    marketingEnabled: z.boolean(),
});

const avatarUpdateSchema = z.object({
    type: z.enum(["uploaded", "default"]),
    url: z.string().optional(),
    key: z.string().optional(),
});

export async function settingsRoutes(fastify: FastifyInstance) {
    // Get Profile
    fastify.get('/', async (request, reply) => {
        const userId = request.headers['x-user-id'] as string;
        if (!userId) return reply.code(401).send({ error: 'Unauthorized' });

        const user = await db.user.findUnique({
            where: { id: userId },
            include: {
                settings: true,
                teacherProfile: {
                    include: {
                        _count: {
                            select: { lessons: true, studentRelations: true },
                        },
                    },
                },
                studentProfile: {
                    include: {
                        _count: {
                            select: { lessons: true },
                        },
                    },
                },
            },
        });

        if (!user) return reply.code(404).send({ error: 'User not found' });
        return user;
    });

    // Update Profile Basic
    fastify.patch('/profile', async (request, reply) => {
        const userId = request.headers['x-user-id'] as string;
        if (!userId) return reply.code(401).send({ error: 'Unauthorized' });

        const data = profileBasicSchema.parse(request.body);

        const updateData: Prisma.UserUpdateInput = {};
        if (data.firstName) updateData.firstName = data.firstName;
        if (data.lastName) updateData.lastName = data.lastName;
        if (data.firstName && data.lastName) updateData.name = `${data.firstName} ${data.lastName}`;
        if (data.username) updateData.username = data.username;
        if (data.phoneNumber !== undefined) updateData.phoneNumber = data.phoneNumber;
        if (data.preferredCountry !== undefined) updateData.preferredCountry = data.preferredCountry;
        if (data.preferredTimezone !== undefined) updateData.preferredTimezone = data.preferredTimezone;
        if (data.notificationEmailEnabled !== undefined) updateData.notificationEmailEnabled = data.notificationEmailEnabled;
        if (data.notificationInAppEnabled !== undefined) updateData.notificationInAppEnabled = data.notificationInAppEnabled;
        if (data.isMarketingConsent !== undefined) updateData.isMarketingConsent = data.isMarketingConsent;

        await db.user.update({
            where: { id: userId },
            data: updateData,
        });

        // Update Teacher Profile
        if (data.branch !== undefined || data.bio !== undefined) {
            const teacherProfile = await db.teacherProfile.findUnique({ where: { userId } });
            if (teacherProfile) {
                await db.teacherProfile.update({
                    where: { userId },
                    data: {
                        branch: data.branch || teacherProfile.branch,
                        bio: data.bio,
                    },
                });
            }
        }

        // Update Student Profile
        if (
            data.studentNo !== undefined ||
            data.gradeLevel !== undefined ||
            data.parentName !== undefined ||
            data.parentPhone !== undefined ||
            data.parentEmail !== undefined
        ) {
            const studentProfile = await db.studentProfile.findUnique({ where: { userId } });
            if (studentProfile) {
                await db.studentProfile.update({
                    where: { userId },
                    data: {
                        studentNo: data.studentNo,
                        gradeLevel: data.gradeLevel,
                        parentName: data.parentName,
                        parentPhone: data.parentPhone,
                        parentEmail: data.parentEmail === "" ? null : data.parentEmail,
                    },
                });
            }
        }

        return { success: true };
    });

    // Change Password
    fastify.post('/password', async (request, reply) => {
        const userId = request.headers['x-user-id'] as string;
        if (!userId) return reply.code(401).send({ error: 'Unauthorized' });

        const { success } = await passwordChangeRateLimit.limit(userId);
        if (!success) {
            return reply.code(429).send({ error: 'Too many requests' });
        }

        const { currentPassword, newPassword } = changePasswordSchema.parse(request.body);

        const user = await db.user.findUnique({ where: { id: userId } });
        if (!user || !user.password) return reply.code(400).send({ error: 'user_not_found_password' });

        const passwordsMatch = await argon2.verify(user.password, currentPassword);
        if (!passwordsMatch) return reply.code(400).send({ error: 'incorrect_password' });

        const hashedPassword = await argon2.hash(newPassword);

        await db.user.update({
            where: { id: userId },
            data: { password: hashedPassword },
        });

        return { success: true };
    });

    // Request Email Change
    fastify.post('/email-change', async (request, reply) => {
        const userId = request.headers['x-user-id'] as string;
        if (!userId) return reply.code(401).send({ error: 'Unauthorized' });

        const { newEmail, token, expires } = emailChangeSchema.parse(request.body);

        const existingUser = await db.user.findUnique({ where: { email: newEmail } });
        if (existingUser) return reply.code(400).send({ error: 'email_in_use' });

        await db.emailChangeRequest.create({
            data: {
                userId,
                newEmail,
                token,
                expires: new Date(expires),
            },
        });

        return { success: true };
    });

    // Deactivate Account
    fastify.post('/deactivate', async (request, reply) => {
        const userId = request.headers['x-user-id'] as string;
        if (!userId) return reply.code(401).send({ error: 'Unauthorized' });

        await db.user.update({
            where: { id: userId },
            data: { isActive: false },
        });

        await db.userSettings.upsert({
            where: { userId },
            create: {
                userId,
                profileVisibility: "private",
                showAvatar: false,
                showEmail: false,
                showPhone: false,
                allowMessages: false,
            },
            update: {
                profileVisibility: "private",
                showAvatar: false,
                showEmail: false,
                showPhone: false,
                allowMessages: false,
            },
        });

        return { success: true };
    });

    // Delete Account
    fastify.delete('/account', async (request, reply) => {
        const userId = request.headers['x-user-id'] as string;
        if (!userId) return reply.code(401).send({ error: 'Unauthorized' });

        await deleteUserAndRelatedData(userId);
        return { success: true };
    });

    // Update Notification Preferences
    fastify.patch('/notifications', async (request, reply) => {
        const userId = request.headers['x-user-id'] as string;
        if (!userId) return reply.code(401).send({ error: 'Unauthorized' });

        const { emailEnabled, inAppEnabled } = notificationPreferencesSchema.parse(request.body);

        await db.user.update({
            where: { id: userId },
            data: {
                notificationEmailEnabled: emailEnabled,
                notificationInAppEnabled: inAppEnabled,
            },
        });

        return { success: true };
    });

    // Update Region/Timezone
    fastify.patch('/region', async (request, reply) => {
        const userId = request.headers['x-user-id'] as string;
        if (!userId) return reply.code(401).send({ error: 'Unauthorized' });

        const { country, timezone } = regionTimezoneSchema.parse(request.body);

        await db.user.update({
            where: { id: userId },
            data: {
                preferredCountry: country,
                preferredTimezone: timezone,
            },
        });

        return { success: true };
    });

    // Update Cookie Preferences
    fastify.patch('/cookies', async (request, reply) => {
        const userId = request.headers['x-user-id'] as string;
        if (!userId) return reply.code(401).send({ error: 'Unauthorized' });

        const { analyticsEnabled, marketingEnabled } = cookiePreferencesSchema.parse(request.body);

        await db.user.update({
            where: { id: userId },
            data: {
                cookieAnalyticsEnabled: analyticsEnabled,
                isMarketingConsent: marketingEnabled,
            },
        });

        return { success: true };
    });

    // Update Avatar
    fastify.patch('/avatar', async (request, reply) => {
        const userId = request.headers['x-user-id'] as string;
        if (!userId) return reply.code(401).send({ error: 'Unauthorized' });

        const { type, url, key } = avatarUpdateSchema.parse(request.body);

        let imagePath = url;
        if (type === "default") {
            imagePath = key;
        }

        if (!imagePath) return reply.code(400).send({ error: 'no_image_provided' });

        const currentUser = await db.user.findUnique({
            where: { id: userId },
            select: { image: true },
        });

        await db.user.update({
            where: { id: userId },
            data: {
                image: imagePath,
                avatarVersion: { increment: 1 }
            },
        });

        // Delete old avatar if needed
        if (
            currentUser?.image &&
            currentUser.image !== imagePath &&
            !currentUser.image.startsWith("http") &&
            !currentUser.image.startsWith("default/")
        ) {
            try {
                await storage.deleteObject(currentUser.image);
            } catch (err) {
                // ignore error
            }
        }

        return { success: true };
    });
}
