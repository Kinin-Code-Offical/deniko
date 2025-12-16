"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messagesRoutes = messagesRoutes;
async function messagesRoutes(fastify) {
    fastify.get('/', async (request, reply) => {
        return { messages: [] }; // Stub
    });
    fastify.post('/', async (request, reply) => {
        return { ok: true }; // Stub
    });
}
