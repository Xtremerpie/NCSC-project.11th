import React, { useState } from "react";
import { BookOpenCheck, Plus, CheckCircle2, Circle, Trash2 } from "lucide-react";
import { useTheme } from "../lib/theme";
import { uid, nextDate, PRIORITIES, PRIORITY_COLOR } from "../lib/state";
import GlassCard from "../components/ui/GlassCard";
import SectionTitle from "../components/ui/SectionTitle";
import Badge from "../components/ui/Badge";
import Empty from "../components/ui/Empty";

function Homework({ state, update }) {
  const { accent } = useTheme();
  const [form, setForm] = useState({ subject: "", dueDate: nextDate(1), priority: "Medium", teacher: "" });

  const add = () => {
    if (!form.subject.trim()) return;
    update((s) => { s.homework.push({ id: uid(), ...form, completed: false }); return s; });
    setForm({ subject: "", dueDate: nextDate(1), priority: "Medium", teacher: "" });
  };
  const toggle = (id) => update((s) => { const h = s.homework.find((x) => x.id === id); if (h) h.completed = !h.completed; return s; });
  const remove = (id) => update((s) => { s.homework = s.homework.filter((x) => x.id !== id); return s; });

  return (
    <div className="fh-fade space-y-4">
      <GlassCard className="p-5">
        <SectionTitle icon={BookOpenCheck} title="Homework Manager" subtitle="Track what's due, by subject and teacher" />
        <div className="flex flex-wrap gap-2">
          <input placeholder="Subject" value={form.subject} onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))} className="rounded-xl px-3 py-2 text-sm bg-slate-900/60 border border-white/10 text-white outline-none w-32" />
          <input placeholder="Teacher name" value={form.teacher} onChange={(e) => setForm((f) => ({ ...f, teacher: e.target.value }))} className="rounded-xl px-3 py-2 text-sm bg-slate-900/60 border border-white/10 text-white outline-none w-36" />
          <input type="date" value={form.dueDate} onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))} className="rounded-xl px-3 py-2 text-sm bg-slate-900/60 border border-white/10 text-white outline-none" />
          <select value={form.priority} onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value }))} className="rounded-xl px-3 py-2 text-sm bg-slate-900/60 border border-white/10 text-white outline-none">
            {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
          </select>
          <button onClick={add} className="rounded-xl px-4 py-2 text-sm font-semibold text-white flex items-center gap-1" style={{ background: accent }}>
            <Plus size={15} /> Add
          </button>
        </div>
      </GlassCard>

      <GlassCard className="p-5">
        {state.homework.length === 0 ? <Empty text="No homework tracked yet." /> : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 text-xs uppercase">
                <th className="pb-2">Subject</th><th className="pb-2">Teacher</th><th className="pb-2">Due</th><th className="pb-2">Priority</th><th className="pb-2">Status</th><th></th>
              </tr>
            </thead>
            <tbody>
              {state.homework.map((h) => (
                <tr key={h.id} className="border-t border-white/5">
                  <td className={`py-2 ${h.completed ? "line-through text-slate-500" : "text-slate-200"}`}>{h.subject}</td>
                  <td className="text-slate-400">{h.teacher || "—"}</td>
                  <td className="text-slate-400">{h.dueDate}</td>
                  <td><Badge color={PRIORITY_COLOR[h.priority]}>{h.priority}</Badge></td>
                  <td>
                    <button onClick={() => toggle(h.id)} className="flex items-center gap-1 text-xs" style={{ color: h.completed ? COLORS.focus : "#9CA3AF" }}>
                      {h.completed ? <CheckCircle2 size={14} /> : <Circle size={14} />} {h.completed ? "Done" : "Pending"}
                    </button>
                  </td>
                  <td><button onClick={() => remove(h.id)} className="text-slate-500 hover:text-red-400"><Trash2 size={14} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </GlassCard>
    </div>
  );
}
export default Homework;
