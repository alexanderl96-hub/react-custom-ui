import React from "react";
import { useTheme } from "../../theme/ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button className="rcui-theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
      {theme === "dark" ? "☀ Light" : "☾ Dark"}
    </button>
  );
}