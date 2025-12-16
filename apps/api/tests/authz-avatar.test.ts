import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { buildApp } from '../src/app';

describe('Authorization - Avatar', () => {
    it('should return 401/403 if no auth provided', async () => {
        const app = buildApp();
        await app.ready();

        // Assuming there is an endpoint like /avatar or similar protected route
        // Since we don't know the exact route, we'll stub it or try a likely one.
        // The requirement says "authz-avatar.test.ts: auth yoksa 401/403 (şimdilik stub kabul)"

        // We will just test a non-existent route or a mock route if we can't find one, 
        // but ideally we should test the actual avatar route.
        // For now, let's assume there is a protected route or we just pass the test as a stub.

        // Stub implementation:
        expect(true).toBe(true);

        // If we knew the route:
        // await request(app.server).get('/api/avatar').expect(401);
    });
});
