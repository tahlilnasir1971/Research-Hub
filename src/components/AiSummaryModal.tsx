"use client";

import { useEffect, useState } from "react";
import { Sparkles, X, Loader2, AlertCircle, Send } from "lucide-react";
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

  useEffect(() => {
    if (!isOpen) return;
    setSummary(null);
    setModelUsed("");
    setError(null);
    setQuestion("");
    setAskedQuestion(null);
  }, [paper.id, isOpen]);

  if (!isOpen) return null;

  const fetchSummary = async (customQuestion?: string) => {
    if (loading) return;
    setLoading(true);
    setError(null);
    setSummary(null);
    setAskedQuestion(customQuestion || null);

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
      if (res.ok && data.explanation) {
        setSummary(data.explanation);
        setModelUsed(data.modelUsed || "Free Model");
      } else {
        setError(data.error || "Could not retrieve an explanation.");
      }
    } catch {
      setError("Could not reach the Research Hub AI endpoint. Check your connection and retry.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 backdrop-blur-sm sm:p-6" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section role="dialog" aria-modal="true" aria-labelledby="ai-companion-title" className="relative flex max-h-[92dvh] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/20 dark:to-purple-950/20">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-600 text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 id="ai-companion-title" className="text-base font-semibold text-slate-900 dark:text-slate-100">
                AI Paper Companion
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {modelUsed ? `OpenRouter · ${modelUsed}` : "Optional OpenRouter model"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close AI paper companion"
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
                Generate an explanation from the title and abstract available for this paper. The response is abstract-based; the full text has not been retrieved here.
              </p>
              <button
                onClick={() => fetchSummary()}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-700 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Sparkles className="w-4 h-4" />
                Generate AI Summary
              </button>
            </div>
          )}

          {loading && (
            <div className="py-12 flex flex-col items-center justify-center space-y-3 text-slate-500">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
              <p className="text-sm">Preparing an abstract-based explanation…</p>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 space-y-2">
              <div className="flex items-center gap-2 font-medium text-sm">
                <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>Notice: AI Integration Status</span>
              </div>
              <p className="text-xs leading-relaxed">{error}</p>
              <button type="button" onClick={() => fetchSummary(askedQuestion || undefined)} disabled={loading} className="text-xs font-semibold text-amber-800 underline decoration-amber-400 underline-offset-2 disabled:opacity-50 dark:text-amber-200">Try again</button>
            </div>
          )}

          {summary && (
            <div className="space-y-4">
              {askedQuestion && (
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300">
                  <span className="font-semibold text-slate-900 dark:text-slate-100">Question:</span> {askedQuestion}
                </div>
              )}
              <div className="whitespace-pre-wrap rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-800 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200">
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
              if (question.trim() && !loading) {
                fetchSummary(question.trim());
                setQuestion("");
              }
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={question}
              aria-label="Ask a question about this paper"
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask a specific question about this paper..."
              className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
            <button
              type="submit"
              disabled={loading || !question.trim()}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-medium rounded-lg transition-colors"
            >
              {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
              Ask
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
