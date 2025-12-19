import { NextResponse } from "next/server";
import logger from "@/lib/logger";
import { internalApiFetch } from "@/lib/internal-api";

export async function GET() {
  try {
    // Check API connectivity
    const res = await internalApiFetch("/health");
    if (!res.ok) throw new Error("API unhealthy"); // ignore-hardcoded

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
