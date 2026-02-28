"use client";

import { Minus, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

type Props = {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
};

export function QuantitySelector({ value, onChange, min = 1, max = 99 }: Props) {
  return (
    <div className="inline-flex items-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface-2)] p-1">
      <Button
        variant="ghost"
        size="icon"
        className="h-10 w-10"
        onClick={() => onChange(Math.max(min, value - 1))}
        aria-label="Decrease quantity"
        type="button"
      >
        <Minus />
      </Button>
      <div className="w-12 text-center text-sm font-semibold">{value}</div>
      <Button
        variant="ghost"
        size="icon"
        className="h-10 w-10"
        onClick={() => onChange(Math.min(max, value + 1))}
        aria-label="Increase quantity"
        type="button"
      >
        <Plus />
      </Button>
    </div>
  );
}

