import Link from "next/link";
import {
  LayoutDashboard,
  Store,
  Zap,
  ArrowRight,
  Blocks,
  Palette,
  Share2,
  Brain,
  Image,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

const FEATURES = [
  {
    icon: Blocks,
    title: "Drag & Drop Widgets",
    description:
      "18+ widgets for AI chat, image generation, analytics, productivity, and more. Arrange your perfect layout.",
  },
  {
    icon: Store,
    title: "Marketplace",
    description:
      "Browse, install, and trade dashboard templates and widgets. Free, paid, and tip-jar pricing.",
  },
  {
    icon: Palette,
    title: "Themes & Customization",
    description:
      "7 built-in themes from Midnight to Neon. Every dashboard is uniquely yours.",
  },
  {
    icon: Share2,
    title: "Export & Share",
    description:
      "Export your dashboard as JSON. Import configs from others. Trade setups with the community.",
  },
  {
    icon: Zap,
    title: "Creator Economy",
    description:
      "Become a creator. Publish your dashboards. Build a following. Earn from your configs.",
  },
  {
    icon: LayoutDashboard,
    title: "Multi-Dashboard",
    description:
      "One for work, one for creative projects, one for AI research. Switch between dashboards instantly.",
  },
];

const TEMPLATES = [
  {
    name: "AI Power User",
    description:
      "Multi-model chat, prompt library, usage analytics, model comparison",
    category: "AI & LLM",
    icon: Brain,
    gradient: "from-violet-500 to-purple-600",
    widgets: ["AI Chat", "Prompt Library", "Model Comparison", "Usage Analytics", "API Keys"],
    installs: "342",
    rating: "4.7",
  },
  {
    name: "Creative Studio",
    description:
      "Image generation, writing assistant, music tools, inspiration feed",
    category: "Creative",
    icon: Image,
    gradient: "from-pink-500 to-rose-600",
    widgets: ["Image Generator", "Writing Assistant", "Music & Audio", "Style Presets", "Inspiration"],
    installs: "215",
    rating: "4.5",
  },
  {
    name: "Business Ops",
    description:
      "Meeting summarizer, email triage, document analyzer, task automation",
    category: "Productivity",
    icon: Briefcase,
    gradient: "from-blue-500 to-cyan-600",
    widgets: ["Meeting Summary", "Email Triage", "Doc Analyzer", "Task Automation", "Calendar AI"],
    installs: "178",
    rating: "4.8",
  },
];

const STEPS = [
  {
    step: "01",
    title: "Browse or Create",
    description:
      "Pick a template from the marketplace or start with a blank canvas.",
  },
  {
    step: "02",
    title: "Add Widgets",
    description:
      "Drag and drop from 18+ widgets — AI chat, analytics, creative tools, and more.",
  },
  {
    step: "03",
    title: "Customize & Share",
    description:
      "Apply themes, configure widgets, export your config, or publish to the marketplace.",
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="container py-16 sm:py-24 text-center">
          <Badge variant="secondary" className="mb-4">
            18+ widgets &middot; 7 themes &middot; Marketplace
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl max-w-3xl mx-auto">
            Your AI.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-pink-600 to-amber-500">
              Your Dashboard.
            </span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Build personalized AI dashboards with drag-and-drop widgets.
            Install community templates. Trade and sell your configurations.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button size="lg" render={<Link href="/marketplace" />}>
              Browse Marketplace
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" render={<Link href="/dashboard" />}>
              Create Dashboard
            </Button>
          </div>
        </section>

        {/* How it works */}
        <section className="border-y bg-muted/30">
          <div className="container py-16">
            <h2 className="text-2xl font-bold text-center mb-10">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {STEPS.map((step) => (
                <div key={step.step} className="text-center">
                  <div className="text-3xl font-bold text-primary/20 mb-2">
                    {step.step}
                  </div>
                  <h3 className="text-lg font-semibold mb-1">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features grid */}
        <section className="container py-16">
          <h2 className="text-2xl font-bold text-center mb-2">
            Everything You Need
          </h2>
          <p className="text-center text-muted-foreground mb-10">
            A complete platform for building, sharing, and trading AI dashboards.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((feature) => (
              <Card key={feature.title} className="group hover:border-primary/30 transition-colors">
                <CardHeader>
                  <feature.icon className="h-8 w-8 mb-2 text-primary group-hover:scale-110 transition-transform" />
                  <CardTitle className="text-base">{feature.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        {/* Example Templates */}
        <section className="border-y bg-muted/30">
          <div className="container py-16">
            <h2 className="text-2xl font-bold text-center mb-2">
              Featured Templates
            </h2>
            <p className="text-center text-muted-foreground mb-10">
              Pre-built dashboards ready to install and customize.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {TEMPLATES.map((template) => (
                <Card
                  key={template.name}
                  className="overflow-hidden group hover:shadow-lg transition-shadow"
                >
                  <div
                    className={`h-36 bg-gradient-to-br ${template.gradient} flex items-center justify-center relative`}
                  >
                    <template.icon className="h-14 w-14 text-white/80 group-hover:scale-110 transition-transform" />
                    <div className="absolute top-3 right-3 flex gap-1">
                      <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm text-xs">
                        {template.installs} installs
                      </Badge>
                    </div>
                  </div>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-1">
                      <Badge variant="secondary" className="text-xs">
                        {template.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        ★ {template.rating}
                      </span>
                    </div>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <CardDescription className="text-sm">
                      {template.description}
                    </CardDescription>
                  </CardHeader>
                  <div className="px-6 pb-4">
                    <div className="flex flex-wrap gap-1">
                      {template.widgets.map((w) => (
                        <Badge key={w} variant="outline" className="text-xs">
                          {w}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="container py-20 text-center">
          <div className="max-w-xl mx-auto">
            <h2 className="text-3xl font-bold mb-3">
              The future of AI is{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-pink-600">
                personal
              </span>
            </h2>
            <p className="text-muted-foreground mb-8">
              Everyone will have their own AI dashboard. Start building yours
              today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button size="lg" render={<Link href="/login" />}>
                Get Started — It&apos;s Free
              </Button>
              <Button size="lg" variant="outline" render={<Link href="/marketplace" />}>
                Explore Marketplace
              </Button>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
