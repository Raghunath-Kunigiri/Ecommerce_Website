"use client";

import type { Category } from "@/lib/types";
import { cn } from "@/lib/utils";

type Props = {
  categories: Category[];
  value: string;
  onChange: (slug: string) => void;
};

export function CategoryFilter({ categories, value, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onChange("all")}
        className={cn(
          "min-h-[44px] touch-manipulation rounded-full border border-[color:var(--border)] bg-[color:var(--surface-1)] px-4 py-2.5 text-sm text-[color:var(--muted)] transition-colors hover:text-[color:var(--fg)]",
          value === "all" &&
            "border-transparent bg-[color:var(--brand-soft)] text-[color:var(--brand-strong)]",
        )}
      >
        All
      </button>
      {categories.map((c) => (
        <button
          key={c.id}
          type="button"
          onClick={() => onChange(c.slug)}
          className={cn(
            "min-h-[44px] touch-manipulation rounded-full border border-[color:var(--border)] bg-[color:var(--surface-1)] px-4 py-2.5 text-sm text-[color:var(--muted)] transition-colors hover:text-[color:var(--fg)]",
            value === c.slug &&
              "border-transparent bg-[color:var(--brand-soft)] text-[color:var(--brand-strong)]",
          )}
        >
          {c.name}
        </button>
      ))}
    </div>
  );
}

