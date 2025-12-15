import { NextRequest } from "next/server";
import { proxyToApi } from "@/lib/api-proxy";

export const dynamic = "force-dynamic";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ userId: string }> }
) {
    const { userId } = await params;
    return proxyToApi(req, `/avatar/${userId}`);
}
