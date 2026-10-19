import { Paper, SearchFilters, SearchResult, AuthorProfile, Topic } from "./types";

const BASE_URL = "https://api.openalex.org";

function getHeaders(): HeadersInit {
  const email = process.env.POLITE_POOL_EMAIL || "anonymous-researcher@research-hub.local";
  return {
    "User-Agent": `ResearchHub/1.0 (mailto:${email})`,
    Accept: "application/json",
  };
}

export function reconstructAbstract(invertedIndex?: Record<string, number[]> | null): string {
  if (!invertedIndex || typeof invertedIndex !== "object") return "";

  const entries = Object.entries(invertedIndex);
  if (entries.length === 0) return "";

  const wordsWithPos: { word: string; pos: number }[] = [];
  for (const [word, positions] of entries) {
    if (Array.isArray(positions)) {
      for (const pos of positions) {
        wordsWithPos.push({ word, pos });
      }
    }
  }

  wordsWithPos.sort((a, b) => a.pos - b.pos);
  return wordsWithPos.map((item) => item.word).join(" ");
}

export function mapOpenAlexWorkToPaper(work: any): Paper {
  const authors = (work.authorships || []).map((a: any) => ({
    id: a.author?.id ? a.author.id.replace("https://openalex.org/", "") : undefined,
    name: a.author?.display_name || "Unknown Author",
    institution: a.institutions?.[0]?.display_name,
    orcid: a.author?.orcid,
  }));

  const primaryTopic: Topic | undefined = work.primary_topic
    ? {
        id: work.primary_topic.id?.replace("https://openalex.org/", ""),
        name: work.primary_topic.display_name,
        field: work.primary_topic.field?.display_name,
        domain: work.primary_topic.domain?.display_name,
        score: work.primary_topic.score,
      }
    : undefined;

  const topics: Topic[] = (work.topics || []).slice(0, 5).map((t: any) => ({
    id: t.id?.replace("https://openalex.org/", ""),
    name: t.display_name,
    field: t.field?.display_name,
    domain: t.domain?.display_name,
  }));

  const concepts = (work.concepts || [])
    .filter((c: any) => c.score > 0.3)
    .slice(0, 8)
    .map((c: any) => c.display_name);

  const openAccessUrl =
    work.open_access?.oa_url ||
    work.best_oa_location?.pdf_url ||
    work.best_oa_location?.landing_page_url ||
    undefined;

  const cleanId = work.id?.replace("https://openalex.org/", "") || "";

  return {
    id: cleanId,
    title: work.display_name || work.title || "Untitled Paper",
    abstract: reconstructAbstract(work.abstract_inverted_index),
    publicationYear: work.publication_year || new Date().getFullYear(),
    publicationDate: work.publication_date,
    authors,
    doi: work.doi ? work.doi.replace("https://doi.org/", "") : undefined,
    landingPageUrl: work.doi || work.primary_location?.landing_page_url,
    isOpenAccess: Boolean(work.open_access?.is_oa),
    openAccessUrl,
    primaryTopic,
    topics,
    concepts,
    citationCount: work.cited_by_count || 0,
    venue:
      work.primary_location?.source?.display_name ||
      work.host_venue?.display_name ||
      undefined,
    source: "openalex",
  };
}

export async function searchOpenAlex(
  query: string,
  filters: SearchFilters = {}
): Promise<SearchResult> {
  const page = filters.page || 1;
  const perPage = Math.min(filters.perPage || 15, 50);

  const url = new URL(`${BASE_URL}/works`);
  if (query.trim()) {
    url.searchParams.set("search", query.trim());
  }

  url.searchParams.set("page", page.toString());
  url.searchParams.set("per_page", perPage.toString());

  // Filters
  const filterParts: string[] = [];
  if (filters.openAccessOnly) {
    filterParts.push("is_oa:true");
  }
  if (filters.yearMin && filters.yearMax) {
    filterParts.push(`from_publication_date:${filters.yearMin}-01-01,to_publication_date:${filters.yearMax}-12-31`);
  } else if (filters.yearMin) {
    filterParts.push(`from_publication_date:${filters.yearMin}-01-01`);
  } else if (filters.yearMax) {
    filterParts.push(`to_publication_date:${filters.yearMax}-12-31`);
  }
  if (filters.topic) {
    filterParts.push(`default.search:${filters.topic}`);
  }

  if (filterParts.length > 0) {
    url.searchParams.set("filter", filterParts.join(","));
  }

  // Sorting
  if (filters.sortBy === "cited") {
    url.searchParams.set("sort", "cited_by_count:desc");
  } else if (filters.sortBy === "year_desc") {
    url.searchParams.set("sort", "publication_date:desc");
  } else if (filters.sortBy === "year_asc") {
    url.searchParams.set("sort", "publication_date:asc");
  } else {
    // Default relevance
    if (query.trim()) {
      url.searchParams.set("sort", "relevance_score:desc");
    } else {
      url.searchParams.set("sort", "cited_by_count:desc");
    }
  }

  const res = await fetch(url.toString(), {
    headers: getHeaders(),
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`OpenAlex API responded with status ${res.status}`);
  }

  const data = await res.json();
  const papers = (data.results || []).map(mapOpenAlexWorkToPaper);

  return {
    papers,
    totalCount: data.meta?.count || papers.length,
    page,
    perPage,
    query,
    provider: "OpenAlex (Free Public Dataset)",
  };
}

export async function getOpenAlexWork(idOrDoi: string): Promise<Paper | null> {
  let endpoint = `${BASE_URL}/works/${encodeURIComponent(idOrDoi)}`;
  if (idOrDoi.startsWith("10.")) {
    endpoint = `${BASE_URL}/works/https://doi.org/${encodeURIComponent(idOrDoi)}`;
  }

  const res = await fetch(endpoint, {
    headers: getHeaders(),
    next: { revalidate: 86400 },
  });

  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error(`OpenAlex fetch error: status ${res.status}`);
  }

  const data = await res.json();
  return mapOpenAlexWorkToPaper(data);
}

export async function getOpenAlexAuthor(authorId: string): Promise<AuthorProfile | null> {
  const cleanId = authorId.replace("https://openalex.org/", "");
  const res = await fetch(`${BASE_URL}/authors/${cleanId}`, {
    headers: getHeaders(),
    next: { revalidate: 86400 },
  });

  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error(`OpenAlex author fetch failed: status ${res.status}`);
  }

  const data = await res.json();

  // Fetch author's top works
  const worksRes = await fetch(
    `${BASE_URL}/works?filter=author.id:${cleanId}&sort=cited_by_count:desc&per_page=10`,
    {
      headers: getHeaders(),
      next: { revalidate: 86400 },
    }
  );

  let topWorks: Paper[] = [];
  if (worksRes.ok) {
    const worksData = await worksRes.json();
    topWorks = (worksData.results || []).map(mapOpenAlexWorkToPaper);
  }

  return {
    id: cleanId,
    name: data.display_name || "Unknown Author",
    affiliation: data.last_known_institution?.display_name,
    worksCount: data.works_count || 0,
    citationCount: data.cited_by_count || 0,
    hIndex: data.summary_stats?.h_index || 0,
    orcid: data.orcid,
    topWorks,
  };
}
