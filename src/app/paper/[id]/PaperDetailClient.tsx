"use client";

import { useState } from "react";
import {
  FileText,
  ExternalLink,
  Quote,
  Sparkles,
  Share2,
  Check,
} from "lucide-react";
import { Paper } from "@/lib/scholarly/types";
import { BookmarkButton } from "@/components/BookmarkButton";
import { CitationModal } from "@/components/CitationModal";
import { AiSummaryModal } from "@/components/AiSummaryModal";

export function PaperDetailClient({ paper }: { paper: Paper }) {
  const [citationOpen, setCitationOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
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
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {paper.openAccessUrl && (
            <a
              href={paper.openAccessUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
            >
              <FileText className="w-4 h-4" />
              Download Open Access PDF
            </a>
          )}

          {paper.landingPageUrl && (
            <a
              href={paper.landingPageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Publisher Website
            </a>
          )}

          <button
            onClick={() => setCitationOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
          >
            <Quote className="w-3.5 h-3.5" />
            Cite (BibTeX / APA)
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setAiOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI Companion
          </button>

          <BookmarkButton paper={paper} showLabel />

          <button
            onClick={handleShare}
            title="Share or Copy Link"
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
          >
            {shared ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

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
