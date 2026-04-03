"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { dashboardCreateSchema } from "@/lib/validations/dashboard";
import { BLANK_DASHBOARD_CONFIG } from "@/widgets/types";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createDashboard(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const parsed = dashboardCreateSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description") || undefined,
    templateId: formData.get("templateId") || undefined,
  });

  if (!parsed.success) {
    throw new Error("Invalid input");
  }

  let config = JSON.stringify(BLANK_DASHBOARD_CONFIG);

  // Clone from template if provided
  if (parsed.data.templateId) {
    const template = await prisma.dashboard.findUnique({
      where: { id: parsed.data.templateId, isTemplate: true },
    });
    if (template) {
      config = template.config;
    }
  }

  const dashboard = await prisma.dashboard.create({
    data: {
      name: parsed.data.name,
      description: parsed.data.description || null,
      config,
      ownerId: session.user.id,
    },
  });

  revalidatePath("/dashboard");
  redirect(`/dashboard/${dashboard.id}`);
}

export async function updateDashboardConfig(
  dashboardId: string,
  config: string
) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const dashboard = await prisma.dashboard.findUnique({
    where: { id: dashboardId },
  });
  if (!dashboard || dashboard.ownerId !== session.user.id) {
    throw new Error("Forbidden");
  }

  await prisma.dashboard.update({
    where: { id: dashboardId },
    data: { config, updatedAt: new Date() },
  });

  revalidatePath(`/dashboard/${dashboardId}`);
}

export async function updateDashboardSettings(
  dashboardId: string,
  data: { name?: string; description?: string; theme?: string; visibility?: string }
) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const dashboard = await prisma.dashboard.findUnique({
    where: { id: dashboardId },
  });
  if (!dashboard || dashboard.ownerId !== session.user.id) {
    throw new Error("Forbidden");
  }

  await prisma.dashboard.update({
    where: { id: dashboardId },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.theme && { theme: data.theme }),
      ...(data.visibility && { visibility: data.visibility }),
      updatedAt: new Date(),
    },
  });

  revalidatePath(`/dashboard/${dashboardId}`);
}

export async function deleteDashboard(dashboardId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const dashboard = await prisma.dashboard.findUnique({
    where: { id: dashboardId },
  });
  if (!dashboard || dashboard.ownerId !== session.user.id) {
    throw new Error("Forbidden");
  }

  await prisma.dashboard.delete({ where: { id: dashboardId } });

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function duplicateDashboard(dashboardId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const source = await prisma.dashboard.findUnique({
    where: { id: dashboardId },
  });
  if (!source) throw new Error("Dashboard not found");

  const dashboard = await prisma.dashboard.create({
    data: {
      name: `${source.name} (copy)`,
      description: source.description,
      config: source.config,
      theme: source.theme,
      ownerId: session.user.id,
    },
  });

  revalidatePath("/dashboard");
  redirect(`/dashboard/${dashboard.id}`);
}
