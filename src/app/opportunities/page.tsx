"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Briefcase,
  ExternalLink,
  Filter,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  GraduationCap,
  Search,
  MapPin,
  Sparkles,
  RefreshCw,
  X,
  Clock,
  Layers,
} from "lucide-react";
import {
  VERIFIED_OPPORTUNITIES,
  Opportunity,
  DISCIPLINE_CONFIGS,
} from "@/lib/opportunities/data";
import {
  AVAILABLE_DISCIPLINES,
  AvailableDiscipline,
  getStoredPreferredDiscipline,
  setStoredPreferredDiscipline,
} from "@/lib/preferences";

const LEVELS = ["All", "Undergraduate", "Graduate", "Postdoc"] as const;
const STATUS_OPTIONS = ["All", "Rolling", "Upcoming Cycle"] as const;

function OpportunitiesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL param or initial state
  const paramDiscipline = searchParams.get("discipline") || searchParams.get("field");

  const [selectedDiscipline, setSelectedDiscipline] = useState<AvailableDiscipline>("All");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("All");
  const [selectedLevel, setSelectedLevel] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize preference on mount
  useEffect(() => {
    if (paramDiscipline && AVAILABLE_DISCIPLINES.includes(paramDiscipline as AvailableDiscipline)) {
      setSelectedDiscipline(paramDiscipline as AvailableDiscipline);
      setStoredPreferredDiscipline(paramDiscipline as AvailableDiscipline);
    } else {
      const stored = getStoredPreferredDiscipline();
      if (stored) {
        setSelectedDiscipline(stored);
      }
    }
    setIsInitialized(true);
  }, [paramDiscipline]);

  // Handler to update discipline and sync URL + localStorage
  const handleDisciplineChange = (disc: AvailableDiscipline) => {
    setSelectedDiscipline(disc);
    setSelectedSubcategory("All");
    setStoredPreferredDiscipline(disc);

    const params = new URLSearchParams(window.location.search);
    if (disc === "All") {
      params.delete("discipline");
      params.delete("field");
    } else {
      params.set("discipline", disc);
    }
    const queryString = params.toString();
    router.replace(queryString ? `/opportunities?${queryString}` : "/opportunities", {
      scroll: false,
    });
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedLevel("All");
    setSelectedStatus("All");
    setSelectedSubcategory("All");
  };

  // Active discipline configuration
  const activeConfig = selectedDiscipline !== "All" ? DISCIPLINE_CONFIGS[selectedDiscipline] : null;

  // Filtered opportunities
  const filtered = useMemo(() => {
    return VERIFIED_OPPORTUNITIES.filter((item) => {
      // Discipline filter with interdisciplinary support
      let matchesDiscipline = selectedDiscipline === "All";
      if (!matchesDiscipline) {
        if (selectedDiscipline === "Psychology") {
          matchesDiscipline =
            item.field === "Psychology" ||
            item.field === "Cognitive Science" ||
            (item.interdisciplinaryTags?.includes("Psychology") ?? false);
        } else if (selectedDiscipline === "Interdisciplinary") {
          matchesDiscipline =
            item.field === "Interdisciplinary" ||
            Boolean(item.interdisciplinaryTags && item.interdisciplinaryTags.length > 1);
        } else {
          matchesDiscipline =
            item.field === selectedDiscipline ||
            (item.interdisciplinaryTags?.includes(selectedDiscipline) ?? false);
        }
      }

      // Subcategory filter
      let matchesSubcategory = true;
      if (selectedSubcategory !== "All" && !selectedSubcategory.startsWith("All")) {
        matchesSubcategory =
          item.subfield.toLowerCase().includes(selectedSubcategory.toLowerCase()) ||
          (item.interdisciplinaryTags?.some((t) =>
            t.toLowerCase().includes(selectedSubcategory.toLowerCase())
          ) ?? false);
      }

      // Level filter
      const matchesLevel =
        selectedLevel === "All" ||
        item.level === selectedLevel ||
        (selectedLevel === "Undergraduate" && item.level === "Early Career");

      // Status filter
      const matchesStatus =
        selectedStatus === "All" ||
        item.status === selectedStatus ||
        (selectedStatus === "Rolling" && (item.status === "Rolling" || item.status === "Open"));

      // Search query filter
      const q = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.organization.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.subfield.toLowerCase().includes(q) ||
        item.eligibility.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q) ||
        (item.interdisciplinaryTags?.some((tag) => tag.toLowerCase().includes(q)) ?? false);

      return matchesDiscipline && matchesSubcategory && matchesLevel && matchesStatus && matchesQuery;
    });
  }, [selectedDiscipline, selectedSubcategory, selectedLevel, selectedStatus, searchQuery]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
          <Briefcase className="w-3.5 h-3.5" />
          <span>Research Pathways & Opportunities</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-slate-950 dark:text-white tracking-tight">
          Discipline-Aware Research Opportunities
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          Explore curated research assistantships, laboratory positions, fellowships, and conferences.
          Filter by your preferred discipline to prioritize opportunities in psychology, mathematics,
          AI, or computational sciences. Every listing connects directly to verified institutional sources.
        </p>
      </div>

      {/* Disclaimers & Grounding Notice */}
      <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-4 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400">
        <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
        <div className="space-y-1 leading-relaxed">
          <p className="font-semibold text-slate-900 dark:text-white">
            Source-Verified Listings & Zero-Cost Open Access
          </p>
          <p>
            Research Hub strictly verifies eligibility, schedules, and application links against official university and agency portals. Never pay an application fee to unverified third parties. Always confirm current cohort deadlines directly on the host institution website.
          </p>
        </div>
      </div>

      {/* Discipline Selection Bar (Sticky & Persistent) */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Active Discipline:
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300">
              {selectedDiscipline === "All" ? "All Disciplines" : selectedDiscipline}
            </span>
            {selectedDiscipline !== "All" && isInitialized && (
              <span className="text-[11px] text-slate-400 dark:text-slate-500">
                (Saved as your preferred field)
              </span>
            )}
          </div>

          {selectedDiscipline !== "All" && (
            <button
              onClick={() => handleDisciplineChange("All")}
              className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition"
            >
              <RefreshCw className="h-3 w-3" />
              <span>Show all fields</span>
            </button>
          )}
        </div>

        {/* Discipline Selection Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {AVAILABLE_DISCIPLINES.map((discipline) => {
            const isSelected = selectedDiscipline === discipline;
            return (
              <button
                key={discipline}
                onClick={() => handleDisciplineChange(discipline)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                  isSelected
                    ? "bg-indigo-700 text-white shadow-sm ring-2 ring-indigo-700/20"
                    : "border border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                }`}
              >
                {discipline}
              </button>
            );
          })}
        </div>

        {/* Discipline Description & Context */}
        {activeConfig && (
          <div className="pt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed flex items-start gap-2 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
            <Sparkles className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">
                {activeConfig.name}
              </p>
              <p className="mt-0.5">{activeConfig.description}</p>
            </div>
          </div>
        )}

        {/* Discipline-Specific Subcategories */}
        {activeConfig && activeConfig.subcategories.length > 0 && (
          <div className="pt-2 flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-semibold text-slate-400 mr-1">
              Focus Area:
            </span>
            {activeConfig.subcategories.map((subcat) => {
              const isSelected =
                selectedSubcategory === subcat ||
                (subcat.startsWith("All") && selectedSubcategory === "All");
              return (
                <button
                  key={subcat}
                  onClick={() =>
                    setSelectedSubcategory(subcat.startsWith("All") ? "All" : subcat)
                  }
                  className={`rounded-lg px-2.5 py-1 text-[11px] font-medium transition ${
                    isSelected
                      ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                      : "border border-slate-200 text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:text-slate-400 dark:hover:text-white"
                  }`}
                >
                  {subcat}
                </button>
              );
            })}
          </div>
        )}

        {/* Suggested Searches for Active Discipline */}
        {activeConfig && activeConfig.suggestedSearches.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px]">
            <span className="text-slate-400 font-medium">Suggested queries:</span>
            {activeConfig.suggestedSearches.map((sug) => (
              <button
                key={sug}
                onClick={() => setSearchQuery(sug)}
                className="rounded-md bg-indigo-50/70 px-2 py-0.5 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:text-indigo-300 dark:hover:bg-indigo-950/80 transition"
              >
                {sug}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Search & Filter Bar */}
      <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
        <div className="relative">
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${
              selectedDiscipline !== "All" ? selectedDiscipline : "all"
            } opportunities by role, lab, faculty, eligibility, or keywords...`}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-10 py-2.5 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 mr-1 flex items-center gap-1">
              <GraduationCap className="h-3 w-3" /> Target Level:
            </span>
            {LEVELS.map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedLevel(lvl)}
                className={`rounded-full px-2.5 py-1 text-xs font-medium transition ${
                  selectedLevel === lvl
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                    : "border border-slate-200 text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:text-slate-400 dark:hover:text-white"
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 mr-1 flex items-center gap-1">
              <Clock className="h-3 w-3" /> Cycle Status:
            </span>
            {STATUS_OPTIONS.map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`rounded-full px-2.5 py-1 text-xs font-medium transition ${
                  selectedStatus === status
                    ? "bg-indigo-700 text-white"
                    : "border border-slate-200 text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:text-slate-400 dark:hover:text-white"
                }`}
              >
                {status === "Rolling" ? "Open / Rolling" : status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Opportunities List */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-200 dark:border-slate-800 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>
              Showing <strong>{filtered.length}</strong> verified opportunities
              {selectedDiscipline !== "All" && ` in ${selectedDiscipline}`}
            </span>
          </div>
          <span>Updated for current academic cycles</span>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 p-12 text-center space-y-4 bg-white/50 dark:bg-slate-900/50">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400">
              <Search className="h-6 w-6" />
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <h2 className="font-semibold text-sm text-slate-900 dark:text-white">
                No matching opportunities found
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                We couldn&apos;t find verified opportunities matching your current filters in{" "}
                <strong>{selectedDiscipline}</strong>. Try broadening your criteria or exploring
                related disciplines.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2 pt-2">
              <button
                onClick={handleResetFilters}
                className="rounded-lg bg-indigo-700 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-indigo-800 transition"
              >
                Reset filters
              </button>
              {selectedDiscipline !== "All" && (
                <button
                  onClick={() => handleDisciplineChange("All")}
                  className="rounded-lg border border-slate-200 px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition"
                >
                  View all disciplines
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((item) => (
              <article
                key={item.id}
                className="group flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 transition hover:border-indigo-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-indigo-800 space-y-4"
              >
                <div className="space-y-3">
                  {/* Badges Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                        {item.type}
                      </span>
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        {item.field}
                      </span>
                      {item.status === "Rolling" ? (
                        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                          <CheckCircle2 className="h-3 w-3" />
                          Open / Rolling
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                          <Calendar className="h-3 w-3" />
                          Upcoming Cycle
                        </span>
                      )}
                    </div>
                    <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      Verified
                    </span>
                  </div>

                  {/* Title & Organization */}
                  <div>
                    <h2 className="font-serif text-lg font-bold text-slate-950 dark:text-white group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors leading-snug">
                      <a
                        href={item.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5"
                      >
                        <span>{item.title}</span>
                      </a>
                    </h2>
                    <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
                      {item.organization}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-serif">
                    {item.description}
                  </p>

                  {/* Interdisciplinary / Focus Tags */}
                  {item.interdisciplinaryTags && item.interdisciplinaryTags.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1 pt-1">
                      {item.interdisciplinaryTags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded px-1.5 py-0.5 text-[10px] font-medium bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-800"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Details section */}
                  <div className="space-y-1.5 border-t border-slate-100 pt-3 text-[11px] text-slate-500 dark:border-slate-800/80 dark:text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span>
                        <strong>Location:</strong> {item.location}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span>
                        <strong>Deadline / Cycle:</strong> {item.deadline} ({item.cycle})
                      </span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <GraduationCap className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span className="line-clamp-2">
                        <strong>Eligibility:</strong> {item.eligibility}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer action */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] font-medium text-slate-400">
                    Target: {item.level}
                  </span>
                  <a
                    href={item.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-300 dark:hover:bg-indigo-900 transition"
                  >
                    <span>Official portal</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function OpportunitiesPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-6xl mx-auto px-4 py-16 text-center text-xs text-slate-500">
          Loading research opportunities...
        </div>
      }
    >
      <OpportunitiesContent />
    </Suspense>
  );
}
