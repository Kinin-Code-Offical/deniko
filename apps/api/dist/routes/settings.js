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
exports.settingsRoutes = settingsRoutes;
const zod_1 = require("zod");
const db_1 = require("../db");
const services_1 = require("../services");
const argon2 = __importStar(require("argon2"));
const account_deletion_1 = require("../lib/account-deletion");
// --- Schemas ---
const profileBasicSchema = zod_1.z.object({
    firstName: zod_1.z.string().min(2).max(50).optional(),
    lastName: zod_1.z.string().min(2).max(50).optional(),
    username: zod_1.z.string().min(3).max(30).optional(),
    phoneNumber: zod_1.z.string().optional().nullable(),
    preferredCountry: zod_1.z.string().optional().nullable(),
    preferredTimezone: zod_1.z.string().optional().nullable(),
    notificationEmailEnabled: zod_1.z.boolean().optional(),
    notificationInAppEnabled: zod_1.z.boolean().optional(),
    isMarketingConsent: zod_1.z.boolean().optional(),
    // Teacher fields
    branch: zod_1.z.string().optional().nullable(),
    bio: zod_1.z.string().optional().nullable(),
    // Student fields
    studentNo: zod_1.z.string().optional().nullable(),
    gradeLevel: zod_1.z.string().optional().nullable(),
    parentName: zod_1.z.string().optional().nullable(),
    parentPhone: zod_1.z.string().optional().nullable(),
    parentEmail: zod_1.z.string().email().optional().nullable().or(zod_1.z.literal("")),
});
const changePasswordSchema = zod_1.z.object({
    currentPassword: zod_1.z.string().min(1),
    newPassword: zod_1.z.string().min(8),
});
const emailChangeSchema = zod_1.z.object({
    newEmail: zod_1.z.string().email(),
    token: zod_1.z.string(),
    expires: zod_1.z.string().datetime().or(zod_1.z.date()), // Accept string or Date
});
const notificationPreferencesSchema = zod_1.z.object({
    emailEnabled: zod_1.z.boolean(),
    inAppEnabled: zod_1.z.boolean(),
});
const regionTimezoneSchema = zod_1.z.object({
    country: zod_1.z.string(),
    timezone: zod_1.z.string(),
});
const cookiePreferencesSchema = zod_1.z.object({
    analyticsEnabled: zod_1.z.boolean(),
    marketingEnabled: zod_1.z.boolean(),
});
const avatarUpdateSchema = zod_1.z.object({
    type: zod_1.z.enum(["uploaded", "default"]),
    url: zod_1.z.string().optional(),
    key: zod_1.z.string().optional(),
});
async function settingsRoutes(fastify) {
    // Get Profile
    fastify.get('/', async (request, reply) => {
        const userId = request.headers['x-user-id'];
        if (!userId)
            return reply.code(401).send({ error: 'Unauthorized' });
        const user = await db_1.db.user.findUnique({
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
        if (!user)
            return reply.code(404).send({ error: 'User not found' });
        return user;
    });
    // Update Profile Basic
    fastify.patch('/profile', async (request, reply) => {
        const userId = request.headers['x-user-id'];
        if (!userId)
            return reply.code(401).send({ error: 'Unauthorized' });
        const data = profileBasicSchema.parse(request.body);
        const updateData = {};
        if (data.firstName)
            updateData.firstName = data.firstName;
        if (data.lastName)
            updateData.lastName = data.lastName;
        if (data.firstName && data.lastName)
            updateData.name = `${data.firstName} ${data.lastName}`;
        if (data.username)
            updateData.username = data.username;
        if (data.phoneNumber !== undefined)
            updateData.phoneNumber = data.phoneNumber;
        if (data.preferredCountry !== undefined)
            updateData.preferredCountry = data.preferredCountry;
        if (data.preferredTimezone !== undefined)
            updateData.preferredTimezone = data.preferredTimezone;
        if (data.notificationEmailEnabled !== undefined)
            updateData.notificationEmailEnabled = data.notificationEmailEnabled;
        if (data.notificationInAppEnabled !== undefined)
            updateData.notificationInAppEnabled = data.notificationInAppEnabled;
        if (data.isMarketingConsent !== undefined)
            updateData.isMarketingConsent = data.isMarketingConsent;
        await db_1.db.user.update({
            where: { id: userId },
            data: updateData,
        });
        // Update Teacher Profile
        if (data.branch !== undefined || data.bio !== undefined) {
            const teacherProfile = await db_1.db.teacherProfile.findUnique({ where: { userId } });
            if (teacherProfile) {
                await db_1.db.teacherProfile.update({
                    where: { userId },
                    data: {
                        branch: data.branch || teacherProfile.branch,
                        bio: data.bio,
                    },
                });
            }
        }
        // Update Student Profile
        if (data.studentNo !== undefined ||
            data.gradeLevel !== undefined ||
            data.parentName !== undefined ||
            data.parentPhone !== undefined ||
            data.parentEmail !== undefined) {
            const studentProfile = await db_1.db.studentProfile.findUnique({ where: { userId } });
            if (studentProfile) {
                await db_1.db.studentProfile.update({
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
        const userId = request.headers['x-user-id'];
        if (!userId)
            return reply.code(401).send({ error: 'Unauthorized' });
        const { currentPassword, newPassword } = changePasswordSchema.parse(request.body);
        const user = await db_1.db.user.findUnique({ where: { id: userId } });
        if (!user || !user.password)
            return reply.code(400).send({ error: 'user_not_found_password' });
        const passwordsMatch = await argon2.verify(user.password, currentPassword);
        if (!passwordsMatch)
            return reply.code(400).send({ error: 'incorrect_password' });
        const hashedPassword = await argon2.hash(newPassword);
        await db_1.db.user.update({
            where: { id: userId },
            data: { password: hashedPassword },
        });
        return { success: true };
    });
    // Request Email Change
    fastify.post('/email-change', async (request, reply) => {
        const userId = request.headers['x-user-id'];
        if (!userId)
            return reply.code(401).send({ error: 'Unauthorized' });
        const { newEmail, token, expires } = emailChangeSchema.parse(request.body);
        const existingUser = await db_1.db.user.findUnique({ where: { email: newEmail } });
        if (existingUser)
            return reply.code(400).send({ error: 'email_in_use' });
        await db_1.db.emailChangeRequest.create({
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
        const userId = request.headers['x-user-id'];
        if (!userId)
            return reply.code(401).send({ error: 'Unauthorized' });
        await db_1.db.user.update({
            where: { id: userId },
            data: { isActive: false },
        });
        await db_1.db.userSettings.upsert({
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
        const userId = request.headers['x-user-id'];
        if (!userId)
            return reply.code(401).send({ error: 'Unauthorized' });
        await (0, account_deletion_1.deleteUserAndRelatedData)(userId);
        return { success: true };
    });
    // Update Notification Preferences
    fastify.patch('/notifications', async (request, reply) => {
        const userId = request.headers['x-user-id'];
        if (!userId)
            return reply.code(401).send({ error: 'Unauthorized' });
        const { emailEnabled, inAppEnabled } = notificationPreferencesSchema.parse(request.body);
        await db_1.db.user.update({
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
        const userId = request.headers['x-user-id'];
        if (!userId)
            return reply.code(401).send({ error: 'Unauthorized' });
        const { country, timezone } = regionTimezoneSchema.parse(request.body);
        await db_1.db.user.update({
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
        const userId = request.headers['x-user-id'];
        if (!userId)
            return reply.code(401).send({ error: 'Unauthorized' });
        const { analyticsEnabled, marketingEnabled } = cookiePreferencesSchema.parse(request.body);
        await db_1.db.user.update({
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
        const userId = request.headers['x-user-id'];
        if (!userId)
            return reply.code(401).send({ error: 'Unauthorized' });
        const { type, url, key } = avatarUpdateSchema.parse(request.body);
        let imagePath = url;
        if (type === "default") {
            imagePath = key;
        }
        if (!imagePath)
            return reply.code(400).send({ error: 'no_image_provided' });
        const currentUser = await db_1.db.user.findUnique({
            where: { id: userId },
            select: { image: true },
        });
        await db_1.db.user.update({
            where: { id: userId },
            data: {
                image: imagePath,
                avatarVersion: { increment: 1 }
            },
        });
        // Delete old avatar if needed
        if (currentUser?.image &&
            currentUser.image !== imagePath &&
            !currentUser.image.startsWith("http") &&
            !currentUser.image.startsWith("default/")) {
            try {
                await services_1.storage.deleteObject(currentUser.image);
            }
            catch (err) {
                // ignore error
            }
        }
        return { success: true };
    });
}
