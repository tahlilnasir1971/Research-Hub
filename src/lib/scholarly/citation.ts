import { Paper } from "./types";

export function generateBibtex(paper: Paper): string {
  const firstAuthor = paper.authors[0]?.name ? paper.authors[0].name.split(" ").slice(-1)[0].toLowerCase() : "author";
  const year = paper.publicationYear || "year";
  const key = `${firstAuthor}${year}${paper.title.slice(0, 10).replace(/[^a-zA-Z0-9]/g, "").toLowerCase()}`;

  const authorsString = paper.authors.map((a) => a.name).join(" and ");

  return `@article{${key},
  title = {${paper.title}},
  author = {${authorsString}},
  year = {${year}},
  ${paper.venue ? `journal = {${paper.venue}},` : ""}
  ${paper.doi ? `doi = {${paper.doi}},` : ""}
  ${paper.openAccessUrl ? `url = {${paper.openAccessUrl}},` : ""}
  note = {Retrieved from Research Hub (Open Data)}
}`;
}

export function generateApa(paper: Paper): string {
  const authorNames = paper.authors.map((a) => {
    const parts = a.name.split(" ");
    if (parts.length > 1) {
      const surname = parts[parts.length - 1];
      const initials = parts.slice(0, -1).map((p) => `${p[0]}.`).join(" ");
      return `${surname}, ${initials}`;
    }
    return a.name;
  });

  let authorText = "Unknown Author.";
  if (authorNames.length === 1) {
    authorText = `${authorNames[0]}.`;
  } else if (authorNames.length === 2) {
    authorText = `${authorNames[0]} & ${authorNames[1]}.`;
  } else if (authorNames.length > 2) {
    authorText = `${authorNames[0]} et al.`;
  }

  const yearText = `(${paper.publicationYear || "n.d."}).`;
  const titleText = `${paper.title}.`;
  const venueText = paper.venue ? ` ${paper.venue}.` : "";
  const doiText = paper.doi ? ` https://doi.org/${paper.doi}` : "";

  return `${authorText} ${yearText} ${titleText}${venueText}${doiText}`.trim();
}

export function generateMla(paper: Paper): string {
  const first = paper.authors[0]?.name || "Unknown Author";
  const more = paper.authors.length > 1 ? ", et al." : ".";
  const authorText = `${first}${more}`;
  const titleText = `"${paper.title}."`;
  const venueText = paper.venue ? ` ${paper.venue},` : "";
  const yearText = ` ${paper.publicationYear || "n.d."}.`;
  const doiText = paper.doi ? ` https://doi.org/${paper.doi}` : "";

  return `${authorText} ${titleText}${venueText}${yearText}${doiText}`.trim();
}

export function generateRis(paper: Paper): string {
  const lines: string[] = [
    "TY  - JOUR",
    `TI  - ${paper.title}`,
  ];

  for (const author of paper.authors) {
    lines.push(`AU  - ${author.name}`);
  }

  if (paper.publicationYear) {
    lines.push(`PY  - ${paper.publicationYear}`);
  }
  if (paper.venue) {
    lines.push(`JO  - ${paper.venue}`);
  }
  if (paper.doi) {
    lines.push(`DO  - ${paper.doi}`);
  }
  if (paper.openAccessUrl) {
    lines.push(`UR  - ${paper.openAccessUrl}`);
  }
  if (paper.abstract) {
    lines.push(`AB  - ${paper.abstract.replace(/\r?\n/g, " ")}`);
  }
  lines.push("ER  - ");

  return lines.join("\n");
}
