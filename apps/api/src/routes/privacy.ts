import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { db } from '../db';

const privacySchema = z.object({
    profileVisibility: z.enum(["public", "private"]),
    showAvatar: z.boolean(),
    showEmail: z.boolean(),
    showPhone: z.boolean(),
    allowMessages: z.boolean(),
    showCourses: z.boolean(),
});

export async function privacyRoutes(fastify: FastifyInstance) {
    // Get Privacy Settings
    fastify.get('/', async (request, reply) => {
        const userId = request.headers['x-user-id'] as string;
        if (!userId) return reply.code(401).send({ error: 'Unauthorized' });

        const settings = await db.userSettings.findUnique({
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
        const userId = request.headers['x-user-id'] as string;
        if (!userId) return reply.code(401).send({ error: 'Unauthorized' });

        const data = privacySchema.parse(request.body);

        return await db.userSettings.upsert({
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
