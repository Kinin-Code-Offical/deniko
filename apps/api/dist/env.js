"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const zod_1 = require("zod");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load .env file
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../.env') });
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(['development', 'test', 'production']).default('development'),
    PORT: zod_1.z.string().default('4000').transform((val) => parseInt(val, 10)),
    // Database
    DATABASE_URL: zod_1.z.string().url({ message: "DATABASE_URL must be a valid URL" }),
    // Storage (Google Cloud Storage)
    GCS_BUCKET_NAME: zod_1.z.string().min(1),
    GCS_PROJECT_ID: zod_1.z.string().min(1),
    GCS_CLIENT_EMAIL: zod_1.z.string().email(),
    GCS_PRIVATE_KEY: zod_1.z.string().min(1),
    // Rate Limiting (Upstash Redis)
    UPSTASH_REDIS_REST_URL: zod_1.z.string().url(),
    UPSTASH_REDIS_REST_TOKEN: zod_1.z.string().min(1),
});
exports.env = envSchema.parse(process.env);
