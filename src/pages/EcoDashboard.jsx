import React from "react";
import { Leaf, MonitorPlay, Target } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useTheme, COLORS } from "../lib/theme";
import GlassCard from "../components/ui/GlassCard";
import SectionTitle from "../components/ui/SectionTitle";
import StatCard from "../components/ui/StatCard";

function EcoDashboard({ state }) {
  const { accent } = useTheme();
  const { paperSaved, digitalWorksheets, studySessions } = state.eco;
  const co2 = (paperSaved * 0.005).toFixed(2); // ~5g CO2 per sheet, rough estimate

  const chartData = [
    { name: "Paper saved (sheets)", value: paperSaved },
    { name: "Digital worksheets", value: digitalWorksheets },
    { name: "Study sessions", value: studySessions },
  ];

  return (
    <div className="fh-fade space-y-4">
      <GlassCard className="p-5">
        <SectionTitle icon={Leaf} title="Eco Dashboard" subtitle="NCSC sustainability tracking" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={Leaf} label="Paper saved (sheets)" value={paperSaved} color={COLORS.focus} />
          <StatCard icon={MonitorPlay} label="Digital worksheets used" value={digitalWorksheets} color={accent} />
          <StatCard icon={Target} label="Study sessions" value={studySessions} color={COLORS.warn} />
          <StatCard icon={Leaf} label="Est. CO₂ reduced (kg)" value={co2} color={COLORS.focus} />
        </div>
      </GlassCard>
      <GlassCard className="p-5">
        <h3 className="text-white text-sm font-semibold mb-3">Digital adoption breakdown</h3>
        <div style={{ width: "100%", height: 220 }}>
          <ResponsiveContainer>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
              <XAxis dataKey="name" tick={{ fill: "#9CA3AF", fontSize: 11 }} interval={0} angle={-10} textAnchor="end" height={50} />
              <YAxis tick={{ fill: "#9CA3AF", fontSize: 11 }} />
              <Tooltip contentStyle={{ background: "#111827", border: "1px solid #1F2937", borderRadius: 8 }} labelStyle={{ color: "#fff" }} />
              <Bar dataKey="value" fill={COLORS.focus} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-[11px] text-slate-500 mt-2">Figures accumulate automatically as you use Smart Board resources and complete focus sessions — an illustrative estimate for the school project, not a certified measurement.</p>
      </GlassCard>
    </div>
  );
}
export default EcoDashboard;
