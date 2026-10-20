"use client";

import { useState } from "react";
import {
  FileText,
  ExternalLink,
  Quote,
  Sparkles,
  Share2,
  Check,
  BookOpen,
  Maximize2,
  Minimize2,
  X,
} from "lucide-react";
import { Paper } from "@/lib/scholarly/types";
import { BookmarkButton } from "@/components/BookmarkButton";
import { CitationModal } from "@/components/CitationModal";
import { AiSummaryModal } from "@/components/AiSummaryModal";

export function PaperDetailClient({ paper }: { paper: Paper }) {
  const [citationOpen, setCitationOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [pdfReaderOpen, setPdfReaderOpen] = useState(false);
  const [shared, setShared] = useState(false);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: paper.title,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    }
  };

  return (
    <>
      <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {paper.openAccessUrl && (
            <>
              <button
                onClick={() => setPdfReaderOpen(!pdfReaderOpen)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
              >
                <BookOpen className="w-3.5 h-3.5" />
                {pdfReaderOpen ? "Hide Reader" : "Open PDF Reader"}
              </button>

              <a
                href={paper.openAccessUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 border border-emerald-300 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-semibold rounded-lg transition-colors"
              >
                <FileText className="w-3.5 h-3.5" />
                Download PDF
              </a>
            </>
          )}

          {paper.landingPageUrl && (
            <a
              href={paper.landingPageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Publisher Record
            </a>
          )}

          <button
            onClick={() => setCitationOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
          >
            <Quote className="w-3.5 h-3.5" />
            Cite (BibTeX / APA)
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setAiOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI Companion
          </button>

          <BookmarkButton paper={paper} showLabel />

          <button
            onClick={handleShare}
            title="Share or Copy Link"
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
          >
            {shared ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Embedded Document Reading Workspace */}
      {pdfReaderOpen && paper.openAccessUrl && (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-lg space-y-2">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-2.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <span>Integrated PDF Reading Workspace</span>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={paper.openAccessUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-indigo-600 hover:underline flex items-center gap-1"
              >
                <span>Full screen tab</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <button
                onClick={() => setPdfReaderOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="w-full h-[650px] bg-slate-100 dark:bg-slate-950">
            <iframe
              src={paper.openAccessUrl}
              title={`PDF viewer for ${paper.title}`}
              className="w-full h-full border-0"
              loading="lazy"
            />
          </div>
        </div>
      )}

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
