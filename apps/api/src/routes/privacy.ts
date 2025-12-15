import { FastifyInstance } from 'fastify';

export async function privacyRoutes(fastify: FastifyInstance) {
    // Similar to settings, maybe merged?
    // User asked for separate routes in Phase 3 list.
    fastify.get('/', async (request, reply) => {
        return { message: "Privacy settings" };
    });
}
