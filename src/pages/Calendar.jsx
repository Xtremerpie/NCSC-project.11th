import React, { useState, useMemo } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Plus, Trash2 } from "lucide-react";
import { useTheme, COLORS } from "../lib/theme";
import { uid, nextDate } from "../lib/state";
import GlassCard from "../components/ui/GlassCard";
import SectionTitle from "../components/ui/SectionTitle";
import Badge from "../components/ui/Badge";
import Empty from "../components/ui/Empty";

const EVENT_TYPES = ["Event", "Test", "Assignment", "Holiday"];
const EVENT_COLOR = { Event: COLORS.accent, Test: COLORS.error, Assignment: COLORS.warn, Holiday: COLORS.focus };

function CalendarPage({ state, update }) {
  const { accent } = useTheme();
  const [cursor, setCursor] = useState(new Date());
  const [view, setView] = useState("Month");
  const [selectedDate, setSelectedDate] = useState(nextDate(0));
  const [form, setForm] = useState({ title: "", date: nextDate(0), type: "Event" });

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstDay = new Date(year, month, 1);
  const startOffset = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [...Array(startOffset).fill(null), ...Array(daysInMonth).keys()].map((d) => (d === null ? null : d + 1));

  const itemsByDate = useMemo(() => {
    const map = {};
    state.events.forEach((e) => { (map[e.date] ||= []).push({ ...e, kind: e.type }); });
    state.homework.forEach((h) => { (map[h.dueDate] ||= []).push({ id: h.id, title: `${h.subject} homework due`, kind: "Assignment" }); });
    return map;
  }, [state.events, state.homework]);

  const fmt = (d) => `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  const today = nextDate(0);

  const addEvent = () => {
    if (!form.title.trim()) return;
    update((s) => { s.events.push({ id: uid(), ...form }); return s; });
    setForm({ title: "", date: selectedDate, type: "Event" });
  };
  const removeEvent = (id) => update((s) => { s.events = s.events.filter((e) => e.id !== id); return s; });

  const selectedItems = itemsByDate[selectedDate] || [];

  return (
    <div className="fh-fade space-y-4">
      <GlassCard className="p-5">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <SectionTitle icon={CalendarDays} title="Calendar" subtitle="Homework, tests, assignments and events" />
          <div className="flex items-center gap-2">
            {["Month", "Week", "Day"].map((v) => (
              <button key={v} onClick={() => setView(v)} className="rounded-lg px-3 py-1.5 text-xs fh-surface" style={{ background: view === v ? `${accent}29` : "rgba(255,255,255,0.04)", color: view === v ? accent : "#9CA3AF" }}>
                {v}
              </button>
            ))}
          </div>
        </div>

        {view !== "Month" ? (
          <Empty text={`${view} view is coming soon — Month view is fully working for now.`} />
        ) : (
          <>
            <div className="flex items-center justify-between mb-3">
              <button onClick={() => setCursor(new Date(year, month - 1, 1))} className="text-slate-400 hover:text-white"><ChevronLeft size={18} /></button>
              <span className="text-white font-semibold text-sm">{cursor.toLocaleDateString(undefined, { month: "long", year: "numeric" })}</span>
              <button onClick={() => setCursor(new Date(year, month + 1, 1))} className="text-slate-400 hover:text-white"><ChevronRight size={18} /></button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-slate-500 mb-1">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => <div key={d}>{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {cells.map((d, i) => {
                if (d === null) return <div key={i} />;
                const dateStr = fmt(d);
                const items = itemsByDate[dateStr] || [];
                const isToday = dateStr === today;
                const isSelected = dateStr === selectedDate;
                return (
                  <button
                    key={i}
                    onClick={() => setSelectedDate(dateStr)}
                    className="aspect-square rounded-lg flex flex-col items-center justify-center text-xs relative fh-surface"
                    style={{
                      background: isSelected ? `${accent}29` : "rgba(255,255,255,0.03)",
                      color: isToday ? accent : "#e2e8f0",
                      border: isToday ? `1px solid ${accent}` : "1px solid transparent",
                    }}
                  >
                    {d}
                    {items.length > 0 && (
                      <span className="flex gap-0.5 mt-0.5">
                        {items.slice(0, 3).map((it, idx) => (
                          <span key={idx} className="w-1 h-1 rounded-full" style={{ background: EVENT_COLOR[it.kind] || accent }} />
                        ))}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </GlassCard>

      <div className="grid md:grid-cols-2 gap-4">
        <GlassCard className="p-5">
          <h3 className="text-white text-sm font-semibold mb-3">{selectedDate}</h3>
          {selectedItems.length === 0 ? <Empty text="Nothing scheduled." /> : (
            <ul className="space-y-2">
              {selectedItems.map((it, idx) => (
                <li key={idx} className="flex items-center gap-2 text-sm text-slate-200">
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: EVENT_COLOR[it.kind] || accent }} />
                  <span className="flex-1 truncate">{it.title}</span>
                  <Badge color={EVENT_COLOR[it.kind] || accent}>{it.kind}</Badge>
                  {it.kind !== "Assignment" && (
                    <button onClick={() => removeEvent(it.id)} className="text-slate-500 hover:text-red-400"><Trash2 size={13} /></button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </GlassCard>

        <GlassCard className="p-5">
          <h3 className="text-white text-sm font-semibold mb-3">Add event</h3>
          <div className="space-y-2">
            <input placeholder="Title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className="w-full rounded-xl px-3 py-2 text-sm bg-slate-900/60 border border-white/10 text-white outline-none" />
            <input type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} className="w-full rounded-xl px-3 py-2 text-sm bg-slate-900/60 border border-white/10 text-white outline-none" />
            <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))} className="w-full rounded-xl px-3 py-2 text-sm bg-slate-900/60 border border-white/10 text-white outline-none">
              {EVENT_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
            <button onClick={addEvent} className="w-full rounded-xl px-4 py-2 text-sm font-semibold text-white flex items-center justify-center gap-1" style={{ background: accent }}>
              <Plus size={15} /> Add to calendar
            </button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
export default CalendarPage;
