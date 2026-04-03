"use client";

import { useState, useRef, useEffect } from "react";
import {
  Send,
  RefreshCw,
  Play,
  Square,
  Newspaper,
  MessageSquare,
  StickyNote,
  MoreHorizontal,
} from "lucide-react";

// ── Types ─────────────────────────────────────

interface AppMessage {
  role: "user" | "app";
  text: string;
}

interface AppState {
  id: string;
  name: string;
  icon: typeof Newspaper;
  color: string;
  status: "idle" | "running" | "stopped";
  content: string[];
  chat: AppMessage[];
  placeholder: string;
}

// ── App Card ──────────────────────────────────

function AppCard({
  app,
  onAction,
  onChat,
}: {
  app: AppState;
  onAction: (id: string, action: "run" | "stop" | "update") => void;
  onChat: (id: string, message: string) => void;
}) {
  const [input, setInput] = useState("");
  const contentRef = useRef<HTMLDivElement>(null);
  const Icon = app.icon;

  const statusColor =
    app.status === "running"
      ? "bg-green-500"
      : app.status === "stopped"
        ? "bg-red-400"
        : "bg-zinc-400";

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onChat(app.id, input.trim());
    setInput("");
    setTimeout(() => {
      contentRef.current?.scrollTo({ top: contentRef.current.scrollHeight, behavior: "smooth" });
    }, 100);
  };

  return (
    <div className="flex flex-col bg-card border rounded-xl overflow-hidden h-full">
      {/* Header + pill */}
      <div className="flex items-center justify-between px-3 py-2 border-b">
        <div className="flex items-center gap-2">
          <div className={`w-7 h-7 rounded-lg ${app.color} flex items-center justify-center`}>
            <Icon className="h-3.5 w-3.5 text-white" />
          </div>
          <div>
            <span className="text-xs font-medium">{app.name}</span>
            <div className="flex items-center gap-1">
              <span className={`w-1.5 h-1.5 rounded-full ${statusColor}`} />
              <span className="text-[10px] text-muted-foreground capitalize">
                {app.status}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-0.5 bg-muted rounded-full px-0.5 py-0.5">
          <button
            onClick={() => onAction(app.id, "update")}
            className="p-1 rounded-full hover:bg-background transition-colors"
            title="Update"
          >
            <RefreshCw className="h-3 w-3" />
          </button>
          <button
            onClick={() => onAction(app.id, "run")}
            className="p-1 rounded-full hover:bg-background transition-colors text-green-600"
            title="Run"
          >
            <Play className="h-3 w-3" />
          </button>
          <button
            onClick={() => onAction(app.id, "stop")}
            className="p-1 rounded-full hover:bg-background transition-colors text-red-500"
            title="Stop"
          >
            <Square className="h-3 w-3" />
          </button>
          <button
            className="p-1 rounded-full hover:bg-background transition-colors"
            title="More"
          >
            <MoreHorizontal className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Content area */}
      <div ref={contentRef} className="flex-1 overflow-auto p-3 space-y-1.5 min-h-0">
        {/* App content */}
        {app.content.map((line, i) => (
          <div key={`c-${i}`} className="text-xs leading-relaxed text-muted-foreground">
            {line}
          </div>
        ))}

        {/* Chat messages */}
        {app.chat.map((msg, i) => (
          <div
            key={`m-${i}`}
            className={`text-xs leading-relaxed ${
              msg.role === "user"
                ? "text-foreground font-medium"
                : "text-muted-foreground"
            }`}
          >
            {msg.role === "user" ? (
              <span className="text-primary">you:</span>
            ) : (
              <span className={app.color.replace("bg-", "text-")}>ai:</span>
            )}{" "}
            {msg.text}
          </div>
        ))}

        {app.content.length === 0 && app.chat.length === 0 && (
          <p className="text-muted-foreground text-xs text-center py-6">
            Hit <span className="font-mono bg-muted px-1 rounded text-[10px]">Run</span> or type below
          </p>
        )}
      </div>

      {/* Chat input */}
      <form onSubmit={handleSend} className="flex items-center gap-1.5 px-2 py-2 border-t">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={app.placeholder}
          className="flex-1 bg-muted/50 rounded-lg px-2.5 py-1.5 text-xs outline-none placeholder:text-muted-foreground/60 focus:bg-muted"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="p-1.5 rounded-lg bg-primary text-primary-foreground disabled:opacity-20 hover:opacity-90 transition-opacity shrink-0"
        >
          <Send className="h-3 w-3" />
        </button>
      </form>
    </div>
  );
}

// ── Main Page ─────────────────────────────────

