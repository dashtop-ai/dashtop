import { NextResponse } from "next/server";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";
import { SignJWT } from "jose";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

const JWT_SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || "fallback-secret-change-me"
);

/**
 * Auto-detect Claude Code or Codex credentials from local machine.
 * No login needed — if you have Claude Code running, you're in.
 */
export async function GET() {
  // Try to find Claude Code credentials
  let apiKey: string | null = null;
  let provider = "anthropic";

  // 1. Check ANTHROPIC_API_KEY env var (set by user or in .env)
  if (process.env.ANTHROPIC_API_KEY) {
    apiKey = process.env.ANTHROPIC_API_KEY;
    provider = "anthropic";
  }

  // 2. Check Claude Code credentials — look for a real API key first,
  //    fall back to OAuth token (which won't work for API calls yet)
  if (!apiKey) {
    try {
      const credPath = join(homedir(), ".claude", ".credentials.json");
      const creds = JSON.parse(readFileSync(credPath, "utf-8"));

      // Prefer a real API key if stored
      if (creds?.anthropicApiKey) {
        apiKey = creds.anthropicApiKey;
        provider = "anthropic";
      }
      // OAuth token detected — we know who you are but can't make API calls yet
      else if (creds?.claudeAiOauth?.accessToken) {
        // Still authenticate the user (so they see the dashboard)
        // but flag that API calls won't work until they add a real key
        apiKey = creds.claudeAiOauth.accessToken;
        provider = "anthropic";
      }
    } catch {
      // No Claude Code credentials found
    }
  }

  // 3. Check OPENAI_API_KEY env var
  if (!apiKey && process.env.OPENAI_API_KEY) {
    apiKey = process.env.OPENAI_API_KEY;
    provider = "openai";
  }

  if (!apiKey) {
    return NextResponse.json({ authenticated: false });
  }

  // Hash key for stable user ID
  const keyHash = await hashKey(apiKey);
  const keyPrefix = apiKey.slice(0, 12) + "..." + apiKey.slice(-4);

  // Find or create user
  let user = await prisma.user.findFirst({
    where: {
      accounts: {
        some: {
          provider,
          providerAccountId: keyHash,
        },
      },
    },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        name: provider === "anthropic" ? "Claude Code User" : "Codex User",
        username: `${provider}-${keyHash.slice(0, 8)}`,
        accounts: {
          create: {
            type: "apikey",
            provider,
            providerAccountId: keyHash,
          },
        },
        apiKeys: {
          create: {
            name: provider === "anthropic" ? "Anthropic (Claude Code)" : "OpenAI (Codex)",
            provider,
            encryptedKey: apiKey,
          },
        },
      },
    });
  } else {
    // Update API key
    await prisma.apiKey.updateMany({
      where: { userId: user.id, provider },
      data: { encryptedKey: apiKey },
    });
  }

  // Create JWT
  const token = await new SignJWT({
    id: user.id,
    name: user.name,
    provider,
    keyPrefix,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("30d")
    .sign(JWT_SECRET);

  const cookieStore = await cookies();
  cookieStore.set("dashtop-session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60,
    path: "/",
  });

  return NextResponse.json({
    authenticated: true,
    provider,
    keyPrefix,
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
