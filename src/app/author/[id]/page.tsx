import Link from "next/link";
import { notFound } from "next/navigation";
import {
  User,
  Building,
  Award,
  BookOpen,
  ArrowLeft,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { getOpenAlexAuthor } from "@/lib/scholarly/openalex";
import { formatNumber } from "@/lib/utils";
import { PaperCard } from "@/components/PaperCard";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const author = await getOpenAlexAuthor(params.id);
  if (!author) {
    return { title: "Author Not Found — Research Hub" };
  }
  return {
    title: `${author.name} — Researcher Profile on Research Hub`,
    description: `Scientific publications, citations, and h-index for ${author.name}.`,
  };
}

export default async function AuthorProfilePage({ params }: { params: { id: string } }) {
  const author = await getOpenAlexAuthor(params.id);

  if (!author) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button */}
      <div>
        <Link
          href="/search"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Paper Search
        </Link>
      </div>

      {/* Author Card Header */}
      <section className="p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold text-2xl shadow-md">
              <User className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                  {author.name}
                </h1>
                <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                  Verified Scholar
                </span>
              </div>
              {author.affiliation && (
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
                  <Building className="w-4 h-4 text-slate-400 shrink-0" />
                  {author.affiliation}
                </p>
              )}
            </div>
          </div>

          {author.orcid && (
            <a
              href={author.orcid}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 text-xs font-medium self-start sm:self-auto hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors"
            >
              <span className="font-bold text-[11px] text-emerald-600">iD</span>
              <span>ORCID Profile</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>

        {/* Researcher Metrics */}
        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-center">
            <span className="block text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100">
              {formatNumber(author.worksCount)}
            </span>
            <span className="text-xs text-slate-500 flex items-center justify-center gap-1 mt-0.5">
              <BookOpen className="w-3 h-3" />
              Indexed Works
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-center">
            <span className="block text-xl sm:text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">
              {formatNumber(author.citationCount)}
            </span>
            <span className="text-xs text-slate-500 flex items-center justify-center gap-1 mt-0.5">
              <Award className="w-3 h-3" />
              Total Citations
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-center">
            <span className="block text-xl sm:text-2xl font-extrabold text-purple-600 dark:text-purple-400">
              {author.hIndex || 0}
            </span>
            <span className="text-xs text-slate-500 flex items-center justify-center gap-1 mt-0.5">
              <span>h-index</span>
            </span>
          </div>
        </div>
      </section>

      {/* Top Publications */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Top Cited Publications
          </h2>
          <span className="text-xs text-slate-400">
            Powered by OpenAlex Open Data
          </span>
        </div>

        {author.topWorks.length === 0 ? (
          <p className="text-xs italic text-slate-400">
            No works indexed for this researcher.
          </p>
        ) : (
          <div className="space-y-4">
            {author.topWorks.map((work) => (
              <PaperCard key={work.id} paper={work} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
