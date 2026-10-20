"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, Loader2, AlertCircle, FileSearch, ArrowLeft, ArrowRight, BookOpen, Users } from "lucide-react";
import { PaperCard } from "@/components/PaperCard";
import { ResearcherCard } from "@/components/ResearcherCard";
import { SearchFilters } from "@/components/SearchFilters";
import { SearchResult, SearchFilters as FilterType, AuthorSearchResult, AuthorProfile } from "@/lib/scholarly/types";

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const query = searchParams.get("q") || "";
  const typeParam = searchParams.get("type") === "researchers" ? "researchers" : "papers";
  const pageParam = parseInt(searchParams.get("page") || "1", 10);
  const openAccessParam = searchParams.get("openAccess") === "true";
  const yearMinParam = searchParams.get("yearMin") ? parseInt(searchParams.get("yearMin")!, 10) : undefined;
  const yearMaxParam = searchParams.get("yearMax") ? parseInt(searchParams.get("yearMax")!, 10) : undefined;
  const sortByParam = (searchParams.get("sortBy") as FilterType["sortBy"]) || "relevance";

  const [inputQuery, setInputQuery] = useState(query);
  const [paperData, setPaperData] = useState<SearchResult | null>(null);
  const [researcherData, setResearcherData] = useState<AuthorSearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setInputQuery(query);
    if (!query.trim()) {
      setPaperData(null);
      setResearcherData(null);
      return;
    }

    const controller = new AbortController();
    const fetchResults = async () => {
      setLoading(true);
      setError(null);

      if (typeParam === "researchers") {
        try {
          const params = new URLSearchParams();
          params.set("q", query);
          params.set("page", pageParam.toString());
          params.set("perPage", "12");

          const res = await fetch(`/api/researchers?${params.toString()}`, { signal: controller.signal });
          if (!res.ok) {
            throw new Error("Could not retrieve researchers from the academic registry.");
          }
          const json: AuthorSearchResult = await res.json();
          setResearcherData(json);
        } catch (err: any) {
          if (err.name !== "AbortError") setError(err.message || "Failed to search researchers.");
        } finally {
          if (!controller.signal.aborted) setLoading(false);
        }
      } else {
        // Papers search
        try {
          const params = new URLSearchParams();
          params.set("q", query);
          params.set("page", pageParam.toString());
          params.set("sortBy", sortByParam);
          if (openAccessParam) params.set("openAccess", "true");
          if (yearMinParam) params.set("yearMin", yearMinParam.toString());
          if (yearMaxParam) params.set("yearMax", yearMaxParam.toString());

          const res = await fetch(`/api/search?${params.toString()}`, { signal: controller.signal });
          if (!res.ok) {
            if (res.status === 429) throw new Error("The scholarly source is receiving too many requests. Wait briefly and try again.");
            throw new Error("The scholarly source could not complete this search. Please try again.");
          }
          const json: SearchResult = await res.json();
          setPaperData(json);
        } catch (err: any) {
          if (err.name !== "AbortError") setError(err.message || "Could not fetch research papers.");
        } finally {
          if (!controller.signal.aborted) setLoading(false);
        }
      }
    };

    fetchResults();
    return () => controller.abort();
  }, [query, typeParam, pageParam, openAccessParam, yearMinParam, yearMaxParam, sortByParam]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputQuery.trim()) {
      updateUrl({ q: inputQuery.trim(), page: 1 });
    }
  };

  const updateUrl = (updates: Partial<{
    q: string;
    type: "papers" | "researchers";
    page: number;
    openAccess: boolean;
    yearMin?: number;
    yearMax?: number;
    sortBy: string;
  }>) => {
    const params = new URLSearchParams(searchParams.toString());

    if (updates.q !== undefined) params.set("q", updates.q);
    if (updates.type !== undefined) {
      if (updates.type === "researchers") params.set("type", "researchers");
      else params.delete("type");
    }
    if (updates.page !== undefined) params.set("page", updates.page.toString());
    if (updates.openAccess !== undefined) {
      if (updates.openAccess) params.set("openAccess", "true");
      else params.delete("openAccess");
    }
    if (updates.yearMin !== undefined) {
      if (updates.yearMin) params.set("yearMin", updates.yearMin.toString());
      else params.delete("yearMin");
    }
    if (updates.yearMax !== undefined) {
      if (updates.yearMax) params.set("yearMax", updates.yearMax.toString());
      else params.delete("yearMax");
    }
    if (updates.sortBy !== undefined) params.set("sortBy", updates.sortBy);

    router.push(`/search?${params.toString()}`);
  };

  const handleApplyFilters = (filters: FilterType) => {
    updateUrl({
      openAccess: filters.openAccessOnly,
      yearMin: filters.yearMin,
      yearMax: filters.yearMax,
      sortBy: filters.sortBy,
      page: 1,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Search Bar & Mode Switcher */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
          <div className="flex items-center gap-1">
            <button
              onClick={() => updateUrl({ type: "papers", page: 1 })}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                typeParam === "papers"
                  ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>Scientific Papers</span>
            </button>

            <button
              onClick={() => updateUrl({ type: "researchers", page: 1 })}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                typeParam === "researchers"
                  ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              <Users className="h-3.5 w-3.5" />
              <span>Researchers & Authors</span>
            </button>
          </div>

          <span className="text-[11px] text-slate-400 hidden sm:inline">
            Searching {typeParam === "papers" ? "250M+ publications (OpenAlex, arXiv, Crossref)" : "verified researchers via OpenAlex Authority"}
          </span>
        </div>

        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder={
                typeParam === "papers"
                  ? "Search papers, keywords, topics, or DOI..."
                  : "Search researchers by name, institution, or field (e.g. Yoshua Bengio, Terence Tao)..."
              }
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-indigo-700 hover:bg-indigo-800 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm transition-colors shrink-0"
          >
            Search
          </button>
        </form>
      </div>

      {/* Main Grid: Filters + Results */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Sidebar Filters (only shown for papers) */}
        {typeParam === "papers" ? (
          <div className="lg:col-span-1 space-y-4">
            <SearchFilters
              initialFilters={{
                openAccessOnly: openAccessParam,
                yearMin: yearMinParam,
                yearMax: yearMaxParam,
                sortBy: sortByParam,
              }}
              onApply={handleApplyFilters}
            />

            <div className="border-l-2 border-indigo-600 py-1 pl-4 text-xs text-slate-600 dark:text-slate-300 space-y-1.5">
              <p className="font-semibold text-slate-800 dark:text-slate-100">Scholarly Data Attribution</p>
              <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                Data is aggregated in real-time from OpenAlex, arXiv, and Crossref. Availability and citation counts reflect verified public registry records.
              </p>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-1 space-y-4">
            <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 space-y-3">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-indigo-700 dark:text-indigo-300" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  Researcher Directory
                </h4>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Search over 90 million researchers globally. Profiles index verified institutional affiliations, publication metrics, h-index, and ORCID identifiers.
              </p>
            </div>
          </div>
        )}

        {/* Results Stream */}
        <div className="lg:col-span-3 space-y-4">
          {/* Status Bar */}
          {typeParam === "papers" && paperData && (
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400 pb-2 border-b border-slate-200 dark:border-slate-800">
              <div>
                Found <span className="font-semibold text-slate-800 dark:text-slate-200">{paperData.totalCount.toLocaleString()}</span> papers for &ldquo;{query}&rdquo;
              </div>
              <div className="flex items-center gap-1.5">
                <span>Source:</span>
                <span className="font-medium text-indigo-600 dark:text-indigo-400">
                  {paperData.provider}
                </span>
              </div>
            </div>
          )}

          {typeParam === "researchers" && researcherData && (
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400 pb-2 border-b border-slate-200 dark:border-slate-800">
              <div>
                Found <span className="font-semibold text-slate-800 dark:text-slate-200">{researcherData.totalCount.toLocaleString()}</span> researchers for &ldquo;{query}&rdquo;
              </div>
              <div className="flex items-center gap-1.5">
                <span>Authority:</span>
                <span className="font-medium text-indigo-600 dark:text-indigo-400">
                  {researcherData.provider}
                </span>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="py-20 flex flex-col items-center justify-center space-y-3 text-slate-500">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
              <p className="text-sm font-medium">Querying open scholarly databases...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="p-6 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 space-y-2">
              <div className="flex items-center gap-2 font-semibold text-sm">
                <AlertCircle className="w-5 h-5 text-amber-600" />
                <span>Search Provider Notification</span>
              </div>
              <p className="text-xs">{error}</p>
              <button
                onClick={() => updateUrl({ q: query })}
                className="mt-2 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg"
              >
                Retry Query
              </button>
            </div>
          )}

          {/* Empty Query State */}
          {!query.trim() && !loading && (
            <div className="py-20 text-center space-y-3 p-8 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              <FileSearch className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                {typeParam === "papers" ? "Search scholarly literature" : "Search researchers & faculty"}
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {typeParam === "papers"
                  ? "Enter keywords, topics, authors, or DOI to discover scientific publications."
                  : "Search researchers by name, institution, or research specialization."}
              </p>
            </div>
          )}

          {/* Zero Results */}
          {!loading && query.trim() && ((typeParam === "papers" && paperData?.papers.length === 0) || (typeParam === "researchers" && researcherData?.authors.length === 0)) && (
            <div className="py-16 text-center space-y-3 p-8 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              <FileSearch className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                No matching {typeParam === "papers" ? "papers" : "researchers"} found
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try alternate spellings, removing filters, or searching for broader terms.
              </p>
            </div>
          )}

          {/* Papers List */}
          {typeParam === "papers" && paperData && paperData.papers.length > 0 && !loading && (
            <div className="space-y-4">
              {paperData.papers.map((paper) => (
                <PaperCard key={paper.id} paper={paper} />
              ))}

              {/* Pagination */}
              <div className="pt-6 flex items-center justify-between border-t border-slate-200 dark:border-slate-800">
                <button
                  disabled={pageParam <= 1}
                  onClick={() => updateUrl({ page: pageParam - 1 })}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Previous
                </button>

                <span className="text-xs text-slate-500">
                  Page <span className="font-semibold text-slate-800 dark:text-slate-200">{pageParam}</span>
                </span>

                <button
                  onClick={() => updateUrl({ page: pageParam + 1 })}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Next
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Researchers List */}
          {typeParam === "researchers" && researcherData && researcherData.authors.length > 0 && !loading && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {researcherData.authors.map((author) => (
                  <ResearcherCard key={author.id} author={author} />
                ))}
              </div>

              {/* Pagination */}
              <div className="pt-6 flex items-center justify-between border-t border-slate-200 dark:border-slate-800">
                <button
                  disabled={pageParam <= 1}
                  onClick={() => updateUrl({ page: pageParam - 1 })}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Previous
                </button>

                <span className="text-xs text-slate-500">
                  Page <span className="font-semibold text-slate-800 dark:text-slate-200">{pageParam}</span>
                </span>

                <button
                  onClick={() => updateUrl({ page: pageParam + 1 })}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Next
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto" />
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
