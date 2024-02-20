"use client";

import { useEffect } from "react";

export const ThemeProvider = ({ children }) => {
  useEffect(() => {
    const savedTheme = localStorage.getItem('selectedTheme');
    if (savedTheme) {
      document.body.classList.add(savedTheme);
    }
  }, []);

  return <>{children}</>;
}