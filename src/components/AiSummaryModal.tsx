"use client";

import { useState } from "react";
import { Sparkles, X, Loader2, AlertCircle, Send, CheckCircle2 } from "lucide-react";
import { Paper } from "@/lib/scholarly/types";

export function AiSummaryModal({
  paper,
  isOpen,
  onClose,
}: {
  paper: Paper;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [modelUsed, setModelUsed] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [question, setQuestion] = useState("");
  const [askedQuestion, setAskedQuestion] = useState<string | null>(null);

  if (!isOpen) return null;

  const fetchSummary = async (customQuestion?: string) => {
    setLoading(true);
    setError(null);
    if (customQuestion) {
      setAskedQuestion(customQuestion);
    }

    try {
      const res = await fetch("/api/ai/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: paper.title,
          abstract: paper.abstract,
          question: customQuestion,
        }),
      });

      const data = await res.json();
      if (data.explanation) {
        setSummary(data.explanation);
        setModelUsed(data.modelUsed || "Free Model");
      } else {
        setError(data.error || "Could not retrieve summary.");
      }
    } catch (err: any) {
      setError(`Network error: ${err.message || "Failed to reach AI adapter"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/20 dark:to-purple-950/20">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-600 text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                AI Paper Companion
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Powered by OpenRouter Zero-Cost Model ({modelUsed || "Free Tier"})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          <div>
            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
              Analyzing Paper
            </span>
            <h4 className="text-sm font-medium text-slate-800 dark:text-slate-200 line-clamp-2 mt-0.5">
              {paper.title}
            </h4>
          </div>

          {!summary && !loading && !error && (
            <div className="p-6 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-center space-y-3">
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Generate an instant plain-language breakdown and key methodology summary using an eligible free OpenRouter model.
              </p>
              <button
                onClick={() => fetchSummary()}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl shadow-sm transition-all"
              >
                <Sparkles className="w-4 h-4" />
                Generate AI Summary
              </button>
            </div>
          )}

          {loading && (
            <div className="py-12 flex flex-col items-center justify-center space-y-3 text-slate-500">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
              <p className="text-sm">Synthesizing paper with zero-cost AI model...</p>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 space-y-2">
              <div className="flex items-center gap-2 font-medium text-sm">
                <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>Notice: AI Integration Status</span>
              </div>
              <p className="text-xs leading-relaxed">{error}</p>
              <div className="text-xs text-amber-700 dark:text-amber-300 pt-1">
                Tip: Research Hub core discovery, abstract search, and PDF links work 100% without any AI API key.
              </div>
            </div>
          )}

          {summary && (
            <div className="space-y-4">
              {askedQuestion && (
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300">
                  <span className="font-semibold text-slate-900 dark:text-slate-100">Question:</span> {askedQuestion}
                </div>
              )}
              <div className="prose dark:prose-invert prose-sm max-w-none text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap bg-slate-50/50 dark:bg-slate-950/50 p-4 rounded-xl border border-slate-200/60 dark:border-slate-800/60">
                {summary}
              </div>
            </div>
          )}
        </div>

        {/* Footer Question Bar */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (question.trim()) {
                fetchSummary(question.trim());
                setQuestion("");
              }
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask a specific question about this paper..."
              className="flex-1 px-3.5 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={loading || !question.trim()}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-medium rounded-lg transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              Ask
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
