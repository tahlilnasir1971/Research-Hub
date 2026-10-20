import test from "node:test";
import assert from "node:assert/strict";
import { VERIFIED_OPPORTUNITIES } from "../src/lib/opportunities/data.ts";

test("verified opportunities list contains valid entries with required fields", () => {
  assert.ok(VERIFIED_OPPORTUNITIES.length >= 8, "Should have curated opportunities");

  for (const item of VERIFIED_OPPORTUNITIES) {
    assert.ok(item.id, "Opportunity must have an id");
    assert.ok(item.title, "Opportunity must have a title");
    assert.ok(item.organization, "Opportunity must have an organization");
    assert.ok(item.sourceUrl.startsWith("http"), `Opportunity ${item.id} must have a valid HTTP(S) source URL`);
    assert.ok(item.deadline, "Opportunity must describe its deadline or cycle");
    assert.ok(item.eligibility, "Opportunity must state eligibility criteria");
    assert.equal(item.verified, true, "Opportunities must be verified");
  }
});

test("verified opportunities cover mathematics, computing, and AI", () => {
  const fields = new Set(VERIFIED_OPPORTUNITIES.map((o) => o.field));
  assert.ok(fields.has("Mathematics"));
  assert.ok(fields.has("Artificial Intelligence"));
  assert.ok(fields.has("Computational Science"));
});
