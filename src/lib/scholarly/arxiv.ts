import { Paper, SearchFilters, SearchResult } from "./types";

const ARXIV_BASE = "https://export.arxiv.org/api/query";

let lastRequestTime = 0;
const MIN_INTERVAL_MS = 1000; // Throttle to prevent 503 errors

async function throttle() {
  const now = Date.now();
  const timeSinceLast = now - lastRequestTime;
  if (timeSinceLast < MIN_INTERVAL_MS) {
    await new Promise((resolve) => setTimeout(resolve, MIN_INTERVAL_MS - timeSinceLast));
  }
  lastRequestTime = Date.now();
}

function parseArxivXml(xml: string): Paper[] {
  const papers: Paper[] = [];
  const entryRegex = /<entry>([\s\S]*?)<\/entry>/gi;
  let match;

  while ((match = entryRegex.exec(xml)) !== null) {
    const entryXml = match[1];

    // Extract ID
    const idMatch = /<id>(.*?)<\/id>/i.exec(entryXml);
    const rawId = idMatch ? idMatch[1].trim() : "";
    const arxivId = rawId.replace(/^https?:\/\/arxiv\.org\/abs\//i, "");

    // Extract Title
    const titleMatch = /<title>([\s\S]*?)<\/title>/i.exec(entryXml);
    const title = titleMatch ? titleMatch[1].replace(/\s+/g, " ").trim() : "Untitled";

    // Extract Summary (Abstract)
    const summaryMatch = /<summary>([\s\S]*?)<\/summary>/i.exec(entryXml);
    const abstract = summaryMatch ? summaryMatch[1].replace(/\s+/g, " ").trim() : "";

    // Extract Published Date
    const pubMatch = /<published>(.*?)<\/published>/i.exec(entryXml);
    const published = pubMatch ? pubMatch[1].trim() : undefined;
    const year = published ? new Date(published).getFullYear() : new Date().getFullYear();

    // Extract Authors
    const authors: { name: string }[] = [];
    const authorRegex = /<author>\s*<name>(.*?)<\/name>\s*<\/author>/gi;
    let authorMatch;
    while ((authorMatch = authorRegex.exec(entryXml)) !== null) {
      authors.push({ name: authorMatch[1].trim() });
    }

    // Extract PDF link
    const pdfMatch = /<link[^>]*?title="pdf"[^>]*?href="(.*?)"/i.exec(entryXml) ||
      /<link[^>]*?href="(.*?)"[^>]*?type="application\/pdf"/i.exec(entryXml);
    const pdfUrl = pdfMatch ? pdfMatch[1].replace(/^http:/, "https:") : `https://arxiv.org/pdf/${arxivId}.pdf`;

    // Extract DOI if available
    const doiMatch = /<arxiv:doi[^>]*>(.*?)<\/arxiv:doi>/i.exec(entryXml);
    const doi = doiMatch ? doiMatch[1].trim() : undefined;

    // Extract Primary Category
    const catMatch = /<arxiv:primary_category[^>]*term="(.*?)"/i.exec(entryXml);
    const category = catMatch ? catMatch[1].trim() : undefined;

    papers.push({
      id: `arxiv:${arxivId}`,
      title,
      abstract,
      publicationYear: year,
      publicationDate: published ? published.split("T")[0] : undefined,
      authors,
      doi,
      landingPageUrl: `https://arxiv.org/abs/${arxivId}`,
      isOpenAccess: true,
      openAccessUrl: pdfUrl,
      primaryTopic: category ? { name: category, field: "Preprints (arXiv)" } : undefined,
      concepts: category ? [category, "Preprint", "arXiv"] : ["Preprint", "arXiv"],
      citationCount: 0,
      venue: "arXiv Preprint Server",
      source: "arxiv",
    });
  }

  return papers;
}

export async function searchArxiv(
  query: string,
  filters: SearchFilters = {}
): Promise<SearchResult> {
  await throttle();

  const page = filters.page || 1;
  const perPage = Math.min(filters.perPage || 15, 30);
  const start = (page - 1) * perPage;

  const searchQuery = query.trim() ? `all:${encodeURIComponent(query.trim())}` : "all:science";
  const url = `${ARXIV_BASE}?search_query=${searchQuery}&start=${start}&max_results=${perPage}&sortBy=submittedDate&sortOrder=descending`;

  const res = await fetch(url, {
    headers: {
      "User-Agent": "ResearchHub/1.0 (mailto:public-scholar@research-hub.local)",
    },
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`arXiv API error: ${res.status}`);
  }

  const xml = await res.text();
  const papers = parseArxivXml(xml);

  return {
    papers,
    totalCount: papers.length >= perPage ? 1000 : papers.length, // arXiv total is estimated
    page,
    perPage,
    query,
    provider: "arXiv (Cornell University)",
  };
}

export async function getArxivWork(arxivId: string): Promise<Paper | null> {
  await throttle();
  const cleanId = arxivId.replace(/^arxiv:/i, "");
  const url = `${ARXIV_BASE}?id_list=${encodeURIComponent(cleanId)}`;

  const res = await fetch(url, {
    next: { revalidate: 86400 },
  });

  if (!res.ok) return null;

  const xml = await res.text();
  const papers = parseArxivXml(xml);
  return papers[0] || null;
}
