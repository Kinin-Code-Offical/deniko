"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLogger = void 0;
const pino_1 = __importDefault(require("pino"));
const createLogger = (config = {}) => {
    const { level = 'info', isProduction = false } = config;
    return (0, pino_1.default)({
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
exports.createLogger = createLogger;
// Default logger for backward compatibility (optional, but risky if we want strictness)
// Better to force usage of createLogger to ensure config is passed.
// But for now, let's remove the global logger to force the fix.
