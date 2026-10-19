import test from "node:test";
import assert from "node:assert/strict";
import { reconstructAbstract } from "../src/lib/scholarly/openalex.ts";
import { deduplicatePapers } from "../src/lib/scholarly/aggregator.ts";

test("reconstructAbstract restores inverted index to sequential text", () => {
  const invertedIndex = {
    Quantum: [0],
    computing: [1],
    offers: [2],
    exponential: [3],
    "speedup.": [4],
  };

  const result = reconstructAbstract(invertedIndex);
  assert.equal(result, "Quantum computing offers exponential speedup.");
});

test("reconstructAbstract handles null or empty input safely", () => {
  assert.equal(reconstructAbstract(null), "");
  assert.equal(reconstructAbstract(undefined), "");
  assert.equal(reconstructAbstract({}), "");
});

test("deduplicatePapers eliminates duplicate papers by DOI and normalized title", () => {
  const papers = [
    {
      id: "W1",
      title: "Attention Is All You Need",
      publicationYear: 2017,
      authors: [{ name: "Vaswani" }],
      doi: "10.48550/arxiv.1706.03762",
      isOpenAccess: true,
      concepts: [],
      citationCount: 100000,
      source: "openalex",
    },
    {
      id: "arxiv:1706.03762",
      title: "Attention Is All You Need",
      publicationYear: 2017,
      authors: [{ name: "Vaswani" }],
      doi: "10.48550/arxiv.1706.03762",
      isOpenAccess: true,
      concepts: [],
      citationCount: 0,
      source: "arxiv",
    },
    {
      id: "W2",
      title: "Deep Residual Learning for Image Recognition",
      publicationYear: 2016,
      authors: [{ name: "He" }],
      doi: "10.1109/cvpr.2016.90",
      isOpenAccess: true,
      concepts: [],
      citationCount: 150000,
      source: "openalex",
    },
  ];

  const unique = deduplicatePapers(papers);
  assert.equal(unique.length, 2);
  assert.equal(unique[0].id, "W1");
  assert.equal(unique[1].id, "W2");
  assert.ok(unique[0].bibtex, "BibTeX should be automatically attached");
});