export default function HomePage() {
  const [authStatus, setAuthStatus] = useState<string | null>(null);

  // Auto-detect Claude Code / Codex credentials on load
  useEffect(() => {
    fetch("/api/auth/auto")
      .then((r) => r.json())
      .then((data) => {
        if (data.authenticated) {
          setAuthStatus(`Connected via ${data.provider === "anthropic" ? "Claude Code" : "Codex"}`);
        } else {
          setAuthStatus("No AI keys detected — paste one at /login");
        }
      })
      .catch(() => setAuthStatus(null));
  }, []);

  const [apps, setApps] = useState<AppState[]>([
    {
      id: "chat",
      name: "AI Chat",
      icon: MessageSquare,
      color: "bg-violet-500",
      status: "running",
      placeholder: "Ask anything...",
      content: [],
      chat: [
        { role: "app", text: "Hello! I'm your AI assistant. Ask me anything." },
      ],
    },
    {
      id: "news",
      name: "News Feed",
      icon: Newspaper,
      color: "bg-amber-500",
      status: "running",
      placeholder: "Search news, add sources...",
      content: [
        "🔴 OpenAI announces GPT-5 with reasoning chains — 2h ago",
        "🟡 Rust 2.0 ships with 40% faster compiles — 3h ago",
        "🔴 EU AI Act enforcement begins — 4h ago",
        "🟡 Next.js 17 preview: actions overhaul — 5h ago",
        "🟢 Figma acquires AI startup for $400M — 6h ago",
      ],
      chat: [],
    },
    {
      id: "notes",
      name: "Notes",
      icon: StickyNote,
      color: "bg-blue-500",
      status: "idle",
      placeholder: "Add a note, ask to organize...",
      content: [
        "📌 Project ideas",
        "   Build a habit tracker widget",
        "   Explore tool use API",
        "📌 Meeting notes — Monday",
        "   TypeScript for all widgets",
        "   Launch target: end of month",
      ],
      chat: [],
    },
  ]);

  const handleAction = (id: string, action: "run" | "stop" | "update") => {
    setApps((prev) =>
      prev.map((app) => {
        if (app.id !== id) return app;
        switch (action) {
          case "run":
            return { ...app, status: "running" as const };
          case "stop":
            return { ...app, status: "stopped" as const, content: [], chat: [] };
          case "update":
            return { ...app, status: "running" as const };
          default:
            return app;
        }
      })
    );
  };

  const handleChat = async (id: string, message: string) => {
    // Add user message + "thinking" indicator immediately
    setApps((prev) =>
      prev.map((app) => {
        if (app.id !== id) return app;
        return {
          ...app,
          status: "running" as const,
          chat: [
            ...app.chat,
            { role: "user" as const, text: message },
            { role: "app" as const, text: "..." },
          ],
        };
      })
    );

    // Get current chat history for context
    const currentApp = apps.find((a) => a.id === id);
    const history = currentApp?.chat || [];

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, appId: id, history }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Fall back to mock if not logged in or API fails
        const fallback = data.error || "Something went wrong. Are you logged in?";
        setApps((prev) =>
          prev.map((app) => {
            if (app.id !== id) return app;
            const chat = [...app.chat];
            chat[chat.length - 1] = { role: "app" as const, text: fallback };
            return { ...app, chat };
          })
        );
        return;
      }

      // Replace "..." with real response
      setApps((prev) =>
        prev.map((app) => {
          if (app.id !== id) return app;
          const chat = [...app.chat];
          chat[chat.length - 1] = { role: "app" as const, text: data.text };
          return { ...app, chat };
        })
      );
    } catch {
      setApps((prev) =>
        prev.map((app) => {
          if (app.id !== id) return app;
          const chat = [...app.chat];
          chat[chat.length - 1] = {
            role: "app" as const,
            text: "Connection failed. Check your network.",
          };
          return { ...app, chat };
        })
      );
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Top bar */}
      <header className="flex items-center justify-between px-4 py-2 border-b">
        <span className="text-sm font-semibold tracking-tight">dashtop</span>
        <span className="text-[11px] text-muted-foreground">
          {authStatus ? (
            <span className="flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${authStatus.includes("Claude") || authStatus.includes("Codex") ? "bg-green-500" : "bg-zinc-400"}`} />
              {authStatus}
            </span>
          ) : (
            "connecting..."
          )}
        </span>
      </header>

      {/* App grid */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3 p-3 min-h-0">
        {apps.map((app) => (
          <AppCard
            key={app.id}
            app={app}
            onAction={handleAction}
            onChat={handleChat}
          />
        ))}
      </div>
    </div>
  );
}
