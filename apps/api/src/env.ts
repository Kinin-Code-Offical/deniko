import { z } from 'zod';
import dotenv from 'dotenv';
import path from 'path';

// Load .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    LOG_LEVEL: z.string().default('info'),
    PORT: z.string().default('4000').transform((val) => parseInt(val, 10)),

    // Database
    DATABASE_URL: z.string().url({ message: "DATABASE_URL must be a valid URL" }),

    // Storage (Google Cloud Storage)
    GCS_BUCKET_NAME: z.string().min(1),
    GCS_PROJECT_ID: z.string().min(1),

    // Rate Limiting (Upstash Redis)
    UPSTASH_REDIS_REST_URL: z.string().url(),
    UPSTASH_REDIS_REST_TOKEN: z.string().min(1),

    // Email - No-Reply (System Notifications)
    SMTP_NOREPLY_HOST: z.string().min(1),
    SMTP_NOREPLY_PORT: z.string().default("465"),
    SMTP_NOREPLY_USER: z.string().email(),
    SMTP_NOREPLY_PASSWORD: z.string().min(1),
    SMTP_NOREPLY_FROM: z.string().email(),

    // Email - Support (Tickets & Inquiries)
    SMTP_SUPPORT_HOST: z.string().min(1),
    SMTP_SUPPORT_PORT: z.string().default("465"),
    SMTP_SUPPORT_USER: z.string().email(),
    SMTP_SUPPORT_PASSWORD: z.string().min(1),
    SMTP_SUPPORT_FROM: z.string().email(),

    // Internal Security
    INTERNAL_API_SECRET: z.string().min(1).default("dev-secret-key"),
});


export const env = envSchema.parse(process.env);
export type Env = typeof env;
