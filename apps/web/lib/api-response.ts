/* eslint-disable @typescript-eslint/no-unused-vars */
import { notFound, redirect } from "next/navigation";
import { NextResponse } from "next/server";
import logger from "@/lib/logger";

type RedirectContext = {
    lang?: string;
};

/**
 * Helper to construct the unauthorized URL.
 * Preserves language if present in context.
 */
function getUnauthorizedUrl(ctx?: RedirectContext) {
    return ctx?.lang ? `/${ctx.lang}/forbidden` : "/forbidden";
}

/**
 * Helper to construct the not found URL.
 * Preserves language if present in context.
 * Note: Next.js notFound() automatically renders the nearest not-found.tsx,
 * but for Route Handlers we might need an explicit redirect or JSON response.
 */
function getNotFoundUrl(ctx?: RedirectContext) {
    // Usually we let Next.js handle 404 UI, but if we must redirect:
    return ctx?.lang ? `/${ctx.lang}/not-found` : "/not-found";
}

/**
 * ------------------------------------------------------------------
 * FOR SERVER COMPONENTS & SERVER ACTIONS
 * Uses next/navigation to throw errors that Next.js catches to render UI.
 * ------------------------------------------------------------------
 */

/**
 * Asserts that the response is OK.
 * - 401/403 -> Redirects to /forbidden
 * - 404/410 -> Throws notFound()
 * - Other errors -> Throws Error
 */
export async function assertOkOrRedirect(res: Response, ctx?: RedirectContext) {
    if (res.ok) return;

    const requestId = res.headers.get("x-request-id") || "unknown";
    const { url } = res;

    if (res.status === 401 || res.status === 403) {
        logger.warn(`Unauthorized access to ${url}`, { requestId, status: res.status });
        redirect(getUnauthorizedUrl(ctx));
    }

    if (res.status === 404 || res.status === 410) {
        logger.warn(`Resource not found at ${url}`, { requestId, status: res.status });
        notFound();
    }

    // For other errors, we throw so error.tsx can handle it
    const body = await res.text().catch(() => "No body");
    logger.error(`Internal API Error: ${res.status} ${res.statusText}`, {
        requestId,
        url,
        body,
    });
    throw new Error(`Internal API Error: ${res.status} ${res.statusText}`);
}

/**
 * Parses JSON from the response if OK.
 * - 401/403 -> Redirects to /forbidden
 * - 404/410 -> Throws notFound()
 * - Other errors -> Throws Error
 */
export async function parseJsonOrRedirect<T>(res: Response, ctx?: RedirectContext): Promise<T> {
    await assertOkOrRedirect(res, ctx);
    return res.json();
}

/**
 * ------------------------------------------------------------------
 * FOR ROUTE HANDLERS (app/api/...)
 * Returns NextResponse objects to control the HTTP response directly.
 * ------------------------------------------------------------------
 */

/**
 * Proxies the response from the internal API to the client.
 * - 401/403 -> Redirects client to /forbidden
 * - 404/410 -> Redirects client to /not-found OR returns 404 JSON (configurable)
 * - OK -> Streams the response body with relevant headers.
 */
export async function forwardProxyResponseOrRedirect(
    res: Response,
    req: Request,
    ctx?: RedirectContext & { returnJsonOn404?: boolean }
) {
    const requestId = res.headers.get("x-request-id") || "unknown";
    const { url } = res;

    if (res.status === 401 || res.status === 403) {
        logger.warn(`Proxy: Unauthorized access to ${url}`, { requestId, status: res.status });
        const target = new URL(req.url);
        target.pathname = getUnauthorizedUrl(ctx);
        return NextResponse.redirect(target);
    }

    if (res.status === 404 || res.status === 410) {
        logger.warn(`Proxy: Resource not found at ${url}`, { requestId, status: res.status });

        if (ctx?.returnJsonOn404) {
            return NextResponse.json({ error: "Not Found" }, { status: 404 });
        }

        // Default: Redirect to 404 page so user sees UI
        // Alternatively, we could return a 404 status and let the client handle it,
        // but for asset proxies (like avatars), a redirect or 404 status is needed.
        // If it's an image, we might want to return a 404 status so the browser shows broken image.
        return new NextResponse("Not Found", { status: 404 });
    }

    // Forward headers
    const headers = new Headers();
    const allowedHeaders = [
        "content-type",
        "content-length",
        "content-disposition",
        "cache-control",
        "etag",
        "last-modified",
    ];

    allowedHeaders.forEach((h) => {
        const val = res.headers.get(h);
        if (val) headers.set(h, val);
    });

    // Stream the body
    return new NextResponse(res.body, {
        status: res.status,
        statusText: res.statusText,
        headers,
    });
}
