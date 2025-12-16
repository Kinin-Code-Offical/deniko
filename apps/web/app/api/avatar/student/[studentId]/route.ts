import { auth } from "@/auth";
import { getObjectStream } from "@/lib/storage";
import { NextResponse } from "next/server";
import logger from "@/lib/logger";
import { internalApiFetch } from "@/lib/internal-api";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ studentId: string }> }
) {
    const { studentId } = await params;
    const session = await auth();

    if (!session?.user) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    let tempAvatarKey: string | null = null;

    try {
        const res = await internalApiFetch(`/student/${studentId}/avatar`, {
            headers: { "x-user-id": session.user.id || "" },
        });
        if (res.ok) {
            const data = await res.json() as { tempAvatarKey?: string | null };
            tempAvatarKey = data.tempAvatarKey || null;
        } else if (res.status === 403) {
            return new NextResponse("Forbidden", { status: 403 });
        }
    } catch (error) {
        // Ignore error, fallback to default
    }

    if (!tempAvatarKey) {
        // Return default avatar from GCS
        try {
            const stream = await getObjectStream("default/avatar.png");
            return new NextResponse(stream as BodyInit, {
                headers: {
                    "Content-Type": "image/png",
                    "Cache-Control": "public, max-age=31536000",
                },
            });
        } catch (error) {
            logger.error({ error }, "Default avatar not found in GCS");
            return new NextResponse("Default avatar not found", { status: 404 });
        }
    }

    // Internal GCS Key
    try {
        const stream = await getObjectStream(tempAvatarKey);
        const contentType = tempAvatarKey.endsWith(".png") ? "image/png" : "image/jpeg";

        return new NextResponse(stream as BodyInit, {
            headers: {
                "Content-Type": contentType,
                "Cache-Control": "private, max-age=300",
            },
        });
    } catch {
        return new NextResponse("Avatar not found", { status: 404 });
    }
}
