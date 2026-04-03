import { NextRequest } from "next/server";
import { getSession, getUserApiKey } from "@/lib/session";

// System prompts per app context
const SYSTEM_PROMPTS: Record<string, string> = {
  chat: "You are a helpful AI assistant on Dashtop. Be concise and direct. You can help with coding, research, writing, analysis, and general questions.",
  news: "You are a news AI assistant. When the user asks about a topic, provide a brief summary of recent developments. When they ask to search, summarize what you know. When they add a source, acknowledge it. Keep responses to 2-3 sentences.",
  notes: "You are a notes assistant. Help the user organize, summarize, and manage their notes. When they add a note, confirm it. When they ask to organize, suggest structure. Keep responses short and actionable.",
};

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return new Response(JSON.stringify({ error: "Not authenticated" }), {
      status: 401,
    });
  }

  const { message, appId, history } = await request.json();
  if (!message) {
    return new Response(JSON.stringify({ error: "Message required" }), {
      status: 400,
    });
  }

  // Get user's API key
  const apiKey = await getUserApiKey(session.id);
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "No API key found. Please log in again." }),
      { status: 400 }
    );
  }

  const systemPrompt = SYSTEM_PROMPTS[appId] || SYSTEM_PROMPTS.chat;

  // Build message history
  const messages = [
    ...(history || []).map((m: { role: string; text: string }) => ({
      role: m.role === "user" ? "user" : "assistant",
      content: m.text,
    })),
    { role: "user", content: message },
  ];

  // OAuth tokens can't call the API — need a real key
  if (apiKey.startsWith("sk-ant-oat01-")) {
    return new Response(
      JSON.stringify({
        error:
          "You're signed in via Claude Code, but the Anthropic API needs an API key (not OAuth). Add ANTHROPIC_API_KEY to your .env file. Get one at console.anthropic.com/settings/keys",
      }),
      { status: 400 }
    );
  }

  // Detect provider from key
  if (apiKey.startsWith("sk-ant-")) {
    return callAnthropic(apiKey, systemPrompt, messages);
  } else if (apiKey.startsWith("sk-")) {
    return callOpenAI(apiKey, systemPrompt, messages);
  }

  return new Response(JSON.stringify({ error: "Unknown API key format" }), {
    status: 400,
  });
}

async function callAnthropic(
  apiKey: string,
  systemPrompt: string,
  messages: { role: string; content: string }[]
) {
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 512,
        system: systemPrompt,
        messages,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return new Response(
        JSON.stringify({
          error: err.error?.message || `Anthropic API error: ${res.status}`,
        }),
        { status: res.status }
      );
    }

    const data = await res.json();
    const text =
      data.content?.[0]?.text || "I couldn't generate a response.";

    return new Response(JSON.stringify({ text, provider: "anthropic" }));
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: err instanceof Error ? err.message : "Failed to call Anthropic",
      }),
      { status: 500 }
    );
  }
}

async function callOpenAI(
  apiKey: string,
  systemPrompt: string,
  messages: { role: string; content: string }[]
) {
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        max_tokens: 512,
        messages: [{ role: "system", content: systemPrompt }, ...messages],
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return new Response(
        JSON.stringify({
          error: err.error?.message || `OpenAI API error: ${res.status}`,
        }),
        { status: res.status }
      );
    }

    const data = await res.json();
    const text =
      data.choices?.[0]?.message?.content || "I couldn't generate a response.";

    return new Response(JSON.stringify({ text, provider: "openai" }));
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: err instanceof Error ? err.message : "Failed to call OpenAI",
      }),
      { status: 500 }
    );
  }
}
