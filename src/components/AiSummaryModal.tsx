"use client";

import { useEffect, useState } from "react";
import { Sparkles, X, Loader2, AlertCircle, Send, Copy, Check, BookOpen, Layers, Target, Compass, MessageSquare } from "lucide-react";
import { Paper } from "@/lib/scholarly/types";
import { AnalysisMode } from "@/lib/ai/openrouter";

interface ModeTab {
  id: AnalysisMode;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const MODES: ModeTab[] = [
  { id: "overview", label: "Executive Overview", icon: Target, description: "Problem, core intuition, and key claims" },
  { id: "methodology", label: "Methodology & Math", icon: Layers, description: "Algorithm, proof strategy, and assumptions" },
  { id: "critical_evaluation", label: "Critical Reading", icon: AlertCircle, description: "Evidence, limitations, and reproducibility" },
  { id: "roadmap", label: "Learning Pathway", icon: Compass, description: "Prerequisites, sequence, and extension hypotheses" },
  { id: "qa", label: "Interactive Q&A", icon: MessageSquare, description: "Ask focused questions about the paper" },
];

const SUGGESTED_QUESTIONS = [
  "What mathematical prerequisites are needed?",
  "What are the main stated limitations?",
  "What evidence is established vs. claimed?",
  "How could this method be extended?",
];

export function AiSummaryModal({
  paper,
  isOpen,
  onClose,
}: {
  paper: Paper;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [activeMode, setActiveMode] = useState<AnalysisMode>("overview");
  const [loading, setLoading] = useState(false);
  const [analyses, setAnalyses] = useState<Partial<Record<AnalysisMode, string>>>({});
  const [modelUsed, setModelUsed] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [question, setQuestion] = useState("");
  const [askedQuestion, setAskedQuestion] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setAnalyses({});
    setModelUsed("");
    setError(null);
    setQuestion("");
    setAskedQuestion(null);
    setActiveMode("overview");
  }, [paper.id, isOpen]);

  if (!isOpen) return null;

  const fetchAnalysis = async (mode: AnalysisMode, customQuestion?: string) => {
    if (loading) return;
    setLoading(true);
    setError(null);
    if (customQuestion) setAskedQuestion(customQuestion);

    try {
      const res = await fetch("/api/ai/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: paper.title,
          abstract: paper.abstract,
          question: customQuestion,
          mode: customQuestion ? "qa" : mode,
        }),
      });

      const data = await res.json();
      if (res.ok && data.explanation) {
        setAnalyses((prev) => ({
          ...prev,
          [customQuestion ? "qa" : mode]: data.explanation,
        }));
        setModelUsed(data.modelUsed || "Free Model");
      } else {
        setError(data.error || "Could not retrieve an analysis.");
      }
    } catch {
      setError("Could not reach the Research Hub AI endpoint. Check your connection and retry.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    const textToCopy = analyses[activeMode];
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentContent = analyses[activeMode];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 backdrop-blur-sm sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="ai-companion-title"
        className="relative flex max-h-[92dvh] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-700 text-white">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="ai-companion-title" className="text-sm font-semibold text-slate-900 dark:text-white">
                  AI Research Companion
                </h3>
                <span className="rounded border border-amber-200 bg-amber-50 px-1.5 py-0.5 text-[10px] font-medium text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-300">
                  Abstract-based analysis
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {modelUsed ? `Model: ${modelUsed}` : "Grounded strictly in available title and abstract metadata"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close AI research companion"
            className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Paper Identification Bar */}
        <div className="border-b border-slate-100 bg-slate-50/70 px-6 py-2.5 dark:border-slate-800 dark:bg-slate-950/40">
          <p className="line-clamp-1 text-xs text-slate-600 dark:text-slate-300 font-serif">
            <span className="font-sans font-semibold text-slate-400 mr-2">Paper:</span>
            {paper.title}
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex overflow-x-auto border-b border-slate-200 px-6 dark:border-slate-800">
          {MODES.map((mode) => {
            const Icon = mode.icon;
            const isActive = activeMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => {
                  setActiveMode(mode.id);
                  if (!analyses[mode.id] && mode.id !== "qa") {
                    fetchAnalysis(mode.id);
                  }
                }}
                className={`flex shrink-0 items-center gap-2 border-b-2 px-3 py-3 text-xs font-semibold transition ${
                  isActive
                    ? "border-indigo-600 text-indigo-700 dark:border-indigo-400 dark:text-indigo-300"
                    : "border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{mode.label}</span>
              </button>
            );
          })}
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {error && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900 dark:border-amber-800/80 dark:bg-amber-950/30 dark:text-amber-200 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold">
                <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
                <span>Companion notice</span>
              </div>
              <p className="text-xs leading-relaxed">{error}</p>
              <button
                type="button"
                onClick={() => fetchAnalysis(activeMode, askedQuestion || undefined)}
                disabled={loading}
                className="text-xs font-semibold underline underline-offset-2 hover:opacity-80 disabled:opacity-50"
              >
                Retry request
              </button>
            </div>
          )}

          {loading && (
            <div className="py-14 text-center space-y-3">
              <Loader2 className="mx-auto h-6 w-6 animate-spin text-indigo-600" />
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Synthesizing researcher-level analysis for {MODES.find((m) => m.id === activeMode)?.label}…
              </p>
            </div>
          )}

          {!loading && !currentContent && !error && (
            <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center space-y-4 dark:border-slate-800">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                  {MODES.find((m) => m.id === activeMode)?.label}
                </h4>
                <p className="mx-auto mt-1 max-w-md text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {MODES.find((m) => m.id === activeMode)?.description}. Analysis is grounded in the published title and abstract.
                </p>
              </div>

              <button
                onClick={() => fetchAnalysis(activeMode)}
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-700 px-4 py-2 text-xs font-semibold text-white transition hover:bg-indigo-800"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Generate {MODES.find((m) => m.id === activeMode)?.label}
              </button>

              {activeMode === "qa" && (
                <div className="pt-2">
                  <p className="text-xs font-medium text-slate-400 mb-2">Or choose a focused research inquiry:</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {SUGGESTED_QUESTIONS.map((sq) => (
                      <button
                        key={sq}
                        onClick={() => fetchAnalysis("qa", sq)}
                        className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600 transition hover:border-indigo-300 hover:text-indigo-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:text-indigo-300"
                      >
                        {sq}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {!loading && currentContent && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {askedQuestion ? `Query: ${askedQuestion}` : MODES.find((m) => m.id === activeMode)?.label}
                </span>
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>
              </div>

              <div className="whitespace-pre-wrap font-serif text-sm leading-7 text-slate-800 dark:text-slate-200 rounded-lg border border-slate-200 bg-slate-50/50 p-5 dark:border-slate-800 dark:bg-slate-950/50">
                {currentContent}
              </div>

              <div className="rounded-lg bg-slate-100/70 p-3 text-[11px] text-slate-500 dark:bg-slate-800/40 dark:text-slate-400 leading-relaxed">
                <strong>Source Grounding:</strong> Statements reflect the published abstract and metadata. Theoretical assumptions or equations not stated in the abstract cannot be verified without full-text access.
              </div>
            </div>
          )}
        </div>

        {/* Footer Question Input */}
        <div className="border-t border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/90">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (question.trim() && !loading) {
                setActiveMode("qa");
                fetchAnalysis("qa", question.trim());
                setQuestion("");
              }
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={question}
              aria-label="Ask a focused question about this paper"
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask a specific question about methods, proofs, or findings..."
              className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
            <button
              type="submit"
              disabled={loading || !question.trim()}
              className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-700 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-indigo-800 disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
              <span>Inquire</span>
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
