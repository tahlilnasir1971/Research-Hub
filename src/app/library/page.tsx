"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Bookmark,
  Trash2,
  Download,
  BookOpen,
  ArrowRight,
  Database,
  FileText,
} from "lucide-react";
import { getLocalBookmarks, BookmarkedPaper } from "@/lib/supabase/client";

export default function LibraryPage() {
  const [bookmarks, setBookmarks] = useState<BookmarkedPaper[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setBookmarks(getLocalBookmarks());
    setLoaded(true);

    const handleUpdate = () => {
      setBookmarks(getLocalBookmarks());
    };

    window.addEventListener("bookmarks-updated", handleUpdate);
    return () => window.removeEventListener("bookmarks-updated", handleUpdate);
  }, []);

  const handleRemove = (id: string) => {
    const raw = localStorage.getItem("research_hub_saved_papers");
    if (!raw) return;
    const current: BookmarkedPaper[] = JSON.parse(raw);
    const updated = current.filter((p) => p.id !== id);
    localStorage.setItem("research_hub_saved_papers", JSON.stringify(updated));
    setBookmarks(updated);
    window.dispatchEvent(new Event("bookmarks-updated"));
  };

  const handleClearAll = () => {
    if (confirm("Are you sure you want to clear your saved library?")) {
      localStorage.removeItem("research_hub_saved_papers");
      setBookmarks([]);
      window.dispatchEvent(new Event("bookmarks-updated"));
    }
  };

  const handleExportBibtex = () => {
    if (bookmarks.length === 0) return;

    const entries = bookmarks.map((b) => {
      const firstAuthor = b.authors[0] ? b.authors[0].split(" ").slice(-1)[0].toLowerCase() : "author";
      const year = b.publicationYear || "year";
      const key = `${firstAuthor}${year}${b.id.replace(/[^a-zA-Z0-9]/g, "").slice(0, 8)}`;
      const authors = b.authors.join(" and ");

      return `@article{${key},
  title = {${b.title}},
  author = {${authors}},
  year = {${year}},
  ${b.doi ? `doi = {${b.doi}},` : ""}
  note = {Exported from Research Hub}
}`;
    });

    const blob = new Blob([entries.join("\n\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `research-hub-library-${new Date().toISOString().split("T")[0]}.bib`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 mb-2">
            <Bookmark className="w-3.5 h-3.5" />
            <span>Personal Collection</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
            Saved Research Library
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Papers you have saved for later reading. This library is stored in this browser and is not synced to other devices.
          </p>
        </div>

        {bookmarks.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportBibtex}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Export .bib
            </button>
            <button
              onClick={handleClearAll}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Local storage notice */}
      <div className="flex items-start gap-3 border-l-2 border-indigo-600 py-1 pl-4">
        <Database className="mt-0.5 h-4 w-4 shrink-0 text-indigo-700 dark:text-indigo-300" />
        <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
          <p className="font-semibold text-slate-800 dark:text-slate-100">Stored in this browser</p>
          <p className="text-slate-500 dark:text-slate-400">
            Saved papers stay in this browser’s local storage. Clearing browser data can remove them; cloud sync is not enabled.
          </p>
        </div>
      </div>

      {/* Bookmarks List */}
      {!loaded ? (
        <div className="py-20 text-center text-xs text-slate-400">
          Loading your library...
        </div>
      ) : bookmarks.length === 0 ? (
        <div className="py-20 text-center p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-200">
            Your library is empty
          </h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Click the bookmark icon on any paper card or detail page to add it to your personal reading list.
          </p>
          <div className="pt-2">
            <Link
              href="/search"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors"
            >
              <span>Discover Papers</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {bookmarks.map((b) => (
            <div
              key={b.id}
              className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-800 shadow-sm transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    {b.publicationYear}
                  </span>
                  <span>•</span>
                  <span>Saved {new Date(b.savedAt).toLocaleDateString()}</span>
                  {b.doi && (
                    <>
                      <span>•</span>
                      <span className="font-mono text-[11px]">{b.doi}</span>
                    </>
                  )}
                </div>

                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  <Link href={`/paper/${encodeURIComponent(b.id)}`}>{b.title}</Link>
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                  {b.authors.join(", ")}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href={`/paper/${encodeURIComponent(b.id)}`}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-slate-700 dark:text-slate-300 hover:text-indigo-600 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5" />
                  Read
                </Link>

                <button
                  onClick={() => handleRemove(b.id)}
                  title="Remove from Library"
                  className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
