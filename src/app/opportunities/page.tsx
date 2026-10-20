"use client";

import { useState } from "react";
import { Briefcase, ExternalLink, Filter, ShieldCheck, CheckCircle2, Calendar, GraduationCap, Compass, Search } from "lucide-react";
import { VERIFIED_OPPORTUNITIES, Opportunity } from "@/lib/opportunities/data";

const FIELDS = ["All", "Mathematics", "Artificial Intelligence", "Computational Science", "Interdisciplinary"] as const;
const LEVELS = ["All", "Undergraduate", "Graduate", "Postdoc"] as const;

export default function OpportunitiesPage() {
  const [selectedField, setSelectedField] = useState<string>("All");
  const [selectedLevel, setSelectedLevel] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = VERIFIED_OPPORTUNITIES.filter((item) => {
    const matchesField = selectedField === "All" || item.field === selectedField;
    const matchesLevel = selectedLevel === "All" || item.level === selectedLevel;
    const matchesQuery =
      !searchQuery.trim() ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesField && matchesLevel && matchesQuery;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
          <Briefcase className="w-3.5 h-3.5" />
          <span>Research Pathways & Funding</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-slate-950 dark:text-white tracking-tight">
          Academic Research Opportunities
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          Curated fellowships, student research internships, and laboratory programs in mathematics, computational sciences, and artificial intelligence. Every listing is linked directly to official verified sources.
        </p>
      </div>

      {/* Disclaimers & Grounding Notice */}
      <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-4 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400">
        <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
        <div className="space-y-1 leading-relaxed">
          <p className="font-semibold text-slate-900 dark:text-white">
            Source-Verified Listings Only
          </p>
          <p>
            Research Hub does not fabricate programs or student listings. Deadlines and eligibility reflect verified institutional schedules. Always confirm current dates and application requirements on the official source website.
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
        <div className="relative">
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search opportunities by title, organization, or focus area (e.g. CERN, Simons, algorithms)..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-4 py-2 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 mr-1 flex items-center gap-1">
              <Filter className="h-3 w-3" /> Field:
            </span>
            {FIELDS.map((f) => (
              <button
                key={f}
                onClick={() => setSelectedField(f)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                  selectedField === f
                    ? "bg-indigo-700 text-white"
                    : "border border-slate-200 text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:text-slate-400 dark:hover:text-white"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 mr-1 flex items-center gap-1">
              <GraduationCap className="h-3 w-3" /> Level:
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
        </div>
      </div>

      {/* Opportunities List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800 text-xs text-slate-500">
          <span>Showing {filtered.length} verified academic opportunities</span>
          <span>Updated for current academic cycles</span>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 p-12 text-center text-xs text-slate-500 dark:border-slate-800">
            No opportunities match your current filter selections. Try clearing your search query.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((item) => (
              <article
                key={item.id}
                className="group flex flex-col justify-between rounded-xl border border-slate-200/90 bg-white p-5 transition hover:border-indigo-300 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-indigo-800 space-y-4"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                      {item.type}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
                      <CheckCircle2 className="h-3 w-3" />
                      Verified Source
                    </span>
                  </div>

                  <h2 className="font-serif text-lg font-bold text-slate-950 dark:text-white group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors leading-snug">
                    <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer">
                      {item.title}
                    </a>
                  </h2>

                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    {item.organization}
                  </p>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-serif">
                    {item.description}
                  </p>

                  <div className="space-y-1.5 border-t border-slate-100 pt-3 text-[11px] text-slate-500 dark:border-slate-800/80 dark:text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span><strong>Cycle:</strong> {item.deadline} ({item.cycle})</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <GraduationCap className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span className="line-clamp-2"><strong>Eligibility:</strong> {item.eligibility}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] font-medium text-slate-400">
                    Target: {item.level}
                  </span>
                  <a
                    href={item.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-700 hover:text-indigo-900 dark:text-indigo-300 dark:hover:text-indigo-200"
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
