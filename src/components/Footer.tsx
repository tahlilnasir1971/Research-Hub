import Link from "next/link";
import { ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white/70 px-4 py-8 dark:border-slate-800 dark:bg-slate-950/60 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div><Link href="/" className="text-sm font-semibold text-slate-900 dark:text-white">Research Hub</Link><p className="mt-1 max-w-md text-xs leading-5 text-slate-500 dark:text-slate-400">A workspace for discovering and organizing scholarly literature from public research sources.</p></div>
        <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-600 dark:text-slate-400">
          <Link href="/search" className="hover:text-indigo-700 dark:hover:text-indigo-300">Search</Link><Link href="/topics" className="hover:text-indigo-700 dark:hover:text-indigo-300">Topics</Link><Link href="/library" className="hover:text-indigo-700 dark:hover:text-indigo-300">Library</Link><Link href="/status" className="hover:text-indigo-700 dark:hover:text-indigo-300">Service status</Link>
          <a href="https://openalex.org" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-indigo-700 dark:hover:text-indigo-300">OpenAlex <ExternalLink className="h-3 w-3" /></a><a href="https://arxiv.org" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-indigo-700 dark:hover:text-indigo-300">arXiv <ExternalLink className="h-3 w-3" /></a>
        </nav>
      </div>
      <div className="mx-auto mt-6 max-w-6xl border-t border-slate-200 pt-4 text-xs text-slate-400 dark:border-slate-800">© {new Date().getFullYear()} Research Hub</div>
    </footer>
  );
}
