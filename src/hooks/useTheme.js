import { useEffect, useState } from 'react';
export function useTheme(initialTheme = 'light') {
  const [theme, setTheme] = useState(() => { try { return localStorage.getItem('react-ui-kit-theme') || initialTheme; } catch { return initialTheme; } });
  useEffect(() => { document.documentElement.dataset.theme = theme; try { localStorage.setItem('react-ui-kit-theme', theme); } catch {} }, [theme]);
  const toggleTheme = () => setTheme(current => current === 'light' ? 'dark' : 'light');
  return { theme, setTheme, toggleTheme };
}
