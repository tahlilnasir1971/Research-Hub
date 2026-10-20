interface OpenRouterMessage {
  role: "system" | "user";
  content: string;
}

interface OpenRouterResponse {
  choices?: Array<{ message?: { content?: string | null } }>;
}

export type AnalysisMode = "overview" | "methodology" | "critical_evaluation" | "roadmap" | "qa";

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 20;
const MAX_RESPONSE_BYTES = 32_000;
const requestHistory = new Map<string, number[]>();

export function isRateLimited(clientIp: string): boolean {
  const now = Date.now();
  const timestamps = (requestHistory.get(clientIp) || []).filter((time) => now - time < RATE_LIMIT_WINDOW_MS);
  if (timestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    requestHistory.set(clientIp, timestamps);
    return true;
  }
  timestamps.push(now);
  requestHistory.set(clientIp, timestamps);

  // Keep the in-memory limiter bounded when many distinct IPs visit a serverless instance.
  if (requestHistory.size > 2_000) {
    requestHistory.forEach((history, ip) => {
      if (!history.some((time) => now - time < RATE_LIMIT_WINDOW_MS)) requestHistory.delete(ip);
    });
  }
  return false;
}

function configuredModel() {
  return (process.env.OPENROUTER_MODEL || "openrouter/free").trim();
}

export function getAiConfig() {
  const model = configuredModel();
  const hasKey = Boolean(process.env.OPENROUTER_API_KEY?.trim());
  const isFreeModel = model === "openrouter/free" || model.endsWith(":free");
  return {
    isConfigured: hasKey && isFreeModel,
    model,
    provider: "OpenRouter",
  };
}

export type ExplainResult = {
  explanation: string;
  modelUsed: string;
  isAiAvailable: boolean;
  error?: string;
  statusCode?: number;
  mode?: AnalysisMode;
};

