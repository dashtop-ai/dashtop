"use client";

import { useState } from "react";
import { HelpCircle, ChevronRight, RotateCcw, Trophy } from "lucide-react";
import { type WidgetProps } from "../types";
import { type QuizMeConfig } from "./config";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface QuizQuestion {
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
}

const MOCK_QUESTIONS: QuizQuestion[] = [
  {
    question: "What is the powerhouse of the cell?",
    options: [
      "Nucleus",
      "Mitochondria",
      "Ribosome",
      "Endoplasmic Reticulum",
    ],
    correctIndex: 1,
    explanation:
      "Mitochondria are known as the powerhouse of the cell because they generate most of the cell's supply of ATP, which is used as a source of chemical energy.",
  },
  {
    question: "What planet is known as the Red Planet?",
    options: ["Venus", "Jupiter", "Mars", "Saturn"],
    correctIndex: 2,
    explanation:
      "Mars appears red because its surface is covered in iron oxide (rust). This gives it the distinctive reddish appearance visible from Earth.",
  },
  {
    question: "What is the chemical symbol for gold?",
    options: ["Go", "Gd", "Au", "Ag"],
    correctIndex: 2,
    explanation:
      "Au comes from the Latin word 'aurum', meaning gold. Ag is silver (from 'argentum'), Gd is gadolinium, and Go is not a chemical symbol.",
  },
  {
    question: "How fast does light travel in a vacuum?",
    options: [
      "300,000 km/s",
      "150,000 km/s",
      "500,000 km/s",
      "1,000,000 km/s",
    ],
    correctIndex: 0,
    explanation:
      "Light travels at approximately 299,792 km/s (about 300,000 km/s) in a vacuum. This is the fastest speed possible in the universe according to Einstein's theory of relativity.",
  },
  {
    question: "What gas do plants absorb from the atmosphere?",
    options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"],
    correctIndex: 2,
    explanation:
      "Plants absorb carbon dioxide (CO2) during photosynthesis. They use CO2 along with water and sunlight to produce glucose and oxygen.",
  },
];

const OPTION_LETTERS = ["A", "B", "C", "D"] as const;

export default function QuizMeWidget({
  config,
}: WidgetProps<QuizMeConfig>) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);

  const totalQuestions = Math.min(config.questionCount, MOCK_QUESTIONS.length);
  const question = MOCK_QUESTIONS[currentIndex];

  const handleAnswer = (optionIndex: number) => {
    if (showResult) return;
    setSelectedAnswer(optionIndex);
    setShowResult(true);
    setAnswered((prev) => prev + 1);
    if (optionIndex === question.correctIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 >= totalQuestions) {
      setQuizComplete(true);
    } else {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setAnswered(0);
    setQuizComplete(false);
  };

  const progressPercent = ((currentIndex + (showResult ? 1 : 0)) / totalQuestions) * 100;

  const getOptionStyle = (index: number) => {
    if (!showResult) {
      return "border-border bg-background hover:bg-muted cursor-pointer";
    }
    if (index === question.correctIndex) {
      return "border-green-500 bg-green-500/10 text-green-700 dark:text-green-400";
    }
    if (index === selectedAnswer && index !== question.correctIndex) {
      return "border-red-500 bg-red-500/10 text-red-700 dark:text-red-400";
    }
    return "border-border bg-background opacity-50";
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border">
        <div className="flex items-center gap-2">
          <HelpCircle className="size-4 text-violet-500" />
          <span className="text-sm font-medium">Quiz Me</span>
        </div>
        <Badge variant="secondary">
          {score}/{answered} correct
        </Badge>
      </div>

      {/* Progress bar */}
      <div className="px-3 pt-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
          <span>
            Question {Math.min(currentIndex + 1, totalQuestions)} of{" "}
            {totalQuestions}
          </span>
          <span>{Math.round(progressPercent)}%</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {quizComplete ? (
        /* Quiz complete screen */
        <div className="flex-1 flex flex-col items-center justify-center px-3 py-4 gap-3">
          <Trophy className="size-10 text-amber-500" />
          <h3 className="text-lg font-semibold">Quiz Complete!</h3>
          <p className="text-2xl font-bold text-primary">
            {score}/{totalQuestions}
          </p>
          <p className="text-sm text-muted-foreground text-center">
            {score === totalQuestions
              ? "Perfect score! You nailed it!"
              : score >= totalQuestions * 0.7
                ? "Great job! Solid knowledge!"
                : score >= totalQuestions * 0.4
                  ? "Not bad! Keep learning!"
                  : "Keep studying, you'll get there!"}
          </p>
          <Button variant="outline" size="sm" onClick={handleRestart}>
            <RotateCcw className="size-3.5" />
            Try Again
          </Button>
        </div>
      ) : (
        <>
          {/* Question area */}
          <ScrollArea className="flex-1 min-h-0">
            <div className="px-3 py-3 space-y-3">
              <p className="text-sm font-medium leading-snug">
                {question.question}
              </p>

              <div className="space-y-2">
                {question.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    disabled={showResult}
                    className={`w-full flex items-center gap-2.5 rounded-lg border px-3 py-2 text-left text-sm transition-colors ${getOptionStyle(index)}`}
                  >
                    <span className="flex-shrink-0 flex items-center justify-center size-6 rounded-md bg-muted text-xs font-semibold">
                      {OPTION_LETTERS[index]}
                    </span>
                    <span>{option}</span>
                  </button>
                ))}
              </div>

              {showResult && (
                <div
                  className={`rounded-lg p-3 text-sm ${
                    selectedAnswer === question.correctIndex
                      ? "bg-green-500/10 text-green-700 dark:text-green-400"
                      : "bg-red-500/10 text-red-700 dark:text-red-400"
                  }`}
                >
                  <p className="font-medium mb-1">
                    {selectedAnswer === question.correctIndex
                      ? "Correct!"
                      : "Incorrect!"}
                  </p>
                  <p className="text-xs opacity-90">{question.explanation}</p>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Next button */}
          {showResult && (
            <div className="px-3 py-2 border-t border-border">
              <Button
                variant="default"
                size="sm"
                onClick={handleNext}
                className="w-full"
              >
                {currentIndex + 1 >= totalQuestions ? (
                  <>
                    <Trophy className="size-3.5" />
                    See Results
                  </>
                ) : (
                  <>
                    Next Question
                    <ChevronRight className="size-3.5" />
                  </>
                )}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
