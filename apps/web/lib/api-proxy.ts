import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

const API_URL = process.env.INTERNAL_API_URL || 'http://localhost:4000';

export async function proxyToApi(req: NextRequest, path: string) {
    const session = await auth();
    const headers = new Headers(req.headers);

    if (session?.user?.id) {
        headers.set('x-user-id', session.user.id);
    }

    // Remove host header to avoid issues
    headers.delete('host');
    headers.delete('connection');

    const url = `${API_URL}${path}`;

    try {
        const response = await fetch(url, {
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
