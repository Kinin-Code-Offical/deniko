"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.passwordChangeRateLimit = exports.loginRateLimit = void 0;
const ratelimit_1 = require("@upstash/ratelimit");
const redis_1 = require("@upstash/redis");
const env_1 = require("../env");
const redis = new redis_1.Redis({
    url: env_1.env.UPSTASH_REDIS_REST_URL,
    token: env_1.env.UPSTASH_REDIS_REST_TOKEN,
});
exports.loginRateLimit = new ratelimit_1.Ratelimit({
    redis,
    limiter: ratelimit_1.Ratelimit.slidingWindow(5, "1 m"),
    analytics: true,
    prefix: "ratelimit:login",
});
exports.passwordChangeRateLimit = new ratelimit_1.Ratelimit({
    redis,
    limiter: ratelimit_1.Ratelimit.slidingWindow(3, "1 m"),
    analytics: true,
    prefix: "ratelimit:password_change",
});
