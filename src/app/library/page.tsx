"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Bookmark,
  Trash2,
  Download,
  BookOpen,
  ArrowRight,
  FileText,
  Tag,
  CheckCircle2,
  Clock,
  BookCheck,
  Archive,
  Compass,
  Edit3,
  HelpCircle,
  FolderPlus,
  ShieldCheck,
} from "lucide-react";
import {
  getLocalBookmarks,
  updateLocalBookmark,
  BookmarkedPaper,
  ReadingStatus,
  RoadmapStage,
} from "@/lib/supabase/client";

const STATUS_CONFIG: Record<ReadingStatus, { label: string; icon: React.ComponentType<{ className?: string }>; color: string }> = {
  to_read: { label: "To Read", icon: Clock, color: "text-amber-700 bg-amber-50 dark:text-amber-300 dark:bg-amber-950/40" },
  reading: { label: "In Progress", icon: BookOpen, color: "text-indigo-700 bg-indigo-50 dark:text-indigo-300 dark:bg-indigo-950/40" },
  completed: { label: "Completed", icon: BookCheck, color: "text-emerald-700 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-950/40" },
  archived: { label: "Archived", icon: Archive, color: "text-slate-600 bg-slate-100 dark:text-slate-400 dark:bg-slate-800" },
};

const ROADMAP_STAGES: Record<RoadmapStage, { label: string; description: string }> = {
  foundational: { label: "1. Foundational Theory", description: "Core mathematical and algorithmic prerequisites" },
  methodological: { label: "2. Core Methodologies", description: "Primary models, algorithms, and proof strategies" },
  specialized: { label: "3. Specialized Applications", description: "Domain-specific implementations and benchmarks" },
  extension: { label: "4. Research Extensions", description: "Open questions and hypothetical extensions" },
};

