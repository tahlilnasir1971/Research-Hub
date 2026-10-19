import { Paper, SearchFilters, SearchResult } from "./types";

const CROSSREF_BASE = "https://api.crossref.org/works";

function getHeaders(): HeadersInit {
  const email = process.env.POLITE_POOL_EMAIL || "scholar@research-hub.local";
  return {
    "User-Agent": `ResearchHub/1.0 (mailto:${email})`,
    Accept: "application/json",
  };
}

export function mapCrossrefItemToPaper(item: any): Paper {
  const authors = (item.author || []).map((a: any) => ({
    name: [a.given, a.family].filter(Boolean).join(" ") || a.name || "Unknown Author",
    institution: a.affiliation?.[0]?.name,
    orcid: a.ORCID,
  }));

  const pubYear =
    item["published-print"]?.["date-parts"]?.[0]?.[0] ||
    item["published-online"]?.["date-parts"]?.[0]?.[0] ||
    item.created?.["date-parts"]?.[0]?.[0] ||
    new Date().getFullYear();

  const title = Array.isArray(item.title) ? item.title[0] : item.title || "Untitled Paper";
  const venue = Array.isArray(item["container-title"]) ? item["container-title"][0] : item["container-title"];

  const doi = item.DOI;
  const isOa = Boolean(item.license?.length > 0);

  // Link to PDF or publisher landing page
  const pdfLink = item.link?.find((l: any) => l["content-type"] === "application/pdf")?.URL;

  return {
    id: `doi:${doi}`,
    title: title.replace(/<[^>]*>/g, ""), // strip HTML tags if any
    abstract: item.abstract ? item.abstract.replace(/<[^>]*>/g, "").trim() : "",
    publicationYear: pubYear,
    authors,
    doi,
    landingPageUrl: item.resource?.primary?.URL || (doi ? `https://doi.org/${doi}` : undefined),
    isOpenAccess: isOa,
    openAccessUrl: pdfLink,
    concepts: item.subject || [],
    citationCount: item["is-referenced-by-count"] || 0,
    venue,
    source: "crossref",
  };
}

export async function searchCrossref(
  query: string,
  filters: SearchFilters = {}
): Promise<SearchResult> {
  const page = filters.page || 1;
  const perPage = Math.min(filters.perPage || 15, 30);
  const offset = (page - 1) * perPage;

  const url = new URL(CROSSREF_BASE);
  if (query.trim()) {
    url.searchParams.set("query", query.trim());
  }
  url.searchParams.set("rows", perPage.toString());
  url.searchParams.set("offset", offset.toString());

  if (filters.sortBy === "cited") {
    url.searchParams.set("sort", "is-referenced-by-count");
    url.searchParams.set("order", "desc");
  } else if (filters.sortBy === "year_desc") {
    url.searchParams.set("sort", "published");
    url.searchParams.set("order", "desc");
  }

  const res = await fetch(url.toString(), {
    headers: getHeaders(),
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`Crossref API responded with status ${res.status}`);
  }

  const data = await res.json();
  const items = data.message?.items || [];
  const papers = items.map(mapCrossrefItemToPaper);

  return {
    papers,
    totalCount: data.message?.["total-results"] || papers.length,
    page,
    perPage,
    query,
    provider: "Crossref (Open Scholarly Infrastructure)",
  };
}

export async function getCrossrefWork(doi: string): Promise<Paper | null> {
  const clean = doi.replace(/^https?:\/\/(dx\.)?doi\.org\//i, "").replace(/^doi:/i, "");
  const url = `${CROSSREF_BASE}/${encodeURIComponent(clean)}`;

  const res = await fetch(url, {
    headers: getHeaders(),
    next: { revalidate: 86400 },
  });

  if (!res.ok) return null;

  const data = await res.json();
  if (!data.message) return null;

  return mapCrossrefItemToPaper(data.message);
}
