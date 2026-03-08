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
  // Start with a deterministic value so SSR and first client render match.
  const [theme, setTheme] = useState<Theme>("light");

  // After mount, read the real theme from localStorage and apply it.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem("theme");
    const initial: Theme = saved === "dark" || saved === "light" ? (saved as Theme) : "light";
    setTheme(initial);
    applyTheme(initial);
  }, []);

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
    >
      {theme === "dark" ? <Sun /> : <Moon />}
    </Button>
  );
}

