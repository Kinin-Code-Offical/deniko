import Fastify, { FastifyBaseLogger } from 'fastify';
import { registerRoutes } from './routes';
import { createLogger } from '@deniko/logger';
import { env } from './env';

export const buildApp = () => {
    const logger = createLogger({
        level: 'info', // or env.LOG_LEVEL if added to env.ts
        isProduction: env.NODE_ENV === 'production'
    });

    const fastify = Fastify({
        loggerInstance: logger as unknown as FastifyBaseLogger
    });

    fastify.get('/health', async (request, reply) => {
        return { ok: true };
    });

    registerRoutes(fastify);

    return fastify;
};

