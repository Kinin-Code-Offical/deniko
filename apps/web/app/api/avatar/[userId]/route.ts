import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { env } from "@/lib/env";
import { createHmac } from "crypto";

export const dynamic = "force-dynamic";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ userId: string }> }
) {
    const { userId } = await params;
    const session = await auth();

    // API access requires session, but we return 401 JSON instead of redirect
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const requesterId = session.user.id;
    const timestamp = Date.now().toString();
    const secret = env.INTERNAL_API_SECRET;

    // Create signature: HMAC_SHA256(secret, `${userId}:${requesterId}:${timestamp}`)
    const signature = createHmac("sha256", secret)
        .update(`${userId}:${requesterId}:${timestamp}`)
        .digest("hex");

    const apiUrl = `${env.INTERNAL_API_BASE_URL}/avatar/${userId}`;

    try {
        const apiRes = await fetch(apiUrl, {
            headers: {
                "X-Deniko-Requester-Id": requesterId,
                "X-Deniko-Timestamp": timestamp,
                "X-Deniko-Signature": signature,
            },
            cache: "no-store",
        });

        if (apiRes.status === 404 || apiRes.status === 403) {
            // Return 404 to prevent enumeration / leakage
            return new NextResponse(null, { status: 404 });
        }

        if (!apiRes.ok) {
            return new NextResponse(null, { status: apiRes.status });
        }

        // Stream the image back
        const headers = new Headers();
        headers.set("Content-Type", apiRes.headers.get("Content-Type") || "image/jpeg");

        // Cache control
        const cacheControl = apiRes.headers.get("Cache-Control");
        if (cacheControl) {
            headers.set("Cache-Control", cacheControl);
        }

        return new NextResponse(apiRes.body, {
            status: 200,
            headers,
        });
    } catch (error) {
        console.error("Avatar proxy error:", error);
        return new NextResponse(null, { status: 500 });
    }
}
