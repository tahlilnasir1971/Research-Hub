import { NextRequest, NextResponse } from "next/server";
import { explainPaperWithAi } from "@/lib/ai/openrouter";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const contentLength = Number(req.headers.get("content-length") || 0);
  if (Number.isFinite(contentLength) && contentLength > 12_000) {
    return NextResponse.json({ error: "This request is too large. Please shorten the abstract or question." }, { status: 413 });
  }
  try {
    const rawBody = await req.text();
    if (new TextEncoder().encode(rawBody).byteLength > 12_000) {
      return NextResponse.json({ error: "This request is too large. Please shorten the abstract or question." }, { status: 413 });
    }
    const body: unknown = JSON.parse(rawBody);
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json({ error: "Send a paper title, abstract, and optional question as a JSON object." }, { status: 400 });
    }
    const { title, abstract, question } = body as Record<string, unknown>;
    if ((title !== undefined && typeof title !== "string") || (abstract !== undefined && typeof abstract !== "string") || (question !== undefined && typeof question !== "string")) {
      return NextResponse.json({ error: "Title, abstract, and question must be text." }, { status: 400 });
    }

    const forwarded = req.headers.get("x-forwarded-for");
    const clientIp = forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1";

    const result = await explainPaperWithAi({
      title,
      abstract,
      question,
      clientIp,
    });

    const { statusCode = 200, ...publicResult } = result;
    return NextResponse.json(publicResult, { status: statusCode });
  } catch {
    return NextResponse.json({ error: "Research Hub could not read this request. Check its format and try again." }, { status: 400 });
  }
}
