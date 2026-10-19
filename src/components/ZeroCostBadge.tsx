"use client";

import React from "react";
import { Sparkles, ShieldCheck } from "lucide-react";

export function ZeroCostBadge({ variant = "default" }: { variant?: "default" | "pill" | "banner" }) {
  if (variant === "pill") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
        $0 Free Public Data
      </span>
    );
  }

  if (variant === "banner") {
    return (
      <div className="bg-emerald-50/80 dark:bg-emerald-950/30 border-y border-emerald-200/60 dark:border-emerald-800/60 py-2 px-4 text-xs text-center text-emerald-800 dark:text-emerald-200">
        <span className="font-semibold">Research Hub Zero-Cost Commitment:</span> Powered 100% by open scholarly datasets (OpenAlex, arXiv, Crossref) with zero paid subscription dependencies.
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
      <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
      <span>Zero-Cost Scholarly Engine</span>
    </div>
  );
}
