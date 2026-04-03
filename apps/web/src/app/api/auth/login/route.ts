import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SignJWT } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || "fallback-secret-change-me"
);

interface ProviderValidation {
  valid: boolean;
  name?: string;
  email?: string;
  provider: string;
  keyPrefix: string;
}

async function validateAnthropicKey(apiKey: string): Promise<ProviderValidation> {
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
        max_tokens: 1,
        messages: [{ role: "user", content: "hi" }],
      }),
    });
    // 200 = valid key, 401 = invalid, other errors = valid key but different issue
    if (res.status === 401) return { valid: false, provider: "anthropic", keyPrefix: "" };
    return {
      valid: true,
      provider: "anthropic",
      name: "Claude User",
      keyPrefix: apiKey.slice(0, 10) + "..." + apiKey.slice(-4),
    };
  } catch {
    return { valid: false, provider: "anthropic", keyPrefix: "" };
  }
}

async function validateOpenAIKey(apiKey: string): Promise<ProviderValidation> {
  try {
    const res = await fetch("https://api.openai.com/v1/models", {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    if (res.status === 401) return { valid: false, provider: "openai", keyPrefix: "" };
    return {
      valid: true,
      provider: "openai",
      name: "OpenAI User",
      keyPrefix: apiKey.slice(0, 7) + "..." + apiKey.slice(-4),
    };
  } catch {
    return { valid: false, provider: "openai", keyPrefix: "" };
  }
}

export async function POST(request: NextRequest) {
  const { apiKey } = await request.json();

  if (!apiKey || typeof apiKey !== "string") {
    return NextResponse.json({ error: "API key required" }, { status: 400 });
  }

  // Detect provider from key format
  let validation: ProviderValidation;
  if (apiKey.startsWith("sk-ant-")) {
    validation = await validateAnthropicKey(apiKey);
  } else if (apiKey.startsWith("sk-")) {
    validation = await validateOpenAIKey(apiKey);
  } else {
    return NextResponse.json(
      { error: "Unrecognized API key format. Use an Anthropic (sk-ant-...) or OpenAI (sk-...) key." },
      { status: 400 }
    );
  }

  if (!validation.valid) {
    return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
  }

  // Create a stable user ID from key prefix (hashed)
  const keyHash = await hashKey(apiKey);

  // Find or create user
  let user = await prisma.user.findFirst({
    where: {
      accounts: {
        some: {
          provider: validation.provider,
          providerAccountId: keyHash,
        },
      },
    },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        name: validation.name,
        username: `${validation.provider}-${keyHash.slice(0, 8)}`,
        accounts: {
          create: {
            type: "apikey",
            provider: validation.provider,
            providerAccountId: keyHash,
          },
        },
        apiKeys: {
          create: {
            name: validation.provider === "anthropic" ? "Anthropic" : "OpenAI",
            provider: validation.provider,
            encryptedKey: apiKey, // In production: encrypt this
          },
        },
      },
    });
  } else {
    // Update API key in case it changed
    await prisma.apiKey.updateMany({
      where: { userId: user.id, provider: validation.provider },
      data: { encryptedKey: apiKey },
    });
  }

  // Create JWT session token
  const token = await new SignJWT({
    id: user.id,
    name: user.name,
    provider: validation.provider,
    keyPrefix: validation.keyPrefix,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("30d")
    .sign(JWT_SECRET);

  // Set session cookie
  const cookieStore = await cookies();
  cookieStore.set("dashtop-session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    path: "/",
  });

  return NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      provider: validation.provider,
      keyPrefix: validation.keyPrefix,
    },
  });
}

async function hashKey(key: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(key);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
