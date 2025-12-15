"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.avatarRoutes = avatarRoutes;
const services_1 = require("../services");
async function avatarRoutes(fastify) {
    fastify.get('/:id', async (request, reply) => {
        const { id } = request.params;
        // TODO: Auth check
        // TODO: Privacy check
        const user = await services_1.prisma.user.findUnique({
            where: { id },
            select: { image: true, settings: { select: { showAvatar: true, profileVisibility: true } } }
        });
        if (!user || !user.image) {
            return reply.code(404).send({ error: 'Avatar not found' });
        }
        // Privacy check logic here
        if (user.settings?.profileVisibility === 'private' || !user.settings?.showAvatar) {
            // Check if requester is allowed (e.g. same user)
            // For now, return 403
            // return reply.code(403).send({ error: 'Access denied' });
        }
        const stream = await storageClient.getObjectStream(user.image);
        if (!stream) {
            return reply.code(404).send({ error: 'File not found in storage' });
        }
        return reply.send(stream);
    });
    fastify.post('/upload', async (request, reply) => {
        // TODO: Implement upload logic
        return { ok: true };
    });
}
