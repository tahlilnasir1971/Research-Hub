import test from "node:test";
import assert from "node:assert/strict";
import { isRateLimited, explainPaperWithAi } from "../src/lib/ai/openrouter.ts";

test("explainPaperWithAi gracefully fails when API key is missing without throwing", async () => {
  // Ensure OPENROUTER_API_KEY is unset for this test
  const originalKey = process.env.OPENROUTER_API_KEY;
  delete process.env.OPENROUTER_API_KEY;

  try {
    const result = await explainPaperWithAi({
      title: "Test Paper",
      abstract: "Test Abstract",
      clientIp: "127.0.0.1",
    });

    assert.equal(result.isAiAvailable, false);
    assert.equal(result.explanation, "");
    assert.ok(result.error?.includes("AI assistant is not configured"));
  } finally {
    if (originalKey) process.env.OPENROUTER_API_KEY = originalKey;
  }
});

test("isRateLimited respects sliding window threshold", () => {
  const testIp = "192.168.1.100";

  // IP should not be rate limited on first 19 requests
  for (let i = 0; i < 19; i++) {
    const limited = isRateLimited(testIp);
    assert.equal(limited, false);
  }

  // 20th request
  const twentieth = isRateLimited(testIp);
  assert.equal(twentieth, false);

  // 21st request should be rate-limited
  const twentyFirst = isRateLimited(testIp);
  assert.equal(twentyFirst, true);
});
