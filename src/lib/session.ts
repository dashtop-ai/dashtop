import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { prisma } from "./prisma";

const JWT_SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || "fallback-secret-change-me"
);

export interface SessionUser {
  id: string;
  name: string | null;
  provider: string;
  keyPrefix: string;
}

export async function getSession(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("dashtop-session")?.value;
    if (!token) return null;

    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      id: payload.id as string,
      name: payload.name as string | null,
      provider: payload.provider as string,
      keyPrefix: payload.keyPrefix as string,
    };
  } catch {
    return null;
  }
}

/**
 * Get the user's API key for a specific provider.
 * Used by widgets to make real AI API calls.
 */
export async function getUserApiKey(
  userId: string,
  provider?: string
): Promise<string | null> {
  const key = await prisma.apiKey.findFirst({
    where: {
      userId,
      ...(provider && { provider }),
    },
    orderBy: { createdAt: "desc" },
  });
  return key?.encryptedKey || null;
}
