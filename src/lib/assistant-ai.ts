/**
 * Talks to an AI service. Works with Anthropic (Claude), OpenAI, Google Gemini, Groq and OpenRouter:
 * set AI_API_KEY and the service is picked from the key. AI_PROVIDER, AI_MODEL and AI_BASE_URL are optional.
 */
export type ChatMessage = { role: "user" | "assistant"; content: string };

type Provider = "anthropic" | "openai" | "gemini" | "groq" | "openrouter";

interface AiConfig {
  provider: Provider;
  key: string;
  model: string;
  baseUrl: string;
}

const DEFAULT_MODEL: Record<Provider, string> = {
  anthropic: "claude-haiku-5-5",
  openai: "gpt-4o-mini",
  gemini: "gemini-2.5-flash",
  groq: "llama-3.1-8b-instant",
  openrouter: "openai/gpt-4o-mini",
};

const DEFAULT_BASE: Record<Provider, string> = {
  anthropic: "https://api.anthropic.com",
  openai: "https://api.openai.com/v1",
  gemini: "https://generativelanguage.googleapis.com",
  groq: "https://api.groq.com/openai/v1",
  openrouter: "https://openrouter.ai/api/v1",
};

export class UpstreamError extends Error {
  constructor(
    public status: number,
    detail: string,
  ) {
    super(`AI request failed (${status}): ${detail}`);
    this.name = "UpstreamError";
  }
}

export class UpstreamBusyError extends Error {
  constructor(message = "The AI service is busy.") {
    super(message);
    this.name = "UpstreamBusyError";
  }
}

export function aiConfig(): AiConfig | null {
  const key = (process.env.AI_API_KEY || "").trim().replace(/^["']|["']$/g, "").trim();
  if (!key) return null;

  const named = (process.env.AI_PROVIDER || "").trim().toLowerCase() as Provider;
  const detected: Provider = key.startsWith("sk-ant-")
    ? "anthropic"
    : key.startsWith("AIza") || key.startsWith("AQ.")
      ? "gemini"
      : key.startsWith("gsk_")
        ? "groq"
        : key.startsWith("sk-or-")
          ? "openrouter"
          : "openai";
  const provider = named in DEFAULT_MODEL ? named : detected;

  return {
    provider,
    key,
    model: (process.env.AI_MODEL || "").trim() || DEFAULT_MODEL[provider],
    baseUrl: ((process.env.AI_BASE_URL || "").trim() || DEFAULT_BASE[provider]).replace(/\/+$/, ""),
  };
}

// Room for a full answer. Gemini 2.5 models also count their hidden "thinking" against this, so thinking is switched off below.
const MAX_TOKENS = 700;

async function post(url: string, headers: Record<string, string>, body: unknown): Promise<unknown> {
  for (let attempt = 0; attempt < 2; attempt++) {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...headers },
      body: JSON.stringify(body),
      cache: "no-store",
      signal: AbortSignal.timeout(20_000),
    });
    if (res.ok) return res.json();

    // Too many requests: wait a moment once, then give up so the visitor still gets an answer.
    if (res.status === 429 || res.status === 503 || res.status === 529) {
      const wait = Math.min(Number(res.headers.get("retry-after")) || 1.5, 3);
      if (attempt === 0) {
        await new Promise((r) => setTimeout(r, wait * 1000));
        continue;
      }
      throw new UpstreamBusyError();
    }
    const detail = await res.text().catch(() => "");
    throw new UpstreamError(res.status, detail.slice(0, 200));
  }
  throw new UpstreamBusyError();
}

/** Other models of the same service to try when the chosen name is not found. */
const ALTERNATES: Partial<Record<Provider, string[]>> = {
  gemini: ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-flash-latest"],
};

/** Sends the conversation and returns the assistant's reply text. */
export async function askModel(cfg: AiConfig, system: string, messages: ChatMessage[]): Promise<string> {
  const tried = new Set<string>();
  const names = [cfg.model, ...(ALTERNATES[cfg.provider] ?? [])];
  let lastError: unknown;
  for (const model of names) {
    if (tried.has(model)) continue;
    tried.add(model);
    try {
      return await askOnce({ ...cfg, model }, system, messages);
    } catch (error) {
      lastError = error;
      // Only a missing or unsupported model name is worth trying again with another model.
      if (!(error instanceof UpstreamError) || (error.status !== 404 && error.status !== 400)) throw error;
    }
  }
  throw lastError;
}

async function askOnce(cfg: AiConfig, system: string, messages: ChatMessage[]): Promise<string> {
  if (cfg.provider === "anthropic") {
    const data = (await post(
      `${cfg.baseUrl}/v1/messages`,
      { "x-api-key": cfg.key, "anthropic-version": "2023-06-01" },
      {
        model: cfg.model,
        max_tokens: MAX_TOKENS,
        temperature: 0.2,
        // The long company text is cached by Anthropic, so repeat questions are cheaper and quicker.
        system: [{ type: "text", text: system, cache_control: { type: "ephemeral" } }],
        messages,
      },
    )) as { content?: { type: string; text?: string }[] };
    return (data.content ?? []).map((b) => b.text ?? "").join("").trim();
  }

  if (cfg.provider === "gemini") {
    const data = (await post(
      `${cfg.baseUrl}/v1beta/models/${encodeURIComponent(cfg.model)}:generateContent`,
      { "x-goog-api-key": cfg.key },
      {
        systemInstruction: { parts: [{ text: system }] },
        contents: messages.map((m) => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] })),
        generationConfig: {
          maxOutputTokens: MAX_TOKENS,
          temperature: 0.2,
          // Short factual answers do not need thinking, and thinking is what used up the budget and cut answers off.
          ...(/gemini-2\.5-flash/.test(cfg.model) ? { thinkingConfig: { thinkingBudget: 0 } } : {}),
        },
      },
    )) as { candidates?: { content?: { parts?: { text?: string }[] } }[] };
    return (data.candidates?.[0]?.content?.parts ?? []).map((p) => p.text ?? "").join("").trim();
  }

  // OpenAI and every service that speaks the same format (Groq, OpenRouter and others).
  const data = (await post(
    `${cfg.baseUrl}/chat/completions`,
    { Authorization: `Bearer ${cfg.key}` },
    {
      model: cfg.model,
      max_tokens: MAX_TOKENS,
      temperature: 0.2,
      messages: [{ role: "system", content: system }, ...messages],
    },
  )) as { choices?: { message?: { content?: string } }[] };
  return (data.choices?.[0]?.message?.content ?? "").trim();
}
