"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateProfile(data: {
  name?: string;
  username?: string;
  bio?: string;
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  // Check username uniqueness
  if (data.username) {
    const existing = await prisma.user.findUnique({
      where: { username: data.username },
    });
    if (existing && existing.id !== session.user.id) {
      throw new Error("Username is already taken");
    }
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.username !== undefined && { username: data.username }),
      ...(data.bio !== undefined && { bio: data.bio }),
    },
  });

  revalidatePath("/settings/profile");
}

export async function becomeCreator() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await prisma.user.update({
    where: { id: session.user.id },
    data: { isCreator: true },
  });

  revalidatePath("/settings/creator");
}
