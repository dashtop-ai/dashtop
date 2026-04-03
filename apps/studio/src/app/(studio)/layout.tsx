import { StudioSidebar } from "@/components/layout/studio-sidebar";

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <StudioSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-6xl p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
