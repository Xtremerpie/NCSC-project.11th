import React, { useState, useMemo } from "react";
import { Bell, Flame, BookOpenCheck, Trophy, X } from "lucide-react";
import { COLORS } from "../lib/theme";
import { ACHIEVEMENTS, nextDate } from "../lib/state";
import GlassCard from "./ui/GlassCard";

function useNotifications(state) {
  return useMemo(() => {
    const items = [];
    state.homework.filter((h) => !h.completed).forEach((h) => {
      const days = Math.ceil((new Date(h.dueDate) - new Date(nextDate(0))) / 86400000);
      if (days <= 2) {
        items.push({
          id: `hw-${h.id}`,
          icon: days <= 0 ? Flame : BookOpenCheck,
          color: days <= 0 ? COLORS.error : COLORS.warn,
          text: days <= 0 ? `${h.subject} homework is due today` : `${h.subject} homework due in ${days} day${days > 1 ? "s" : ""}`,
        });
      }
    });
    const newAchievements = state.achievementsEarned.filter((id) => !state.seenAchievementIds.includes(id));
    newAchievements.forEach((id) => {
      const a = ACHIEVEMENTS.find((x) => x.id === id);
      if (a) items.push({ id: `ach-${id}`, icon: Trophy, color: COLORS.focus, text: `Achievement unlocked — ${a.label}` });
    });
    return items;
  }, [state.homework, state.achievementsEarned, state.seenAchievementIds]);
}

function NotificationBell({ state, onOpenChange }) {
  const [open, setOpen] = useState(false);
  const notifications = useNotifications(state);
  const toggle = () => {
    const next = !open;
    setOpen(next);
    if (next) onOpenChange();
  };
  return (
    <div className="relative">
      <button onClick={toggle} className="relative w-8 h-8 rounded-xl flex items-center justify-center fh-surface" style={{ background: "rgba(255,255,255,0.05)" }}>
        <Bell size={15} className="text-slate-300" />
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] flex items-center justify-center text-white" style={{ background: COLORS.error }}>
            {notifications.length}
          </span>
        )}
      </button>
      {open && (
        <GlassCard className="absolute z-40 top-9 left-0 w-64 p-3 fh-fade" style={{ boxShadow: "0 12px 40px rgba(0,0,0,0.45)" }}>
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-white text-xs font-semibold">Notifications</span>
            <button onClick={() => setOpen(false)} className="text-slate-500 hover:text-white"><X size={13} /></button>
          </div>
          {notifications.length === 0 ? (
            <p className="text-xs text-slate-500 py-4 text-center italic">You're all caught up.</p>
          ) : (
            <ul className="space-y-1 max-h-64 overflow-y-auto">
              {notifications.map((n) => {
                const Icon = n.icon;
                return (
                  <li key={n.id} className="flex items-start gap-2 text-xs text-slate-300 px-2 py-2 rounded-lg" style={{ background: "rgba(255,255,255,0.03)" }}>
                    <Icon size={13} style={{ color: n.color }} className="mt-0.5 shrink-0" />
                    <span>{n.text}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </GlassCard>
      )}
    </div>
  );
}
export default NotificationBell;
export { useNotifications };
