"use client";

import { useState } from "react";
import { Copy, Check, Quote, X } from "lucide-react";
import { Paper } from "@/lib/scholarly/types";
import { generateBibtex, generateApa, generateMla, generateRis } from "@/lib/scholarly/citation";

export function CitationModal({
  paper,
  isOpen,
  onClose,
}: {
  paper: Paper;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [format, setFormat] = useState<"bibtex" | "apa" | "mla" | "ris">("bibtex");
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  let text = "";
  if (format === "bibtex") text = generateBibtex(paper);
  else if (format === "apa") text = generateApa(paper);
  else if (format === "mla") text = generateMla(paper);
  else if (format === "ris") text = generateRis(paper);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Quote className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Cite this Paper
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Format Selector Tabs */}
        <div className="flex px-6 pt-4 gap-2 border-b border-slate-100 dark:border-slate-800">
          {(["bibtex", "apa", "mla", "ris"] as const).map((fmt) => (
            <button
              key={fmt}
              onClick={() => setFormat(fmt)}
              className={`pb-3 px-3 text-sm font-medium uppercase tracking-wider transition-colors border-b-2 ${
                format === fmt
                  ? "border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400"
                  : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              {fmt}
            </button>
          ))}
        </div>

        {/* Content Box */}
        <div className="p-6">
          <div className="relative bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-800 dark:text-slate-200 max-h-60 overflow-y-auto whitespace-pre-wrap select-all">
            {text}
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Generated locally at $0 cost. Format compliant with scientific citation standards.
            </p>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-lg shadow-sm transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy Citation
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
