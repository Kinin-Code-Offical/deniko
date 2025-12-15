import "server-only";
import { GoogleAuth } from "google-auth-library";
import { env } from "@/lib/env";
import { v4 as uuidv4 } from "uuid";

const BASE_URL = env.INTERNAL_API_BASE_URL;
const auth = new GoogleAuth();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let client: any;

async function getAuthHeaders() {
    if (env.NODE_ENV !== "production") {
        return {};
    }

    try {
        if (!client) {
            client = await auth.getIdTokenClient(BASE_URL);
        }
        const headers = await client.getRequestHeaders();
        return headers;
    } catch (error) {
        console.error("Failed to get ID token for internal API", error);
        // Fallback or throw? For now, let's return empty and let the API decide (it might be public or protected by other means in some setups, but strictly it should fail if auth is required)
        // However, if we are in production but maybe running locally against prod? No, NODE_ENV=production implies real prod.
        return {};
    }
}

export async function internalApiFetch(path: string, init?: RequestInit) {
    const requestId = uuidv4();
    const authHeaders = await getAuthHeaders();

    const headers = new Headers(init?.headers);
    headers.set("x-request-id", requestId);

    // Merge auth headers
    for (const [key, value] of Object.entries(authHeaders)) {
        headers.set(key, value as string);
    }

    const url = `${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;

    return fetch(url, {
        ...init,
        headers,
    });
}
