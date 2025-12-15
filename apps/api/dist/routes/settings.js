"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.settingsRoutes = settingsRoutes;
const services_1 = require("../services");
async function settingsRoutes(fastify) {
    fastify.get('/', async (request, reply) => {
        // TODO: Get user from auth context
        const userId = request.headers['x-user-id'];
        if (!userId)
            return reply.code(401).send({ error: 'Unauthorized' });
        const settings = await services_1.prisma.userSettings.findUnique({
            where: { userId }
        });
        return settings;
    });
    fastify.put('/', async (request, reply) => {
        const userId = request.headers['x-user-id'];
        if (!userId)
            return reply.code(401).send({ error: 'Unauthorized' });
        const body = request.body; // Use zod validation here
        const settings = await services_1.prisma.userSettings.upsert({
            where: { userId },
            update: body,
            create: { ...body, userId }
        });
        return settings;
    });
}
