"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.privacyRoutes = privacyRoutes;
async function privacyRoutes(fastify) {
    // Similar to settings, maybe merged?
    // User asked for separate routes in Phase 3 list.
    fastify.get('/', async (request, reply) => {
        return { message: "Privacy settings" };
    });
}
