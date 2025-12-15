import Fastify from 'fastify';
import { registerRoutes } from './routes';
import { logger } from '@deniko/logger';

const fastify = Fastify({
    logger: logger
});

fastify.get('/health', async (request, reply) => {
    return { ok: true };
});

registerRoutes(fastify);

const start = async () => {
    try {
        const port = process.env.PORT ? parseInt(process.env.PORT) : (process.env.NODE_ENV === 'production' ? 8080 : 4000);
        await fastify.listen({ port, host: '0.0.0.0' });
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();
