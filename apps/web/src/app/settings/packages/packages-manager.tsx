"use client";

import { useRef } from "react";
import { Package, Upload, Trash2, Palette, FileText, LayoutDashboard, Blocks } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { installPackageFromFile, uninstallPackage, togglePackage } from "@/lib/actions/package.actions";
import type { DashtopManifest } from "@/lib/packages/types";
import { toast } from "sonner";

interface InstalledPkg {
  id: string;
  packageId: string;
  type: "theme" | "preset" | "template" | "widget";
  version: string;
  manifest: DashtopManifest;
  status: string;
  installedAt: string;
}

const TYPE_ICONS = {
  theme: Palette,
  preset: FileText,
  template: LayoutDashboard,
  widget: Blocks,
};

export function PackagesManager({ packages }: { packages: InstalledPkg[] }) {
  const formRef = useRef<HTMLFormElement>(null);

  const handleInstall = async (formData: FormData) => {
    try {
      await installPackageFromFile(formData);
      toast.success("Package installed!");
      if (formRef.current) formRef.current.reset();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to install");
    }
  };

  const handleUninstall = async (packageId: string) => {
    try {
      await uninstallPackage(packageId);
      toast.success("Package uninstalled");
    } catch {
      toast.error("Failed to uninstall");
    }
  };

  const handleToggle = async (id: string, enabled: boolean) => {
    try {
      await togglePackage(id, enabled);
    } catch {
      toast.error("Failed to toggle package");
    }
  };

  return (
    <div className="space-y-6">
      {/* Install */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Install Package
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form ref={formRef} action={handleInstall}>
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm mb-3">
                Drop a <code>.dashtop</code> file here or click to browse
              </p>
              <input
                type="file"
                name="package"
                accept=".dashtop,.zip"
                className="block mx-auto text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                required
              />
              <Button type="submit" size="sm" className="mt-3">
                Install Package
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Installed packages */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Installed Packages ({packages.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {packages.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              No packages installed. Export a dashboard template or theme, or
              install one from the marketplace.
            </p>
          ) : (
            <div className="space-y-3">
              {packages.map((pkg) => {
                const Icon = TYPE_ICONS[pkg.type];
                return (
                  <div
                    key={pkg.id}
                    className="flex items-center gap-3 p-3 border rounded-lg"
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm truncate">
                          {pkg.manifest.name}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {pkg.type}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          v{pkg.version}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {pkg.manifest.description}
                      </p>
                    </div>
                    <Switch
                      checked={pkg.status === "active"}
                      onCheckedChange={(checked) =>
                        handleToggle(pkg.id, checked)
                      }
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => handleUninstall(pkg.packageId)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
