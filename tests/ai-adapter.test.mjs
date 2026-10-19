import test from "node:test";
import assert from "node:assert/strict";
import { getAiConfig, isRateLimited, explainPaperWithAi } from "../src/lib/ai/openrouter.ts";

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
    assert.equal(result.statusCode, 503);
  } finally {
    if (originalKey) process.env.OPENROUTER_API_KEY = originalKey;
  }
});

test("paid model configuration is rejected before contacting OpenRouter", async () => {
  const originalKey = process.env.OPENROUTER_API_KEY;
  const originalModel = process.env.OPENROUTER_MODEL;
  process.env.OPENROUTER_API_KEY = "test-key-not-a-credential";
  process.env.OPENROUTER_MODEL = "openai/example-paid-model";
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => { throw new Error("Fetch should not be called for a paid model"); };

  try {
    const result = await explainPaperWithAi({ title: "Test paper", abstract: "Test abstract" });
    assert.equal(getAiConfig().isConfigured, false);
    assert.equal(result.statusCode, 503);
    assert.match(result.error || "", /not marked as free/i);
  } finally {
    globalThis.fetch = originalFetch;
    if (originalKey === undefined) delete process.env.OPENROUTER_API_KEY;
    else process.env.OPENROUTER_API_KEY = originalKey;
    if (originalModel === undefined) delete process.env.OPENROUTER_MODEL;
    else process.env.OPENROUTER_MODEL = originalModel;
  }
});

test("abstract-based explanation sends a free model request and returns its response", async () => {
  const originalKey = process.env.OPENROUTER_API_KEY;
  const originalModel = process.env.OPENROUTER_MODEL;
  const originalFetch = globalThis.fetch;
  process.env.OPENROUTER_API_KEY = "test-key-not-a-credential";
  process.env.OPENROUTER_MODEL = "openrouter/free";
  let requestBody;
  globalThis.fetch = async (url, options) => {
    assert.equal(url, "https://openrouter.ai/api/v1/chat/completions");
    assert.equal(options.headers.Authorization, "Bearer test-key-not-a-credential");
    requestBody = JSON.parse(options.body);
    return new Response(JSON.stringify({ choices: [{ message: { content: "Abstract-based explanation." } }] }), { status: 200 });
  };

  try {
    const result = await explainPaperWithAi({ title: "Test paper", abstract: "A test abstract." });
    assert.equal(requestBody.model, "openrouter/free");
    assert.match(requestBody.messages[1].content, /title and abstract metadata only/i);
    assert.equal(result.explanation, "Abstract-based explanation.");
    assert.equal(result.statusCode, undefined);
  } finally {
    globalThis.fetch = originalFetch;
    if (originalKey === undefined) delete process.env.OPENROUTER_API_KEY;
    else process.env.OPENROUTER_API_KEY = originalKey;
    if (originalModel === undefined) delete process.env.OPENROUTER_MODEL;
    else process.env.OPENROUTER_MODEL = originalModel;
  }
});

test("provider rate limits return a useful 429 without exposing provider details", async () => {
  const originalKey = process.env.OPENROUTER_API_KEY;
  const originalModel = process.env.OPENROUTER_MODEL;
  const originalFetch = globalThis.fetch;
  process.env.OPENROUTER_API_KEY = "test-key-not-a-credential";
  process.env.OPENROUTER_MODEL = "openrouter/free";
  globalThis.fetch = async () => new Response("private provider error", { status: 429 });

  try {
    const result = await explainPaperWithAi({ title: "Test paper", abstract: "Test abstract" });
    assert.equal(result.statusCode, 429);
    assert.match(result.error || "", /busy or rate-limited/i);
    assert.doesNotMatch(result.error || "", /private provider error/);
  } finally {
    globalThis.fetch = originalFetch;
    if (originalKey === undefined) delete process.env.OPENROUTER_API_KEY;
    else process.env.OPENROUTER_API_KEY = originalKey;
    if (originalModel === undefined) delete process.env.OPENROUTER_MODEL;
    else process.env.OPENROUTER_MODEL = originalModel;
  }
});

test("unreadable provider JSON returns a safe upstream error", async () => {
  const originalKey = process.env.OPENROUTER_API_KEY;
  const originalModel = process.env.OPENROUTER_MODEL;
  const originalFetch = globalThis.fetch;
  process.env.OPENROUTER_API_KEY = "test-key-not-a-credential";
  process.env.OPENROUTER_MODEL = "openrouter/free";
  globalThis.fetch = async () => new Response("not-json", { status: 200 });

  try {
    const result = await explainPaperWithAi({ title: "Test paper", abstract: "Test abstract" });
    assert.equal(result.statusCode, 502);
    assert.match(result.error || "", /unreadable response/i);
  } finally {
    globalThis.fetch = originalFetch;
    if (originalKey === undefined) delete process.env.OPENROUTER_API_KEY;
    else process.env.OPENROUTER_API_KEY = originalKey;
    if (originalModel === undefined) delete process.env.OPENROUTER_MODEL;
    else process.env.OPENROUTER_MODEL = originalModel;
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
