import test from "node:test";
import assert from "node:assert/strict";
import {
  VERIFIED_OPPORTUNITIES,
  DISCIPLINE_CONFIGS,
} from "../src/lib/opportunities/data.ts";

test("verified opportunities list contains valid entries with required fields", () => {
  assert.ok(VERIFIED_OPPORTUNITIES.length >= 15, "Should have a robust collection of verified opportunities");

  for (const item of VERIFIED_OPPORTUNITIES) {
    assert.ok(item.id, `Opportunity must have an id: ${JSON.stringify(item)}`);
    assert.ok(item.title, `Opportunity ${item.id} must have a title`);
    assert.ok(item.organization, `Opportunity ${item.id} must have an organization`);
    assert.ok(
      item.sourceUrl.startsWith("http://") || item.sourceUrl.startsWith("https://"),
      `Opportunity ${item.id} must have a valid HTTP(S) source URL`
    );
    assert.ok(item.deadline, `Opportunity ${item.id} must describe its deadline or cycle`);
    assert.ok(item.eligibility, `Opportunity ${item.id} must state eligibility criteria`);
    assert.ok(item.location, `Opportunity ${item.id} must state location`);
    assert.ok(
      ["Open", "Upcoming Cycle", "Rolling"].includes(item.status),
      `Opportunity ${item.id} status must be Open, Upcoming Cycle, or Rolling`
    );
    assert.equal(item.verified, true, `Opportunity ${item.id} must be marked verified`);
  }
});

test("verified opportunities comprehensively cover Psychology subdisciplines", () => {
  const psychOpportunities = VERIFIED_OPPORTUNITIES.filter(
    (o) =>
      o.field === "Psychology" ||
      o.field === "Cognitive Science" ||
      (o.interdisciplinaryTags && o.interdisciplinaryTags.includes("Psychology"))
  );

  assert.ok(
    psychOpportunities.length >= 8,
    `Must have at least 8 psychology opportunities (found ${psychOpportunities.length})`
  );

  // Check subdisciplines and types are represented
  const subfields = psychOpportunities.map((o) => o.subfield).join(" ");
  const types = new Set(psychOpportunities.map((o) => o.type));

  // Must include research assistantships / lab positions
  assert.ok(
    types.has("Lab Position"),
    "Must include psychology research assistantships / lab positions"
  );
  assert.ok(
    types.has("Research Program"),
    "Must include undergraduate research programs and mentorship"
  );
  assert.ok(
    types.has("Internship"),
    "Must include psychology internships"
  );
  assert.ok(
    types.has("Fellowship"),
    "Must include psychology graduate/postdoctoral fellowships"
  );
  assert.ok(
    types.has("Grant / Scholarship"),
    "Must include psychology grants or scholarships"
  );
  assert.ok(
    types.has("Conference / Call for Papers"),
    "Must include psychology / cognitive conferences and calls for papers"
  );

  // Check subfields cover clinical, cognitive, social, developmental, I-O, and psychology + AI
  assert.ok(/Clinical/i.test(subfields), "Must include clinical psychology");
  assert.ok(/Cognitive/i.test(subfields), "Must include cognitive psychology");
  assert.ok(/Social/i.test(subfields), "Must include social psychology");
  assert.ok(/Developmental/i.test(subfields), "Must include developmental psychology");
  assert.ok(/Industrial/i.test(subfields), "Must include industrial-organizational psychology");
  assert.ok(/AI|HCI/i.test(subfields), "Must include interdisciplinary psychology + AI / HCI");
});

test("verified opportunities cover Mathematics, AI, and Computational Science", () => {
  const mathOpps = VERIFIED_OPPORTUNITIES.filter(
    (o) => o.field === "Mathematics" || (o.interdisciplinaryTags && o.interdisciplinaryTags.includes("Mathematics"))
  );
  const aiOpps = VERIFIED_OPPORTUNITIES.filter(
    (o) => o.field === "Artificial Intelligence" || (o.interdisciplinaryTags && o.interdisciplinaryTags.includes("Artificial Intelligence"))
  );
  const compOpps = VERIFIED_OPPORTUNITIES.filter(
    (o) => o.field === "Computational Science" || (o.interdisciplinaryTags && o.interdisciplinaryTags.includes("Computational Science"))
  );

  assert.ok(mathOpps.length >= 2, "Must have verified mathematics opportunities");
  assert.ok(aiOpps.length >= 2, "Must have verified AI opportunities");
  assert.ok(compOpps.length >= 2, "Must have verified computational science opportunities");
});

test("discipline configurations exist and contain suggested searches", () => {
  assert.ok(DISCIPLINE_CONFIGS.Psychology, "Psychology configuration must exist");
  assert.ok(DISCIPLINE_CONFIGS.Psychology.suggestedSearches.length >= 4, "Psychology must have suggested searches");
  assert.ok(DISCIPLINE_CONFIGS.Psychology.subcategories.length >= 4, "Psychology must have subcategories");

  assert.ok(DISCIPLINE_CONFIGS.Mathematics, "Mathematics configuration must exist");
  assert.ok(DISCIPLINE_CONFIGS["Artificial Intelligence"], "AI configuration must exist");
});
