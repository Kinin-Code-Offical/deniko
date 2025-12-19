import { NextResponse } from "next/server";
import logger from "@/lib/logger";
import { internalApiFetch } from "@/lib/internal-api";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Check API connectivity
    const res = await internalApiFetch("/health");
    if (!res.ok) throw new Error(`API unhealthy: ${res.status} ${res.statusText}`);

    return NextResponse.json(
      {
        status: "ok",
        timestamp: new Date().toISOString(),
        api: "connected",
        uptime: process.uptime(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Health check failed:", error);
    logger.error({ error }, "Health check failed");
    return NextResponse.json(
      {
        status: "error",
        timestamp: new Date().toISOString(),
        database: "disconnected",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 503 }
    );
  }
}
