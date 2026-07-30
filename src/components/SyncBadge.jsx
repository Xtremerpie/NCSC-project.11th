import React, { useState } from "react";
import { X } from "lucide-react";
import GlassCard from "./ui/GlassCard";

const SYNC_STATES = {
  connecting: { label: "Connecting…", color: "#9CA3AF", pulse: true },
  syncing: { label: "Syncing…", color: "#F59E0B", pulse: true },
  connected: { label: "Synced", color: "#22C55E", pulse: false },
  local: { label: "Local changes", color: "#F97316", pulse: false },
  error: { label: "Offline", color: "#EF4444", pulse: false },
};

function SyncBadge({ status, deviceId, lastSync, pending }) {
  const [open, setOpen] = useState(false);
  const s = SYNC_STATES[status] || SYNC_STATES.connecting;
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 text-[10px] px-2 py-1 rounded-full"
        style={{ background: `${s.color}1A`, color: s.color }}
      >
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: s.color, animation: s.pulse ? "fh-breathe 1.2s ease-in-out infinite" : "none" }}
        />
        {s.label}
      </button>
      {open && (
        <GlassCard className="absolute z-40 top-8 left-0 w-56 p-4 fh-fade" style={{ boxShadow: "0 12px 40px rgba(0,0,0,0.45)" }}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-white text-xs font-semibold">Cloud Status</span>
            <button onClick={() => setOpen(false)} className="text-slate-500 hover:text-white"><X size={13} /></button>
          </div>
          <dl className="space-y-2 text-[11px]">
            <div className="flex justify-between"><dt className="text-slate-500">Status</dt><dd style={{ color: s.color }}>{s.label}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500">Database</dt><dd className="text-slate-300">Supabase</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500">Device</dt><dd className="text-slate-300 truncate max-w-[110px]">{deviceId ? deviceId.slice(0, 8) : "—"}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500">Last sync</dt><dd className="text-slate-300">{lastSync || "—"}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500">Pending changes</dt><dd className="text-slate-300">{pending}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500">Storage</dt><dd className="text-slate-300">Cloud</dd></div>
          </dl>
        </GlassCard>
      )}
    </div>
  );
}


export default SyncBadge;
