import pino from 'pino';
export interface LoggerConfig {
    level?: string;
    isProduction?: boolean;
}
export declare const createLogger: (config?: LoggerConfig) => pino.Logger<never, boolean>;
