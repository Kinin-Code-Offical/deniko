import { createDb } from "@deniko/db";
import { env } from "./env";

export const db = createDb({
    isProduction: env.NODE_ENV === 'production',
    datasourceUrl: env.DATABASE_URL
});
