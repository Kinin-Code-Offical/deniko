"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.privacyRoutes = privacyRoutes;
const zod_1 = require("zod");
const db_1 = require("../db");
const privacySchema = zod_1.z.object({
    profileVisibility: zod_1.z.enum(["public", "private"]),
    showAvatar: zod_1.z.boolean(),
    showEmail: zod_1.z.boolean(),
    showPhone: zod_1.z.boolean(),
    allowMessages: zod_1.z.boolean(),
    showCourses: zod_1.z.boolean(),
});
async function privacyRoutes(fastify) {
    // Get Privacy Settings
    fastify.get('/', async (request, reply) => {
        const userId = request.headers['x-user-id'];
        if (!userId)
            return reply.code(401).send({ error: 'Unauthorized' });
        const settings = await db_1.db.userSettings.findUnique({
            where: { userId },
        });
        if (!settings) {
            // Return defaults
            return {
                profileVisibility: "public",
                showAvatar: true,
                showEmail: false,
                showPhone: false,
                allowMessages: true,
                showCourses: true,
            };
        }
        return settings;
    });
    // Update Privacy Settings
    fastify.patch('/', async (request, reply) => {
        const userId = request.headers['x-user-id'];
        if (!userId)
            return reply.code(401).send({ error: 'Unauthorized' });
        const data = privacySchema.parse(request.body);
        return await db_1.db.userSettings.upsert({
            where: { userId },
            create: {
                userId,
                ...data,
            },
            update: {
                ...data,
            },
        });
    });
}
