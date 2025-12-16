import { env } from "@/lib/env";
import { logger } from "@/lib/logger";
import { internalApiFetch } from "@/lib/internal-api";
import "server-only";

export async function assertLoginRateLimit({
    ip,
    email,
}: {
    ip: string | null;
    email?: string | null;
}) {
    const res = await internalApiFetch("/ratelimit/check", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ip, email })
    });

    if (!res.ok) {
        const json = await res.json() as { error: string };
        if (res.status === 429) {
            const error = new Error(json.error);
            // @ts-expect-error custom code
            error.code = json.error;
            throw error;
        }
        logger.error({ error: json }, "Rate limit check failed");
        // Fail open or closed? Closed for security.
        throw new Error("Rate limit check failed");
    }
}