export default function LibraryPage() {
  const [bookmarks, setBookmarks] = useState<BookmarkedPaper[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<"papers" | "roadmap">("papers");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [notesInput, setNotesInput] = useState<string>("");
  const [questionInput, setQuestionInput] = useState<string>("");
  const [newTagInput, setNewTagInput] = useState<string>("");

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

  const handleStatusChange = (id: string, status: ReadingStatus) => {
    updateLocalBookmark(id, { status });
  };

  const handleStageChange = (id: string, roadmapStage: RoadmapStage) => {
    updateLocalBookmark(id, { roadmapStage });
  };

  const handleSaveNotes = (id: string) => {
    updateLocalBookmark(id, { notes: notesInput, researchQuestion: questionInput });
    setEditingNotesId(null);
  };

  const handleAddTag = (id: string) => {
    if (!newTagInput.trim()) return;
    const paper = bookmarks.find((b) => b.id === id);
    if (!paper) return;
    const existing = paper.tags || [];
    if (!existing.includes(newTagInput.trim())) {
      updateLocalBookmark(id, { tags: [...existing, newTagInput.trim()] });
    }
    setNewTagInput("");
  };

  const handleRemoveTag = (id: string, tagToRemove: string) => {
    const paper = bookmarks.find((b) => b.id === id);
    if (!paper) return;
    const existing = paper.tags || [];
    updateLocalBookmark(id, { tags: existing.filter((t) => t !== tagToRemove) });
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
  ${b.notes ? `note = {Notes: ${b.notes.replace(/\r?\n/g, " ")}},` : ""}
  url = {https://doi.org/${b.doi || ""}}
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

  const allTags = Array.from(new Set(bookmarks.flatMap((b) => b.tags || [])));

  const filteredBookmarks = bookmarks.filter((b) => {
    const statusMatch = statusFilter === "all" || (b.status || "to_read") === statusFilter;
    const tagMatch = selectedTag === "all" || (b.tags && b.tags.includes(selectedTag));
    return statusMatch && tagMatch;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 mb-2">
            <Bookmark className="w-3.5 h-3.5" />
            <span>Personal Workspace</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-950 dark:text-white tracking-tight">
            Research Library & Roadmaps
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Organize papers, record reading notes, track theoretical roadmaps, and export references. Stored locally in this browser.
          </p>
        </div>

        {bookmarks.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportBibtex}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-indigo-700 hover:bg-indigo-800 text-white shadow-sm transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Export .bib
            </button>
          </div>
        )}
      </div>

      {/* Persistence Notice */}
      <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-4 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400">
        <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-900 dark:text-white">Local Privacy Architecture: </span>
          <span>
            Your notes, tags, and reading milestones remain entirely inside your browser&apos;s local storage. No telemetry or private notes are sent to external databases.
          </span>
        </div>
      </div>

      {/* View Switcher: Collection vs Roadmap */}
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab("papers")}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-semibold transition ${
            activeTab === "papers"
              ? "border-indigo-600 text-indigo-700 dark:border-indigo-400 dark:text-indigo-300"
              : "border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          }`}
        >
          <BookOpen className="h-3.5 w-3.5" />
          <span>Papers & Notes ({bookmarks.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("roadmap")}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-semibold transition ${
            activeTab === "roadmap"
              ? "border-indigo-600 text-indigo-700 dark:border-indigo-400 dark:text-indigo-300"
              : "border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          }`}
        >
          <Compass className="h-3.5 w-3.5" />
          <span>Staged Research Roadmap</span>
        </button>
      </div>

      {/* Filters (only for Collection tab) */}
      {activeTab === "papers" && bookmarks.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-medium text-slate-400 mr-1">Status:</span>
            {["all", "to_read", "reading", "completed", "archived"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`rounded-full px-2.5 py-1 text-xs font-medium transition ${
                  statusFilter === st
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                    : "border border-slate-200 text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:text-slate-400 dark:hover:text-white"
                }`}
              >
                {st === "all" ? "All Papers" : STATUS_CONFIG[st as ReadingStatus].label}
              </button>
            ))}
          </div>

          {allTags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="font-medium text-slate-400 mr-1 flex items-center gap-1">
                <Tag className="h-3 w-3" /> Tag:
              </span>
              <button
                onClick={() => setSelectedTag("all")}
                className={`rounded-full px-2 py-0.5 text-xs ${
                  selectedTag === "all" ? "bg-indigo-700 text-white" : "border border-slate-200 text-slate-600 dark:border-slate-700"
                }`}
              >
                All
              </button>
              {allTags.map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedTag(t)}
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    selectedTag === t ? "bg-indigo-700 text-white" : "border border-slate-200 text-slate-600 dark:border-slate-700"
                  }`}
                >
                  #{t}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 1: Papers & Notes List */}
      {activeTab === "papers" && (
        <>
          {!loaded ? (
            <div className="py-20 text-center text-xs text-slate-400">Loading library…</div>
          ) : bookmarks.length === 0 ? (
            <div className="py-16 text-center rounded-xl border border-dashed border-slate-200 p-8 dark:border-slate-800 space-y-3">
              <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Your library is empty</h2>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Save papers from search results or paper pages to organize reading lists, record researcher notes, and create personal roadmaps.
              </p>
              <div className="pt-2">
                <Link
                  href="/search"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
                >
                  <span>Explore literature</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBookmarks.map((b) => {
                const currentStatus: ReadingStatus = b.status || "to_read";
                const isEditing = editingNotesId === b.id;

                return (
                  <div
                    key={b.id}
                    className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
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

                        <h3 className="font-serif text-base font-bold text-slate-900 dark:text-white hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors">
                          <Link href={`/paper/${encodeURIComponent(b.id)}`}>{b.title}</Link>
                        </h3>

                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                          {b.authors.join(", ")}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
                        {/* Reading Status Selector */}
                        <select
                          value={currentStatus}
                          onChange={(e) => handleStatusChange(b.id, e.target.value as ReadingStatus)}
                          className="text-xs p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 outline-none"
                        >
                          <option value="to_read">To Read</option>
                          <option value="reading">In Progress</option>
                          <option value="completed">Completed</option>
                          <option value="archived">Archived</option>
                        </select>

                        <Link
                          href={`/paper/${encodeURIComponent(b.id)}`}
                          className="p-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
                        >
                          <FileText className="h-4 w-4" />
                        </Link>

                        <button
                          onClick={() => handleRemove(b.id)}
                          title="Remove from library"
                          className="p-1.5 text-xs rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Tags List */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {(b.tags || []).map((t) => (
                        <span
                          key={t}
                          className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                        >
                          #{t}
                          <button
                            onClick={() => handleRemoveTag(b.id, t)}
                            className="hover:text-rose-500"
                          >
                            ×
                          </button>
                        </span>
                      ))}

                      <div className="inline-flex items-center gap-1">
                        <input
                          type="text"
                          placeholder="+ add tag"
                          value={editingNotesId === b.id ? newTagInput : ""}
                          onFocus={() => setEditingNotesId(b.id)}
                          onChange={(e) => setNewTagInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddTag(b.id);
                            }
                          }}
                          className="w-20 text-[11px] border border-dashed border-slate-200 dark:border-slate-700 bg-transparent px-1.5 py-0.5 rounded outline-none"
                        />
                      </div>
                    </div>

                    {/* Researcher Notes & Question Section */}
                    <div className="border-t border-slate-100 pt-3 dark:border-slate-800">
                      {isEditing ? (
                        <div className="space-y-2">
                          <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                            Personal Research Notes
                          </label>
                          <textarea
                            value={notesInput}
                            onChange={(e) => setNotesInput(e.target.value)}
                            placeholder="Record key equations, proof steps, or insights..."
                            rows={3}
                            className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none font-serif"
                          />

                          <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                            Guiding Research Question
                          </label>
                          <input
                            type="text"
                            value={questionInput}
                            onChange={(e) => setQuestionInput(e.target.value)}
                            placeholder="What exact question are you investigating with this paper?"
                            className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none font-serif"
                          />

                          <div className="flex items-center gap-2 pt-1">
                            <button
                              onClick={() => handleSaveNotes(b.id)}
                              className="px-3 py-1 bg-indigo-700 text-white rounded text-xs font-semibold hover:bg-indigo-800"
                            >
                              Save Notes
                            </button>
                            <button
                              onClick={() => setEditingNotesId(null)}
                              className="px-3 py-1 text-slate-500 text-xs hover:text-slate-700"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start justify-between gap-3 text-xs">
                          <div className="space-y-1">
                            {b.researchQuestion && (
                              <p className="font-serif text-xs text-indigo-700 dark:text-indigo-300 font-medium">
                                <strong>Research Question:</strong> {b.researchQuestion}
                              </p>
                            )}
                            {b.notes ? (
                              <p className="font-serif text-xs text-slate-600 dark:text-slate-300 whitespace-pre-wrap">
                                {b.notes}
                              </p>
                            ) : (
                              <p className="text-slate-400 italic text-[11px]">No personal notes recorded yet.</p>
                            )}
                          </div>
                          <button
                            onClick={() => {
                              setEditingNotesId(b.id);
                              setNotesInput(b.notes || "");
                              setQuestionInput(b.researchQuestion || "");
                            }}
                            className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-indigo-700 shrink-0"
                          >
                            <Edit3 className="h-3 w-3" />
                            <span>{b.notes ? "Edit notes" : "Add notes"}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Tab 2: Staged Research Roadmap */}
      {activeTab === "roadmap" && (
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400">
            <strong>Roadmap Methodology:</strong> Organize literature into sequential learning stages. Move from foundational mathematical theory to primary algorithms, specialized domain implementations, and prospective extensions.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(Object.entries(ROADMAP_STAGES) as [RoadmapStage, { label: string; description: string }][]).map(([stageKey, stageInfo]) => {
              const stagePapers = bookmarks.filter((b) => (b.roadmapStage || "foundational") === stageKey);

              return (
                <div
                  key={stageKey}
                  className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 dark:border-slate-800">
                    <div>
                      <h3 className="font-serif text-sm font-bold text-slate-900 dark:text-white">
                        {stageInfo.label}
                      </h3>
                      <p className="text-[11px] text-slate-400">{stageInfo.description}</p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      {stagePapers.length}
                    </span>
                  </div>

                  {stagePapers.length === 0 ? (
                    <p className="text-xs italic text-slate-400 py-4 text-center">
                      No papers assigned to this stage.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {stagePapers.map((paper) => (
                        <div
                          key={paper.id}
                          className="rounded-lg border border-slate-100 bg-slate-50/70 p-3 text-xs dark:border-slate-800 dark:bg-slate-950 space-y-1.5"
                        >
                          <Link
                            href={`/paper/${encodeURIComponent(paper.id)}`}
                            className="font-serif font-semibold text-slate-900 dark:text-white hover:text-indigo-700 block line-clamp-1"
                          >
                            {paper.title}
                          </Link>
                          <div className="flex items-center justify-between text-[11px] text-slate-400">
                            <span>{paper.publicationYear} · {paper.authors[0] || "Author"}</span>
                            <select
                              value={paper.roadmapStage || "foundational"}
                              onChange={(e) => handleStageChange(paper.id, e.target.value as RoadmapStage)}
                              className="text-[10px] bg-transparent border-b border-slate-300 dark:border-slate-700 outline-none"
                            >
                              <option value="foundational">Move: 1. Foundational</option>
                              <option value="methodological">Move: 2. Methodological</option>
                              <option value="specialized">Move: 3. Specialized</option>
                              <option value="extension">Move: 4. Extension</option>
                            </select>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
