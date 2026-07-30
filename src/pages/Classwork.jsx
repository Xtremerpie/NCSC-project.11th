import React, { useState } from "react";
import { Files, Plus, Trash2, UploadCloud, Paperclip, Download, Loader2 } from "lucide-react";
import { useTheme, COLORS } from "../lib/theme";
import { uid, nextDate, CLASSWORK_STATUSES, CLASSWORK_STATUS_COLOR } from "../lib/state";
import { sbUploadFile, sbDeleteFile } from "../lib/supabase";
import GlassCard from "../components/ui/GlassCard";
import SectionTitle from "../components/ui/SectionTitle";
import Badge from "../components/ui/Badge";
import Empty from "../components/ui/Empty";

function Classwork({ state, update }) {
  const { accent } = useTheme();
  const [form, setForm] = useState({ subject: "", title: "", notes: "", status: "Not started", dueDate: nextDate(3) });
  const [uploadingId, setUploadingId] = useState(null);
  const [error, setError] = useState("");

  const addItem = () => {
    if (!form.title.trim()) return;
    update((s) => { s.classwork.push({ id: uid(), ...form, files: [] }); return s; });
    setForm({ subject: "", title: "", notes: "", status: "Not started", dueDate: nextDate(3) });
  };

  const editField = (id, key, value) =>
    update((s) => {
      const c = s.classwork.find((x) => x.id === id);
      if (c) c[key] = value;
      return s;
    });

  const removeItem = (id) =>
    update((s) => { s.classwork = s.classwork.filter((c) => c.id !== id); return s; });

  const handleUpload = async (item, file) => {
    setError("");
    setUploadingId(item.id);
    try {
      const path = `${item.id}/${Date.now()}-${file.name}`;
      const url = await sbUploadFile(path, file);
      update((s) => {
        const c = s.classwork.find((x) => x.id === item.id);
        if (c) c.files.push({ name: file.name, path, url, size: file.size, uploadedAt: new Date().toISOString() });
        return s;
      });
    } catch (e) {
      console.error(e);
      setError("Upload failed — make sure the \"classwork-files\" bucket exists in Supabase (see README).");
    } finally {
      setUploadingId(null);
    }
  };

  const removeFile = async (item, file) => {
    try {
      await sbDeleteFile(file.path);
    } catch (e) {
      console.error(e);
    }
    update((s) => {
      const c = s.classwork.find((x) => x.id === item.id);
      if (c) c.files = c.files.filter((f) => f.path !== file.path);
      return s;
    });
  };

  return (
    <div className="fh-fade space-y-4">
      <GlassCard className="p-5">
        <SectionTitle icon={Files} title="Classwork & Files" subtitle="Track assignments per subject and attach reference files" />
        {error && <p className="text-xs mb-3" style={{ color: COLORS.error }}>{error}</p>}
        <div className="grid md:grid-cols-5 gap-2">
          <input
            placeholder="Subject"
            value={form.subject}
            onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
            className="rounded-xl px-3 py-2 text-sm bg-slate-900/60 border border-white/10 text-white outline-none"
          />
          <input
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            className="rounded-xl px-3 py-2 text-sm bg-slate-900/60 border border-white/10 text-white outline-none md:col-span-2"
          />
          <input
            type="date"
            value={form.dueDate}
            onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))}
            className="rounded-xl px-3 py-2 text-sm bg-slate-900/60 border border-white/10 text-white outline-none"
          />
          <button onClick={addItem} className="rounded-xl px-4 py-2 text-sm font-semibold text-white flex items-center justify-center gap-1" style={{ background: accent }}>
            <Plus size={15} /> Add
          </button>
        </div>
      </GlassCard>

      {state.classwork.length === 0 ? (
        <GlassCard className="p-5"><Empty text="No classwork yet." /></GlassCard>
      ) : (
        <div className="space-y-3">
          {state.classwork.map((item) => (
            <GlassCard key={item.id} className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div className="flex-1 min-w-[200px]">
                  <input
                    value={item.title}
                    onChange={(e) => editField(item.id, "title", e.target.value)}
                    className="bg-transparent text-white font-semibold text-sm outline-none w-full"
                  />
                  <div className="flex items-center gap-2 mt-1">
                    <Badge color={accent}>{item.subject || "General"}</Badge>
                    <span className="text-xs text-slate-500">Due {item.dueDate}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={item.status}
                    onChange={(e) => editField(item.id, "status", e.target.value)}
                    className="rounded-lg px-2 py-1.5 text-xs bg-slate-900/60 border border-white/10 outline-none"
                    style={{ color: CLASSWORK_STATUS_COLOR[item.status] }}
                  >
                    {CLASSWORK_STATUSES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                  <button onClick={() => removeItem(item.id)} className="text-slate-500 hover:text-red-400">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              <textarea
                value={item.notes}
                onChange={(e) => editField(item.id, "notes", e.target.value)}
                placeholder="Notes / instructions…"
                className="w-full h-16 rounded-xl px-3 py-2 text-sm bg-slate-900/60 border border-white/10 text-white outline-none resize-none mb-3"
              />

              <div className="flex flex-wrap items-center gap-2">
                {item.files.map((f) => (
                  <a
                    key={f.path}
                    href={f.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg"
                    style={{ background: "rgba(255,255,255,0.05)", color: "#e2e8f0" }}
                  >
                    <Paperclip size={12} /> {f.name}
                    <Download size={12} className="opacity-60" />
                    <span
                      onClick={(e) => { e.preventDefault(); removeFile(item, f); }}
                      className="ml-1 text-slate-500 hover:text-red-400"
                    >
                      <Trash2 size={11} />
                    </span>
                  </a>
                ))}
                <label
                  className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg cursor-pointer"
                  style={{ background: "rgba(255,255,255,0.03)", color: "#9CA3AF" }}
                >
                  {uploadingId === item.id ? <Loader2 size={12} className="animate-spin" /> : <UploadCloud size={12} />}
                  {uploadingId === item.id ? "Uploading…" : "Attach file"}
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleUpload(item, file);
                      e.target.value = "";
                    }}
                  />
                </label>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}

export default Classwork;
