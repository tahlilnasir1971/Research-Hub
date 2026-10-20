import Link from "next/link";
import { User, Building, Award, BookOpen, ExternalLink, ArrowRight } from "lucide-react";
import { AuthorProfile } from "@/lib/scholarly/types";
import { formatNumber } from "@/lib/utils";

export function ResearcherCard({ author }: { author: AuthorProfile }) {
  return (
    <article className="group flex flex-col justify-between rounded-xl border border-slate-200/90 bg-white p-5 transition hover:border-indigo-300 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-indigo-800">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-700 dark:text-white dark:group-hover:text-indigo-300 transition-colors">
                <Link href={`/author/${encodeURIComponent(author.id)}`}>
                  {author.name}
                </Link>
              </h3>
              {author.affiliation && (
                <p className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  <Building className="h-3 w-3 shrink-0" />
                  <span className="line-clamp-1">{author.affiliation}</span>
                </p>
              )}
            </div>
          </div>

          {author.orcid && (
            <a
              href={author.orcid}
              target="_blank"
              rel="noopener noreferrer"
              title="Verified ORCID Profile"
              className="inline-flex items-center gap-1 rounded border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-800 transition hover:bg-emerald-100 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300"
            >
              <span className="font-bold text-emerald-600">iD</span>
              <span className="hidden sm:inline">ORCID</span>
            </a>
          )}
        </div>

        {/* Researcher Metrics */}
        <div className="grid grid-cols-3 gap-2 border-t border-slate-100 pt-3 dark:border-slate-800/80 text-center">
          <div className="rounded-lg bg-slate-50/70 p-2 dark:bg-slate-800/40">
            <span className="block text-sm font-bold text-slate-900 dark:text-white">
              {formatNumber(author.worksCount)}
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">Works</span>
          </div>

          <div className="rounded-lg bg-slate-50/70 p-2 dark:bg-slate-800/40">
            <span className="block text-sm font-bold text-indigo-700 dark:text-indigo-300">
              {formatNumber(author.citationCount)}
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">Citations</span>
          </div>

          <div className="rounded-lg bg-slate-50/70 p-2 dark:bg-slate-800/40">
            <span className="block text-sm font-bold text-slate-900 dark:text-white">
              {author.hIndex || "—"}
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">h-index</span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <span className="text-[11px] text-slate-400">
          Source: OpenAlex Academic Authority
        </span>
        <Link
          href={`/author/${encodeURIComponent(author.id)}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-700 hover:text-indigo-900 dark:text-indigo-300 dark:hover:text-indigo-200"
        >
          <span>View publications</span>
          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </article>
  );
}
