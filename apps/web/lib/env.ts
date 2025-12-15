import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  NEXT_RUNTIME: z.enum(["edge", "nodejs"]).optional(),
  DATABASE_URL: z.string().url({ message: "DATABASE_URL must be a valid URL" }),
  INSTANCE_CONNECTION_NAME: z.string().optional(),
  DIRECT_URL: z.string().url().optional(),
  NEXTAUTH_URL: z.string().url({ message: "NEXTAUTH_URL must be a valid URL" }),

  // Auth
  AUTH_SECRET: z.string().min(1, { message: "AUTH_SECRET is required" }),

  AUTH_GOOGLE_ID: z.string().min(1, { message: "AUTH_GOOGLE_ID is required" }),
  AUTH_GOOGLE_SECRET: z
    .string()
    .min(1, { message: "AUTH_GOOGLE_SECRET is required" }),

  // Public

  NEXT_PUBLIC_NOINDEX: z
    .enum(["true", "false"])
    .default("false")
    .transform((v) => v === "true"),
  NEXT_PUBLIC_SITE_URL: z
    .string()
    .url()
    .optional()
    .default("https://deniko.net"),
  NEXT_PUBLIC_GA_ID: z.string().optional(),

  // Internal
  INTERNAL_API_BASE_URL: z.string().url().default("http://localhost:4000"),
});




export const env = envSchema.parse(process.env);
export type Env = typeof env;
