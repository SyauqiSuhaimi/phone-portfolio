"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

type Theme = "light" | "dark";

type ThemeContextValue = {
  theme: Theme;
  toggleTheme: () => void;
  brightness: number;
  updateBrightness: (value: number) => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>("light");
  const [brightness, setBrightness] = useState(100);

  useEffect(() => {
    // Check local storage or system preference
    const savedTheme = localStorage.getItem("theme");
    const savedBrightness = localStorage.getItem("brightness");

    if (savedTheme === "light" || savedTheme === "dark") {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    }

    if (savedBrightness) {
      const brightnessValue = parseInt(savedBrightness, 10);
      setBrightness(brightnessValue);
      applyBrightness(brightnessValue);
    } else {
      applyBrightness(70);
    }
  }, []);

  const applyBrightness = (value: number) => {
    // Apply brightness as a filter to the root element
    document.documentElement.style.filter = `brightness(${value / 100})`;
  };

  const updateBrightness = (value: number) => {
    setBrightness(value);
    localStorage.setItem("brightness", value.toString());
    applyBrightness(value);
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return (
    <ThemeContext.Provider
      value={{ theme, toggleTheme, brightness, updateBrightness }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
