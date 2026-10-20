"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Atom, BookOpen, Calculator, Cpu, Dna, Globe2, Search, Stethoscope, Brain, Briefcase } from "lucide-react";

const SUGGESTED_QUERIES = ["Optimization", "Cognitive psychology", "Large language models", "Quantum computing", "Climate modeling", "Neuroscience"];

const DISCIPLINES = [
  { name: "Psychology & cognitive sciences", icon: Brain, query: "cognitive psychology neuroscience behavioral decision making", opportunityField: "Psychology", color: "text-purple-600 bg-purple-50 dark:text-purple-300 dark:bg-purple-950/40" },
  { name: "Computer science & AI", icon: Cpu, query: "computer science machine learning algorithms", opportunityField: "Artificial Intelligence", color: "text-indigo-600 bg-indigo-50 dark:text-indigo-300 dark:bg-indigo-950/40" },
  { name: "Mathematics", icon: Calculator, query: "algebra topology applied mathematics optimization", opportunityField: "Mathematics", color: "text-amber-700 bg-amber-50 dark:text-amber-300 dark:bg-amber-950/40" },
  { name: "Physics & astronomy", icon: Atom, query: "astrophysics quantum mechanics condensed matter", opportunityField: "Computational Science", color: "text-violet-600 bg-violet-50 dark:text-violet-300 dark:bg-violet-950/40" },
  { name: "Biology & genetics", icon: Dna, query: "genomics molecular biology genetics", opportunityField: "Interdisciplinary", color: "text-emerald-700 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-950/40" },
  { name: "Medicine & health", icon: Stethoscope, query: "clinical trials oncology immunology psychiatry", opportunityField: "Psychology", color: "text-rose-700 bg-rose-50 dark:text-rose-300 dark:bg-rose-950/40" },
  { name: "Climate & earth science", icon: Globe2, query: "climate change ecology geoscience", opportunityField: "Computational Science", color: "text-sky-700 bg-sky-50 dark:text-sky-300 dark:bg-sky-950/40" },
];

export default function HomePage() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const search = (value: string) => {
    if (value.trim()) router.push(`/search?q=${encodeURIComponent(value.trim())}`);
  };

  return (
    <div className="pb-16">
      <section className="mx-auto max-w-6xl px-4 pb-16 pt-14 sm:px-6 sm:pb-24 sm:pt-24 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_.85fr] lg:items-center">
          <div>
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-700 dark:text-indigo-300">Research, with room to think</p>
            <h1 className="max-w-2xl font-serif text-4xl leading-[1.08] tracking-tight text-slate-950 dark:text-white sm:text-6xl">Find the work that moves your question forward.</h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">Search scholarly literature across OpenAlex, arXiv, and Crossref. Discover papers, authors, and discipline-aware research opportunities.</p>

            <form onSubmit={(event) => { event.preventDefault(); search(query); }} className="mt-8 flex rounded-xl border border-slate-300 bg-white p-1.5 shadow-sm transition focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-900">
              <label className="sr-only" htmlFor="research-query">Search papers, topics, authors, or DOI</label>
              <Search aria-hidden="true" className="ml-3 h-5 w-5 shrink-0 self-center text-slate-400" />
              <input id="research-query" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search papers, topics, authors, or DOI" className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-white" />
              <button type="submit" className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-indigo-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Search <ArrowRight className="h-4 w-4" /></button>
            </form>

            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="mr-1">Explore:</span>
              {SUGGESTED_QUERIES.map((item) => <button key={item} onClick={() => search(item)} className="rounded-full border border-slate-200 px-3 py-1.5 transition hover:border-indigo-300 hover:text-indigo-700 dark:border-slate-700 dark:hover:border-indigo-700 dark:hover:text-indigo-300">{item}</button>)}
            </div>
          </div>

          <aside className="border-l border-slate-200 pl-6 dark:border-slate-800 sm:pl-8">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">A research workspace</p>
            <div className="mt-6 space-y-6">
              <div className="flex gap-4"><span className="font-serif text-2xl text-indigo-700 dark:text-indigo-300">01</span><div><h2 className="text-sm font-semibold text-slate-900 dark:text-white">Discover literature</h2><p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">Search and filter scholarly records from public research sources.</p></div></div>
              <div className="flex gap-4"><span className="font-serif text-2xl text-indigo-700 dark:text-indigo-300">02</span><div><h2 className="text-sm font-semibold text-slate-900 dark:text-white">Find research opportunities</h2><p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">Explore verified research assistantships, lab openings, and fellowships adapted to your field.</p></div></div>
              <div className="flex gap-4"><span className="font-serif text-2xl text-indigo-700 dark:text-indigo-300">03</span><div><h2 className="text-sm font-semibold text-slate-900 dark:text-white">Ask better questions</h2><p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">Use the optional AI companion for abstract-based explanations when configured.</p></div></div>
            </div>
            <div className="mt-7 flex flex-wrap gap-4">
              <Link href="/topics" className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-700 hover:text-indigo-900 dark:text-indigo-300 dark:hover:text-indigo-200">Browse topics <ArrowRight className="h-4 w-4" /></Link>
              <Link href="/opportunities" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"><Briefcase className="h-4 w-4" /> View opportunities</Link>
            </div>
          </aside>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white/70 py-14 dark:border-slate-800 dark:bg-slate-900/40 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Explore by field</p><h2 className="mt-2 font-serif text-3xl tracking-tight text-slate-950 dark:text-white">Start with a discipline</h2></div><p className="max-w-md text-sm leading-6 text-slate-600 dark:text-slate-400">Choose a broad area to search papers or view academic opportunities in that field.</p></div>
          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {DISCIPLINES.map(({ name, icon: Icon, query: disciplineQuery, color, opportunityField }) => (
              <div key={name} className="group flex flex-col justify-between gap-3 border border-slate-200 bg-white p-4 transition hover:border-indigo-300 hover:shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:hover:border-indigo-800 rounded-xl">
                <Link href={`/search?q=${encodeURIComponent(disciplineQuery)}`} className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-3">
                    <span className={`flex h-10 w-10 items-center justify-center rounded-lg ${color}`}><Icon className="h-5 w-5" /></span>
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">{name}</span>
                  </span>
                  <ArrowRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-indigo-600" />
                </Link>
                {opportunityField && (
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                    <Link href={`/opportunities?discipline=${encodeURIComponent(opportunityField)}`} className="text-[11px] font-medium text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 inline-flex items-center gap-1">
                      <span>{opportunityField} opportunities</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="flex flex-col gap-5 border-l-2 border-indigo-600 pl-5 sm:flex-row sm:items-center sm:justify-between sm:pl-7"><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Keep your reading organized</p><h2 className="mt-2 font-serif text-2xl text-slate-950 dark:text-white">Build a library around your questions.</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">Save papers in this browser, revisit their source records, and export references in BibTeX.</p></div><Link href="/library" className="inline-flex shrink-0 items-center gap-2 self-start rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-indigo-400 hover:text-indigo-700 dark:border-slate-700 dark:text-slate-200 dark:hover:text-indigo-300 sm:self-auto"><BookOpen className="h-4 w-4" /> Open library</Link></div>
      </section>
    </div>
  );
}
