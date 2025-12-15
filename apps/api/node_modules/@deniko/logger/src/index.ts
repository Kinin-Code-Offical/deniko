import pino from 'pino';

const isProduction = process.env.NODE_ENV === 'production';

export const logger = pino({
    level: process.env.LOG_LEVEL || 'info',
    transport: !isProduction
        ? {
            target: 'pino-pretty',
            options: {
                colorize: true,
            },
        }
        : undefined,
    redact: {
        paths: ['password', 'token', 'email', 'phoneNumber', 'cookie', 'authorization'],
        censor: '***',
    },
});
