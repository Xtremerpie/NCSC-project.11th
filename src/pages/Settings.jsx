import React, { useState } from "react";
import { Settings as SettingsIcon, Bell, User, Trash2, Moon, Sun, CheckCircle2 } from "lucide-react";
import { useTheme, COLORS, ACCENT_MAP } from "../lib/theme";
import { defaultState } from "../lib/state";
import GlassCard from "../components/ui/GlassCard";
import SectionTitle from "../components/ui/SectionTitle";
import Toggle from "../components/ui/Toggle";

function SettingsPage({ state, update }) {
  const { accent } = useTheme();
  const s = state.settings;
  const setField = (key, value) => update((st) => { st.settings[key] = value; return st; });
  const [confirmReset, setConfirmReset] = useState(false);

  return (
    <div className="fh-fade space-y-4">
      <GlassCard className="p-5">
        <SectionTitle icon={SettingsIcon} title="Appearance" />
        <div className="mb-4">
          <label className="text-xs text-slate-400 block mb-2">Theme</label>
          <div className="flex gap-2">
            <button
              onClick={() => setField("theme", "dark")}
              className="flex-1 rounded-xl px-3 py-2.5 text-sm flex items-center justify-center gap-2"
              style={{ background: s.theme === "dark" ? `${accent}29` : "rgba(255,255,255,0.04)", color: s.theme === "dark" ? accent : "#9CA3AF" }}
            >
              <Moon size={15} /> Dark
            </button>
            <button
              onClick={() => setField("theme", "light")}
              className="flex-1 rounded-xl px-3 py-2.5 text-sm flex items-center justify-center gap-2"
              style={{ background: s.theme === "light" ? `${accent}29` : "rgba(255,255,255,0.04)", color: s.theme === "light" ? accent : "#9CA3AF" }}
            >
              <Sun size={15} /> Light
            </button>
          </div>
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-2">Accent color</label>
          <div className="flex gap-2 flex-wrap">
            {Object.entries(ACCENT_MAP).map(([name, hex]) => (
              <button
                key={name}
                onClick={() => setField("accent", name)}
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{ background: hex, boxShadow: s.accent === name ? `0 0 0 2px #0B0F19, 0 0 0 4px ${hex}` : "none" }}
                title={name}
              >
                {s.accent === name && <CheckCircle2 size={15} className="text-white" />}
              </button>
            ))}
          </div>
        </div>
      </GlassCard>

      <GlassCard className="p-5">
        <SectionTitle icon={Bell} title="Notifications & Sync" />
        <div className="space-y-1">
          <Toggle label="Sound alerts" checked={s.sound} onChange={(v) => setField("sound", v)} accent={accent} />
          <Toggle label="Auto save" checked={s.autoSave} onChange={(v) => setField("autoSave", v)} accent={accent} />
          <Toggle label="Cloud sync" checked={s.cloudSync} onChange={(v) => setField("cloudSync", v)} accent={accent} />
        </div>
      </GlassCard>

      <GlassCard className="p-5">
        <SectionTitle icon={User} title="Account" />
        <div className="text-sm text-slate-300 space-y-2">
          <div className="flex justify-between"><span className="text-slate-400">Language</span><span>English</span></div>
          <div className="flex justify-between"><span className="text-slate-400">About</span><span>FocusHeist — Steal your focus back</span></div>
          <div className="flex justify-between"><span className="text-slate-400">Version</span><span>1.0.0 (NCSC prototype)</span></div>
        </div>
      </GlassCard>

      <GlassCard className="p-5">
        <SectionTitle icon={Trash2} title="Reset data" subtitle="Clears tasks, homework, notes and stats on this device" />
        {!confirmReset ? (
          <button onClick={() => setConfirmReset(true)} className="rounded-xl px-4 py-2 text-sm font-semibold text-white" style={{ background: COLORS.error }}>
            Reset all data
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Are you sure? This can't be undone.</span>
            <button
              onClick={() => { update(() => defaultState()); setConfirmReset(false); }}
              className="rounded-xl px-3 py-1.5 text-xs font-semibold text-white" style={{ background: COLORS.error }}
            >
              Yes, reset
            </button>
            <button onClick={() => setConfirmReset(false)} className="rounded-xl px-3 py-1.5 text-xs text-slate-300 border border-white/10">Cancel</button>
          </div>
        )}
      </GlassCard>
    </div>
  );
}

export default SettingsPage;
