import React, { useState } from "react";
import { CalendarClock, Plus, CheckCircle2, Circle, Trash2 } from "lucide-react";
import { useTheme } from "../lib/theme";
import { uid, BLOCKS, PRIORITIES, PRIORITY_COLOR } from "../lib/state";
import GlassCard from "../components/ui/GlassCard";
import SectionTitle from "../components/ui/SectionTitle";
import Badge from "../components/ui/Badge";
import Empty from "../components/ui/Empty";

function Planner({ state, update }) {
  const { accent } = useTheme();
  const [text, setText] = useState("");
  const [block, setBlock] = useState("Morning");
  const [priority, setPriority] = useState("Medium");

  const addTask = () => {
    if (!text.trim()) return;
    update((s) => {
      s.tasks.push({ id: uid(), text: text.trim(), block, priority, done: false });
      return s;
    });
    setText("");
  };

  const toggle = (id) =>
    update((s) => {
      const t = s.tasks.find((x) => x.id === id);
      if (t) t.done = !t.done;
      return s;
    });

  const remove = (id) =>
    update((s) => {
      s.tasks = s.tasks.filter((x) => x.id !== id);
      return s;
    });

  return (
    <div className="fh-fade space-y-4">
      <GlassCard className="p-5">
        <SectionTitle icon={CalendarClock} title="Daily Planner" subtitle="Organize tasks across your day" />
        <div className="flex flex-wrap gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
            placeholder="Add a task…"
            className="flex-1 min-w-[180px] rounded-xl px-3 py-2 text-sm bg-slate-900/60 border border-white/10 text-white outline-none focus:border-blue-500"
          />
          <select value={block} onChange={(e) => setBlock(e.target.value)} className="rounded-xl px-3 py-2 text-sm bg-slate-900/60 border border-white/10 text-white outline-none">
            {BLOCKS.map((b) => <option key={b}>{b}</option>)}
          </select>
          <select value={priority} onChange={(e) => setPriority(e.target.value)} className="rounded-xl px-3 py-2 text-sm bg-slate-900/60 border border-white/10 text-white outline-none">
            {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
          </select>
          <button onClick={addTask} className="rounded-xl px-4 py-2 text-sm font-semibold text-white flex items-center gap-1" style={{ background: accent }}>
            <Plus size={15} /> Add
          </button>
        </div>
      </GlassCard>

      <div className="grid md:grid-cols-2 gap-4">
        {BLOCKS.map((b) => {
          const items = state.tasks.filter((t) => t.block === b);
          return (
            <GlassCard key={b} className="p-4">
              <h3 className="text-white font-semibold text-sm mb-3 flex items-center justify-between">
                {b} <span className="text-xs text-slate-500">{items.filter((t) => t.done).length}/{items.length}</span>
              </h3>
              {items.length === 0 ? (
                <Empty text="No tasks yet." />
              ) : (
                <ul className="space-y-2">
                  {items.map((t) => (
                    <li key={t.id} className="flex items-center gap-2 text-sm group">
                      <button onClick={() => toggle(t.id)}>
                        {t.done ? <CheckCircle2 size={16} style={{ color: COLORS.focus }} /> : <Circle size={16} className="text-slate-500" />}
                      </button>
                      <span className={`flex-1 truncate ${t.done ? "line-through text-slate-500" : "text-slate-200"}`}>{t.text}</span>
                      <Badge color={PRIORITY_COLOR[t.priority]}>{t.priority}</Badge>
                      <button onClick={() => remove(t.id)} className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400">
                        <Trash2 size={14} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}
export default Planner;
