import { createDashboard } from "@/lib/actions/dashboard.actions";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutDashboard } from "lucide-react";

export default async function NewDashboardPage() {
  const templates = await prisma.dashboard.findMany({
    where: { isTemplate: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container max-w-2xl py-8">
      <h1 className="text-2xl font-bold mb-6">Create New Dashboard</h1>

      <form action={createDashboard} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Dashboard Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="My AI Dashboard"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description (optional)</Label>
          <Input
            id="description"
            name="description"
            placeholder="A short description of your dashboard"
          />
        </div>

        {templates.length > 0 && (
          <div className="space-y-3">
            <Label>Start from a template (optional)</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {templates.map((template) => (
                <label key={template.id}>
                  <input
                    type="radio"
                    name="templateId"
                    value={template.id}
                    className="peer sr-only"
                  />
                  <Card className="cursor-pointer peer-checked:border-primary transition-colors hover:border-primary/50">
                    <CardHeader className="p-3">
                      <CardTitle className="text-sm">{template.name}</CardTitle>
                      <CardDescription className="text-xs">
                        {template.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </label>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <Button type="submit">
            <LayoutDashboard className="h-4 w-4 mr-1" />
            Create Dashboard
          </Button>
        </div>
      </form>
    </div>
  );
}
