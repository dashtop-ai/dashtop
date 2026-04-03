"use server";

import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { parsePackage, type ParsedPackage } from "@/lib/packages/manager";
import { BLANK_DASHBOARD_CONFIG } from "@/widgets/types";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function installPackageFromFile(formData: FormData) {
  const session = await getSession();
  if (!session?.id) throw new Error("Unauthorized");

  const file = formData.get("package") as File;
  if (!file) throw new Error("No file provided");

  const data = await file.arrayBuffer();
  let pkg: ParsedPackage;

  try {
    pkg = await parsePackage(data);
  } catch (err) {
    throw new Error(
      `Invalid package: ${err instanceof Error ? err.message : "unknown error"}`
    );
  }

  const { manifest } = pkg;

  // Check if already installed
  const existing = await prisma.installedPackage.findUnique({
    where: {
      userId_packageId: {
        userId: session.id,
        packageId: manifest.id,
      },
    },
  });

  if (existing) {
    // Update existing
    await prisma.installedPackage.update({
      where: { id: existing.id },
      data: {
        version: manifest.version,
        manifest: JSON.stringify(manifest),
        payload: getPayloadJson(pkg),
        status: "active",
      },
    });
  } else {
    // Install new
    await prisma.installedPackage.create({
      data: {
        packageId: manifest.id,
        type: manifest.type,
        version: manifest.version,
        manifest: JSON.stringify(manifest),
        payload: getPayloadJson(pkg),
        status: "active",
        userId: session.id,
      },
    });
  }

  // For templates, also create a dashboard
  if (manifest.type === "template" && pkg.templatePayload) {
    await prisma.dashboard.create({
      data: {
        name: manifest.name,
        description: manifest.description,
        config: JSON.stringify(pkg.templatePayload),
        ownerId: session.id,
      },
    });
    revalidatePath("/dashboard");
    redirect("/dashboard");
  }

  revalidatePath("/settings");
}

export async function uninstallPackage(packageId: string) {
  const session = await getSession();
  if (!session?.id) throw new Error("Unauthorized");

  await prisma.installedPackage.deleteMany({
    where: {
      userId: session.id,
      packageId,
    },
  });

  revalidatePath("/settings");
}

export async function togglePackage(id: string, enabled: boolean) {
  const session = await getSession();
  if (!session?.id) throw new Error("Unauthorized");

  const pkg = await prisma.installedPackage.findUnique({ where: { id } });
  if (!pkg || pkg.userId !== session.id) throw new Error("Not found");

  await prisma.installedPackage.update({
    where: { id },
    data: { status: enabled ? "active" : "disabled" },
  });

  revalidatePath("/settings");
}

function getPayloadJson(pkg: ParsedPackage): string | null {
  if (pkg.themePayload) return JSON.stringify(pkg.themePayload);
  if (pkg.presetPayload) return JSON.stringify(pkg.presetPayload);
  if (pkg.templatePayload) return JSON.stringify(pkg.templatePayload);
  return null;
}