export async function explainPaperWithAi(params: {
  title?: string;
  abstract?: string;
  question?: string;
  mode?: AnalysisMode;
  clientIp?: string;
}): Promise<ExplainResult> {
  const { model } = getAiConfig();
  const apiKey = process.env.OPENROUTER_API_KEY?.trim();

  if (!apiKey) {
    return {
      explanation: "",
      modelUsed: model,
      isAiAvailable: false,
      error: "AI assistant is not configured. Add OPENROUTER_API_KEY to the server’s local environment file to enable the companion.",
      statusCode: 503,
    };
  }
  if (model !== "openrouter/free" && !model.endsWith(":free")) {
    return {
      explanation: "",
      modelUsed: model,
      isAiAvailable: false,
      error: "The configured model is not marked as free. Set OPENROUTER_MODEL to openrouter/free or a supported model ending in :free.",
      statusCode: 503,
    };
  }

  const title = typeof params.title === "string" ? params.title.trim() : "";
  const abstract = typeof params.abstract === "string" ? params.abstract.trim() : "";
  const question = typeof params.question === "string" ? params.question.trim() : "";
  const mode = params.mode || (question ? "qa" : "overview");

  if (!title && !abstract) {
    return {
      explanation: "",
      modelUsed: model,
      isAiAvailable: true,
      error: "Provide a paper title or abstract to start an explanation.",
      statusCode: 400,
    };
  }
  if (title.length > 300 || abstract.length > 6_000 || question.length > 500) {
    return {
      explanation: "",
      modelUsed: model,
      isAiAvailable: true,
      error: "This request is too long. Shorten the title, abstract, or question and try again.",
      statusCode: 400,
    };
  }
  if (params.clientIp && isRateLimited(params.clientIp)) {
    return {
      explanation: "",
      modelUsed: model,
      isAiAvailable: true,
      error: "The local AI request limit has been reached. Please wait before trying again.",
      statusCode: 429,
    };
  }

  let promptInstruction = "";
  if (question || mode === "qa") {
    promptInstruction = question
      ? `Reader's question: ${question}`
      : "Explain the research question, approach, main claims, and limitations described in the abstract.";
  } else if (mode === "methodology") {
    promptInstruction = `Provide a researcher-level methodological breakdown of this work:
1. **Algorithmic / Theoretical Framework**: How the method or model is constructed.
2. **Mathematical Formulations & Symbols**: Core mathematical notation, objectives, or assumptions described.
3. **Implementation & Complexity**: Algorithmic complexity, compute, or design considerations indicated in the text.`;
  } else if (mode === "critical_evaluation") {
    promptInstruction = `Provide an objective critical evaluation of this research:
1. **Demonstrated Evidence**: What was actually empirically or theoretically established vs. claims.
2. **Assumptions & Limitations**: Key constraints or unaddressed scenarios stated by the authors.
3. **Reproducibility**: What code, datasets, or experimental details are required to reproduce this work.`;
  } else if (mode === "roadmap") {
    promptInstruction = `Provide a structured learning pathway and research extensions:
1. **Prerequisites**: Essential mathematics, programming, or domain theory needed before reading this paper.
2. **Foundational Pathway**: Recommended sequence of prerequisite concepts to master this domain.
3. **Plausible Extensions**: Reasonable scientific directions or hypotheses to explore next (labeled as hypotheses).
4. **Critical Reader Questions**: 3 rigorous questions a researcher should investigate when reviewing this paper.`;
  } else {
    // default overview
    promptInstruction = "Explain the research question, approach, main claims, and limitations described in the abstract.";
  }

  const prompt = [
    `Paper title: ${title || "Unavailable"}`,
    `Abstract: ${abstract || "Unavailable"}`,
    promptInstruction,
    "The source provided is title and abstract metadata only. Label the response as abstract-based. Do not imply that you read the full paper. Separate what the abstract states from interpretation, and say when a detail is not available.",
  ].join("\n\n");

  const messages: OpenRouterMessage[] = [
    {
      role: "system",
      content:
        "You are Research Hub's careful academic reading assistant. Be clear, accurate, and appropriately cautious. Use headings and structured lists when helpful. Base paper-specific statements only on the supplied title and abstract; do not invent equations, methods, results, citations, quotations, or limitations. Keep the answer under 600 words.",
    },
    { role: "user", content: prompt },
  ];

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 25_000);
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://research-hub.local",
        "X-Title": "Research Hub",
      },
      body: JSON.stringify({ model, messages, max_tokens: 750, temperature: 0.2 }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const friendly: Record<number, string> = {
        401: "OpenRouter did not accept the configured API key. Check OPENROUTER_API_KEY on the server.",
        402: "OpenRouter reports that this key or model has no available credits. Check the account and model quota; Research Hub did not switch to a paid model.",
        403: "OpenRouter rejected this request. Check the key’s access and model availability.",
        429: "The selected free model is busy or rate-limited. Wait a little and retry.",
      };
      const statusCode =
        response.status === 429
          ? 429
          : response.status === 401 || response.status === 402 || response.status === 403
          ? 503
          : 502;
      return {
        explanation: "",
        modelUsed: model,
        isAiAvailable: true,
        error: friendly[response.status] || "OpenRouter could not complete this request. Please retry later.",
        statusCode,
        mode,
      };
    }

    const contentLength = Number(response.headers.get("content-length") || 0);
    if (contentLength > MAX_RESPONSE_BYTES) {
      return {
        explanation: "",
        modelUsed: model,
        isAiAvailable: true,
        error: "The AI response was larger than expected. Please retry with a shorter question.",
        statusCode: 502,
        mode,
      };
    }
    const raw = await response.text();
    if (new TextEncoder().encode(raw).byteLength > MAX_RESPONSE_BYTES) {
      return {
        explanation: "",
        modelUsed: model,
        isAiAvailable: true,
        error: "The AI response was larger than expected. Please retry with a shorter question.",
        statusCode: 502,
        mode,
      };
    }
    let data: OpenRouterResponse;
    try {
      data = JSON.parse(raw) as OpenRouterResponse;
    } catch {
      return {
        explanation: "",
        modelUsed: model,
        isAiAvailable: true,
        error: "OpenRouter returned an unreadable response. Please retry in a moment.",
        statusCode: 502,
        mode,
      };
    }
    const content = data.choices?.[0]?.message?.content;
    if (typeof content !== "string" || !content.trim()) {
      return {
        explanation: "",
        modelUsed: model,
        isAiAvailable: true,
        error: "The model returned an empty response. Please retry in a moment.",
        statusCode: 502,
        mode,
      };
    }
    const explanation = content.trim();
    return { explanation, modelUsed: model, isAiAvailable: true, mode };
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return {
        explanation: "",
        modelUsed: model,
        isAiAvailable: true,
        error: "The AI request took too long. Please try again.",
        statusCode: 504,
        mode,
      };
    }
    return {
      explanation: "",
      modelUsed: model,
      isAiAvailable: true,
      error: "Research Hub could not reach OpenRouter. Check your connection and retry.",
      statusCode: 502,
      mode,
    };
  } finally {
    clearTimeout(timeoutId);
  }
}
