import { NextRequest, NextResponse } from "next/server";
import { searchOpenAlexAuthors } from "@/lib/scholarly/openalex";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const perPage = parseInt(searchParams.get("perPage") || "12", 10);

  if (!q.trim()) {
    return NextResponse.json({
      authors: [],
      totalCount: 0,
      page: 1,
      perPage,
      query: "",
      provider: "OpenAlex",
    });
  }

  try {
    const result = await searchOpenAlexAuthors(q, page, perPage);
    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (err: any) {
    console.error("API Researcher search error:", err);
    return NextResponse.json(
      { error: "Could not retrieve researchers from scholarly database", details: err.message },
      { status: 500 }
    );
  }
}
