"use client";

import { useState } from "react";
import { Plus, Search, Store, Blocks } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getAllWidgets, getWidgetsByCategory } from "@/widgets/registry";
import { type WidgetCategory } from "@/widgets/types";

interface WidgetPickerProps {
  onAddWidget: (widgetType: string) => void;
}

const CATEGORIES: { value: WidgetCategory | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "ai", label: "AI" },
  { value: "analytics", label: "Analytics" },
  { value: "media", label: "Creative" },
  { value: "productivity", label: "Productivity" },
  { value: "utility", label: "Utility" },
];

export function WidgetPicker({ onAddWidget }: WidgetPickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const handleAdd = (type: string) => {
    onAddWidget(type);
    setOpen(false);
    setSearch("");
  };

  const getFilteredWidgets = () => {
    const widgets =
      activeTab === "all"
        ? getAllWidgets()
        : getWidgetsByCategory(activeTab);

    if (!search) return widgets;
    const q = search.toLowerCase();
    return widgets.filter(
      (w) =>
        w.manifest.name.toLowerCase().includes(q) ||
        w.manifest.description.toLowerCase().includes(q) ||
        w.manifest.tags.some((t) => t.toLowerCase().includes(q))
    );
  };

  const filtered = getFilteredWidgets();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" />}>
        <Plus className="h-4 w-4 mr-1" />
        Add Widget
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Blocks className="h-5 w-5" />
            Add Widget
          </DialogTitle>
        </DialogHeader>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search widgets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Category tabs */}
        <div className="flex gap-1.5 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveTab(cat.value)}
              className={`text-xs px-2.5 py-1 rounded-full transition-colors ${
                activeTab === cat.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Widget grid */}
        <div className="flex-1 overflow-auto">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Search className="h-8 w-8 mb-2" />
              <p className="text-sm">No widgets found</p>
              <p className="text-xs">Try a different search or category</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 p-0.5">
              {filtered.map((entry) => (
                <Card
                  key={entry.manifest.type}
                  className="cursor-pointer hover:border-primary/50 transition-colors group"
                  onClick={() => handleAdd(entry.manifest.type)}
                >
                  <CardHeader className="p-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-sm group-hover:text-primary transition-colors">
                        {entry.manifest.name}
                      </CardTitle>
                      <Badge variant="secondary" className="text-[10px] ml-2 shrink-0">
                        {entry.manifest.category}
                      </Badge>
                    </div>
                    <CardDescription className="text-xs line-clamp-2">
                      {entry.manifest.description}
                    </CardDescription>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-[10px] text-muted-foreground">
                        {entry.manifest.defaultSize.w}x{entry.manifest.defaultSize.h}
                      </span>
                      <Plus className="h-3 w-3 text-primary opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Footer with count */}
        <div className="flex items-center justify-between pt-2 border-t text-xs text-muted-foreground">
          <span>{filtered.length} widget{filtered.length !== 1 ? "s" : ""} available</span>
          <span className="flex items-center gap-1">
            <Store className="h-3 w-3" />
            More on the marketplace
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
