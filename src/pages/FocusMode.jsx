import React, { useState, useEffect, useMemo } from "react";
import * as math from "mathjs";
import { Target, Play, Pause, RotateCcw, X, Delete, StickyNote, CloudRain, TreePine, Library, Waves, VolumeX } from "lucide-react";
import { useTheme, COLORS } from "../lib/theme";
import GlassCard from "../components/ui/GlassCard";

const MUSIC_OPTIONS = [
  { id: "rain", label: "Rain", icon: CloudRain },
  { id: "forest", label: "Forest", icon: TreePine },
  { id: "library", label: "Library", icon: Library },
  { id: "white", label: "White noise", icon: Waves },
  { id: "none", label: "None", icon: VolumeX },
];

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

function FocusMode({ state, onExit, onSessionComplete }) {
  const { accent } = useTheme();
  const openItems = useMemo(() => [
    ...state.tasks.filter((t) => !t.done).map((t) => t.text),
    ...state.homework.filter((h) => !h.completed).map((h) => `${h.subject} homework — ${h.teacher}`),
  ], [state]);

  const [currentTask, setCurrentTask] = useState(openItems[0] || "");
  const [seconds, setSeconds] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [notes, setNotes] = useState("");
  const [music, setMusic] = useState("none");
  const [calcExpr, setCalcExpr] = useState("");
  const [calcResult, setCalcResult] = useState("");
  const total = 25 * 60;

  useEffect(() => {
    if (!running) return;
    if (seconds <= 0) {
      setRunning(false);
      onSessionComplete(25);
      return;
    }
    const t = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [running, seconds, onSessionComplete]);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  const pct = 1 - seconds / total;

  const pressCalc = (k) => {
    if (k === "C") { setCalcExpr(""); setCalcResult(""); return; }
    if (k === "=") {
      try { setCalcResult(String(math.evaluate(calcExpr))); }
      catch { setCalcResult("Error"); }
      return;
    }
    if (k === "⌫") { setCalcExpr((e) => e.slice(0, -1)); return; }
    setCalcExpr((e) => e + k);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: "rgba(6,9,15,0.92)", backdropFilter: "blur(10px)" }}
    >
      <button onClick={onExit} className="absolute top-6 right-6 text-slate-400 hover:text-white">
        <X size={22} />
      </button>

      <div className="w-full max-w-3xl grid md:grid-cols-2 gap-6 fh-fade">
        {/* Timer + task */}
        <div className="flex flex-col items-center justify-center gap-5">
          <svg width="220" height="220" viewBox="0 0 220 220">
            <circle cx="110" cy="110" r="95" stroke="#1F2937" strokeWidth="10" fill="none" />
            <circle
              cx="110" cy="110" r="95" stroke={COLORS.focus} strokeWidth="10" fill="none"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 95}
              strokeDashoffset={2 * Math.PI * 95 * (1 - pct)}
              transform="rotate(-90 110 110)"
              style={{ transition: "stroke-dashoffset 1s linear" }}
            />
            <text x="110" y="120" textAnchor="middle" fontSize="42" fill="#fff" fontFamily="'Space Grotesk', sans-serif" fontWeight="600">
              {mm}:{ss}
            </text>
          </svg>
          <div className="flex gap-3">
            <button onClick={() => setRunning((r) => !r)} className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white flex items-center gap-2" style={{ background: COLORS.focus }}>
              {running ? <Pause size={15} /> : <Play size={15} />} {running ? "Pause" : "Start"}
            </button>
            <button onClick={() => { setRunning(false); setSeconds(total); }} className="rounded-xl px-4 py-2.5 text-sm text-slate-300 border border-white/10">
              <RotateCcw size={15} />
            </button>
          </div>
          <select
            value={currentTask}
            onChange={(e) => setCurrentTask(e.target.value)}
            className="w-full max-w-xs rounded-xl px-3 py-2 text-sm bg-slate-900/70 border border-white/10 text-white outline-none"
          >
            {openItems.length === 0 && <option>No open tasks</option>}
            {openItems.map((o) => <option key={o}>{o}</option>)}
          </select>
          <div className="flex gap-2 flex-wrap justify-center">
            {MUSIC_OPTIONS.map((m) => {
              const Icon = m.icon;
              return (
                <button
                  key={m.id}
                  onClick={() => setMusic(m.id)}
                  className="w-9 h-9 rounded-xl flex items-center justify-center fh-surface"
                  style={{ background: music === m.id ? `${accent}33` : "rgba(255,255,255,0.04)", color: music === m.id ? accent : "#9CA3AF" }}
                  title={m.label}
                >
                  <Icon size={15} />
                </button>
              );
            })}
          </div>
          <p className="text-[10px] text-slate-500">Ambient sound is a visual placeholder in this prototype.</p>
        </div>

        {/* Notes + calculator */}
        <div className="flex flex-col gap-4">
          <GlassCard className="p-4 flex-1">
            <div className="text-xs text-slate-400 mb-2 flex items-center gap-1.5"><StickyNote size={13} /> Quick notes</div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Jot anything down while you focus…"
              className="w-full h-28 bg-transparent text-sm text-slate-200 outline-none resize-none placeholder:text-slate-600"
            />
          </GlassCard>
          <GlassCard className="p-4">
            <div className="text-xs text-slate-400 mb-2">Calculator</div>
            <div className="rounded-lg bg-slate-900/70 px-3 py-2 mb-2 text-right">
              <div className="text-slate-500 text-xs h-4 truncate">{calcExpr || " "}</div>
              <div className="text-white text-lg font-semibold truncate">{calcResult || "0"}</div>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {["7","8","9","/","4","5","6","*","1","2","3","-","C","0","=","+"].map((k) => (
                <button
                  key={k}
                  onClick={() => pressCalc(k)}
                  className="rounded-lg py-2 text-sm text-slate-200 fh-surface"
                  style={{ background: "rgba(255,255,255,0.05)" }}
                >
                  {k}
                </button>
              ))}
              <button onClick={() => pressCalc("⌫")} className="col-span-4 rounded-lg py-1.5 text-xs text-slate-400 flex items-center justify-center gap-1 fh-surface" style={{ background: "rgba(255,255,255,0.03)" }}>
                <Delete size={12} /> backspace
              </button>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

export default FocusMode;
