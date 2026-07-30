import { loadState } from "./lib/state";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Target, ChevronRight, Flame, Settings as SettingsIcon } from "lucide-react";
import {
  LayoutDashboard, CalendarClock, CalendarDays, TimerReset, BookOpenCheck,
  StickyNote, MonitorPlay, QrCode, Leaf, BarChart3, Files,
} from "lucide-react";
import { ThemeCtx, ACCENT_MAP, COLORS } from "./lib/theme";
import { defaultState, mergeWithDefaults, applyDailyVisit, getNewlyEarned } from "./lib/state";
import { sbFetchState, sbSaveState } from "./lib/supabase";

import GlassCard from "./components/ui/GlassCard";
import SyncBadge from "./components/SyncBadge";
import NotificationBell from "./components/NotificationBell";

import Dashboard from "./pages/Dashboard";
import Planner from "./pages/Planner";
import CalendarPage from "./pages/Calendar";
import FocusPanel from "./pages/FocusPanel";
import FocusMode from "./pages/FocusMode";
import Pomodoro from "./pages/Pomodoro";
import Homework from "./pages/Homework";
import Classwork from "./pages/Classwork";
import Notes from "./pages/Notes";
import SmartBoard from "./pages/SmartBoard";
import QRSharing from "./pages/QRSharing";
import EcoDashboard from "./pages/EcoDashboard";
import Analytics from "./pages/Analytics";
import ProfilePage from "./pages/Profile";
import SettingsPage from "./pages/Settings";

const NAV = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "planner", label: "Daily Planner", icon: CalendarClock },
  { id: "calendar", label: "Calendar", icon: CalendarDays },
  { id: "focus", label: "Focus Mode", icon: Target },
  { id: "pomodoro", label: "Pomodoro", icon: TimerReset },
  { id: "homework", label: "Homework", icon: BookOpenCheck },
  { id: "classwork", label: "Classwork & Files", icon: Files },
  { id: "notes", label: "Notes", icon: StickyNote },
  { id: "smartboard", label: "Smart Board", icon: MonitorPlay },
  { id: "qr", label: "QR Sharing", icon: QrCode },
  { id: "eco", label: "Eco Dashboard", icon: Leaf },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
];

