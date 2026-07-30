import React from "react";

function Toggle({ label, checked, onChange, accent }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-slate-200">{label}</span>
      <button
        onClick={() => onChange(!checked)}
        className="w-10 h-6 rounded-full relative shrink-0"
        style={{ background: checked ? accent : "rgba(255,255,255,0.12)", transition: "background .2s ease" }}
      >
        <span className="absolute top-0.5 w-5 h-5 rounded-full bg-white" style={{ left: checked ? 18 : 2, transition: "left .2s ease" }} />
      </button>
    </div>
  );
}

export default Toggle;
