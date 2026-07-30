import React from "react";
import { useTheme } from "../../lib/theme";

function GlassCard({ children, className = "", style = {} }) {
  const { mode } = useTheme();
  const dark = mode !== "light";
  return (
    <div
      className={`rounded-2xl ${className}`}
      style={{
        background: dark ? "rgba(31,41,55,0.55)" : "rgba(255,255,255,0.78)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: `1px solid ${dark ? "rgba(255,255,255,0.06)" : "rgba(15,23,42,0.08)"}`,
        boxShadow: dark ? "0 8px 30px rgba(0,0,0,0.35)" : "0 8px 30px rgba(15,23,42,0.10)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}


export default GlassCard;
