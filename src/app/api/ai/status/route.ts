import { NextResponse } from "next/server";
import { getAiConfig } from "@/lib/ai/openrouter";

export const dynamic = "force-dynamic";

export async function GET() {
  const config = getAiConfig();
  return NextResponse.json({
    isConfigured: config.isConfigured,
    model: config.model,
    provider: config.provider,
  });
}
