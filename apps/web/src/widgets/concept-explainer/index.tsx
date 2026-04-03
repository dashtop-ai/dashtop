"use client";

import { useState } from "react";
import { Lightbulb, ArrowDown, Shuffle, Search } from "lucide-react";
import { type WidgetProps } from "../types";
import { type ConceptExplainerConfig } from "./config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface Explanation {
  concept: string;
  body: string;
  level: string;
  style: string;
}

const MOCK_EXPLANATIONS: Record<string, Record<string, string>> = {
  "Quantum Entanglement": {
    eli5: "Imagine you have two magic coins. No matter how far apart they are \u2014 even on opposite sides of the universe \u2014 when you flip one and it lands on heads, the other one ALWAYS lands on tails, instantly. Scientists don't fully know how this works, but it's real! Einstein called it \"spooky action at a distance\" because it seems impossible. These connected particles share a special link that nothing can break, not even distance.",
    textbook: "Quantum entanglement is a phenomenon in which two or more particles become correlated in such a way that the quantum state of each particle cannot be described independently. When a measurement is performed on one entangled particle, the state of its partner is instantaneously determined, regardless of the spatial separation between them. This non-local correlation, described mathematically by Bell's theorem, violates classical locality assumptions and has been experimentally verified through numerous Bell test experiments.",
    analogy: "Think of entangled particles like a pair of gloves separated into two sealed boxes. You ship one box to Tokyo and keep one in New York. The moment you open your box and find a left glove, you instantly know the Tokyo box contains the right glove. But here's the quantum twist: unlike real gloves that were always left or right, entangled particles don't decide until you look. It's as if the gloves are simultaneously both left AND right until someone peeks, and only then do both boxes \"choose\" opposite hands at the same instant.",
  },
  "Machine Learning": {
    eli5: "Machine learning is like teaching a computer by showing it tons of examples instead of giving it step-by-step instructions. It's like how you learned to recognize cats \u2014 nobody gave you a rulebook, you just saw lots of cats. Computers do the same thing: look at thousands of pictures, find patterns, and eventually figure out what makes a cat a cat!",
    textbook: "Machine learning is a subset of artificial intelligence that enables systems to learn and improve from experience without being explicitly programmed. It focuses on developing algorithms that can access data, identify patterns, and make decisions with minimal human intervention. The three primary paradigms are supervised learning, unsupervised learning, and reinforcement learning, each suited to different types of problems and data structures.",
    analogy: "Machine learning is like training a new chef. Instead of giving them an exact recipe, you show them hundreds of great dishes and terrible ones, letting them taste each. Over time, they develop an intuition for what makes food great \u2014 the right balance of salt, the perfect sear, the ideal pairing. The chef never memorizes a single recipe but learns the underlying principles of great cooking through experience.",
  },
};

const DEFAULT_CONCEPT = "Quantum Entanglement";

const LEVEL_LABELS: Record<string, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  expert: "Expert",
};

const LEVEL_COLORS: Record<string, "default" | "secondary" | "outline"> = {
  beginner: "secondary",
  intermediate: "default",
  expert: "outline",
};

export default function ConceptExplainerWidget({
  config,
}: WidgetProps<ConceptExplainerConfig>) {
  const [query, setQuery] = useState("");
  const [currentConcept, setCurrentConcept] = useState(DEFAULT_CONCEPT);
  const [currentStyle, setCurrentStyle] = useState(config.style);

  const getExplanation = (): Explanation => {
    const conceptData = MOCK_EXPLANATIONS[currentConcept];
    if (conceptData && conceptData[currentStyle]) {
      return {
        concept: currentConcept,
        body: conceptData[currentStyle],
        level: config.level,
        style: currentStyle,
      };
    }
    return {
      concept: currentConcept,
      body: `Explanation for "${currentConcept}" would be generated here by AI in ${currentStyle} style at ${config.level} level. This is a mock placeholder for concepts not yet in the demo dataset.`,
      level: config.level,
      style: currentStyle,
    };
  };

  const explanation = getExplanation();

  const handleSearch = () => {
    if (query.trim()) {
      setCurrentConcept(query.trim());
      setCurrentStyle(config.style);
    }
  };

  const handleDeeper = () => {
    setCurrentStyle("textbook");
  };

  const handleAnalogy = () => {
    setCurrentStyle("analogy");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border">
        <div className="flex items-center gap-2">
          <Lightbulb className="size-4 text-amber-500" />
          <span className="text-sm font-medium">Concept Explainer</span>
        </div>
        <Badge variant={LEVEL_COLORS[config.level]}>
          {LEVEL_LABELS[config.level]}
        </Badge>
      </div>

      {/* Search input */}
      <div className="flex items-center gap-2 px-3 py-2">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="What do you want to learn?"
          className="flex-1"
        />
        <Button size="icon" onClick={handleSearch} disabled={!query.trim()}>
          <Search className="size-4" />
        </Button>
      </div>

      <Separator />

      {/* Explanation area */}
      <ScrollArea className="flex-1 min-h-0">
        <div className="px-3 py-3 space-y-3">
          <div className="flex items-start gap-2">
            <h3 className="text-base font-semibold leading-tight">
              {explanation.concept}
            </h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
            {explanation.body}
          </p>
        </div>
      </ScrollArea>

      {/* Quick actions */}
      <div className="flex items-center gap-2 px-3 py-2 border-t border-border">
        <Button
          variant="outline"
          size="sm"
          onClick={handleDeeper}
          className="flex-1"
          disabled={currentStyle === "textbook"}
        >
          <ArrowDown className="size-3.5" />
          Explain deeper
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleAnalogy}
          className="flex-1"
          disabled={currentStyle === "analogy"}
        >
          <Shuffle className="size-3.5" />
          Give me an analogy
        </Button>
      </div>
    </div>
  );
}
