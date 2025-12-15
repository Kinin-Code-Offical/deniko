import { FastifyInstance } from 'fastify';
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { env } from '../env';
import { z } from 'zod';

const redis = new Redis({
    url: env.UPSTASH_REDIS_REST_URL,
    token: env.UPSTASH_REDIS_REST_TOKEN,
});

const ipLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(20, "10 m"),
    prefix: "rl:login:ip",
});

const ipUserLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "10 m"),
    prefix: "rl:login:ip-user",
});

const checkSchema = z.object({
    ip: z.string().nullable(),
    email: z.string().email().nullable().optional(),
});

export async function ratelimitRoutes(fastify: FastifyInstance) {
    fastify.post('/check', async (request, reply) => {
        const result = checkSchema.safeParse(request.body);
        if (!result.success) {
            return reply.code(400).send({ error: result.error });
        }

        const { ip, email } = result.data;
        const safeIp = ip ?? "unknown";
        const safeEmail = email?.toLowerCase() ?? null;

        // 1) IP limit
        const ipRes = await ipLimiter.limit(safeIp);
        if (!ipRes.success) {
            fastify.log.warn({
                event: "login_rate_limited_ip",
                ip: safeIp,
                email: safeEmail,
                limit: "20/10m",
            });
            return reply.code(429).send({ error: "TOO_MANY_LOGIN_ATTEMPTS_IP" });
        }

        // 2) IP + email limit (if email exists)
        if (safeEmail) {
            const ipUserKey = `${safeIp}:${safeEmail}`;
            const ipUserRes = await ipUserLimiter.limit(ipUserKey);
            if (!ipUserRes.success) {
                fastify.log.warn({
                    event: "login_rate_limited_ip_user",
                    ip: safeIp,
                    email: safeEmail,
                    limit: "10/10m",
                });
                return reply.code(429).send({ error: "TOO_MANY_LOGIN_ATTEMPTS_IP_USER" });
            }
        }

        return { success: true };
    });
}
