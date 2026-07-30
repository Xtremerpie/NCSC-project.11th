import { createContext, useContext } from "react";

export const COLORS = {
  bg0: "#0B0F19",
  bg1: "#111827",
  bg2: "#1F2937",
  accent: "#3B82F6",
  focus: "#22C55E",
  warn: "#F59E0B",
  error: "#EF4444",
};

export const ACCENT_MAP = {
  Blue: "#3B82F6",
  Green: "#22C55E",
  Purple: "#8B5CF6",
  Pink: "#EC4899",
};

export const ThemeCtx = createContext({ mode: "dark", accent: COLORS.accent });
export const useTheme = () => useContext(ThemeCtx);
