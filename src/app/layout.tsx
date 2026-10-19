import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ZeroCostBadge } from "@/components/ZeroCostBadge";

export const metadata: Metadata = {
  title: "Research Hub — Zero-Cost Open Scholarly Discovery",
  description:
    "Discover 250M+ scientific papers, preprints, and open-access research across OpenAlex, arXiv, and Crossref. Completely free, open, and without subscription paywalls.",
  keywords: [
    "research",
    "open access",
    "scientific papers",
    "arxiv",
    "openalex",
    "crossref",
    "literature search",
    "citations",
    "bibtex",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
        <ZeroCostBadge variant="banner" />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
