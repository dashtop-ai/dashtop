import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client.js";

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL || "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Create system creator user
  const creator = await prisma.user.upsert({
    where: { email: "official@dashtop.io" },
    update: {},
    create: {
      email: "official@dashtop.io",
      name: "Dashtop Official",
      username: "dashtop-official",
      isCreator: true,
    },
  });

  // ── Widget Definitions ────────────────────

  const widgetDefs = [
    { type: "clock", name: "Clock", category: "utility", icon: "Clock", description: "Displays current time with configurable format", defaultConfig: '{"format24h":false,"showSeconds":true,"showDate":true,"timezone":"local"}', defaultSize: '{"w":3,"h":2}' },
    { type: "notes", name: "Sticky Notes", category: "utility", icon: "StickyNote", description: "Quick notes on your dashboard", defaultConfig: '{"content":"","fontSize":"sm"}', defaultSize: '{"w":3,"h":3}' },
    { type: "web-bookmark", name: "Web Bookmark", category: "utility", icon: "Globe", description: "Quick link to any website", defaultConfig: '{"url":"","title":"New Bookmark","description":"","iconUrl":""}', defaultSize: '{"w":3,"h":2}' },
    { type: "ai-chat", name: "AI Chat", category: "ai", icon: "MessageSquare", description: "Multi-model AI chat interface", defaultConfig: '{"model":"gpt-4","systemPrompt":"You are a helpful assistant.","temperature":0.7}', defaultSize: '{"w":6,"h":5}' },
    { type: "prompt-library", name: "Prompt Library", category: "ai", icon: "BookOpen", description: "Save and organize your best prompts", defaultConfig: '{"category":"all","sortBy":"recent"}', defaultSize: '{"w":3,"h":3}' },
    { type: "usage-analytics", name: "Usage Analytics", category: "analytics", icon: "BarChart3", description: "Track AI usage and costs", defaultConfig: '{"timeRange":"30d","showCost":true}', defaultSize: '{"w":4,"h":3}' },
    { type: "api-key-manager", name: "API Key Manager", category: "utility", icon: "Key", description: "Manage your AI service API keys", defaultConfig: '{}', defaultSize: '{"w":4,"h":2}' },
    { type: "model-comparison", name: "Model Comparison", category: "ai", icon: "GitCompare", description: "Compare responses across AI models", defaultConfig: '{"models":["gpt-4","claude-3","gemini-pro"]}', defaultSize: '{"w":6,"h":4}' },
    { type: "image-generator", name: "Image Generator", category: "media", icon: "Image", description: "Generate images with AI", defaultConfig: '{"model":"dall-e-3","size":"1024x1024"}', defaultSize: '{"w":6,"h":5}' },
    { type: "music-audio", name: "Music & Audio", category: "media", icon: "Music", description: "AI music and audio generation", defaultConfig: '{"model":"suno","duration":30}', defaultSize: '{"w":4,"h":3}' },
    { type: "writing-assistant", name: "Writing Assistant", category: "productivity", icon: "PenTool", description: "AI-powered writing help", defaultConfig: '{"tone":"professional","maxLength":500}', defaultSize: '{"w":5,"h":4}' },
    { type: "style-presets", name: "Style Presets", category: "media", icon: "Palette", description: "Save and apply style configurations", defaultConfig: '{}', defaultSize: '{"w":3,"h":3}' },
    { type: "inspiration-feed", name: "Inspiration Feed", category: "media", icon: "Sparkles", description: "Curated AI art and creative inspiration", defaultConfig: '{"source":"trending"}', defaultSize: '{"w":3,"h":4}' },
    { type: "meeting-summarizer", name: "Meeting Summarizer", category: "productivity", icon: "Video", description: "AI meeting notes and summaries", defaultConfig: '{}', defaultSize: '{"w":5,"h":4}' },
    { type: "email-triage", name: "Email Triage", category: "productivity", icon: "Mail", description: "AI-powered email prioritization", defaultConfig: '{"autoLabel":true}', defaultSize: '{"w":5,"h":4}' },
    { type: "document-analyzer", name: "Document Analyzer", category: "productivity", icon: "FileText", description: "Extract insights from documents", defaultConfig: '{}', defaultSize: '{"w":5,"h":4}' },
    { type: "task-automation", name: "Task Automation", category: "productivity", icon: "Workflow", description: "Automate repetitive tasks with AI", defaultConfig: '{}', defaultSize: '{"w":4,"h":3}' },
    { type: "calendar-ai", name: "Calendar AI", category: "productivity", icon: "Calendar", description: "Smart calendar management", defaultConfig: '{}', defaultSize: '{"w":4,"h":3}' },
  ];

  for (const wd of widgetDefs) {
    await prisma.widgetDefinition.upsert({
      where: { type: wd.type },
      update: {},
      create: wd,
    });
  }

  // ── Template Dashboards ───────────────────

  const aiPowerUserConfig = JSON.stringify({
    version: 1,
    layouts: {
      lg: [
        { i: "chat-main", x: 0, y: 0, w: 6, h: 5, minW: 3, minH: 3 },
        { i: "prompt-lib", x: 6, y: 0, w: 3, h: 3, minW: 2, minH: 2 },
        { i: "model-compare", x: 6, y: 3, w: 6, h: 4, minW: 4, minH: 3 },
        { i: "usage-stats", x: 9, y: 0, w: 3, h: 3, minW: 2, minH: 2 },
        { i: "api-keys", x: 0, y: 5, w: 6, h: 2, minW: 3, minH: 2 },
      ],
      md: [
        { i: "chat-main", x: 0, y: 0, w: 5, h: 5, minW: 3, minH: 3 },
        { i: "prompt-lib", x: 5, y: 0, w: 3, h: 3, minW: 2, minH: 2 },
        { i: "model-compare", x: 0, y: 5, w: 8, h: 4, minW: 4, minH: 3 },
        { i: "usage-stats", x: 5, y: 3, w: 3, h: 2, minW: 2, minH: 2 },
        { i: "api-keys", x: 0, y: 9, w: 8, h: 2, minW: 3, minH: 2 },
      ],
      sm: [
        { i: "chat-main", x: 0, y: 0, w: 4, h: 5, minW: 3, minH: 3 },
        { i: "prompt-lib", x: 0, y: 5, w: 4, h: 3, minW: 2, minH: 2 },
        { i: "model-compare", x: 0, y: 8, w: 4, h: 4, minW: 4, minH: 3 },
        { i: "usage-stats", x: 0, y: 12, w: 4, h: 3, minW: 2, minH: 2 },
        { i: "api-keys", x: 0, y: 15, w: 4, h: 2, minW: 3, minH: 2 },
      ],
    },
    widgets: {
      "chat-main": { type: "ai-chat", config: {}, addedAt: "2026-01-01T00:00:00Z" },
      "prompt-lib": { type: "prompt-library", config: {}, addedAt: "2026-01-01T00:00:00Z" },
      "model-compare": { type: "model-comparison", config: {}, addedAt: "2026-01-01T00:00:00Z" },
      "usage-stats": { type: "usage-analytics", config: {}, addedAt: "2026-01-01T00:00:00Z" },
      "api-keys": { type: "api-key-manager", config: {}, addedAt: "2026-01-01T00:00:00Z" },
    },
  });

  const creativeStudioConfig = JSON.stringify({
    version: 1,
    layouts: {
      lg: [
        { i: "img-gen", x: 0, y: 0, w: 6, h: 5, minW: 4, minH: 4 },
        { i: "writing", x: 6, y: 0, w: 6, h: 4, minW: 3, minH: 3 },
        { i: "music", x: 0, y: 5, w: 4, h: 3, minW: 3, minH: 2 },
        { i: "styles", x: 4, y: 5, w: 3, h: 3, minW: 2, minH: 2 },
        { i: "inspiration", x: 7, y: 4, w: 5, h: 4, minW: 3, minH: 3 },
      ],
      md: [
        { i: "img-gen", x: 0, y: 0, w: 5, h: 5, minW: 4, minH: 4 },
        { i: "writing", x: 0, y: 5, w: 8, h: 4, minW: 3, minH: 3 },
        { i: "music", x: 5, y: 0, w: 3, h: 3, minW: 3, minH: 2 },
        { i: "styles", x: 5, y: 3, w: 3, h: 2, minW: 2, minH: 2 },
        { i: "inspiration", x: 0, y: 9, w: 8, h: 4, minW: 3, minH: 3 },
      ],
      sm: [
        { i: "img-gen", x: 0, y: 0, w: 4, h: 5, minW: 4, minH: 4 },
        { i: "writing", x: 0, y: 5, w: 4, h: 4, minW: 3, minH: 3 },
        { i: "music", x: 0, y: 9, w: 4, h: 3, minW: 3, minH: 2 },
        { i: "styles", x: 0, y: 12, w: 4, h: 3, minW: 2, minH: 2 },
        { i: "inspiration", x: 0, y: 15, w: 4, h: 4, minW: 3, minH: 3 },
      ],
    },
    widgets: {
      "img-gen": { type: "image-generator", config: {}, addedAt: "2026-01-01T00:00:00Z" },
      "writing": { type: "writing-assistant", config: {}, addedAt: "2026-01-01T00:00:00Z" },
      "music": { type: "music-audio", config: {}, addedAt: "2026-01-01T00:00:00Z" },
      "styles": { type: "style-presets", config: {}, addedAt: "2026-01-01T00:00:00Z" },
      "inspiration": { type: "inspiration-feed", config: {}, addedAt: "2026-01-01T00:00:00Z" },
    },
  });

  const businessOpsConfig = JSON.stringify({
    version: 1,
    layouts: {
      lg: [
        { i: "meetings", x: 0, y: 0, w: 5, h: 4, minW: 4, minH: 3 },
        { i: "email", x: 5, y: 0, w: 5, h: 4, minW: 4, minH: 3 },
        { i: "docs", x: 0, y: 4, w: 5, h: 4, minW: 4, minH: 3 },
        { i: "tasks", x: 5, y: 4, w: 4, h: 3, minW: 3, minH: 2 },
        { i: "calendar", x: 9, y: 4, w: 3, h: 3, minW: 2, minH: 2 },
      ],
      md: [
        { i: "meetings", x: 0, y: 0, w: 4, h: 4, minW: 4, minH: 3 },
        { i: "email", x: 4, y: 0, w: 4, h: 4, minW: 4, minH: 3 },
        { i: "docs", x: 0, y: 4, w: 8, h: 4, minW: 4, minH: 3 },
        { i: "tasks", x: 0, y: 8, w: 4, h: 3, minW: 3, minH: 2 },
        { i: "calendar", x: 4, y: 8, w: 4, h: 3, minW: 2, minH: 2 },
      ],
      sm: [
        { i: "meetings", x: 0, y: 0, w: 4, h: 4, minW: 4, minH: 3 },
        { i: "email", x: 0, y: 4, w: 4, h: 4, minW: 4, minH: 3 },
        { i: "docs", x: 0, y: 8, w: 4, h: 4, minW: 4, minH: 3 },
        { i: "tasks", x: 0, y: 12, w: 4, h: 3, minW: 3, minH: 2 },
        { i: "calendar", x: 0, y: 15, w: 4, h: 3, minW: 2, minH: 2 },
      ],
    },
    widgets: {
      "meetings": { type: "meeting-summarizer", config: {}, addedAt: "2026-01-01T00:00:00Z" },
      "email": { type: "email-triage", config: {}, addedAt: "2026-01-01T00:00:00Z" },
      "docs": { type: "document-analyzer", config: {}, addedAt: "2026-01-01T00:00:00Z" },
      "tasks": { type: "task-automation", config: {}, addedAt: "2026-01-01T00:00:00Z" },
      "calendar": { type: "calendar-ai", config: {}, addedAt: "2026-01-01T00:00:00Z" },
    },
  });

  // Create template dashboards
  const aiDashboard = await prisma.dashboard.upsert({
    where: { id: "tmpl-ai-power-user" },
    update: { config: aiPowerUserConfig },
    create: {
      id: "tmpl-ai-power-user",
      name: "AI Power User",
      description: "Multi-model chat, prompt library, usage analytics, and model comparison — the ultimate AI workspace.",
      config: aiPowerUserConfig,
      isTemplate: true,
      visibility: "public",
      ownerId: creator.id,
    },
  });

  const creativeDashboard = await prisma.dashboard.upsert({
    where: { id: "tmpl-creative-studio" },
    update: { config: creativeStudioConfig },
    create: {
      id: "tmpl-creative-studio",
      name: "Creative Studio",
      description: "Image generation, writing assistant, music tools, and inspiration — your creative AI workspace.",
      config: creativeStudioConfig,
      isTemplate: true,
      visibility: "public",
      ownerId: creator.id,
    },
  });

  const businessDashboard = await prisma.dashboard.upsert({
    where: { id: "tmpl-business-ops" },
    update: { config: businessOpsConfig },
    create: {
      id: "tmpl-business-ops",
      name: "Business Ops",
      description: "Meeting summarizer, email triage, document analyzer, and task automation — AI for your workday.",
      config: businessOpsConfig,
      isTemplate: true,
      visibility: "public",
      ownerId: creator.id,
    },
  });

  // ── Marketplace Listings ──────────────────

  await prisma.marketplaceListing.upsert({
    where: { dashboardId: aiDashboard.id },
    update: {},
    create: {
      title: "AI Power User",
      description: "The ultimate AI workspace with multi-model chat, prompt library, usage analytics, and model comparison.",
      longDescription: "This dashboard template is designed for power users who work with multiple AI models daily. It includes a full-featured chat interface, a prompt library for saving your best prompts, usage analytics to track costs, API key management, and a model comparison tool to evaluate responses side-by-side.",
      type: "dashboard",
      category: "ai",
      tags: JSON.stringify(["ai", "chat", "gpt", "claude", "llm", "prompts", "analytics"]),
      price: 0,
      pricingModel: "free",
      isFeatured: true,
      downloadCount: 342,
      avgRating: 4.7,
      reviewCount: 28,
      creatorId: creator.id,
      dashboardId: aiDashboard.id,
    },
  });

  await prisma.marketplaceListing.upsert({
    where: { dashboardId: creativeDashboard.id },
    update: {},
    create: {
      title: "Creative Studio",
      description: "AI-powered creative workspace with image generation, writing tools, music, and inspiration.",
      longDescription: "Unleash your creativity with this all-in-one AI creative studio. Generate images with DALL-E or Stable Diffusion, write with AI assistance, create music, manage style presets, and browse curated inspiration — all from a single dashboard.",
      type: "dashboard",
      category: "media",
      tags: JSON.stringify(["creative", "art", "images", "music", "writing", "dall-e", "stable-diffusion"]),
      price: 0,
      pricingModel: "tip-jar",
      isFeatured: true,
      downloadCount: 215,
      avgRating: 4.5,
      reviewCount: 19,
      creatorId: creator.id,
      dashboardId: creativeDashboard.id,
    },
  });

  await prisma.marketplaceListing.upsert({
    where: { dashboardId: businessDashboard.id },
    update: {},
    create: {
      title: "Business Ops",
      description: "Streamline your workday with AI-powered meeting summaries, email triage, and task automation.",
      longDescription: "This dashboard brings AI to your daily business operations. Automatically summarize meetings, prioritize emails, analyze documents, automate repetitive tasks, and manage your calendar with AI assistance. Perfect for professionals who want to save hours every week.",
      type: "dashboard",
      category: "productivity",
      tags: JSON.stringify(["business", "productivity", "email", "meetings", "documents", "automation"]),
      price: 4.99,
      pricingModel: "paid",
      isFeatured: true,
      downloadCount: 178,
      avgRating: 4.8,
      reviewCount: 15,
      creatorId: creator.id,
      dashboardId: businessDashboard.id,
    },
  });

  // ── Widget Pack Listings ─────────────────────

  const widgetListings = [
    {
      title: "News Summary Widget",
      description: "AI-curated daily news digest from your favorite sources with priority indicators and AI insights.",
      longDescription: "Stay informed with an AI-powered news widget that summarizes articles from your favorite sources every morning. Features priority indicators, category filtering, expandable summaries with AI insights, and configurable refresh schedule. Supports 12+ news sources out of the box.",
      type: "widget" as const,
      category: "ai",
      tags: JSON.stringify(["news", "ai", "summary", "daily", "rss"]),
      price: 0,
      pricingModel: "free" as const,
      downloadCount: 128,
      avgRating: 4.6,
      reviewCount: 11,
    },
    {
      title: "Pomodoro Timer Widget",
      description: "Focus timer with AI-suggested break activities and productivity tracking.",
      longDescription: "A Pomodoro-style focus timer that integrates with your dashboard. Tracks work sessions, suggests break activities based on your recent tasks, and provides weekly productivity insights.",
      type: "widget" as const,
      category: "productivity",
      tags: JSON.stringify(["timer", "pomodoro", "focus", "productivity"]),
      price: 0,
      pricingModel: "free" as const,
      downloadCount: 89,
      avgRating: 4.3,
      reviewCount: 7,
    },
    {
      title: "GitHub Activity Widget",
      description: "Live GitHub contribution graph, PR status, and repo analytics on your dashboard.",
      longDescription: "Connect your GitHub account to display your contribution graph, open PR status, recent commits, and repo analytics directly on your dashboard. Great for developers who want to keep track of their coding activity.",
      type: "widget" as const,
      category: "analytics",
      tags: JSON.stringify(["github", "git", "developer", "analytics", "code"]),
      price: 1.99,
      pricingModel: "paid" as const,
      downloadCount: 156,
      avgRating: 4.7,
      reviewCount: 22,
    },
    {
      title: "Crypto Tracker Widget",
      description: "Real-time cryptocurrency prices, portfolio tracking, and AI market sentiment analysis.",
      longDescription: "Track your crypto portfolio with real-time prices, 24h change indicators, and AI-powered market sentiment analysis. Supports 100+ tokens and provides price alerts.",
      type: "widget" as const,
      category: "data-viz",
      tags: JSON.stringify(["crypto", "bitcoin", "portfolio", "prices", "trading"]),
      price: 2.99,
      pricingModel: "paid" as const,
      downloadCount: 203,
      avgRating: 4.4,
      reviewCount: 18,
    },
    {
      title: "Habit Tracker Widget",
      description: "Track daily habits with streaks, AI coaching, and visual progress charts.",
      longDescription: "Build better habits with this AI-enhanced tracker. Set daily goals, track streaks, get personalized coaching suggestions, and visualize your progress over time with beautiful charts.",
      type: "widget" as const,
      category: "productivity",
      tags: JSON.stringify(["habits", "tracking", "goals", "streaks", "health"]),
      price: 0,
      pricingModel: "tip-jar" as const,
      downloadCount: 94,
      avgRating: 4.5,
      reviewCount: 9,
    },
    {
      title: "Spotify Now Playing Widget",
      description: "Show currently playing track with album art, playback controls, and listening stats.",
      longDescription: "Display your currently playing Spotify track with album art, artist info, and playback controls. Also shows your recent listening history and top tracks for the week.",
      type: "widget" as const,
      category: "media",
      tags: JSON.stringify(["spotify", "music", "now-playing", "media"]),
      price: 0,
      pricingModel: "free" as const,
      downloadCount: 312,
      avgRating: 4.8,
      reviewCount: 31,
    },
  ];

  for (const listing of widgetListings) {
    // Use title slug as a stable identifier for upsert
    const slug = listing.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    const existing = await prisma.marketplaceListing.findFirst({
      where: { title: listing.title, creatorId: creator.id },
    });
    if (!existing) {
      await prisma.marketplaceListing.create({
        data: {
          ...listing,
          creatorId: creator.id,
          isPublished: true,
        },
      });
    }
  }

  console.log("Seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
