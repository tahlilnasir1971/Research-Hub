import test from "node:test";
import assert from "node:assert/strict";
import {
  generateBibtex,
  generateApa,
  generateMla,
  generateRis,
} from "../src/lib/scholarly/citation.ts";

const samplePaper = {
  id: "W12345",
  title: "Quantum Supremacy Using a Programmable Superconducting Processor",
  publicationYear: 2019,
  authors: [{ name: "Frank Arute" }, { name: "Kunai Arya" }, { name: "John M. Martinis" }],
  venue: "Nature",
  doi: "10.1038/s41586-019-1666-5",
  isOpenAccess: true,
  openAccessUrl: "https://nature.com/articles/s41586-019-1666-5.pdf",
  concepts: ["Quantum computing"],
  citationCount: 4500,
  source: "openalex",
};

test("generateBibtex produces valid BibTeX structure", () => {
  const bib = generateBibtex(samplePaper);
  assert.ok(bib.startsWith("@article{"));
  assert.ok(bib.includes("title = {Quantum Supremacy Using a Programmable Superconducting Processor}"));
  assert.ok(bib.includes("author = {Frank Arute and Kunai Arya and John M. Martinis}"));
  assert.ok(bib.includes("journal = {Nature}"));
  assert.ok(bib.includes("year = {2019}"));
  assert.ok(bib.includes("doi = {10.1038/s41586-019-1666-5}"));
});

test("generateApa formats author list with et al. for multi-authors", () => {
  const apa = generateApa(samplePaper);
  assert.ok(apa.includes("Arute, F. et al."));
  assert.ok(apa.includes("(2019)."));
  assert.ok(apa.includes("https://doi.org/10.1038/s41586-019-1666-5"));
});

test("generateMla formats correctly", () => {
  const mla = generateMla(samplePaper);
  assert.ok(mla.includes("Frank Arute, et al."));
  assert.ok(mla.includes('"Quantum Supremacy Using a Programmable Superconducting Processor."'));
});

test("generateRis generates standard RIS lines", () => {
  const ris = generateRis(samplePaper);
  assert.ok(ris.includes("TY  - JOUR"));
  assert.ok(ris.includes("TI  - Quantum Supremacy Using a Programmable Superconducting Processor"));
  assert.ok(ris.includes("AU  - Frank Arute"));
  assert.ok(ris.includes("ER  - "));
});
