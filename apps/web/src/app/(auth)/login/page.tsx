"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LayoutDashboard, Key, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const [apiKey, setApiKey] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) return;

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey: apiKey.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Connection failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const detectedProvider = apiKey.startsWith("sk-ant-")
    ? "Anthropic"
    : apiKey.startsWith("sk-")
      ? "OpenAI"
      : null;

  return (
    <div className="flex flex-col items-center gap-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-3">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <LayoutDashboard className="h-6 w-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">Welcome to Dashtop</CardTitle>
          <CardDescription className="text-base">
            Paste your AI API key to get started. Your key is your identity and
            your compute.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="api-key" className="flex items-center gap-2">
                <Key className="h-3.5 w-3.5" />
                API Key
              </Label>
              <Input
                id="api-key"
                type="password"
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value);
                  setError("");
                }}
                placeholder="sk-ant-... or sk-..."
                className="font-mono text-sm"
                autoFocus
              />
              {detectedProvider && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      detectedProvider === "Anthropic"
                        ? "bg-orange-500"
                        : "bg-green-500"
                    }`}
                  />
                  {detectedProvider === "Anthropic" ? "Claude Code / Anthropic" : "Codex / OpenAI"}
                </p>
              )}
              {error && (
                <p className="text-xs text-destructive">{error}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={!apiKey.trim() || loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Validating key...
                </>
              ) : (
                <>
                  Enter Dashtop
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="text-center max-w-md space-y-3">
        <p className="text-xs text-muted-foreground">
          Dashtop is completely free. Your API key powers the AI widgets on your
          dashboard using your own tokens. We never store your key in plain text.
        </p>
        <div className="flex justify-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-orange-500" />
            Claude Code (sk-ant-...)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            Codex (sk-...)
          </span>
        </div>
      </div>
    </div>
  );
}
