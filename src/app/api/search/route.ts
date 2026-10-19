import { NextRequest, NextResponse } from "next/server";
import { unifiedSearch } from "@/lib/scholarly/aggregator";
import { SearchFilters } from "@/lib/scholarly/types";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const perPage = parseInt(searchParams.get("perPage") || "15", 10);
  const yearMin = searchParams.get("yearMin") ? parseInt(searchParams.get("yearMin")!, 10) : undefined;
  const yearMax = searchParams.get("yearMax") ? parseInt(searchParams.get("yearMax")!, 10) : undefined;
  const openAccessOnly = searchParams.get("openAccess") === "true";
  const topic = searchParams.get("topic") || undefined;
  const sortBy = (searchParams.get("sortBy") as SearchFilters["sortBy"]) || "relevance";

  try {
    const result = await unifiedSearch(q, {
      page,
      perPage,
      yearMin,
      yearMax,
      openAccessOnly,
      topic,
      sortBy,
    });

    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=86400",
      },
    });
  } catch (err: any) {
    console.error("API Search error:", err);
    return NextResponse.json(
      { error: "Failed to perform scholarly search", details: err.message },
      { status: 500 }
    );
  }
}
