import { createLogger } from "@deniko/logger";
import { env } from "./env";

export const logger = createLogger({
    level: env.LOG_LEVEL || "info",
    isProduction: env.NODE_ENV === "production",
});
