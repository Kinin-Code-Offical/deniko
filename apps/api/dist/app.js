"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildApp = void 0;
const fastify_1 = __importDefault(require("fastify"));
const routes_1 = require("./routes");
const logger_1 = require("@deniko/logger");
const env_1 = require("./env");
const buildApp = () => {
    const logger = (0, logger_1.createLogger)({
        level: 'info', // or env.LOG_LEVEL if added to env.ts
        isProduction: env_1.env.NODE_ENV === 'production'
    });
    const fastify = (0, fastify_1.default)({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        loggerInstance: logger
    });
    fastify.get('/health', async (request, reply) => {
        return { ok: true };
    });
    (0, routes_1.registerRoutes)(fastify);
    return fastify;
};
exports.buildApp = buildApp;
