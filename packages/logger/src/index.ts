import pino from 'pino';

export interface LoggerConfig {
    level?: string;
    isProduction?: boolean;
}

export const createLogger = (config: LoggerConfig = {}) => {
    const { level = 'info', isProduction = false } = config;

    return pino({
        level,
        transport: isProduction ? undefined : {
            target: 'pino-pretty',
            options: {
                colorize: true,
            },
        },
        redact: {
            paths: ['password', 'token', 'email', 'phoneNumber', 'cookie', 'authorization'],
            censor: '***',
        },
    });
};

// Default logger for backward compatibility (optional, but risky if we want strictness)
// Better to force usage of createLogger to ensure config is passed.
// But for now, let's remove the global logger to force the fix.

