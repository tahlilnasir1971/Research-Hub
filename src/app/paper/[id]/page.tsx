import Link from "next/link";
import { notFound } from "next/navigation";
import {
  FileText,
  ExternalLink,
  BookOpen,
  Award,
  Globe,
  Tag,
  ArrowLeft,
  Calendar,
  Building,
} from "lucide-react";
import { unifiedGetPaper } from "@/lib/scholarly/aggregator";
import { formatNumber } from "@/lib/utils";
import { PaperDetailClient } from "./PaperDetailClient";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const paper = await unifiedGetPaper(params.id);
  if (!paper) {
    return { title: "Paper Not Found — Research Hub" };
  }
  return {
    title: `${paper.title} — Research Hub`,
    description: paper.abstract ? paper.abstract.slice(0, 160) : "Read paper details and citations on Research Hub.",
  };
}

export default async function PaperDetailPage({ params }: { params: { id: string } }) {
  const paper = await unifiedGetPaper(params.id);

  if (!paper) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Navigation Top */}
      <div>
        <Link
          href="/search"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Paper Search
        </Link>
      </div>

      {/* Main Header */}
      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-bold text-indigo-600 dark:text-indigo-400">
            {paper.publicationYear}
          </span>

          {paper.venue && (
            <>
              <span className="text-slate-400">•</span>
              <span className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-300 font-medium">
                <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                {paper.venue}
              </span>
            </>
          )}

          {paper.isOpenAccess && (
            <>
              <span className="text-slate-400">•</span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                <Globe className="w-3.5 h-3.5 text-emerald-600" />
                Open Access PDF Available
              </span>
            </>
          )}

          {paper.citationCount > 0 && (
            <>
              <span className="text-slate-400">•</span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                <Award className="w-3.5 h-3.5 text-indigo-600" />
                {formatNumber(paper.citationCount)} Citations
              </span>
            </>
          )}
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
          {paper.title}
        </h1>

        {/* Authors */}
        <div className="pt-2">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Authors & Affiliations
          </h2>
          <div className="flex flex-wrap gap-2">
            {paper.authors.map((author, idx) => (
              <div
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 shadow-sm"
              >
                {author.id ? (
                  <Link
                    href={`/author/${encodeURIComponent(author.id)}`}
                    className="font-semibold hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline"
                  >
                    {author.name}
                  </Link>
                ) : (
                  <span className="font-semibold">{author.name}</span>
                )}
                {author.institution && (
                  <span className="text-[11px] text-slate-400 flex items-center gap-0.5">
                    <Building className="w-3 h-3 shrink-0" />
                    {author.institution}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Client Action Bar (PDF, AI, Citation, Bookmark) */}
      <PaperDetailClient paper={paper} />

      {/* Abstract */}
      <section className="p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Abstract
        </h2>
        {paper.abstract ? (
          <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line font-serif">
            {paper.abstract}
          </p>
        ) : (
          <p className="text-xs italic text-slate-400">
            No abstract is indexed in the public record for this paper. Refer to the publisher or open access source.
          </p>
        )}
      </section>

      {/* Concepts & Topics */}
      {paper.concepts.length > 0 && (
        <section className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5" />
            Concepts & Categorized Topics
          </h3>
          <div className="flex flex-wrap gap-2">
            {paper.concepts.map((concept, idx) => (
              <Link
                key={idx}
                href={`/search?q=${encodeURIComponent(concept)}`}
                className="px-3 py-1 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950 hover:text-indigo-600 transition-colors"
              >
                {concept}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Metadata & Identifiers */}
      <section className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 text-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Publication & Indexing Details
        </h3>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <dt className="text-slate-400">Digital Object Identifier (DOI)</dt>
            <dd className="font-mono text-slate-800 dark:text-slate-200 mt-0.5">
              {paper.doi ? (
                <a
                  href={`https://doi.org/${paper.doi}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                >
                  {paper.doi} <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                "None"
              )}
            </dd>
          </div>

          <div>
            <dt className="text-slate-400">Data Source</dt>
            <dd className="uppercase font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
              {paper.source} (Zero-Cost Public API)
            </dd>
          </div>

          <div>
            <dt className="text-slate-400">Publication Date</dt>
            <dd className="text-slate-800 dark:text-slate-200 mt-0.5 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-slate-400" />
              {paper.publicationDate || paper.publicationYear}
            </dd>
          </div>

          <div>
            <dt className="text-slate-400">Access Type</dt>
            <dd className="text-slate-800 dark:text-slate-200 mt-0.5">
              {paper.isOpenAccess ? "Open Access (Public)" : "Restricted / Publisher Landing"}
            </dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
