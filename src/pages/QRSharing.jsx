import React, { useState, useMemo } from "react";
import { QrCode } from "lucide-react";
import { uid } from "../lib/state";
import GlassCard from "../components/ui/GlassCard";
import SectionTitle from "../components/ui/SectionTitle";

function QRSharing() {
  const [note, setNote] = useState("Chapter 3 revision notes — Polynomials");
  const code = useMemo(() => `focusheist://share/${uid()}`, [note]); // eslint-disable-line
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&bgcolor=111827&color=3B82F6&data=${encodeURIComponent(code + " — " + note)}`;

  return (
    <div className="fh-fade grid md:grid-cols-2 gap-4">
      <GlassCard className="p-5">
        <SectionTitle icon={QrCode} title="QR Resource Sharing" subtitle="Generate → students scan → receive instantly" />
        <label className="text-xs text-slate-400">What are you sharing?</label>
        <input
          value={note} onChange={(e) => setNote(e.target.value)}
          className="w-full mt-1 rounded-xl px-3 py-2 text-sm bg-slate-900/60 border border-white/10 text-white outline-none"
        />
        <p className="text-xs text-slate-500 mt-3">Students scan the code with any phone camera to instantly open this resource.</p>
      </GlassCard>
      <GlassCard className="p-6 flex flex-col items-center justify-center gap-3">
        <img src={qrUrl} alt="QR code" width={180} height={180} className="rounded-xl" style={{ background: "#111827" }} />
        <span className="text-xs text-slate-400 truncate max-w-[220px]">{note}</span>
      </GlassCard>
    </div>
  );
}
export default QRSharing;
