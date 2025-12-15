import { z } from 'zod';
import dotenv from 'dotenv';
import path from 'path';

// Load .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    PORT: z.string().default('4000').transform((val) => parseInt(val, 10)),

    // Database
    DATABASE_URL: z.string().url({ message: "DATABASE_URL must be a valid URL" }),

    // Storage (Google Cloud Storage)
    GCS_BUCKET_NAME: z.string().min(1),
    GCS_PROJECT_ID: z.string().min(1),
    GCS_CLIENT_EMAIL: z.string().email(),
    GCS_PRIVATE_KEY: z.string().min(1),

    // Rate Limiting (Upstash Redis)
    UPSTASH_REDIS_REST_URL: z.string().url(),
    UPSTASH_REDIS_REST_TOKEN: z.string().min(1),
});

export const env = envSchema.parse(process.env);
export type Env = typeof env;
