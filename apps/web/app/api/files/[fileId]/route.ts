import { auth } from "@/auth";
import { getObjectStream } from "@/lib/storage";
import { NextResponse } from "next/server";
import { i18n } from "@/i18n-config";
import { internalApiFetch } from "@/lib/internal-api";

function isHtmlRequest(req: Request): boolean {
    const accept = req.headers.get("accept") || "";
    return accept.includes("text/html");
}

export async function GET(
    req: Request,
    { params }: { params: Promise<{ fileId: string }> }
) {
    const { fileId } = await params;
    const session = await auth();

    if (!session?.user) {
        if (isHtmlRequest(req)) {
            const defaultLang = i18n.defaultLocale;
            return NextResponse.redirect(new URL(`/${defaultLang}/forbidden`, req.url), 302);
        }
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        // Fetch file metadata from API (which should handle permission checks)
        const res = await internalApiFetch(`/files/${fileId}/metadata`, {
            headers: {
                "x-user-id": session.user.id || "",
            }
        });

        if (!res.ok) {
            if (res.status === 403) {
                if (isHtmlRequest(req)) {
                    const defaultLang = i18n.defaultLocale;
                    return NextResponse.redirect(new URL(`/${defaultLang}/forbidden`, req.url), 302);
                }
                return new NextResponse("Forbidden", { status: 403 });
            }
            return new NextResponse("File not found", { status: 404 });
        }

        const file = await res.json() as { key: string; mimeType: string; sizeBytes: number; filename: string };

        const stream = await getObjectStream(file.key);

        return new NextResponse(stream as BodyInit, {
            headers: {
                "Content-Type": file.mimeType,
                "Content-Length": file.sizeBytes.toString(),
                "Content-Disposition": `attachment; filename="${file.filename}"`,
                "Cache-Control": "private, max-age=300",
            },
        });
    } catch {
        return new NextResponse("File content not found", { status: 404 });
    }
}
