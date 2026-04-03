import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { PackagesManager } from "./packages-manager";

export default async function PackagesPage() {
  const session = await getSession();
  if (!session?.id) redirect("/login");

  const packages = await prisma.installedPackage.findMany({
    where: { userId: session.id },
    orderBy: { installedAt: "desc" },
  });

  return (
    <PackagesManager
      packages={packages.map((p) => ({
        id: p.id,
        packageId: p.packageId,
        type: p.type as "theme" | "preset" | "template" | "widget",
        version: p.version,
        manifest: JSON.parse(p.manifest),
        status: p.status,
        installedAt: p.installedAt.toISOString(),
      }))}
    />
  );
}
