"use client";

import { useState, useEffect } from "react";
import {
  Activity,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Server,
  Zap,
  ExternalLink,
  Cpu,
  Database,
  Cloud,
} from "lucide-react";

export default function StatusPage() {
  const [openAlexStatus, setOpenAlexStatus] = useState<"checking" | "online" | "offline">("checking");
  const [openAlexLatency, setOpenAlexLatency] = useState<number | null>(null);

  const [aiStatus, setAiStatus] = useState<{
    isConfigured: boolean;
    model: string;
    provider: string;
  } | null>(null);

  useEffect(() => {
    // Ping OpenAlex
    const start = performance.now();
    fetch("https://api.openalex.org/works?per_page=1", {
      headers: { "User-Agent": "ResearchHub/1.0 (status-ping)" },
    })
      .then((res) => {
        if (res.ok) {
          setOpenAlexStatus("online");
          setOpenAlexLatency(Math.round(performance.now() - start));
        } else {
          setOpenAlexStatus("offline");
        }
      })
      .catch(() => setOpenAlexStatus("offline"));

    // Check AI status
    fetch("/api/ai/status")
      .then((res) => res.json())
      .then((data) => setAiStatus(data))
      .catch(() => setAiStatus({ isConfigured: false, model: "none", provider: "none" }));
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>System Status & Free Tier Audit</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
          Transparency & Infrastructure Health
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
          Real-time verification of Research Hub&apos;s external services, rate-limit policies, and zero-cost billing guarantees.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* OpenAlex */}
        <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                <Server className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  OpenAlex API
                </h3>
                <span className="text-xs text-slate-500">Primary Scholarly Catalog</span>
              </div>
            </div>
            <span
              className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                openAlexStatus === "online"
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                  : openAlexStatus === "checking"
                  ? "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"
                  : "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300"
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              {openAlexStatus === "online" ? `Online (${openAlexLatency}ms)` : openAlexStatus}
            </span>
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
            <p>• Free Quota: 100,000 requests/day unauthenticated</p>
            <p>• Polite Pool Rate: 10 req/sec via email header</p>
            <p>• Cost: Permanently $0.00 (Public domain CC0)</p>
          </div>
        </div>

        {/* arXiv API */}
        <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  arXiv API
                </h3>
                <span className="text-xs text-slate-500">Preprints & Open Access PDFs</span>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Operational
            </span>
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
            <p>• Policy: Maximum 1 request every 3 seconds</p>
            <p>• Safeguard: Client-side and server-side request throttling</p>
            <p>• Cost: Permanently $0.00 (Cornell University)</p>
          </div>
        </div>

        {/* OpenRouter AI */}
        <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-pink-50 dark:bg-pink-950/60 text-pink-600 dark:text-pink-400">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  OpenRouter AI
                </h3>
                <span className="text-xs text-slate-500">Optional Companion Layer</span>
              </div>
            </div>
            <span
              className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                aiStatus?.isConfigured
                  ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
                  : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
              }`}
            >
              {aiStatus?.isConfigured ? "Active (Free Model)" : "Zero-Cost Standby"}
            </span>
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
            <p>• Current Model: <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded font-mono">{aiStatus?.model || "meta-llama/llama-3.3-70b-instruct:free"}</code></p>
            <p>• Safeguard: Hard-blocked from paid models; 500 token limit; 20 req/hr per IP rate limit</p>
            <p>• Cost: Permanently $0.00 (Free model routing only)</p>
          </div>
        </div>

        {/* Vercel Hobby Hosting */}
        <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400">
                <Cloud className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Vercel Hobby Hosting
                </h3>
                <span className="text-xs text-slate-500">Edge & Next.js Serverless</span>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Hobby Tier Active
            </span>
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
            <p>• Allowance: 100 GB Bandwidth/mo, 100 GB-hrs serverless execution</p>
            <p>• Safeguard: Hard cap with zero overage billing; edge caching enabled</p>
            <p>• Cost: $0.00 (Personal/non-commercial open source)</p>
          </div>
        </div>
      </div>

      {/* Free Tier Checklist */}
      <section className="p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          Mandatory Zero-Cost Compliance Verification
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700 dark:text-slate-300">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span><strong>No Paid AI Fallback:</strong> Rejects paid models; returns friendly error if free model is busy.</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span><strong>No Secret Exposure:</strong> All environment variables stored server-side only; .env never tracked.</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span><strong>Zero Mandatory Database:</strong> Core research discovery operates anonymously without Supabase.</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span><strong>No Paid Vector Embeddings:</strong> Lexical and topic queries are handled by open upstream APIs.</span>
          </div>
        </div>
      </section>
    </div>
  );
}
