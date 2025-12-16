"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const logger_1 = require("@deniko/logger");
const env_1 = require("./env");
exports.logger = (0, logger_1.createLogger)({
    level: env_1.env.LOG_LEVEL || "info",
    isProduction: env_1.env.NODE_ENV === "production",
});
