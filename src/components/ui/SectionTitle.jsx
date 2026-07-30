import React from "react";
import { useTheme } from "../../lib/theme";

function SectionTitle({ icon: Icon, title, subtitle }) {
  const { accent } = useTheme();
  return (
    <div className="flex items-center gap-3 mb-5">
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: "rgba(59,130,246,0.15)", color: accent }}
      >
        <Icon size={18} />
      </div>
      <div>
        <h2 className="text-white font-semibold text-lg leading-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          {title}
        </h2>
        {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
      </div>
    </div>
  );
}


export default SectionTitle;
