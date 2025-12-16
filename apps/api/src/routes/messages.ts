import { FastifyInstance } from 'fastify';

export async function messagesRoutes(fastify: FastifyInstance) {
    fastify.get('/', async (request, reply) => {
        return { messages: [] }; // Stub
    });

    fastify.post('/', async (request, reply) => {
        return { ok: true }; // Stub
    });
}
