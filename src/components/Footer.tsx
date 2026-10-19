import Link from "next/link";
import { BookOpenCheck, ShieldCheck, Github, ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-600 text-white">
              <BookOpenCheck className="w-4 h-4" />
            </div>
            <span className="text-base font-bold text-slate-900 dark:text-slate-100">
              Research Hub
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
              <ShieldCheck className="w-3 h-3" />
              $0 Infrastructure
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md">
            An open-access research discovery platform powered entirely by public scholarly APIs (OpenAlex, arXiv, Crossref) with zero paid subscription dependencies.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-xs text-slate-600 dark:text-slate-400">
          <Link href="/search" className="hover:text-indigo-600 dark:hover:text-indigo-400">
            Paper Search
          </Link>
          <Link href="/topics" className="hover:text-indigo-600 dark:hover:text-indigo-400">
            Topic Explorer
          </Link>
          <Link href="/library" className="hover:text-indigo-600 dark:hover:text-indigo-400">
            Saved Library
          </Link>
          <Link href="/status" className="hover:text-indigo-600 dark:hover:text-indigo-400">
            Free Tier Audit & Status
          </Link>
          <a
            href="https://openalex.org"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            OpenAlex <ExternalLink className="w-3 h-3" />
          </a>
          <a
            href="https://arxiv.org"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            arXiv <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        <p>© 2026 Research Hub. Free, open-access, and public research for everyone.</p>
        <p className="text-[11px] text-slate-400">
          Zero-cost verified: Next.js + Vercel Hobby + Public Scholarly APIs.
        </p>
      </div>
    </footer>
  );
}
