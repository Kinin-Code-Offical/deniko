import { FastifyInstance } from 'fastify';
import { prisma } from '../services';

export async function settingsRoutes(fastify: FastifyInstance) {

    fastify.get('/', async (request, reply) => {
        // TODO: Get user from auth context
        const userId = request.headers['x-user-id'] as string;
        if (!userId) return reply.code(401).send({ error: 'Unauthorized' });

        return await prisma.userSettings.findUnique({
            where: { userId }
        });
    });

    fastify.put('/', async (request, reply) => {
        const userId = request.headers['x-user-id'] as string;
        if (!userId) return reply.code(401).send({ error: 'Unauthorized' });

        const body = request.body as any; // Use zod validation here

        return await prisma.userSettings.upsert({
            where: { userId },
            update: body,
            create: { ...body, userId }
        });
    });
}
