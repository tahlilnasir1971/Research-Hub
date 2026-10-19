import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Research Hub — Scholarly discovery workspace",
  description:
    "Search scholarly literature across OpenAlex, arXiv, and Crossref. Organize papers and explore research topics.",
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
      <body className="flex min-h-screen flex-col antialiased selection:bg-indigo-200 selection:text-slate-950 dark:selection:bg-indigo-800 dark:selection:text-white">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
