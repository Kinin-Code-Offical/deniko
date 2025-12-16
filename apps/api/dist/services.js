"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storage = exports.prisma = void 0;
const storage_1 = require("@deniko/storage");
const env_1 = require("./env");
const db_1 = require("./db");
exports.prisma = db_1.db;
exports.storage = (0, storage_1.createStorage)({
    bucketName: env_1.env.GCS_BUCKET_NAME,
    options: {
        projectId: env_1.env.GCS_PROJECT_ID,
        credentials: {
            client_email: env_1.env.GCS_CLIENT_EMAIL,
            private_key: env_1.env.GCS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }
    }
});
