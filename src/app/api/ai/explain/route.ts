import { NextRequest, NextResponse } from "next/server";
import { explainPaperWithAi } from "@/lib/ai/openrouter";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, abstract, question } = body;

    const forwarded = req.headers.get("x-forwarded-for");
    const clientIp = forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1";

    const result = await explainPaperWithAi({
      title,
      abstract,
      question,
      clientIp,
    });

    if (result.error && !result.explanation) {
      return NextResponse.json(result, { status: result.isAiAvailable ? 429 : 503 });
    }

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("AI explain endpoint error:", err);
    return NextResponse.json(
      { error: "Internal server error processing AI request", details: err.message },
      { status: 500 }
    );
  }
}
