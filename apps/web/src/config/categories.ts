export const MARKETPLACE_CATEGORIES = [
  { slug: "ai", name: "AI & LLM", icon: "Brain", description: "Chat, prompts, model tools" },
  { slug: "analytics", name: "Analytics", icon: "BarChart3", description: "Usage stats, metrics, insights" },
  { slug: "media", name: "Creative", icon: "Palette", description: "Image, audio, video generation" },
  { slug: "productivity", name: "Productivity", icon: "Zap", description: "Email, meetings, tasks, docs" },
  { slug: "data-viz", name: "Data Viz", icon: "LineChart", description: "Charts, graphs, dashboards" },
  { slug: "utility", name: "Utility", icon: "Settings", description: "Clock, notes, bookmarks, tools" },
  { slug: "communication", name: "Communication", icon: "MessageCircle", description: "Chat, messaging, social" },
] as const;

export const LISTING_TYPES = [
  { value: "dashboard", label: "Dashboard" },
  { value: "widget", label: "Widget" },
  { value: "widget-pack", label: "Widget Pack" },
  { value: "config", label: "Config" },
] as const;

export const PRICING_MODELS = [
  { value: "free", label: "Free" },
  { value: "paid", label: "Paid" },
  { value: "tip-jar", label: "Tip Jar" },
] as const;
