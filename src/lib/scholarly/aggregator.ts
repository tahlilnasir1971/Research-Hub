import { Paper, SearchFilters, SearchResult } from "./types";
import { searchOpenAlex, getOpenAlexWork } from "./openalex";
import { searchArxiv, getArxivWork } from "./arxiv";
import { searchCrossref, getCrossrefWork } from "./crossref";
import { generateBibtex } from "./citation";

export function deduplicatePapers(papers: Paper[]): Paper[] {
  const seenDoi = new Set<string>();
  const seenTitle = new Set<string>();
  const unique: Paper[] = [];

  for (const paper of papers) {
    const normTitle = paper.title.toLowerCase().replace(/[^a-z0-9]/g, "");

    if (paper.doi) {
      const normDoi = paper.doi.toLowerCase().trim();
      if (seenDoi.has(normDoi)) continue;
      seenDoi.add(normDoi);
    }

    if (normTitle.length > 10) {
      if (seenTitle.has(normTitle)) continue;
      seenTitle.add(normTitle);
    }

    // Attach bibtex
    paper.bibtex = generateBibtex(paper);
    unique.push(paper);
  }

  return unique;
}

export async function unifiedSearch(
  query: string,
  filters: SearchFilters = {}
): Promise<SearchResult> {
  // Strategy: Try OpenAlex first (covers over 250M works with rich topic & author data)
  try {
    const openAlexResult = await searchOpenAlex(query, filters);
    if (openAlexResult.papers.length > 0) {
      return {
        ...openAlexResult,
        papers: deduplicatePapers(openAlexResult.papers),
      };
    }
  } catch (err) {
    console.warn("OpenAlex search failed, falling back to arXiv and Crossref:", err);
  }

  // Fallback 1: arXiv search (ideal for CS, physics, math preprints)
  try {
    const arxivResult = await searchArxiv(query, filters);
    if (arxivResult.papers.length > 0) {
      return {
        ...arxivResult,
        papers: deduplicatePapers(arxivResult.papers),
      };
    }
  } catch (err) {
    console.warn("arXiv search failed, falling back to Crossref:", err);
  }

  // Fallback 2: Crossref search (comprehensive DOI catalog)
  try {
    const crossrefResult = await searchCrossref(query, filters);
    return {
      ...crossrefResult,
      papers: deduplicatePapers(crossrefResult.papers),
    };
  } catch (err) {
    console.error("All scholarly search providers failed:", err);
    return {
      papers: [],
      totalCount: 0,
      page: filters.page || 1,
      perPage: filters.perPage || 15,
      query,
      provider: "None (Service Outage or Offline)",
    };
  }
}

export async function unifiedGetPaper(id: string): Promise<Paper | null> {
  const decodedId = decodeURIComponent(id);

  // Check prefix
  if (decodedId.startsWith("arxiv:")) {
    const paper = await getArxivWork(decodedId);
    if (paper) {
      paper.bibtex = generateBibtex(paper);
      return paper;
    }
  }

  if (decodedId.startsWith("doi:") || decodedId.startsWith("10.")) {
    const cleanDoi = decodedId.replace(/^doi:/i, "");
    // Try OpenAlex by DOI first
    try {
      const openAlexPaper = await getOpenAlexWork(cleanDoi);
      if (openAlexPaper) {
        openAlexPaper.bibtex = generateBibtex(openAlexPaper);
        return openAlexPaper;
      }
    } catch {
      // Ignore and try Crossref
    }

    const crossrefPaper = await getCrossrefWork(cleanDoi);
    if (crossrefPaper) {
      crossrefPaper.bibtex = generateBibtex(crossrefPaper);
      return crossrefPaper;
    }
  }

  // Otherwise assume OpenAlex ID (e.g. W2741809807)
  try {
    const openAlexPaper = await getOpenAlexWork(decodedId);
    if (openAlexPaper) {
      openAlexPaper.bibtex = generateBibtex(openAlexPaper);
      return openAlexPaper;
    }
  } catch {
    // try arXiv or Crossref fallback
  }

  return null;
}
