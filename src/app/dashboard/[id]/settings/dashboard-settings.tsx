"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Download, Upload, Trash2, Rocket, Package, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  updateDashboardSettings,
  deleteDashboard,
} from "@/lib/actions/dashboard.actions";
import { DASHBOARD_THEMES, getThemeById } from "@/config/themes";
import { MARKETPLACE_CATEGORIES } from "@/config/categories";
import { publishToMarketplace } from "@/lib/actions/publish.actions";
import { buildPackage, generatePackageId, getPackageFilename } from "@/lib/packages/manager";
import type { DashtopManifest } from "@/lib/packages/types";
import { toast } from "sonner";

interface DashboardSettingsProps {
  dashboard: {
    id: string;
    name: string;
    description: string;
    theme: string;
    visibility: "private" | "public" | "unlisted";
    config: string;
  };
}

export function DashboardSettings({ dashboard }: DashboardSettingsProps) {
  const [name, setName] = useState(dashboard.name);
  const [description, setDescription] = useState(dashboard.description);
  const [theme, setTheme] = useState(dashboard.theme);
  const [visibility, setVisibility] = useState(dashboard.visibility);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateDashboardSettings(dashboard.id, {
        name,
        description,
        theme,
        visibility,
      });
      toast.success("Settings saved");
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleExport = () => {
    const blob = new Blob([dashboard.config], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${name.toLowerCase().replace(/\s+/g, "-")}.dashtop.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Dashboard exported");
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      try {
        const text = await file.text();
        JSON.parse(text); // validate JSON
        toast.success("Config imported — save to apply");
      } catch {
        toast.error("Invalid JSON file");
      }
    };
    input.click();
  };

  return (
    <div className="container max-w-2xl py-8">
      <div className="flex items-center gap-3 mb-6">
        <Button
          variant="ghost"
          size="icon"
          render={<Link href={`/dashboard/${dashboard.id}`} />}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Dashboard Settings</h1>
          <p className="text-sm text-muted-foreground">{dashboard.name}</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* General */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">General</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="desc">Description</Label>
              <Textarea
                id="desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Visibility</Label>
              <Select
                value={visibility}
                onValueChange={(v) =>
                  v && setVisibility(v as "private" | "public" | "unlisted")
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="private">Private</SelectItem>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="unlisted">Unlisted</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Theme */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Theme</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {DASHBOARD_THEMES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`rounded-lg border-2 p-3 text-left transition-colors ${
                    theme === t.id
                      ? "border-primary"
                      : "border-transparent hover:border-muted"
                  }`}
                >
                  <div className="flex gap-1 mb-2">
                    {Object.values(t.colors)
                      .slice(0, 4)
                      .map((color, i) => (
                        <div
                          key={i}
                          className="w-4 h-4 rounded-full border"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                  </div>
                  <div className="text-sm font-medium">{t.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {t.description}
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Export / Import */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Data</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleExport} className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Export JSON
              </Button>
              <Button variant="outline" onClick={handleImport} className="flex-1">
                <Upload className="h-4 w-4 mr-2" />
                Import Config
              </Button>
            </div>
            <Separator className="my-3" />
            <p className="text-xs font-medium mb-2">Export as .dashtop Package</p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={async () => {
                  const currentTheme = getThemeById(theme);
                  const manifest: DashtopManifest = {
                    id: generatePackageId("local", `${name}-template`),
                    name: `${name} Template`,
                    version: "1.0.0",
                    description: `Dashboard template: ${name}`,
                    type: "template",
                    category: "utility",
                    tags: ["template"],
                    author: { name: "Local User", username: "local" },
                    dashtopVersion: ">=0.1.0",
                    requiredWidgets: Object.values(JSON.parse(dashboard.config).widgets || {}).map((w: any) => w.type),
                  };
                  const blob = await buildPackage({
                    manifest,
                    templatePayload: JSON.parse(dashboard.config),
                  });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = getPackageFilename(manifest);
                  a.click();
                  URL.revokeObjectURL(url);
                  toast.success("Template package exported!");
                }}
              >
                <Package className="h-4 w-4 mr-2" />
                Template (.dashtop)
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={async () => {
                  const currentTheme = getThemeById(theme);
                  const manifest: DashtopManifest = {
                    id: generatePackageId("local", `${name}-theme`),
                    name: `${name} Theme`,
                    version: "1.0.0",
                    description: `Theme from: ${name}`,
                    type: "theme",
                    category: "utility",
                    tags: ["theme", currentTheme.colorScheme],
                    author: { name: "Local User", username: "local" },
                    dashtopVersion: ">=0.1.0",
                  };
                  const blob = await buildPackage({
                    manifest,
                    themePayload: {
                      colorScheme: currentTheme.colorScheme,
                      colors: currentTheme.colors,
                    },
                  });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = getPackageFilename(manifest);
                  a.click();
                  URL.revokeObjectURL(url);
                  toast.success("Theme package exported!");
                }}
              >
                <Palette className="h-4 w-4 mr-2" />
                Theme (.dashtop)
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              .dashtop packages can be shared, installed, and traded on the marketplace.
            </p>
          </CardContent>
        </Card>

        {/* Publish to Marketplace */}
        <PublishSection dashboardId={dashboard.id} dashboardName={name} />

        {/* Danger Zone */}
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="text-lg text-destructive">
              Danger Zone
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form action={deleteDashboard.bind(null, dashboard.id)}>
              <Button variant="destructive" type="submit">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Dashboard
              </Button>
            </form>
          </CardContent>
        </Card>

        <Separator />

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function PublishSection({
  dashboardId,
  dashboardName,
}: {
  dashboardId: string;
  dashboardName: string;
}) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(dashboardName);
  const [desc, setDesc] = useState("");
  const [longDesc, setLongDesc] = useState("");
  const [category, setCategory] = useState("utility");
  const [tagsInput, setTagsInput] = useState("");
  const [price, setPrice] = useState("0");
  const [pricingModel, setPricingModel] = useState("free");
  const [publishing, setPublishing] = useState(false);

  const handlePublish = async () => {
    if (!title || !desc) {
      toast.error("Title and description are required");
      return;
    }
    setPublishing(true);
    try {
      await publishToMarketplace(dashboardId, {
        title,
        description: desc,
        longDescription: longDesc,
        category,
        tags: tagsInput
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        price: parseFloat(price) || 0,
        pricingModel,
      });
      toast.success("Published to marketplace!");
      setOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to publish");
    } finally {
      setPublishing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Rocket className="h-5 w-5" />
          Publish to Marketplace
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!open ? (
          <div>
            <p className="text-sm text-muted-foreground mb-3">
              Share this dashboard with the community. Others can install and
              customize it.
            </p>
            <Button variant="outline" onClick={() => setOpen(true)}>
              <Rocket className="h-4 w-4 mr-2" />
              Publish Dashboard
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pub-title">Listing Title</Label>
              <Input
                id="pub-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pub-desc">Short Description</Label>
              <Input
                id="pub-desc"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="A brief description for the marketplace card"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pub-long">Detailed Description</Label>
              <Textarea
                id="pub-long"
                value={longDesc}
                onChange={(e) => setLongDesc(e.target.value)}
                placeholder="Explain what this dashboard does, who it's for..."
                rows={4}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={category} onValueChange={(v) => v && setCategory(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MARKETPLACE_CATEGORIES.map((c) => (
                      <SelectItem key={c.slug} value={c.slug}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Pricing</Label>
                <Select value={pricingModel} onValueChange={(v) => v && setPricingModel(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="tip-jar">Tip Jar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {pricingModel === "paid" && (
              <div className="space-y-2">
                <Label htmlFor="pub-price">Price (USD)</Label>
                <Input
                  id="pub-price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="pub-tags">Tags (comma-separated)</Label>
              <Input
                id="pub-tags"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="ai, productivity, chat"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handlePublish} disabled={publishing}>
                {publishing ? "Publishing..." : "Publish"}
              </Button>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
