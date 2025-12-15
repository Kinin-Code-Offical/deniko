import Fastify from 'fastify';
import { registerRoutes } from './routes';
import { createLogger } from '@deniko/logger';
import { env } from './env';

export const buildApp = () => {
    const logger = createLogger({
        level: 'info', // or env.LOG_LEVEL if added to env.ts
        isProduction: env.NODE_ENV === 'production'
    });

    const fastify = Fastify({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        loggerInstance: logger as any
    });

    fastify.get('/health', async (request, reply) => {
        return { ok: true };
    });

    registerRoutes(fastify);

    return fastify;
};

