"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { type WidgetProps } from "../types";
import { type SudokuConfig } from "./config";
import { Button } from "@/components/ui/button";

// ── Hardcoded valid solved board ─────────────────
const SOLVED_BOARD: number[][] = [
  [5, 3, 4, 6, 7, 8, 9, 1, 2],
  [6, 7, 2, 1, 9, 5, 3, 4, 8],
  [1, 9, 8, 3, 4, 2, 5, 6, 7],
  [8, 5, 9, 7, 6, 1, 4, 2, 3],
  [4, 2, 6, 8, 5, 3, 7, 9, 1],
  [7, 1, 3, 9, 2, 4, 8, 5, 6],
  [9, 6, 1, 5, 3, 7, 2, 8, 4],
  [2, 8, 7, 4, 1, 9, 6, 3, 5],
  [3, 4, 5, 2, 8, 6, 1, 7, 9],
];

type CellState = {
  value: number; // 0 = empty
  prefilled: boolean;
};

function removalsForDifficulty(d: SudokuConfig["difficulty"]): number {
  if (d === "easy") return 35;
  if (d === "medium") return 45;
  return 55;
}

/** Shuffle an array in-place using Fisher-Yates */
function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j]!, arr[i]!];
  }
  return arr;
}

function generatePuzzle(difficulty: SudokuConfig["difficulty"]): CellState[][] {
  const board: CellState[][] = SOLVED_BOARD.map((row) =>
    row.map((v) => ({ value: v, prefilled: true })),
  );

  const positions = shuffle(
    Array.from({ length: 81 }, (_, i) => i),
  );

  const toRemove = removalsForDifficulty(difficulty);
  for (let i = 0; i < toRemove; i++) {
    const pos = positions[i]!;
    const r = Math.floor(pos / 9);
    const c = pos % 9;
    board[r]![c] = { value: 0, prefilled: false };
  }

  return board;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function SudokuWidget({
  config,
}: WidgetProps<SudokuConfig>) {
  const [board, setBoard] = useState<CellState[][]>(() =>
    generatePuzzle(config.difficulty),
  );
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [complete, setComplete] = useState(false);

  // Timer
  useEffect(() => {
    if (!config.showTimer || complete) return;
    const id = setInterval(() => setElapsed((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [config.showTimer, complete]);

  // Check completion
  useEffect(() => {
    const allFilled = board.every((row) => row.every((c) => c.value !== 0));
    if (!allFilled) {
      setComplete(false);
      return;
    }
    const allCorrect = board.every((row, r) =>
      row.every((c, ci) => c.value === SOLVED_BOARD[r]![ci]),
    );
    setComplete(allCorrect);
  }, [board]);

  const handleNewGame = useCallback(() => {
    setBoard(generatePuzzle(config.difficulty));
    setSelected(null);
    setElapsed(0);
    setComplete(false);
  }, [config.difficulty]);

  const placeNumber = useCallback(
    (num: number) => {
      if (!selected || complete) return;
      const [r, c] = selected;
      const cell = board[r]![c]!;
      if (cell.prefilled) return;
      setBoard((prev) => {
        const next = prev.map((row) => row.map((cl) => ({ ...cl })));
        next[r]![c] = { value: num, prefilled: false };
        return next;
      });
    },
    [selected, board, complete],
  );

  const clearCell = useCallback(() => {
    if (!selected || complete) return;
    const [r, c] = selected;
    const cell = board[r]![c]!;
    if (cell.prefilled) return;
    setBoard((prev) => {
      const next = prev.map((row) => row.map((cl) => ({ ...cl })));
      next[r]![c] = { value: 0, prefilled: false };
      return next;
    });
  }, [selected, board, complete]);

  const giveHint = useCallback(() => {
    if (complete) return;
    // Find all empty or wrong cells
    const candidates: [number, number][] = [];
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const cell = board[r]![c]!;
        if (!cell.prefilled && cell.value !== SOLVED_BOARD[r]![c]) {
          candidates.push([r, c]);
        }
      }
    }
    if (candidates.length === 0) return;
    const [r, c] = candidates[Math.floor(Math.random() * candidates.length)]!;
    setBoard((prev) => {
      const next = prev.map((row) => row.map((cl) => ({ ...cl })));
      next[r]![c] = { value: SOLVED_BOARD[r]![c]!, prefilled: false };
      return next;
    });
    setSelected([r, c]);
  }, [board, complete]);

  // Determine cell text color
  const cellColor = useCallback(
    (r: number, c: number, cell: CellState): string => {
      if (cell.value === 0) return "";
      if (cell.prefilled) return "text-foreground font-bold";
      if (
        config.highlightErrors &&
        cell.value !== SOLVED_BOARD[r]![c]
      ) {
        return "text-red-500 font-medium";
      }
      return "text-blue-500 font-medium";
    },
    [config.highlightErrors],
  );

  // Compute 3x3 box border classes for a cell
  const boxBorders = useCallback((r: number, c: number): string => {
    const classes: string[] = [];
    if (c % 3 === 0 && c !== 0) classes.push("border-l-2 border-l-foreground/40");
    if (r % 3 === 0 && r !== 0) classes.push("border-t-2 border-t-foreground/40");
    return classes.join(" ");
  }, []);

  return (
    <div className="flex flex-col items-center h-full gap-2 p-2 select-none overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between w-full gap-2 min-h-0">
        {config.showTimer && (
          <span className="text-xs font-mono text-muted-foreground tabular-nums">
            {formatTime(elapsed)}
          </span>
        )}
        <div className="flex gap-1 ml-auto">
          <Button variant="ghost" size="xs" onClick={giveHint} disabled={complete}>
            Hint
          </Button>
          <Button variant="outline" size="xs" onClick={handleNewGame}>
            New
          </Button>
        </div>
      </div>

      {/* Completion message */}
      {complete && (
        <div className="text-sm font-semibold text-green-500">
          Puzzle Complete!
        </div>
      )}

      {/* Sudoku grid */}
      <div
        className="grid border-2 border-foreground/60 rounded-sm shrink-0"
        style={{
          gridTemplateColumns: "repeat(9, 1fr)",
          gridTemplateRows: "repeat(9, 1fr)",
          width: "min(100%, 270px)",
          aspectRatio: "1",
        }}
      >
        {board.map((row, r) =>
          row.map((cell, c) => {
            const isSelected =
              selected !== null && selected[0] === r && selected[1] === c;
            return (
              <button
                key={`${r}-${c}`}
                type="button"
                className={[
                  "flex items-center justify-center font-mono text-sm leading-none",
                  "border border-border/50 transition-colors cursor-pointer",
                  boxBorders(r, c),
                  isSelected ? "bg-blue-500/20" : "hover:bg-muted/50",
                  cellColor(r, c, cell),
                ].join(" ")}
                onClick={() => setSelected([r, c])}
              >
                {cell.value !== 0 ? cell.value : ""}
              </button>
            );
          }),
        )}
      </div>

      {/* Number pad */}
      <div className="flex flex-wrap gap-1 justify-center">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <Button
            key={n}
            variant="outline"
            size="xs"
            className="font-mono w-6 h-6 p-0 text-xs"
            onClick={() => placeNumber(n)}
            disabled={complete}
          >
            {n}
          </Button>
        ))}
        <Button
          variant="ghost"
          size="xs"
          className="text-xs h-6 px-2"
          onClick={clearCell}
          disabled={complete}
        >
          Clear
        </Button>
      </div>
    </div>
  );
}
