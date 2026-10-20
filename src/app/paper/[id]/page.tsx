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
  CheckCircle2,
  AlertCircle,
  FileQuestion,
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

  // Determine truthful content availability level
  const contentStatus = paper.openAccessUrl
    ? {
        level: "full_text_available",
        badge: "Open Access Full-Text PDF Available",
        badgeColor: "border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300",
        icon: CheckCircle2,
        description: "A publicly accessible full-text PDF is indexed for this work. You can open the reader or download the document directly.",
      }
    : paper.abstract
    ? {
        level: "abstract_available",
        badge: "Abstract & Metadata Available",
        badgeColor: "border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300",
        icon: AlertCircle,
        description: "The published abstract and citation metadata are available. Full text is not indexed in the open record; consult the publisher link for licensed access.",
      }
    : {
        level: "metadata_only",
        badge: "Bibliographic Metadata Only",
        badgeColor: "border-slate-300 bg-slate-100 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300",
        icon: FileQuestion,
        description: "Only citation and publication identifiers are indexed. Abstract and full-text are inaccessible through public endpoints.",
      };

  const StatusIcon = contentStatus.icon;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Navigation Top */}
      <div>
        <Link
          href="/search"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Literature Search
        </Link>
      </div>

      {/* Main Header */}
      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-bold text-indigo-700 dark:text-indigo-300">
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

          {paper.citationCount > 0 && (
            <>
              <span className="text-slate-400">•</span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                <Award className="w-3.5 h-3.5 text-indigo-600" />
                {formatNumber(paper.citationCount)} Citations
              </span>
            </>
          )}

          <span className={`inline-flex items-center gap-1 rounded border px-2 py-0.5 text-xs font-medium ${contentStatus.badgeColor}`}>
            <StatusIcon className="h-3 w-3 shrink-0" />
            {contentStatus.badge}
          </span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-slate-950 dark:text-white tracking-tight leading-tight">
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
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 shadow-sm"
              >
                {author.id ? (
                  <Link
                    href={`/author/${encodeURIComponent(author.id)}`}
                    className="font-semibold text-slate-900 dark:text-white hover:text-indigo-700 dark:hover:text-indigo-300 hover:underline"
                  >
                    {author.name}
                  </Link>
                ) : (
                  <span className="font-semibold text-slate-900 dark:text-white">{author.name}</span>
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

      {/* Truthful Content Status Notice */}
      <div className={`flex items-start gap-3 rounded-xl border p-4 text-xs leading-relaxed ${contentStatus.badgeColor}`}>
        <StatusIcon className="h-4 w-4 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold">{contentStatus.badge}: </span>
          <span>{contentStatus.description}</span>
        </div>
      </div>

      {/* Client Action Bar (PDF, AI Companion, Citation, Bookmark, Reader) */}
      <PaperDetailClient paper={paper} />

      {/* Abstract */}
      <section className="p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
          <FileText className="w-4 h-4 text-indigo-600" />
          Abstract
        </h2>
        {paper.abstract ? (
          <p className="text-base text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line font-serif">
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
              {paper.source} (Public Open Scholarly API)
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
              {paper.isOpenAccess ? "Open Access (Publicly Accessible PDF)" : "Restricted / Publisher Landing"}
            </dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
