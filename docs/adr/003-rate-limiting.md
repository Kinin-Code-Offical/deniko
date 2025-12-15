# ADR 003: Rate Limiting Strategy

## Status

Accepted

## Context

Public endpoints, especially authentication and file uploads, are vulnerable to abuse (brute force, DoS). We need a mechanism to limit the rate of requests.

## Decision

We use **Token Bucket Algorithm** via `@upstash/ratelimit`.

1. **Storage**: Redis (Upstash) is the primary store for counters.
2. **Fallback**: In-memory map (LRU) if Redis is unavailable (for local dev).
3. **Granularity**:
    - **Login**: Strict limit (e.g., 5 attempts / 10 mins) per IP + Email.
    - **API**: Generous limit (e.g., 100 req / 10s) per IP.

## Consequences

- **Reliability**: Redis ensures distributed rate limiting across serverless functions.
- **UX**: Users may be blocked if they share an IP (NAT), but the limits are tuned to be high enough for normal use.

## References

- [Upstash Rate Limit SDK](https://github.com/upstash/ratelimit)
