import { NextRequest, NextResponse } from "next/server";
import { unifiedGetPaper } from "@/lib/scholarly/aggregator";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    if (!id) {
      return NextResponse.json({ error: "Paper ID is required" }, { status: 400 });
    }

    const paper = await unifiedGetPaper(id);
    if (!paper) {
      return NextResponse.json({ error: "Paper not found" }, { status: 404 });
    }

    return NextResponse.json(paper, {
      headers: {
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
      },
    });
  } catch (err: any) {
    console.error("API Paper fetch error:", err);
    return NextResponse.json(
      { error: "Failed to fetch paper details", details: err.message },
      { status: 500 }
    );
  }
}
