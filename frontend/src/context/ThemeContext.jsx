import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('shophub-theme');
    return saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('shophub-theme', dark ? 'dark' : 'light');
  }, [dark]);

  return <ThemeContext.Provider value={{ dark, toggleTheme: () => setDark((value) => !value) }}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
