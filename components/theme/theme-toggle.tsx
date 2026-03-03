"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";

type Theme = "light" | "dark";

function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-theme", theme);
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "light";
    const saved = window.localStorage.getItem("theme");
    return saved === "dark" || saved === "light" ? saved : "light";
  });

  useEffect(() => {
    applyTheme(theme);
    try {
      if (typeof window !== "undefined") window.localStorage.setItem("theme", theme);
    } catch {
      // ignore
    }
  }, [theme]);

  const next: Theme = theme === "dark" ? "light" : "dark";

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={() => setTheme(next)}
      aria-label={`Switch to ${next} mode`}
      suppressHydrationWarning
    >
      {theme === "dark" ? <Sun /> : <Moon />}
    </Button>
  );
}

