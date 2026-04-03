"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { type WidgetProps } from "../types";
import { type AiChatConfig } from "./config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const MOCK_RESPONSES = [
  "That's a great question! Based on the context you've provided, I'd recommend starting with a modular approach. Break down the problem into smaller components, then tackle each one systematically.",
  "I can help with that. Here's a step-by-step approach:\n\n1. First, identify the core requirements\n2. Design the data model\n3. Implement the business logic\n4. Add error handling and tests",
  "Interesting perspective! The key insight here is that performance optimization should be data-driven. Profile first, then optimize the actual bottlenecks rather than guessing.",
  "Let me think about this... The trade-off between complexity and maintainability is crucial here. I'd lean toward the simpler solution unless benchmarks show the complex approach is necessary.",
  "Great use case! You might want to consider using a combination of caching and lazy loading to achieve optimal performance while keeping the user experience smooth.",
];

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "1",
    role: "assistant",
    content: "Hello! How can I help you today? Feel free to ask me anything.",
    timestamp: new Date(Date.now() - 60000),
  },
];

export default function AiChatWidget({ config }: WidgetProps<AiChatConfig>) {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  const modelLabel =
    config.model === "gpt-4"
      ? "GPT-4"
      : config.model === "claude-3"
        ? "Claude 3"
        : config.model === "gemini-pro"
          ? "Gemini Pro"
          : config.model;

  const handleSend = () => {
    if (!input.trim() || isTyping) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    const delay = config.streamResponses ? 800 + Math.random() * 1200 : 1500;

    setTimeout(() => {
      const response =
        MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)];
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, delay);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border">
        <div className="flex items-center gap-2">
          <Bot className="size-4 text-primary" />
          <span className="text-sm font-medium">AI Chat</span>
        </div>
        <Badge variant="secondary">{modelLabel}</Badge>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 min-h-0">
        <div ref={scrollRef} className="p-3 space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "assistant" && (
                <div className="flex-shrink-0 size-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot className="size-3.5 text-primary" />
                </div>
              )}
              <div
                className={`rounded-lg px-3 py-2 text-sm max-w-[80%] whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                }`}
              >
                {msg.content}
              </div>
              {msg.role === "user" && (
                <div className="flex-shrink-0 size-6 rounded-full bg-secondary flex items-center justify-center">
                  <User className="size-3.5 text-secondary-foreground" />
                </div>
              )}
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-2 justify-start">
              <div className="flex-shrink-0 size-6 rounded-full bg-primary/10 flex items-center justify-center">
                <Bot className="size-3.5 text-primary" />
              </div>
              <div className="rounded-lg px-3 py-2 bg-muted text-muted-foreground text-sm flex items-center gap-1.5">
                <Loader2 className="size-3 animate-spin" />
                Thinking...
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="flex items-center gap-2 px-3 py-2 border-t border-border">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
          placeholder="Type a message..."
          className="flex-1"
          disabled={isTyping}
        />
        <Button
          size="icon"
          onClick={handleSend}
          disabled={!input.trim() || isTyping}
        >
          <Send className="size-4" />
        </Button>
      </div>
    </div>
  );
}
