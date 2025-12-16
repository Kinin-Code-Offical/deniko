"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const db_1 = require("@deniko/db");
const env_1 = require("./env");
exports.db = (0, db_1.createDb)({
    isProduction: env_1.env.NODE_ENV === 'production',
    datasourceUrl: env_1.env.DATABASE_URL
});
