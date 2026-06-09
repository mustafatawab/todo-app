"use client";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/themeContext";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-all duration-200"
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      <Sun className="h-4 w-4 scale-100 dark:scale-0 transition-transform duration-300" />
      <Moon className="h-4 w-4 absolute scale-0 dark:scale-100 transition-transform duration-300" />
    </Button>
  );
}
