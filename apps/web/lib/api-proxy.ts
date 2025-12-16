import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { env } from '@/lib/env';
import { internalApiFetch } from "@/lib/internal-api";
import "server-only";

export async function proxyToApi(req: NextRequest, path: string) {

    const session = await auth();
    const headers = new Headers(req.headers);

    if (session?.user?.id) {
        headers.set('x-user-id', session.user.id);
    }

    // Remove host header to avoid issues
    headers.delete('host');
    headers.delete('connection');

    try {
        const response = await internalApiFetch(path, {
            method: req.method,
            headers,
            body: req.body,
            // @ts-expect-error - duplex is needed for streaming bodies in some node versions
            duplex: 'half'
        });

        return new NextResponse(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: response.headers
        });
    } catch (error) {
        console.error('Proxy error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
