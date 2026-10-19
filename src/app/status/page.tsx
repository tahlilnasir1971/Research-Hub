"use client";

import { useEffect, useState } from "react";
import { Activity, AlertCircle, CheckCircle2, Clock, Cpu, ExternalLink, Server } from "lucide-react";

type ServiceState = "checking" | "online" | "unavailable";

export default function StatusPage() {
  const [openAlex, setOpenAlex] = useState<{ state: ServiceState; latency?: number }>({ state: "checking" });
  const [aiStatus, setAiStatus] = useState<{ isConfigured: boolean; model: string } | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 8000);
    const start = performance.now();
    fetch("https://api.openalex.org/works?per_page=1", { signal: controller.signal })
      .then((response) => setOpenAlex({ state: response.ok ? "online" : "unavailable", latency: Math.round(performance.now() - start) }))
      .catch(() => setOpenAlex({ state: "unavailable" }))
      .finally(() => window.clearTimeout(timeout));
    fetch("/api/ai/status", { signal: controller.signal })
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((data) => setAiStatus({ isConfigured: Boolean(data.isConfigured), model: String(data.model || "Not configured") }))
      .catch(() => setAiStatus({ isConfigured: false, model: "Status unavailable" }));
    return () => { controller.abort(); window.clearTimeout(timeout); };
  }, []);

  const statusStyle = (state: ServiceState) => state === "online" ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200" : state === "checking" ? "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200" : "border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-200";

  return (
    <div className="mx-auto max-w-5xl space-y-10 px-4 py-10 sm:px-6 lg:px-8">
      <header className="max-w-2xl space-y-3">
        <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-indigo-700 dark:text-indigo-300"><Activity className="h-4 w-4" /> Service status</p>
        <h1 className="font-serif text-3xl tracking-tight text-slate-950 dark:text-white sm:text-4xl">What the app can verify</h1>
        <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">This page checks the OpenAlex endpoint from your browser and reports whether an OpenRouter key is configured on this server. Provider availability and quotas can change independently.</p>
      </header>

      <section aria-label="Service status" className="divide-y divide-slate-200 border-y border-slate-200 dark:divide-slate-800 dark:border-slate-800">
        <article className="grid gap-4 py-6 sm:grid-cols-[1fr_auto] sm:items-center">
          <div className="flex gap-4"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300"><Server className="h-5 w-5" /></span><div><h2 className="text-sm font-semibold text-slate-900 dark:text-white">OpenAlex</h2><p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Scholarly works and author metadata used in discovery.</p><a className="mt-2 inline-flex items-center gap-1 text-xs text-indigo-700 hover:underline dark:text-indigo-300" href="https://docs.openalex.org/" target="_blank" rel="noopener noreferrer">Provider documentation <ExternalLink className="h-3 w-3" /></a></div></div>
          <span className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${statusStyle(openAlex.state)}`}>{openAlex.state === "online" ? <CheckCircle2 className="h-3.5 w-3.5" /> : openAlex.state === "checking" ? <Clock className="h-3.5 w-3.5" /> : <AlertCircle className="h-3.5 w-3.5" />}{openAlex.state === "online" ? `Responding${openAlex.latency !== undefined ? ` · ${openAlex.latency} ms` : ""}` : openAlex.state === "checking" ? "Checking" : "Could not reach service"}</span>
        </article>

        <article className="grid gap-4 py-6 sm:grid-cols-[1fr_auto] sm:items-center">
          <div className="flex gap-4"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300"><Activity className="h-5 w-5" /></span><div><h2 className="text-sm font-semibold text-slate-900 dark:text-white">arXiv and Crossref</h2><p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Connected as search and publication metadata sources. This page does not perform separate uptime checks for these providers.</p></div></div>
          <span className="w-fit rounded-full border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 dark:border-slate-700 dark:text-slate-300">Integration available</span>
        </article>

        <article className="grid gap-4 py-6 sm:grid-cols-[1fr_auto] sm:items-center">
          <div className="flex gap-4"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"><Cpu className="h-5 w-5" /></span><div><h2 className="text-sm font-semibold text-slate-900 dark:text-white">OpenRouter AI companion</h2><p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Optional. A configured key enables requests; this check does not send a prompt or confirm model availability.</p><p className="mt-2 font-mono text-xs text-slate-500 dark:text-slate-400">Model: {aiStatus?.model || "Checking configuration"}</p></div></div>
          <span className={`w-fit rounded-full border px-2.5 py-1 text-xs font-medium ${aiStatus?.isConfigured ? "border-indigo-200 bg-indigo-50 text-indigo-800 dark:border-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-200" : "border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-300"}`}>{aiStatus ? aiStatus.isConfigured ? "Key configured" : "Not configured" : "Checking"}</span>
        </article>
      </section>

      <p className="max-w-3xl text-xs leading-5 text-slate-500 dark:text-slate-400">Search and library features use public provider endpoints and local browser storage. Third-party service terms, rate limits, availability, and any configured AI model may change. See each provider’s current documentation for its policies.</p>
    </div>
  );
}
