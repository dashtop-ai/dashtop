import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { ProfileForm } from "./profile-form";

export default async function ProfilePage() {
  const session = await getSession();
  if (!session?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: { name: true, username: true, bio: true, email: true, image: true },
  });

  if (!user) redirect("/login");

  return <ProfileForm user={user} />;
}
