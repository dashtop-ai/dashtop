"use client";

import { type ReactNode } from "react";
import { Settings, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ErrorBoundary } from "@/components/shared/error-boundary";

interface WidgetWrapperProps {
  title: string;
  icon?: string;
  isEditing: boolean;
  onSettingsClick?: () => void;
  onRemove?: () => void;
  children: ReactNode;
}

export function WidgetWrapper({
  title,
  isEditing,
  onSettingsClick,
  onRemove,
  children,
}: WidgetWrapperProps) {
  return (
    <Card className="h-full flex flex-col overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between p-2 pb-0 space-y-0">
        <span className="text-xs font-medium text-muted-foreground truncate">
          {title}
        </span>
        {isEditing && (
          <div className="flex items-center gap-1">
            {onSettingsClick && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={(e) => {
                  e.stopPropagation();
                  onSettingsClick();
                }}
              >
                <Settings className="h-3 w-3" />
              </Button>
            )}
            {onRemove && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-destructive hover:text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        )}
      </CardHeader>
      <CardContent className="flex-1 p-2 overflow-auto">
        <ErrorBoundary>{children}</ErrorBoundary>
      </CardContent>
    </Card>
  );
}
