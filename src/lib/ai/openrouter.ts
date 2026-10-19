interface OpenRouterMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface OpenRouterResponse {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
  error?: {
    message?: string;
    code?: number;
  };
}

// In-memory sliding window rate limiter per IP ($0 cost)
const ipRequestHistory = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS_PER_WINDOW = 20; // 20 requests per hour per IP

export function isRateLimited(clientIp: string): boolean {
  const now = Date.now();
  const timestamps = ipRequestHistory.get(clientIp) || [];
  const validTimestamps = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

  if (validTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }

  validTimestamps.push(now);
  ipRequestHistory.set(clientIp, validTimestamps);
  return false;
}

export function getAiConfig() {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const model = process.env.OPENROUTER_MODEL || "meta-llama/llama-3.3-70b-instruct:free";

  return {
    isConfigured: Boolean(apiKey && apiKey.trim().length > 0),
    model,
    provider: "OpenRouter (Zero-Cost Free Model)",
  };
}

export async function explainPaperWithAi(params: {
  title: string;
  abstract: string;
  question?: string;
  clientIp?: string;
}): Promise<{
  explanation: string;
  modelUsed: string;
  isAiAvailable: boolean;
  error?: string;
}> {
  const { isConfigured, model } = getAiConfig();

  if (!isConfigured) {
    return {
      explanation: "",
      modelUsed: "none",
      isAiAvailable: false,
      error: "AI assistant is not configured. Research Hub runs 100% free with core paper discovery. To enable free AI summaries, add an OPENROUTER_API_KEY for free models.",
    };
  }

  // Rate limit check
  if (params.clientIp && isRateLimited(params.clientIp)) {
    return {
      explanation: "",
      modelUsed: model,
      isAiAvailable: true,
      error: "Hourly free AI rate limit reached (20 requests/hr). Please wait a bit before requesting another AI summary.",
    };
  }

  // Input validation & sanitization
  const safeTitle = (params.title || "").slice(0, 300);
  const safeAbstract = (params.abstract || "").slice(0, 3000);
  if (!safeAbstract && !safeTitle) {
    return {
      explanation: "",
      modelUsed: model,
      isAiAvailable: true,
      error: "No paper title or abstract provided for AI analysis.",
    };
  }

  const prompt = params.question
    ? `Paper Title: "${safeTitle}"\nAbstract: ${safeAbstract}\n\nUser Question: ${params.question.slice(0, 300)}\n\nPlease provide a clear, concise, objective response based on the paper.`
    : `Paper Title: "${safeTitle}"\nAbstract: ${safeAbstract}\n\nPlease provide:\n1. 🎯 Plain-Language Summary (1-2 sentences for a non-specialist)\n2. 🔬 Key Methodology & Contributions (bullet points)\n3. 💡 Significance & Potential Applications`;

  const messages: OpenRouterMessage[] = [
    {
      role: "system",
      content:
        "You are the Research Hub AI Scholar Assistant. You help researchers and curious readers understand academic papers concisely, objectively, and accurately. Keep responses structured, informative, and under 350 words.",
    },
    {
      role: "user",
      content: prompt,
    },
  ];

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 18000); // 18s timeout

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://research-hub.local",
        "X-Title": "Research Hub",
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens: 500,
        temperature: 0.3,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const errText = await res.text();
      let errorMsg = `OpenRouter responded with status ${res.status}`;
      try {
        const errJson = JSON.parse(errText);
        if (errJson.error?.message) {
          errorMsg = errJson.error.message;
        }
      } catch {
        // use raw errorMsg
      }

      if (res.status === 429) {
        errorMsg = "OpenRouter free model is currently rate-limited by upstream provider. Please try again shortly.";
      }

      return {
        explanation: "",
        modelUsed: model,
        isAiAvailable: true,
        error: errorMsg,
      };
    }

    const data: OpenRouterResponse = await res.json();
    const content = data.choices?.[0]?.message?.content?.trim();

    if (!content) {
      return {
        explanation: "",
        modelUsed: model,
        isAiAvailable: true,
        error: "OpenRouter returned an empty response. Upstream free model may be overloaded.",
      };
    }

    return {
      explanation: content,
      modelUsed: model,
      isAiAvailable: true,
    };
  } catch (err: any) {
    if (err.name === "AbortError") {
      return {
        explanation: "",
        modelUsed: model,
        isAiAvailable: true,
        error: "AI request timed out after 18 seconds. Free models may experience high latency during peak hours.",
      };
    }

    return {
      explanation: "",
      modelUsed: model,
      isAiAvailable: true,
      error: `Network error communicating with OpenRouter: ${err.message || "Unknown error"}`,
    };
  }
}
