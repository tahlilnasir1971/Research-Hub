"use client";

import { useState } from "react";
import { Filter, RotateCcw, Calendar, CheckSquare, Square } from "lucide-react";
import { SearchFilters as FilterType } from "@/lib/scholarly/types";

export function SearchFilters({
  initialFilters,
  onApply,
}: {
  initialFilters: FilterType;
  onApply: (filters: FilterType) => void;
}) {
  const [openAccess, setOpenAccess] = useState(initialFilters.openAccessOnly || false);
  const [yearMin, setYearMin] = useState(initialFilters.yearMin ? initialFilters.yearMin.toString() : "");
  const [yearMax, setYearMax] = useState(initialFilters.yearMax ? initialFilters.yearMax.toString() : "");
  const [sortBy, setSortBy] = useState<FilterType["sortBy"]>(initialFilters.sortBy || "relevance");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApply({
      openAccessOnly: openAccess,
      yearMin: yearMin ? parseInt(yearMin, 10) : undefined,
      yearMax: yearMax ? parseInt(yearMax, 10) : undefined,
      sortBy,
      page: 1,
    });
  };

  const handleReset = () => {
    setOpenAccess(false);
    setYearMin("");
    setYearMax("");
    setSortBy("relevance");
    onApply({
      openAccessOnly: false,
      yearMin: undefined,
      yearMax: undefined,
      sortBy: "relevance",
      page: 1,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 sm:p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm"
    >
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Search Filters
          </h4>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 flex items-center gap-1"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </button>
      </div>

      {/* Sort By */}
      <div>
        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          Sort Order
        </label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as FilterType["sortBy"])}
          className="w-full text-xs p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="relevance">Most Relevant</option>
          <option value="cited">Most Cited</option>
          <option value="year_desc">Newest First</option>
          <option value="year_asc">Oldest First</option>
        </select>
      </div>

      {/* Open Access Toggle */}
      <div>
        <button
          type="button"
          onClick={() => setOpenAccess(!openAccess)}
          className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
        >
          {openAccess ? (
            <CheckSquare className="w-4 h-4 text-emerald-600" />
          ) : (
            <Square className="w-4 h-4 text-slate-400" />
          )}
          <span>Open Access Only (Free Full PDFs)</span>
        </button>
      </div>

      {/* Year Range */}
      <div>
        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
          <Calendar className="w-3 h-3 text-slate-400" />
          Publication Year Range
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="From (e.g. 2020)"
            min="1900"
            max="2030"
            value={yearMin}
            onChange={(e) => setYearMin(e.target.value)}
            className="text-xs p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="number"
            placeholder="To (e.g. 2026)"
            min="1900"
            max="2030"
            value={yearMax}
            onChange={(e) => setYearMax(e.target.value)}
            className="text-xs p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
      >
        Apply Filters
      </button>
    </form>
  );
}
