import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  Zap,
  ArrowRight,
  Blocks,
  GitFork,
  Sparkles,
  Brain,
  Image,
  Briefcase,
  Key,
  Heart,
  Globe,
  Gamepad2,
  BookOpen,
  TrendingUp,
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

const PRINCIPLES = [
  {
    icon: Key,
    title: "Bring Your Own Keys",
    description:
      "Your API key is your identity and your compute. No subscriptions, no platform fees. You own your AI.",
  },
  {
    icon: GitFork,
    title: "Fork, Remix, Improve",
    description:
      "Every app is open. Clone it, remix it with AI, make it yours. Share your improvements back to the community.",
  },
  {
    icon: Users,
    title: "Built Together",
    description:
      "15+ apps built by the community. Anyone can contribute — developers write code, users remix with AI.",
  },
  {
    icon: Sparkles,
    title: "AI-Powered Everything",
    description:
      "Don't like a widget? Tell AI to change it. Describe what you want and it builds it. No coding required.",
  },
  {
    icon: Blocks,
    title: "Drag, Drop, Done",
    description:
      "19+ widgets across AI, productivity, creative, finance, and more. Arrange your perfect layout in seconds.",
  },
  {
    icon: Globe,
    title: "Open & Free Forever",
    description:
      "No walled garden. Export your dashboards, share your configs, take your data anywhere. This is yours.",
  },
];

const APPS = [
  {
    name: "News Aggregator",
    description: "AI-curated daily digest from your favorite sources",
    icon: Globe,
    gradient: "from-amber-500 to-orange-600",
    contributors: 4,
  },
  {
    name: "Stock Broker",
    description: "Portfolio tracking, market analysis, trade signals",
    icon: TrendingUp,
    gradient: "from-emerald-500 to-green-600",
    contributors: 3,
  },
  {
    name: "Mind Games",
    description: "Chess, Go, Sudoku with AI opponents and training",
    icon: Gamepad2,
    gradient: "from-violet-500 to-purple-600",
    contributors: 5,
  },
  {
    name: "Learn Languages",
    description: "AI conversation partner, vocab builder, immersion",
    icon: BookOpen,
    gradient: "from-blue-500 to-cyan-600",
    contributors: 6,
  },
  {
    name: "AI Power User",
    description: "Multi-model chat, prompts, model comparison",
    icon: Brain,
    gradient: "from-pink-500 to-rose-600",
    contributors: 8,
  },
  {
    name: "Creative Studio",
    description: "Image gen, writing tools, music, inspiration",
    icon: Image,
    gradient: "from-fuchsia-500 to-pink-600",
    contributors: 7,
  },
  {
    name: "Fitness Coach",
    description: "Workouts, nutrition, progress tracking, AI coaching",
    icon: Heart,
    gradient: "from-red-500 to-rose-600",
    contributors: 3,
  },
  {
    name: "Business Ops",
    description: "Meetings, email triage, docs, task automation",
    icon: Briefcase,
    gradient: "from-slate-500 to-zinc-600",
    contributors: 5,
  },
];

const STEPS = [
  {
    step: "01",
    title: "Paste Your API Key",
    description:
      "Claude Code or Codex — your key is your login. No sign-up forms, no OAuth. Just paste and go.",
  },
  {
    step: "02",
    title: "Pick an App or Build One",
    description:
      "Install a community app, start from a blank canvas, or remix any existing app with AI.",
  },
  {
    step: "03",
    title: "Make It Yours",
    description:
      "Drag widgets, tweak settings, ask AI to modify anything. Then share your creation with the world.",
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
            Open source &middot; Free forever &middot; Bring your own keys
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl max-w-4xl mx-auto leading-tight">
            Let&apos;s build the{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-pink-600 to-amber-500">
              future of AI
            </span>{" "}
            together
          </h1>
          <p className="mt-5 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Open AI dashboards that anyone can build, remix, and share.
            Bring your own API keys. Everything is free.
            The community builds the apps — AI helps everyone contribute.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button size="lg" render={<Link href="/login" />}>
              Start Building
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" render={<Link href="/community" />}>
              Explore Apps
            </Button>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Just paste your Anthropic or OpenAI key. That&apos;s it.
          </p>
        </section>

        {/* How it works */}
        <section className="border-y bg-muted/30">
          <div className="container py-16">
            <h2 className="text-2xl font-bold text-center mb-10">
              Three Steps. Zero Friction.
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

        {/* Principles */}
        <section className="container py-16">
          <h2 className="text-2xl font-bold text-center mb-2">
            How We Build
          </h2>
          <p className="text-center text-muted-foreground mb-10">
            An open platform where everyone contributes and everyone benefits.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PRINCIPLES.map((p) => (
              <Card key={p.title} className="group hover:border-primary/30 transition-colors">
                <CardHeader>
                  <p.icon className="h-8 w-8 mb-2 text-primary group-hover:scale-110 transition-transform" />
                  <CardTitle className="text-base">{p.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {p.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        {/* Community Apps */}
        <section className="border-y bg-muted/30">
          <div className="container py-16">
            <h2 className="text-2xl font-bold text-center mb-2">
              Community Apps
            </h2>
            <p className="text-center text-muted-foreground mb-10">
              Built by people like you. Fork any app. Remix with AI. Make it yours.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {APPS.map((app) => (
                <Card
                  key={app.name}
                  className="overflow-hidden group hover:shadow-lg transition-all hover:-translate-y-0.5"
                >
                  <div
                    className={`h-24 bg-gradient-to-br ${app.gradient} flex items-center justify-center`}
                  >
                    <app.icon className="h-10 w-10 text-white/80 group-hover:scale-110 transition-transform" />
                  </div>
                  <CardHeader className="p-4">
                    <CardTitle className="text-sm">{app.name}</CardTitle>
                    <CardDescription className="text-xs">
                      {app.description}
                    </CardDescription>
                    <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                      <Users className="h-3 w-3" />
                      {app.contributors} contributors
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
            <div className="text-center mt-8">
              <Button variant="outline" render={<Link href="/community" />}>
                See all apps
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* Remix CTA */}
        <section className="container py-16">
          <div className="max-w-3xl mx-auto text-center">
            <Sparkles className="h-10 w-10 text-violet-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-3">
              Don&apos;t like something? Remix it.
            </h2>
            <p className="text-muted-foreground mb-2 max-w-xl mx-auto">
              Every widget, every app can be changed with a single prompt.
              Tell AI what you want — it modifies the code, packages it, and installs
              your personalized version. No coding required.
            </p>
            <p className="text-sm text-muted-foreground italic">
              &ldquo;Add stock prices to my news feed&rdquo; &mdash; done in 10 seconds.
            </p>
          </div>
        </section>

        {/* Final CTA */}
        <section className="border-t bg-muted/30">
          <div className="container py-20 text-center">
            <div className="max-w-xl mx-auto">
              <h2 className="text-3xl font-bold mb-3">
                The future of AI is{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-pink-600">
                  something we build together
                </span>
              </h2>
              <p className="text-muted-foreground mb-8">
                Everyone gets an AI dashboard. Everyone can build one.
                Bring your keys. Join the community.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button size="lg" render={<Link href="/login" />}>
                  Start Building — It&apos;s Free
                </Button>
                <Button size="lg" variant="outline" render={<Link href="https://github.com/dashtop-ai/dashtop" />}>
                  <GitFork className="mr-2 h-4 w-4" />
                  View on GitHub
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
