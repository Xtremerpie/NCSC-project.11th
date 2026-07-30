import React, { useState, useEffect } from "react";
import { MonitorPlay } from "lucide-react";
import { useTheme } from "../lib/theme";
import GlassCard from "../components/ui/GlassCard";
import SectionTitle from "../components/ui/SectionTitle";
import Empty from "../components/ui/Empty";

const SB_DATA = {
  "Class 9-A": {
    Physics: {
      "Ch 1 — Motion": ["PDF", "Video", "Slides", "Quiz", "Whiteboard"],
      "Ch 2 — Force & Laws": ["PDF", "Slides", "Quiz"],
    },
    Math: {
      "Ch 3 — Polynomials": ["PDF", "Video", "Whiteboard"],
    },
  },
  "Class 9-B": {
    English: { "Ch 4 — Poetry": ["PDF", "Slides"] },
  },
};

function SmartBoard({ update }) {
  const { accent } = useTheme();
  const classes = Object.keys(SB_DATA);
  const [cls, setCls] = useState(classes[0]);
  const subjects = Object.keys(SB_DATA[cls]);
  const [subject, setSubject] = useState(subjects[0]);
  const chapters = Object.keys(SB_DATA[cls][subject] || {});
  const [chapter, setChapter] = useState(chapters[0]);
  const resources = SB_DATA[cls]?.[subject]?.[chapter] || [];
  const [launched, setLaunched] = useState(null);

  useEffect(() => { setSubject(Object.keys(SB_DATA[cls])[0]); }, [cls]);
  useEffect(() => { setChapter(Object.keys(SB_DATA[cls][subject] || {})[0]); }, [cls, subject]); // eslint-disable-line

  const launch = (r) => {
    setLaunched(r);
    update((s) => {
      s.eco.digitalWorksheets += 1;
      s.eco.paperSaved += 5; // approx sheets saved per digital resource opened
      return s;
    });
  };

  return (
    <div className="fh-fade space-y-4">
      <GlassCard className="p-5">
        <SectionTitle icon={MonitorPlay} title="Smart Board Resource Launcher" subtitle="Teacher login → class → subject → chapter → open" />
        <div className="flex flex-wrap gap-2">
          <select value={cls} onChange={(e) => setCls(e.target.value)} className="rounded-xl px-3 py-2 text-sm bg-slate-900/60 border border-white/10 text-white outline-none">
            {classes.map((c) => <option key={c}>{c}</option>)}
          </select>
          <select value={subject} onChange={(e) => setSubject(e.target.value)} className="rounded-xl px-3 py-2 text-sm bg-slate-900/60 border border-white/10 text-white outline-none">
            {subjects.map((s) => <option key={s}>{s}</option>)}
          </select>
          <select value={chapter} onChange={(e) => setChapter(e.target.value)} className="rounded-xl px-3 py-2 text-sm bg-slate-900/60 border border-white/10 text-white outline-none">
            {chapters.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
      </GlassCard>

      <GlassCard className="p-5">
        <h3 className="text-white text-sm font-semibold mb-3">Available resources</h3>
        <div className="flex flex-wrap gap-2">
          {resources.length === 0 && <Empty text="No resources for this chapter." />}
          {resources.map((r) => (
            <button
              key={r}
              onClick={() => launch(r)}
              className="rounded-xl px-4 py-3 text-sm text-white flex items-center gap-2"
              style={{ background: "rgba(59,130,246,0.14)" }}
            >
              <MonitorPlay size={15} style={{ color: accent }} /> {r}
            </button>
          ))}
        </div>
        {launched && (
          <GlassCard className="p-6 mt-4 text-center" style={{ background: "rgba(59,130,246,0.08)" }}>
            <p className="text-white font-medium">Now launching: {chapter} — {launched}</p>
            <p className="text-xs text-slate-400 mt-1">Instantly displayed on the classroom board.</p>
          </GlassCard>
        )}
      </GlassCard>
    </div>
  );
}
export default SmartBoard;
