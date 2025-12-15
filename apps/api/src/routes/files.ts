import { FastifyInstance } from 'fastify';
import { storageClient } from '@deniko/storage';

export async function filesRoutes(fastify: FastifyInstance) {
    fastify.get('/:path', async (request, reply) => {
        const { path } = request.params as { path: string };
        // TODO: Auth check

        const stream = await storageClient.getObjectStream(path);
        if (!stream) {
            return reply.code(404).send({ error: 'File not found' });
        }
        return reply.send(stream);
    });
}
