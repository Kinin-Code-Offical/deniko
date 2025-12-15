import { FastifyInstance } from 'fastify';
import { avatarRoutes } from './avatar';
import { filesRoutes } from './files';
import { settingsRoutes } from './settings';
import { privacyRoutes } from './privacy';
import { messagesRoutes } from './messages';

export async function registerRoutes(fastify: FastifyInstance) {
    fastify.register(avatarRoutes, { prefix: '/avatar' });
    fastify.register(filesRoutes, { prefix: '/files' });
    fastify.register(settingsRoutes, { prefix: '/settings' });
    fastify.register(privacyRoutes, { prefix: '/privacy' });
    fastify.register(messagesRoutes, { prefix: '/messages' });
}