function FocusHeistApp() {
  const [state, setState] = useState(loadState);
  const [tab, setTab] = useState("dashboard");
  const [focusActive, setFocusActive] = useState(false);
  const [syncStatus, setSyncStatus] = useState("connecting");
  const [lastSync, setLastSync] = useState(null);
  const loadedRef = useRef(false);
  const deviceIdRef = useRef(null);
  const dirtyRef = useRef(false);

  // establish a stable per-browser device id (kept in Claude's storage,
  // since artifacts can't use localStorage), then load this device's
  // saved state from Supabase
  useEffect(() => {
    (async () => {
      try {
        let id;
        try {
          const idRes = await window.storage?.get("device_id", false);
          id = idRes?.value;
        } catch {
          id = null;
        }
        if (!id) {
          id = crypto.randomUUID();
          await window.storage?.set("device_id", id, false).catch(() => {});
        }
        deviceIdRef.current = id;

        const rows = await sbFetchState(id);
        let loaded = rows?.[0]?.state ? mergeWithDefaults(rows[0].state) : defaultState();
        loaded = applyDailyVisit(loaded);
        setState(loaded);
        await sbSaveState(id, loaded);
        setSyncStatus("connected");
        setLastSync(new Date());
      } catch (e) {
        console.error(e);
        setSyncStatus("error");
      } finally {
        loadedRef.current = true;
      }
    })();
  }, []);

  // persist to Supabase on change (debounced) — shows syncing/local-change states in between
  useEffect(() => {
    if (!loadedRef.current || !deviceIdRef.current) return;
    dirtyRef.current = true;
    setSyncStatus((s) => (s === "error" ? "local" : "syncing"));
    const t = setTimeout(() => {
      sbSaveState(deviceIdRef.current, state)
        .then(() => { dirtyRef.current = false; setSyncStatus("connected"); setLastSync(new Date()); })
        .catch((e) => { console.error(e); setSyncStatus("error"); });
    }, 600);
    return () => clearTimeout(t);
  }, [state]);

  const update = useCallback((fn) => setState((s) => fn(structuredClone(s))), []);

  const logStudySession = useCallback((minutes) => {
    update((s) => {
      s.pomodoro.sessionsToday += 1;
      s.pomodoro.focusMinutesToday += minutes;
      s.eco.studySessions += 1;
      return s;
    });
  }, [update]);

  // auto-detect newly-earned achievements as stats change
  useEffect(() => {
    if (!loadedRef.current) return;
    const newIds = getNewlyEarned(state);
    if (newIds.length > 0) {
      update((s) => { s.achievementsEarned = [...s.achievementsEarned, ...newIds]; return s; });
    }
  }, [state.tasks, state.pomodoro, state.eco, state.profile.streak]); // eslint-disable-line

  const markNotificationsSeen = useCallback(() => {
    update((s) => { s.seenAchievementIds = [...s.achievementsEarned]; return s; });
  }, [update]);

  const mode = state.settings.theme || "dark";
  const accent = ACCENT_MAP[state.settings.accent] || COLORS.accent;
  const light = mode === "light";

  return (
    <ThemeCtx.Provider value={{ mode, accent }}>
      <div
        className={`w-full min-h-[720px] flex gap-4 p-4 ${light ? "fh-light" : ""}`}
        style={{
          "--fh-accent": accent,
          background: light
            ? "radial-gradient(1200px 600px at 10% -10%, #eef2ff 0%, #f4f6fb 55%)"
            : `radial-gradient(1200px 600px at 10% -10%, #16203a 0%, ${COLORS.bg0} 55%)`,
          fontFamily: "'Inter', sans-serif",
          transition: "background .3s ease",
        }}
      >
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap');
          ::-webkit-scrollbar { width: 6px; height: 6px; }
          ::-webkit-scrollbar-thumb { background: #374151; border-radius: 999px; }
          @keyframes fh-breathe { 0%,100% { transform: scale(1); opacity: .55; } 50% { transform: scale(1.06); opacity: .9; } }
          @keyframes fh-fade { from { opacity:0; transform: translateY(4px);} to { opacity:1; transform:none; } }
          @keyframes fh-pop { 0% { transform: scale(.9); opacity:0; } 100% { transform: scale(1); opacity:1; } }
          .fh-fade { animation: fh-fade .25s ease; }
          .fh-pop { animation: fh-pop .2s ease; }
          button { font-family: inherit; transition: transform .12s ease, opacity .12s ease; }
          button:active { transform: scale(0.97); }
          input, textarea, select { font-family: inherit; transition: border-color .15s ease; }
          input:focus, select:focus, textarea:focus { border-color: var(--fh-accent) !important; outline: none; }

          .fh-light .text-white { color: #0f172a !important; }
          .fh-light .text-slate-200 { color: #1e293b !important; }
          .fh-light .text-slate-300 { color: #334155 !important; }
          .fh-light .text-slate-400 { color: #64748b !important; }
          .fh-light .text-slate-500 { color: #94a3b8 !important; }
          .fh-light .placeholder\\:text-slate-600::placeholder { color: #cbd5e1 !important; }
          .fh-light .border-white\\/10 { border-color: rgba(15,23,42,0.12) !important; }
          .fh-light .bg-slate-900\\/60, .fh-light .bg-slate-900\\/70 { background: rgba(255,255,255,0.85) !important; }
          .fh-light .fh-surface { background: rgba(15,23,42,0.06) !important; }
          .fh-light ::-webkit-scrollbar-thumb { background: #cbd5e1; }
        `}</style>

        {/* Sidebar */}
        <GlassCard className="w-56 shrink-0 p-4 flex flex-col" style={{ position: "sticky", top: 16, alignSelf: "flex-start" }}>
          <div className="mb-4 px-1">
            <div className="text-white font-bold text-xl" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Focus<span style={{ color: accent }}>Heist</span>
            </div>
            <div className="text-[11px] text-slate-400 tracking-wide mb-2">Steal your focus back.</div>
            <div className="flex items-center gap-2">
              <SyncBadge status={syncStatus} deviceId={deviceIdRef.current} pending={dirtyRef.current ? 1 : 0}
                lastSync={lastSync ? lastSync.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : null} />
              <NotificationBell state={state} onOpenChange={markNotificationsSeen} />
            </div>
          </div>
          <nav className="flex flex-col gap-1 overflow-y-auto" style={{ maxHeight: 380 }}>
            {NAV.map((n) => {
              const active = tab === n.id;
              const Icon = n.icon;
              return (
                <button
                  key={n.id}
                  onClick={() => setTab(n.id)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all"
                  style={{
                    background: active ? `${accent}29` : "transparent",
                    color: active ? accent : "#9CA3AF",
                  }}
                >
                  <Icon size={16} />
                  <span className="truncate">{n.label}</span>
                  {active && <ChevronRight size={14} className="ml-auto opacity-70" />}
                </button>
              );
            })}
          </nav>
          <div className="mt-auto pt-4 space-y-2">
            <button
              onClick={() => setTab("profile")}
              className="w-full flex items-center gap-2 px-2 py-2 rounded-xl text-left fh-surface"
              style={{ background: "rgba(255,255,255,0.04)" }}
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ background: accent }}>
                {(state.profile.name || "S").slice(0, 1).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs text-white font-medium truncate">{state.profile.name}</div>
                <div className="text-[10px] text-slate-400 flex items-center gap-1"><Flame size={10} style={{ color: COLORS.warn }} /> {state.profile.streak} day streak</div>
              </div>
              <SettingsIcon
                size={14}
                className="text-slate-500 hover:text-white shrink-0"
                onClick={(e) => { e.stopPropagation(); setTab("settings"); }}
              />
            </button>
            <button
              onClick={() => setFocusActive(true)}
              className="w-full rounded-xl py-2.5 text-sm font-semibold text-white flex items-center justify-center gap-2"
              style={{ background: `linear-gradient(135deg, ${accent}, #2563eb)` }}
            >
              <Target size={16} /> Enter Focus
            </button>
          </div>
        </GlassCard>

        {/* Main */}
        <div className="flex-1 min-w-0">
          {tab === "dashboard" && <Dashboard state={state} setTab={setTab} onEnterFocus={() => setFocusActive(true)} />}
          {tab === "planner" && <Planner state={state} update={update} />}
          {tab === "calendar" && <CalendarPage state={state} update={update} />}
          {tab === "focus" && <FocusPanel onEnter={() => setFocusActive(true)} state={state} />}
          {tab === "pomodoro" && <Pomodoro state={state} logStudySession={logStudySession} />}
          {tab === "homework" && <Homework state={state} update={update} />}
          {tab === "classwork" && <Classwork state={state} update={update} />}
          {tab === "notes" && <Notes state={state} update={update} />}
          {tab === "smartboard" && <SmartBoard update={update} />}
          {tab === "qr" && <QRSharing />}
          {tab === "eco" && <EcoDashboard state={state} />}
          {tab === "analytics" && <Analytics state={state} />}
          {tab === "profile" && <ProfilePage state={state} update={update} />}
          {tab === "settings" && <SettingsPage state={state} update={update} />}
        </div>

        {focusActive && (
          <FocusMode
            state={state}
            onExit={() => setFocusActive(false)}
            onSessionComplete={logStudySession}
          />
        )}
      </div>
    </ThemeCtx.Provider>
  );
}


export default function FocusHeist() {
  return <FocusHeistApp />;
}
