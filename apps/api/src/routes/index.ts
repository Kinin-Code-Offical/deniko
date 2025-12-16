import { FastifyInstance } from 'fastify';
import { avatarRoutes } from './avatar';
import { filesRoutes } from './files';
import { settingsRoutes } from './settings';
import { privacyRoutes } from './privacy';
import { messagesRoutes } from './messages';
import { emailRoutes } from './email';
import { ratelimitRoutes } from './ratelimit';
import { authRoutes } from './auth';
import { studentRoutes } from './student';
import { onboardingRoutes } from './onboarding';
import { classroomRoutes } from './classroom';
import { publicRoutes } from './public';
import { dashboardRoutes } from './dashboard';

export async function registerRoutes(fastify: FastifyInstance) {
    fastify.register(avatarRoutes, { prefix: '/avatar' });
    fastify.register(filesRoutes, { prefix: '/files' });
    fastify.register(settingsRoutes, { prefix: '/settings' });
    fastify.register(privacyRoutes, { prefix: '/privacy' });
    fastify.register(messagesRoutes, { prefix: '/messages' });
    fastify.register(emailRoutes, { prefix: '/email' });
    fastify.register(ratelimitRoutes, { prefix: '/ratelimit' });
    fastify.register(authRoutes, { prefix: '/auth' });
    fastify.register(studentRoutes, { prefix: '/student' });
    fastify.register(onboardingRoutes, { prefix: '/onboarding' });
    fastify.register(classroomRoutes, { prefix: '/classroom' });
    fastify.register(publicRoutes, { prefix: '/public' });
    fastify.register(dashboardRoutes, { prefix: '/dashboard' });
}


