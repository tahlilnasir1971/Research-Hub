"use client";

import { useState, useEffect } from "react";
import { Bookmark } from "lucide-react";
import { Paper } from "@/lib/scholarly/types";
import { isPaperBookmarked, toggleLocalBookmark } from "@/lib/supabase/client";

export function BookmarkButton({ paper, showLabel = false }: { paper: Paper; showLabel?: boolean }) {
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    setBookmarked(isPaperBookmarked(paper.id));

    const handleUpdate = () => {
      setBookmarked(isPaperBookmarked(paper.id));
    };

    window.addEventListener("bookmarks-updated", handleUpdate);
    return () => window.removeEventListener("bookmarks-updated", handleUpdate);
  }, [paper.id]);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newState = toggleLocalBookmark(paper);
    setBookmarked(newState);
  };

  return (
    <button
      onClick={handleToggle}
      title={bookmarked ? "Remove from Library" : "Save to Library"}
      aria-label={bookmarked ? "Remove from Library" : "Save to Library"}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
        bookmarked
          ? "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800"
          : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"
      }`}
    >
      <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? "fill-indigo-600 dark:fill-indigo-400" : ""}`} />
      {showLabel && <span>{bookmarked ? "Saved" : "Save"}</span>}
    </button>
  );
}
