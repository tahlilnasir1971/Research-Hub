"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FileText,
  ExternalLink,
  Quote,
  Sparkles,
  BookOpen,
  Award,
  Globe,
  Tag,
} from "lucide-react";
import { Paper } from "@/lib/scholarly/types";
import { formatNumber, truncateText } from "@/lib/utils";
import { BookmarkButton } from "./BookmarkButton";
import { CitationModal } from "./CitationModal";
import { AiSummaryModal } from "./AiSummaryModal";

export function PaperCard({ paper }: { paper: Paper }) {
  const [citationOpen, setCitationOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);

  // Encode the paper ID properly for URL routing
  const paperHref = `/paper/${encodeURIComponent(paper.id)}`;

  return (
    <>
      <article className="group p-5 sm:p-6 bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 hover:border-indigo-300 dark:hover:border-indigo-800/60 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">
        <div className="space-y-3">
          {/* Metadata Top Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {paper.publicationYear}
              </span>

              {paper.venue && (
                <>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1 max-w-[240px] truncate" title={paper.venue}>
                    <BookOpen className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                    {paper.venue}
                  </span>
                </>
              )}

              {paper.source && (
                <>
                  <span>•</span>
                  <span className="uppercase text-[10px] font-semibold tracking-wider px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {paper.source}
                  </span>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              {paper.isOpenAccess && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  <Globe className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  Open Access
                </span>
              )}

              {paper.citationCount > 0 && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  <Award className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                  {formatNumber(paper.citationCount)} citations
                </span>
              )}
            </div>
          </div>

          {/* Title */}
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug">
            <Link href={paperHref}>{paper.title}</Link>
          </h3>

          {/* Authors */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-600 dark:text-slate-300">
            {paper.authors.slice(0, 5).map((author, idx) => (
              <span key={idx} className="inline-flex items-center">
                {author.id ? (
                  <Link
                    href={`/author/${encodeURIComponent(author.id)}`}
                    className="hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline"
                  >
                    {author.name}
                  </Link>
                ) : (
                  <span>{author.name}</span>
                )}
                {idx < Math.min(paper.authors.length, 5) - 1 && <span className="ml-1 text-slate-400">,</span>}
              </span>
            ))}
            {paper.authors.length > 5 && (
              <span className="text-slate-400">+{paper.authors.length - 5} more</span>
            )}
          </div>

          {/* Abstract Snippet */}
          {paper.abstract ? (
            <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>
                {expanded ? paper.abstract : truncateText(paper.abstract, 220)}
              </p>
              {paper.abstract.length > 220 && (
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="mt-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  {expanded ? "Show less" : "Read more"}
                </button>
              )}
            </div>
          ) : (
            <p className="text-xs italic text-slate-400">No abstract available from provider.</p>
          )}

          {/* Topics & Concepts */}
          {paper.concepts.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <Tag className="w-3 h-3 text-slate-400 shrink-0" />
              {paper.concepts.slice(0, 4).map((concept, idx) => (
                <Link
                  key={idx}
                  href={`/search?q=${encodeURIComponent(concept)}`}
                  className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 transition-colors"
                >
                  {concept}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Action Footer */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {paper.openAccessUrl && (
              <a
                href={paper.openAccessUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-sm"
              >
                <FileText className="w-3.5 h-3.5" />
                View PDF
              </a>
            )}

            {paper.landingPageUrl && (
              <a
                href={paper.landingPageUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="View on Publisher Site"
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Publisher</span>
              </a>
            )}

            <button
              onClick={() => setCitationOpen(true)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors"
            >
              <Quote className="w-3.5 h-3.5" />
              Cite
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setAiOpen(true)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Summary</span>
            </button>

            <BookmarkButton paper={paper} />
          </div>
        </div>
      </article>

      <CitationModal
        paper={paper}
        isOpen={citationOpen}
        onClose={() => setCitationOpen(false)}
      />

      <AiSummaryModal
        paper={paper}
        isOpen={aiOpen}
        onClose={() => setAiOpen(false)}
      />
    </>
  );
}
