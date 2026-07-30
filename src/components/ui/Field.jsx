import React from "react";

function Field({ label, value, onChange }) {
  return (
    <div>
      <label className="text-xs text-slate-400 block mb-1">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl px-3 py-2 text-sm bg-slate-900/60 border border-white/10 text-white outline-none"
      />
    </div>
  );
}

export default Field;
