"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search,
  BookOpenCheck,
  Sparkles,
  ShieldCheck,
  FileText,
  Cpu,
  Dna,
  Atom,
  Stethoscope,
  Globe2,
  Calculator,
  ArrowRight,
  Quote,
} from "lucide-react";

const SUGGESTED_QUERIES = [
  "Quantum Computing",
  "Large Language Models",
  "CRISPR Gene Editing",
  "Renewable Energy Storage",
  "Dark Matter",
  "Neuroplasticity",
];

const DISCIPLINES = [
  {
    name: "Computer Science",
    icon: Cpu,
    query: "computer science machine learning algorithms",
    count: "35M+ works",
    color: "from-blue-500/10 to-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-900",
  },
  {
    name: "Biology & Genetics",
    icon: Dna,
    query: "genomics molecular biology genetics",
    count: "40M+ works",
    color: "from-emerald-500/10 to-teal-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900",
  },
  {
    name: "Physics & Astronomy",
    icon: Atom,
    query: "astrophysics quantum mechanics condensed matter",
    count: "28M+ works",
    color: "from-purple-500/10 to-pink-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-900",
  },
  {
    name: "Medicine & Health",
    icon: Stethoscope,
    query: "clinical trials oncology immunology",
    count: "50M+ works",
    color: "from-rose-500/10 to-orange-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900",
  },
  {
    name: "Climate & Earth",
    icon: Globe2,
    query: "climate change ecology geoscience",
    count: "18M+ works",
    color: "from-cyan-500/10 to-sky-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-900",
  },
  {
    name: "Mathematics",
    icon: Calculator,
    query: "algebra topology applied mathematics",
    count: "12M+ works",
    color: "from-amber-500/10 to-yellow-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900",
  },
];

export default function HomePage() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative pt-12 pb-16 sm:pt-20 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 mb-6 animate-in fade-in slide-in-from-bottom-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Zero-Cost Open Scholarly Discovery Platform</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 max-w-4xl mx-auto leading-tight">
          Explore Scientific Knowledge{" "}
          <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Without Paywalls
          </span>
        </h1>

        <p className="mt-5 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Search over 250 million research papers, preprints, and open-access publications powered by OpenAlex, arXiv, and Crossref with $0 subscription cost.
        </p>

        {/* Search Input Box */}
        <div className="mt-8 max-w-2xl mx-auto">
          <form
            onSubmit={handleSearch}
            className="relative flex items-center shadow-xl rounded-2xl bg-white dark:bg-slate-900 border-2 border-indigo-500/20 focus-within:border-indigo-600 transition-all p-2"
          >
            <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by keywords, title, author, or DOI..."
              className="w-full px-3 py-2 text-sm sm:text-base bg-transparent text-slate-900 dark:text-slate-100 focus:outline-none placeholder:text-slate-400"
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md transition-all shrink-0 flex items-center gap-1.5"
            >
              <span>Search</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Suggestions */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
            <span className="font-medium text-slate-400">Popular:</span>
            {SUGGESTED_QUERIES.map((q) => (
              <button
                key={q}
                onClick={() => router.push(`/search?q=${encodeURIComponent(q)}`)}
                className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200 dark:border-slate-700 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Value Highlights */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto text-left">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              100% Zero-Cost Guarantee
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Never pay for search or discovery. Built on verified free tiers with documented zero billing exposure.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600">
              <Quote className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Instant Citation Export
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Generate one-click BibTeX, APA, MLA, and RIS citations computed client-side at $0 cost.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
            <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/50 flex items-center justify-center text-purple-600">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Optional Free-Tier AI
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Connect OpenRouter with free models (:free) for plain-language summaries. Fully optional, never breaks search.
            </p>
          </div>
        </div>
      </section>

      {/* Explore Disciplines */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Browse by Scientific Discipline
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Explore curated literature across foundational and emerging fields.
            </p>
          </div>
          <Link
            href="/topics"
            className="text-xs sm:text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            <span>View All Topics</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {DISCIPLINES.map((d) => {
            const Icon = d.icon;
            return (
              <Link
                key={d.name}
                href={`/search?q=${encodeURIComponent(d.query)}`}
                className={`group p-6 rounded-2xl bg-gradient-to-br ${d.color} border hover:shadow-md transition-all duration-200 flex flex-col justify-between`}
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 shadow-sm flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {d.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {d.count}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-200/40 dark:border-slate-800/60 flex items-center justify-between text-xs font-semibold">
                  <span>Explore research</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Free Tier Compliance Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-3xl bg-slate-900 text-white relative overflow-hidden shadow-xl">
          <div className="max-w-2xl space-y-4">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              Verified Zero-Cost Infrastructure
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold">
              Built to operate forever within free quotas
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Research Hub adheres strictly to a zero-cost architecture mandate. We evaluate all API quotas, maintain no paid fallbacks, store no secrets client-side, and run on Vercel&apos;s generous Hobby tier connected to GitHub.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                href="/status"
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold rounded-xl transition-colors shadow-sm"
              >
                Read Free Tier Audit
              </Link>
              <Link
                href="/search"
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl transition-colors"
              >
                Start Searching
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
