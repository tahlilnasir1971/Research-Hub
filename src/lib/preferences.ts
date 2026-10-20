export const PREFERRED_DISCIPLINE_STORAGE_KEY = "research_hub_preferred_discipline";

export const AVAILABLE_DISCIPLINES = [
  "All",
  "Psychology",
  "Mathematics",
  "Artificial Intelligence",
  "Computational Science",
  "Interdisciplinary",
] as const;

export type AvailableDiscipline = (typeof AVAILABLE_DISCIPLINES)[number];

export function getStoredPreferredDiscipline(): AvailableDiscipline | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(PREFERRED_DISCIPLINE_STORAGE_KEY);
    if (stored && AVAILABLE_DISCIPLINES.includes(stored as AvailableDiscipline)) {
      return stored as AvailableDiscipline;
    }
  } catch {
    // Graceful fallback for restricted environments
  }
  return null;
}

export function setStoredPreferredDiscipline(discipline: AvailableDiscipline): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PREFERRED_DISCIPLINE_STORAGE_KEY, discipline);
    window.dispatchEvent(
      new CustomEvent("research_hub_discipline_changed", {
        detail: { discipline },
      })
    );
  } catch {
    // Graceful fallback
  }
}
