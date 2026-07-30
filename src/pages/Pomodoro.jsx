import React, { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, TimerReset, BarChart3, Flame, Clock } from "lucide-react";
import { useTheme, COLORS } from "../lib/theme";
import GlassCard from "../components/ui/GlassCard";
import SectionTitle from "../components/ui/SectionTitle";
import StatCard from "../components/ui/StatCard";

const MODES = { "25/5": [25, 5], "45/10": [45, 10], "60/15": [60, 15] };

function Pomodoro({ state, logStudySession }) {
  const { accent } = useTheme();
  const [mode, setMode] = useState("25/5");
  const [custom, setCustom] = useState({ focus: 20, brk: 5 });
  const [onBreak, setOnBreak] = useState(false);
  const focusMin = mode === "Custom" ? custom.focus : MODES[mode][0];
  const breakMin = mode === "Custom" ? custom.brk : MODES[mode][1];
  const [seconds, setSeconds] = useState(focusMin * 60);
  const [running, setRunning] = useState(false);

  useEffect(() => { setSeconds((onBreak ? breakMin : focusMin) * 60); setRunning(false); }, [mode, focusMin, breakMin]); // eslint-disable-line

  useEffect(() => {
    if (!running) return;
    if (seconds <= 0) {
      if (!onBreak) logStudySession(focusMin);
      setOnBreak((b) => !b);
      setSeconds((onBreak ? focusMin : breakMin) * 60);
      return;
    }
    const t = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [running, seconds]); // eslint-disable-line

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <div className="fh-fade grid md:grid-cols-2 gap-4">
      <GlassCard className="p-6 flex flex-col items-center gap-4">
        <SectionTitle icon={TimerReset} title="Pomodoro Timer" subtitle={onBreak ? "Break time" : "Focus time"} />
        <div className="text-6xl font-bold" style={{ color: onBreak ? COLORS.warn : COLORS.focus, fontFamily: "'Space Grotesk', sans-serif" }}>
          {mm}:{ss}
        </div>
        <div className="flex gap-2">
          <button onClick={() => setRunning((r) => !r)} className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white flex items-center gap-2" style={{ background: COLORS.focus }}>
            {running ? <Pause size={15} /> : <Play size={15} />} {running ? "Pause" : "Start"}
          </button>
          <button onClick={() => { setRunning(false); setSeconds((onBreak ? breakMin : focusMin) * 60); }} className="rounded-xl px-4 py-2.5 text-sm text-slate-300 border border-white/10">
            <RotateCcw size={15} />
          </button>
        </div>
        <div className="flex flex-wrap gap-2 justify-center">
          {Object.keys(MODES).concat("Custom").map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className="rounded-xl px-3 py-1.5 text-xs fh-surface"
              style={{ background: mode === m ? `${accent}33` : "rgba(255,255,255,0.04)", color: mode === m ? "#93c5fd" : "#9CA3AF" }}
            >
              {m}
            </button>
          ))}
        </div>
        {mode === "Custom" && (
          <div className="flex gap-3 items-center text-xs text-slate-400">
            <label className="flex items-center gap-1">Focus
              <input type="number" min={5} max={120} value={custom.focus} onChange={(e) => setCustom((c) => ({ ...c, focus: +e.target.value || 1 }))} className="w-14 bg-slate-900/60 border border-white/10 rounded-lg px-2 py-1 text-white" />
            </label>
            <label className="flex items-center gap-1">Break
              <input type="number" min={1} max={60} value={custom.brk} onChange={(e) => setCustom((c) => ({ ...c, brk: +e.target.value || 1 }))} className="w-14 bg-slate-900/60 border border-white/10 rounded-lg px-2 py-1 text-white" />
            </label>
          </div>
        )}
      </GlassCard>

      <GlassCard className="p-6">
        <SectionTitle icon={BarChart3} title="Session stats" subtitle="Tracked for this session" />
        <div className="grid grid-cols-2 gap-3">
          <StatCard icon={Flame} label="Sessions today" value={state.pomodoro.sessionsToday} color={COLORS.error} />
          <StatCard icon={Clock} label="Focus minutes today" value={state.pomodoro.focusMinutesToday} color={COLORS.focus} />
        </div>
        <p className="text-xs text-slate-500 mt-4">Weekly and monthly stats build up automatically as you keep using FocusHeist day to day.</p>
      </GlassCard>
    </div>
  );
}
export default Pomodoro;
