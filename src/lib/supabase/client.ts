import { Paper } from "../scholarly/types";

export interface BookmarkedPaper {
  id: string;
  title: string;
  authors: string[];
  publicationYear: number;
  doi?: string;
  savedAt: string;
}

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(url && key && url.trim().length > 0 && key.trim().length > 0);
}

// LocalStorage fallback implementation ($0 cost, 100% offline & anonymous friendly)
const LOCAL_STORAGE_KEY = "research_hub_saved_papers";

export function getLocalBookmarks(): BookmarkedPaper[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error("Failed to read from localStorage:", err);
    return [];
  }
}

export function toggleLocalBookmark(paper: Paper): boolean {
  if (typeof window === "undefined") return false;
  try {
    const current = getLocalBookmarks();
    const exists = current.some((p) => p.id === paper.id);

    let updated: BookmarkedPaper[];
    if (exists) {
      updated = current.filter((p) => p.id !== paper.id);
    } else {
      const newEntry: BookmarkedPaper = {
        id: paper.id,
        title: paper.title,
        authors: paper.authors.map((a) => a.name),
        publicationYear: paper.publicationYear,
        doi: paper.doi,
        savedAt: new Date().toISOString(),
      };
      updated = [newEntry, ...current];
    }

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("bookmarks-updated"));
    return !exists;
  } catch (err) {
    console.error("Failed to update localStorage bookmarks:", err);
    return false;
  }
}

export function isPaperBookmarked(paperId: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const current = getLocalBookmarks();
    return current.some((p) => p.id === paperId);
  } catch {
    return false;
  }
}
