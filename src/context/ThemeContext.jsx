import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");
  const [brightness, setBrightness] = useState(100);

  useEffect(() => {
    // Check local storage or system preference
    const savedTheme = localStorage.getItem("theme");
    const savedBrightness = localStorage.getItem("brightness");

    if (savedTheme) {
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

  const applyBrightness = (value) => {
    // Apply brightness as a filter to the root element
    document.documentElement.style.filter = `brightness(${value / 100})`;
  };

  const updateBrightness = (value) => {
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

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
