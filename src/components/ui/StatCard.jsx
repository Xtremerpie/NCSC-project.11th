import React from "react";
import GlassCard from "./GlassCard";

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <GlassCard className="p-4">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${color}22`, color }}>
          <Icon size={17} />
        </div>
        <div className="min-w-0">
          <div className="text-xl font-bold text-white leading-tight">{value}</div>
          <div className="text-[11px] text-slate-400 truncate">{label}</div>
        </div>
      </div>
    </GlassCard>
  );
}

export default StatCard;
