import "server-only";
import { GoogleAuth } from "google-auth-library";
import { env } from "@/lib/env";
import { v4 as uuidv4 } from "uuid";
import logger from "@/lib/logger";

const BASE_URL = env.INTERNAL_API_BASE_URL;
const auth = new GoogleAuth();

interface AuthClient {
    getRequestHeaders(): Promise<Record<string, string>>;
}

let client: AuthClient | undefined;

async function getAuthHeaders() {
    // Cloud Run ortamında değilsek token ekleme (local/dev)
    const runningOnCloudRun = Boolean(process.env.K_SERVICE);
    if (!runningOnCloudRun) return {};

    // Audience mutlaka çağırdığın base URL ile aynı olmalı (trailing slash yok)
    const audience = (BASE_URL || "").replace(/\/+$/, "");
    if (!audience) {
        logger.error("INTERNAL_API_BASE_URL is empty; cannot create ID token");
        return {};
    }

    // 1) En güvenilir yöntem: Cloud Run metadata server’dan ID token
    try {
        const metaUrl =
            "http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/identity" +
            `?audience=${encodeURIComponent(audience)}&format=full`;

        const res = await fetch(metaUrl, {
            headers: { "Metadata-Flavor": "Google" },
        });

        if (!res.ok) {
            const body = await res.text().catch(() => "");
            throw new Error(`metadata identity token fetch failed: ${res.status} ${body}`);
        }

        const token = await res.text();
        return { Authorization: `Bearer ${token}` };
    } catch (error) {
        // 2) Fallback: google-auth-library (istersen kalsın)
        try {
            if (!client) {
                client = (await auth.getIdTokenClient(audience)) as unknown as AuthClient;
            }
            return await client.getRequestHeaders();
        } catch (e) {
            logger.error("Failed to get ID token for internal API (metadata + google-auth failed)", {
                error: error instanceof Error ? error.message : String(error),
                fallbackError: e instanceof Error ? e.message : String(e),
                audience,
            });
            return {};
        }
    }
}


interface InternalApiOptions extends RequestInit {
    timeout?: number;
    retries?: number;
}

export async function internalApiFetch(path: string, options: InternalApiOptions = {}) {
    const { timeout = 5000, retries = 1, ...init } = options;
    const requestId = uuidv4();
    const authHeaders = await getAuthHeaders();

    const headers = new Headers(init?.headers);
    headers.set("x-request-id", requestId);

    // Merge auth headers
    for (const [key, value] of Object.entries(authHeaders)) {
        headers.set(key, value as string);
    }

    const url = `${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;

    let lastError: unknown;

    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            const controller = new AbortController();
            const id = setTimeout(() => controller.abort(), timeout);

            const response = await fetch(url, {
                ...init,
                headers,
                signal: controller.signal,
            });

            clearTimeout(id);
            // Log warning for non-2xx responses but don't retry unless it's a 5xx
            // Skip logging for 429 (Rate Limit) and 404 (Not Found) as they are often expected

            if (!response.ok && (response.status !== 429 && response.status !== 404)) {
                logger.warn(`Internal API Error: ${response.status} ${response.statusText}`, {
                    url,
                    requestId,
                    status: response.status
                });
            }


            return response;
        } catch (error) {
            lastError = error;
            const isRetryable = attempt < retries && (init.method === "GET" || !init.method);

            logger.warn(`Internal API Fetch Failed (Attempt ${attempt + 1}/${retries + 1})`, {
                url,
                requestId,
                error: error instanceof Error ? error.message : String(error)
            });

            if (!isRetryable) break;

            // Exponential backoff
            await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 100));
        }
    }

    throw lastError;
}
