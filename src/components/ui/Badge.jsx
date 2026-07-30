import React from "react";

function Badge({ children, color }) {
  return (
    <span
      className="text-[10px] font-medium px-2 py-0.5 rounded-full uppercase tracking-wide"
      style={{ background: `${color}22`, color }}
    >
      {children}
    </span>
  );
}


export default Badge;
