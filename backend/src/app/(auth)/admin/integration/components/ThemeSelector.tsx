"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type Theme = "support" | "tutor";

interface ThemeSelectorProps {
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
  className?: string;
}

export function ThemeSelector({
  theme,
  onThemeChange,
  className = "mb-4",
}: ThemeSelectorProps) {
  return (
    <div className={className}>
      <p className="text-sm text-muted-foreground mb-2">Theme:</p>
      <Select
        value={theme}
        onValueChange={(value) => onThemeChange(value as Theme)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select theme" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="support">IT-Support</SelectItem>
          <SelectItem value="tutor">AI-Tutor</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
