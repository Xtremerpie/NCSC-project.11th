import React from "react";
import { Target, CheckCircle2, BookOpenCheck, Flame, Sparkles, Clock, CalendarClock, CalendarDays, StickyNote, RefreshCw, Quote, Circle } from "lucide-react";
import { useTheme } from "../lib/theme";
import { COLORS } from "../lib/theme";
import { PRIORITY_COLOR, nextDate } from "../lib/state";
import GlassCard from "../components/ui/GlassCard";
import SectionTitle from "../components/ui/SectionTitle";
import Badge from "../components/ui/Badge";
import Empty from "../components/ui/Empty";
import StatCard from "../components/ui/StatCard";

const QUOTES = [
  "Small steps every day beat big plans that never start.",
  "Focus is a muscle — the more you use it, the stronger it gets.",
  "Done is better than perfect. Start the next task.",
  "You don't need more time, you need fewer distractions.",
  "Progress, not perfection.",
  "The best time to study was yesterday. The next best time is now.",
];

function Dashboard({ state, setTab, onEnterFocus }) {
  const { accent } = useTheme();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const todayTasks = state.tasks.filter((t) => !t.done);
  const dueHomework = [...state.homework]
    .filter((h) => !h.completed)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  const studyMinutes = state.pomodoro.focusMinutesToday;
  const studyHours = (studyMinutes / 60).toFixed(1);
  const goalMinutes = (state.profile.studyGoal || 2) * 60;
  const goalPct = Math.min(100, Math.round((studyMinutes / goalMinutes) * 100));

  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  const quote = QUOTES[dayOfYear % QUOTES.length];

  const upcomingExam = [...state.events]
    .filter((e) => e.type === "Test" && e.date >= nextDate(0))
    .sort((a, b) => a.date.localeCompare(b.date))[0];

  const recentNotes = [...state.notes].slice(0, 3);

  return (
    <div className="fh-fade space-y-4">
      <GlassCard className="p-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {greeting}, {state.profile.name?.split(" ")[0] || "there"} 👋
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              {new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
            </p>
            <p className="text-slate-500 text-xs mt-2 flex items-center gap-1.5 italic"><Quote size={11} /> {quote}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setTab("pomodoro")}
              className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-200 border border-white/10 flex items-center gap-2"
            >
              <RefreshCw size={15} /> Continue last session
            </button>
            <button
              onClick={onEnterFocus}
              className="rounded-xl px-4 py-2.5 text-sm font-semibold text-white flex items-center gap-2"
              style={{ background: `linear-gradient(135deg, ${COLORS.focus}, #16a34a)` }}
            >
              <Target size={16} /> Start Focus Mode
            </button>
          </div>
        </div>
      </GlassCard>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={CheckCircle2} label="Open tasks" value={todayTasks.length} color={accent} />
        <StatCard icon={BookOpenCheck} label="Homework due" value={dueHomework.length} color={COLORS.warn} />
        <StatCard icon={Flame} label="Study streak" value={`${state.profile.streak}d`} color={COLORS.error} />
        <StatCard icon={Sparkles} label="XP earned" value={state.profile.xp} color={COLORS.focus} />
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <GlassCard className="p-5 md:col-span-2">
          <SectionTitle icon={Clock} title="Today's goal" subtitle={`${studyHours}h of ${state.profile.studyGoal}h studied`} />
          <div className="w-full h-2.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
            <div className="h-full rounded-full" style={{ width: `${goalPct}%`, background: `linear-gradient(90deg, ${accent}, ${COLORS.focus})`, transition: "width .4s ease" }} />
          </div>
          <p className="text-xs text-slate-500 mt-2">{goalPct}% of today's study goal complete</p>
        </GlassCard>
        <GlassCard className="p-5">
          <SectionTitle icon={CalendarDays} title="Upcoming exam" />
          {upcomingExam ? (
            <div>
              <p className="text-white text-sm font-medium">{upcomingExam.title}</p>
              <p className="text-xs text-slate-400 mt-1">{upcomingExam.date}</p>
            </div>
          ) : <Empty text="No tests scheduled." />}
          <button onClick={() => setTab("calendar")} className="text-xs mt-3 hover:underline" style={{ color: accent }}>Open calendar →</button>
        </GlassCard>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <GlassCard className="p-5">
          <SectionTitle icon={CalendarClock} title="Today's tasks" subtitle="From your daily planner" />
          {todayTasks.length === 0 ? (
            <Empty text="Nothing pending — nice work." />
          ) : (
            <ul className="space-y-2">
              {todayTasks.slice(0, 5).map((t) => (
                <li key={t.id} className="flex items-center gap-2 text-sm text-slate-200">
                  <Circle size={14} style={{ color: PRIORITY_COLOR[t.priority] }} />
                  <span className="flex-1 truncate">{t.text}</span>
                  <Badge color={PRIORITY_COLOR[t.priority]}>{t.block}</Badge>
                </li>
              ))}
            </ul>
          )}
          <button onClick={() => setTab("planner")} className="text-xs mt-3 hover:underline" style={{ color: accent }}>
            Open planner →
          </button>
        </GlassCard>

        <GlassCard className="p-5">
          <SectionTitle icon={BookOpenCheck} title="Upcoming homework" subtitle="Sorted by due date" />
          {dueHomework.length === 0 ? (
            <Empty text="All homework submitted." />
          ) : (
            <ul className="space-y-2">
              {dueHomework.slice(0, 5).map((h) => (
                <li key={h.id} className="flex items-center gap-2 text-sm text-slate-200">
                  <span className="flex-1 truncate">{h.subject} — {h.teacher}</span>
                  <span className="text-xs text-slate-400">{h.dueDate}</span>
                  <Badge color={PRIORITY_COLOR[h.priority]}>{h.priority}</Badge>
                </li>
              ))}
            </ul>
          )}
          <button onClick={() => setTab("homework")} className="text-xs mt-3 hover:underline" style={{ color: accent }}>
            Open homework manager →
          </button>
        </GlassCard>
      </div>

      <GlassCard className="p-5">
        <SectionTitle icon={StickyNote} title="Recent notes" />
        {recentNotes.length === 0 ? <Empty text="No notes yet." /> : (
          <div className="grid md:grid-cols-3 gap-3">
            {recentNotes.map((n) => (
              <div key={n.id} className="rounded-xl p-3 fh-surface" style={{ background: "rgba(255,255,255,0.03)" }}>
                <p className="text-white text-sm font-medium truncate">{n.title}</p>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{n.content}</p>
              </div>
            ))}
          </div>
        )}
        <button onClick={() => setTab("notes")} className="text-xs mt-3 hover:underline" style={{ color: accent }}>Open notes →</button>
      </GlassCard>
    </div>
  );
}

export default Dashboard;
