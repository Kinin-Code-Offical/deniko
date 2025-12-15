import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { buildApp } from '../src/app';

describe('Health Check', () => {
    it('GET /health should return { ok: true }', async () => {
        const app = buildApp();
        await app.ready();

        const response = await request(app.server)
            .get('/health')
            .expect(200);

        expect(response.body).toEqual({ ok: true });
    });
});
