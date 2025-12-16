import { FastifyInstance } from 'fastify';
import { storage } from '../services';

export async function filesRoutes(fastify: FastifyInstance) {
    fastify.get('/:path', async (request, reply) => {
        const { path } = request.params as { path: string };
        // TODO: Auth check

        const stream = await storage.getObjectStream(path);
        if (!stream) {
            return reply.code(404).send({ error: 'File not found' });
        }
        return reply.send(stream);
    });

    fastify.post('/upload', async (request, reply) => {
        const { key, data, contentType } = request.body as { key: string, data: string, contentType: string };
        // TODO: Auth check

        if (!key || !data || !contentType) {
            return reply.code(400).send({ error: 'Missing required fields' });
        }

        const buffer = Buffer.from(data, 'base64');
        await storage.putObject(key, buffer, contentType);
        return { success: true };
    });

    fastify.delete('/:path', async (request, reply) => {
        const { path } = request.params as { path: string };
        // TODO: Auth check

        const success = await storage.deleteObject(path);
        return { success };
    });

    fastify.post('/signed-url', async (request, reply) => {
        const { key, expiresInSeconds } = request.body as { key: string, expiresInSeconds?: number };
        // TODO: Auth check

        const url = await storage.getSignedUrl(key, {
            action: 'read',
            expires: Date.now() + (expiresInSeconds || 300) * 1000
        });
        return { url };
    });
}


