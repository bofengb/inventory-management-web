"use client";

import { createTheme } from "@mui/material/styles";

// LIGHT THEME
export const lightTheme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: "#ffffff",
      paper: "#ffffff",
    },
    text: {
      primary: "#111827", // Tailwind's gray-900
    },
  },
});

// DARK THEME
export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#0f172a", // Tailwind's slate-900
      paper: "#1e293b", // Tailwind's slate-800
    },
    text: {
      primary: "#f8fafc", // Tailwind's gray-50
    },
  },
});
