import { describe, it, expect } from 'vitest';
import { buildApp } from '../src/app';

describe('Health Check', () => {
    it('GET /health should return { ok: true }', async () => {
        const app = buildApp();
        await app.ready();

        const response = await app.inject({
            method: 'GET',
            url: '/health'
        });

        expect(response.statusCode).toBe(200);
        expect(response.json()).toEqual({ ok: true });

        await app.close();
    });
});
