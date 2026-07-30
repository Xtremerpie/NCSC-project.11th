import React from "react";
import { User, Trophy, CheckCircle2 } from "lucide-react";
import { useTheme, COLORS } from "../lib/theme";
import { ACHIEVEMENTS } from "../lib/state";
import GlassCard from "../components/ui/GlassCard";
import SectionTitle from "../components/ui/SectionTitle";
import Field from "../components/ui/Field";

function ProfilePage({ state, update }) {
  const { accent } = useTheme();
  const p = state.profile;
  const setField = (key, value) => update((s) => { s.profile[key] = value; return s; });
  const tasksDone = state.tasks.filter((t) => t.done).length;

  return (
    <div className="fh-fade space-y-4">
      <GlassCard className="p-6">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white shrink-0" style={{ background: accent }}>
            {(p.name || "S").slice(0, 1).toUpperCase()}
          </div>
          <div className="flex-1 min-w-[200px]">
            <input value={p.name} onChange={(e) => setField("name", e.target.value)} className="bg-transparent text-white text-xl font-bold outline-none border-b border-transparent focus:border-white/20 w-full" style={{ fontFamily: "'Space Grotesk', sans-serif" }} />
            <p className="text-xs text-slate-400 mt-1">Joined {p.joinedDate}</p>
          </div>
          <div className="flex gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-white">{p.streak}</div>
              <div className="text-[10px] text-slate-400">Day streak</div>
            </div>
            <div>
              <div className="text-lg font-bold text-white">{p.xp}</div>
              <div className="text-[10px] text-slate-400">XP</div>
            </div>
            <div>
              <div className="text-lg font-bold text-white">{tasksDone}</div>
              <div className="text-[10px] text-slate-400">Tasks done</div>
            </div>
          </div>
        </div>
      </GlassCard>

      <div className="grid md:grid-cols-2 gap-4">
        <GlassCard className="p-5">
          <SectionTitle icon={User} title="School details" />
          <div className="space-y-3">
            <Field label="Class" value={p.className} onChange={(v) => setField("className", v)} />
            <Field label="Roll number" value={p.rollNumber} onChange={(v) => setField("rollNumber", v)} />
            <Field label="School" value={p.school} onChange={(v) => setField("school", v)} />
            <div>
              <label className="text-xs text-slate-400 block mb-1">Daily study goal (hours)</label>
              <input
                type="number" min={0.5} max={12} step={0.5} value={p.studyGoal}
                onChange={(e) => setField("studyGoal", +e.target.value || 1)}
                className="w-full rounded-xl px-3 py-2 text-sm bg-slate-900/60 border border-white/10 text-white outline-none"
              />
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <SectionTitle icon={Trophy} title="Achievements" subtitle={`${state.achievementsEarned.length}/${ACHIEVEMENTS.length} unlocked`} />
          <ul className="space-y-2">
            {ACHIEVEMENTS.map((a) => {
              const earned = state.achievementsEarned.includes(a.id);
              return (
                <li key={a.id} className="flex items-center gap-3 text-sm px-3 py-2 rounded-xl" style={{ background: earned ? `${accent}14` : "rgba(255,255,255,0.03)", opacity: earned ? 1 : 0.5 }}>
                  <span className="text-lg">{a.emoji}</span>
                  <span className={earned ? "text-white" : "text-slate-400"}>{a.label}</span>
                  {earned && <CheckCircle2 size={14} style={{ color: COLORS.focus }} className="ml-auto" />}
                </li>
              );
            })}
          </ul>
        </GlassCard>
      </div>
    </div>
  );
}

export default ProfilePage;
