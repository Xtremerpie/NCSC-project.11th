import React, { useState } from "react";
import { StickyNote, Plus, Trash2 } from "lucide-react";
import { useTheme } from "../lib/theme";
import { uid } from "../lib/state";
import GlassCard from "../components/ui/GlassCard";
import SectionTitle from "../components/ui/SectionTitle";
import Badge from "../components/ui/Badge";
import Empty from "../components/ui/Empty";

function Notes({ state, update }) {
  const { accent } = useTheme();
  const [query, setQuery] = useState("");
  const [form, setForm] = useState({ title: "", subject: "", content: "" });
  const [openId, setOpenId] = useState(null);

  const add = () => {
    if (!form.title.trim()) return;
    update((s) => { s.notes.unshift({ id: uid(), ...form }); return s; });
    setForm({ title: "", subject: "", content: "" });
  };
  const remove = (id) => update((s) => { s.notes = s.notes.filter((n) => n.id !== id); return s; });

  const filtered = state.notes.filter((n) =>
    (n.title + n.subject + n.content).toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fh-fade space-y-4">
      <GlassCard className="p-5">
        <SectionTitle icon={StickyNote} title="Notes" subtitle="Organize by subject, searchable" />
        <input
          value={query} onChange={(e) => setQuery(e.target.value)}
          placeholder="Search notes…"
          className="w-full rounded-xl px-3 py-2 text-sm bg-slate-900/60 border border-white/10 text-white outline-none mb-3"
        />
        <div className="grid md:grid-cols-3 gap-2 mb-2">
          <input placeholder="Title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className="rounded-xl px-3 py-2 text-sm bg-slate-900/60 border border-white/10 text-white outline-none" />
          <input placeholder="Subject / folder" value={form.subject} onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))} className="rounded-xl px-3 py-2 text-sm bg-slate-900/60 border border-white/10 text-white outline-none" />
          <button onClick={add} className="rounded-xl px-4 py-2 text-sm font-semibold text-white flex items-center justify-center gap-1" style={{ background: accent }}>
            <Plus size={15} /> New note
          </button>
        </div>
        <textarea
          placeholder="Write your note…"
          value={form.content}
          onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
          className="w-full h-20 rounded-xl px-3 py-2 text-sm bg-slate-900/60 border border-white/10 text-white outline-none resize-none"
        />
      </GlassCard>

      <div className="grid md:grid-cols-2 gap-3">
        {filtered.length === 0 ? <Empty text="No notes found." /> : filtered.map((n) => (
          <GlassCard key={n.id} className="p-4">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="text-white font-semibold text-sm truncate">{n.title}</h3>
              <button onClick={() => remove(n.id)} className="text-slate-500 hover:text-red-400 shrink-0"><Trash2 size={13} /></button>
            </div>
            {n.subject && <Badge color={accent}>{n.subject}</Badge>}
            <p className={`text-xs text-slate-400 mt-2 ${openId === n.id ? "" : "line-clamp-3"}`}>{n.content}</p>
            {n.content?.length > 120 && (
              <button onClick={() => setOpenId(openId === n.id ? null : n.id)} className="text-[11px] text-blue-400 mt-1 hover:underline">
                {openId === n.id ? "Show less" : "Show more"}
              </button>
            )}
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
export default Notes;
