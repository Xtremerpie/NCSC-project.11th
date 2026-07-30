import React from "react";
import { Target } from "lucide-react";
import { COLORS } from "../lib/theme";
import GlassCard from "../components/ui/GlassCard";

function FocusPanel({ onEnter, state }) {
  const openItems = [
    ...state.tasks.filter((t) => !t.done).map((t) => t.text),
    ...state.homework.filter((h) => !h.completed).map((h) => `${h.subject} homework`),
  ];
  return (
    <div className="fh-fade">
      <GlassCard className="p-8 flex flex-col items-center text-center gap-4">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{ background: "rgba(34,197,94,0.12)", animation: "fh-breathe 3s ease-in-out infinite" }}
        >
          <Target size={34} style={{ color: COLORS.focus }} />
        </div>
        <h2 className="text-white text-xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Smart Focus Mode</h2>
        <p className="text-slate-400 text-sm max-w-md">
          Everything disappears — just a timer, your current task, notes, a calculator, and quiet background sound. No distractions.
        </p>
        <button
          onClick={onEnter}
          className="rounded-xl px-6 py-3 text-sm font-semibold text-white"
          style={{ background: `linear-gradient(135deg, ${COLORS.focus}, #16a34a)` }}
        >
          Enter Focus Mode
        </button>
        {openItems.length > 0 && (
          <p className="text-xs text-slate-500">You have {openItems.length} open item{openItems.length > 1 ? "s" : ""} waiting.</p>
        )}
      </GlassCard>
    </div>
  );
}

export default FocusPanel;
