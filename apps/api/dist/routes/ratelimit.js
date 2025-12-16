"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ratelimitRoutes = ratelimitRoutes;
const ratelimit_1 = require("@upstash/ratelimit");
const redis_1 = require("@upstash/redis");
const env_1 = require("../env");
const zod_1 = require("zod");
const redis = new redis_1.Redis({
    url: env_1.env.UPSTASH_REDIS_REST_URL,
    token: env_1.env.UPSTASH_REDIS_REST_TOKEN,
});
const ipLimiter = new ratelimit_1.Ratelimit({
    redis,
    limiter: ratelimit_1.Ratelimit.slidingWindow(20, "10 m"),
    prefix: "rl:login:ip",
});
const ipUserLimiter = new ratelimit_1.Ratelimit({
    redis,
    limiter: ratelimit_1.Ratelimit.slidingWindow(10, "10 m"),
    prefix: "rl:login:ip-user",
});
const checkSchema = zod_1.z.object({
    ip: zod_1.z.string().nullable(),
    email: zod_1.z.string().email().nullable().optional(),
});
async function ratelimitRoutes(fastify) {
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
