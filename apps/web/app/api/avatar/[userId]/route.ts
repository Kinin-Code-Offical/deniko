import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { env } from "@/lib/env";
import { createHmac } from "crypto";
import { internalApiFetch } from "@/lib/internal-api";
import { forwardProxyResponseOrRedirect } from "@/lib/api-response";

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

    try {
        const apiRes = await internalApiFetch(`/avatar/${userId}`, {
            headers: {
                "X-Deniko-Requester-Id": requesterId,
                "X-Deniko-Timestamp": timestamp,
                "X-Deniko-Signature": signature,
            },
            cache: "no-store",
        });

        // Use centralized proxy handler
        // We want 404 to return 404 status (not redirect) for images/avatars
        return await forwardProxyResponseOrRedirect(apiRes, request, { returnJsonOn404: false });

    } catch (error) {
        console.error("Avatar proxy error:", error);
        return new NextResponse(null, { status: 500 });
    }
}
