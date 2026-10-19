"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, Loader2, AlertCircle, FileSearch, ArrowLeft, ArrowRight } from "lucide-react";
import { PaperCard } from "@/components/PaperCard";
import { SearchFilters } from "@/components/SearchFilters";
import { SearchResult, SearchFilters as FilterType } from "@/lib/scholarly/types";

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const query = searchParams.get("q") || "";
  const pageParam = parseInt(searchParams.get("page") || "1", 10);
  const openAccessParam = searchParams.get("openAccess") === "true";
  const yearMinParam = searchParams.get("yearMin") ? parseInt(searchParams.get("yearMin")!, 10) : undefined;
  const yearMaxParam = searchParams.get("yearMax") ? parseInt(searchParams.get("yearMax")!, 10) : undefined;
  const sortByParam = (searchParams.get("sortBy") as FilterType["sortBy"]) || "relevance";

  const [inputQuery, setInputQuery] = useState(query);
  const [data, setData] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setInputQuery(query);
    if (!query.trim()) {
      setData(null);
      return;
    }

    const controller = new AbortController();
    const fetchResults = async () => {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      params.set("q", query);
      params.set("page", pageParam.toString());
      params.set("sortBy", sortByParam);
      if (openAccessParam) params.set("openAccess", "true");
      if (yearMinParam) params.set("yearMin", yearMinParam.toString());
      if (yearMaxParam) params.set("yearMax", yearMaxParam.toString());

      try {
        const res = await fetch(`/api/search?${params.toString()}`, { signal: controller.signal });
        if (!res.ok) {
          if (res.status === 429) throw new Error("The scholarly source is receiving too many requests. Wait briefly and try again.");
          throw new Error("The scholarly source could not complete this search. Please try again.");
        }
        const json: SearchResult = await res.json();
        setData(json);
      } catch (err: any) {
        if (err.name !== "AbortError") setError(err.message || "Could not fetch research papers.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    fetchResults();
    return () => controller.abort();
  }, [query, pageParam, openAccessParam, yearMinParam, yearMaxParam, sortByParam]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputQuery.trim()) {
      updateUrl({ q: inputQuery.trim(), page: 1 });
    }
  };

  const updateUrl = (updates: Partial<{
    q: string;
    page: number;
    openAccess: boolean;
    yearMin?: number;
    yearMax?: number;
    sortBy: string;
  }>) => {
    const params = new URLSearchParams(searchParams.toString());

    if (updates.q !== undefined) params.set("q", updates.q);
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
      {/* Top Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Search papers across OpenAlex, arXiv, and Crossref"
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm transition-colors shrink-0"
          >
            Search
          </button>
        </form>
      </div>

      {/* Main Grid: Filters + Results */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Sidebar Filters */}
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
            <p className="font-semibold text-slate-800 dark:text-slate-100">About these results</p>
            <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
              Results are retrieved from public scholarly APIs. Availability and coverage vary by source.
            </p>
          </div>
        </div>

        {/* Results Stream */}
        <div className="lg:col-span-3 space-y-4">
          {/* Status Bar */}
          {data && (
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400 pb-2 border-b border-slate-200 dark:border-slate-800">
              <div>
                Found <span className="font-semibold text-slate-800 dark:text-slate-200">{data.totalCount.toLocaleString()}</span> results for &ldquo;{query}&rdquo;
              </div>
              <div className="flex items-center gap-1.5">
                <span>Provider:</span>
                <span className="font-medium text-indigo-600 dark:text-indigo-400">
                  {data.provider}
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
            <div className="p-6 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 space-y-2">
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
            <div className="py-20 text-center space-y-3 p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              <FileSearch className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                Search scholarly literature
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Type in keywords, researcher names, paper titles, or DOIs to discover scientific literature.
              </p>
            </div>
          )}

          {/* Zero Results */}
          {data && data.papers.length === 0 && !loading && (
            <div className="py-16 text-center space-y-3 p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              <FileSearch className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                No matching research papers found
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try broadening your query, removing year filters, or searching for alternative scientific terms.
              </p>
            </div>
          )}

          {/* Papers List */}
          {data && data.papers.length > 0 && !loading && (
            <div className="space-y-4">
              {data.papers.map((paper) => (
                <PaperCard key={paper.id} paper={paper} />
              ))}

              {/* Pagination */}
              <div className="pt-6 flex items-center justify-between border-t border-slate-200 dark:border-slate-800">
                <button
                  disabled={pageParam <= 1}
                  onClick={() => updateUrl({ page: pageParam - 1 })}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Previous
                </button>

                <span className="text-xs text-slate-500">
                  Page <span className="font-semibold text-slate-800 dark:text-slate-200">{pageParam}</span>
                </span>

                <button
                  onClick={() => updateUrl({ page: pageParam + 1 })}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
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
