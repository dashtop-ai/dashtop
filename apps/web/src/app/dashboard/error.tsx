"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex items-center justify-center py-16">
      <Card className="max-w-md w-full">
        <CardContent className="flex flex-col items-center gap-4 text-center">
          <AlertTriangle className="h-10 w-10 text-destructive" />
          <div className="space-y-1">
            <h2 className="text-lg font-semibold">Something went wrong</h2>
            <p className="text-sm text-muted-foreground">
              {error.message || "Failed to load dashboards."}
            </p>
          </div>
          <Button onClick={reset} variant="outline">
            Try Again
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
