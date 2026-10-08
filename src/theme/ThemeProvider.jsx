import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const ThemeContext = createContext(null);

export function ThemeProvider({
  children,
  defaultTheme = "light",
  storageKey = "rcui-theme"
}) {
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return defaultTheme;
    return localStorage.getItem(storageKey) || defaultTheme;
  });

  useEffect(() => {
    document.documentElement.dataset.rcuiTheme = theme;
    localStorage.setItem(storageKey, theme);
  }, [theme, storageKey]);

  const value = useMemo(() => ({
    theme,
    setTheme,
    toggleTheme: () => setTheme((current) => current === "dark" ? "light" : "dark")
  }), [theme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used inside ThemeProvider.");
  return context;
}