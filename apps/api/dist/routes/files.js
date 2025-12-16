"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filesRoutes = filesRoutes;
const services_1 = require("../services");
async function filesRoutes(fastify) {
    fastify.get('/:path', async (request, reply) => {
        const { path } = request.params;
        // TODO: Auth check
        const stream = await services_1.storage.getObjectStream(path);
        if (!stream) {
            return reply.code(404).send({ error: 'File not found' });
        }
        return reply.send(stream);
    });
    fastify.post('/upload', async (request, reply) => {
        const { key, data, contentType } = request.body;
        // TODO: Auth check
        if (!key || !data || !contentType) {
            return reply.code(400).send({ error: 'Missing required fields' });
        }
        const buffer = Buffer.from(data, 'base64');
        await services_1.storage.putObject(key, buffer, contentType);
        return { success: true };
    });
    fastify.delete('/:path', async (request, reply) => {
        const { path } = request.params;
        // TODO: Auth check
        const success = await services_1.storage.deleteObject(path);
        return { success };
    });
    fastify.post('/signed-url', async (request, reply) => {
        const { key, expiresInSeconds } = request.body;
        // TODO: Auth check
        const url = await services_1.storage.getSignedUrl(key, {
            action: 'read',
            expires: Date.now() + (expiresInSeconds || 300) * 1000
        });
        return { url };
    });
}
