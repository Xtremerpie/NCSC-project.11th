import React, { useMemo } from "react";
import { BarChart3, Clock, Flame, CheckCircle2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from "recharts";
import { useTheme, COLORS } from "../lib/theme";
import { BLOCKS } from "../lib/state";
import GlassCard from "../components/ui/GlassCard";
import SectionTitle from "../components/ui/SectionTitle";
import StatCard from "../components/ui/StatCard";
import Empty from "../components/ui/Empty";

function Analytics({ state }) {
  const { accent } = useTheme();
  const byBlock = BLOCKS.map((b) => ({
    name: b,
    done: state.tasks.filter((t) => t.block === b && t.done).length,
    total: state.tasks.filter((t) => t.block === b).length,
  }));

  const bySubject = useMemo(() => {
    const map = {};
    state.homework.forEach((h) => { map[h.subject] = (map[h.subject] || 0) + 1; });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [state.homework]);

  const pieColors = [accent, COLORS.focus, COLORS.warn, COLORS.error, "#a78bfa"];
  const completionRate = state.homework.length
    ? Math.round((state.homework.filter((h) => h.completed).length / state.homework.length) * 100)
    : 0;

  return (
    <div className="fh-fade space-y-4">
      <GlassCard className="p-5">
        <SectionTitle icon={BarChart3} title="Progress Analytics" subtitle="Based on your current tasks and homework" />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <StatCard icon={Clock} label="Study hours today" value={(state.pomodoro.focusMinutesToday / 60).toFixed(1)} color={COLORS.focus} />
          <StatCard icon={Flame} label="Pomodoro sessions" value={state.pomodoro.sessionsToday} color={COLORS.error} />
          <StatCard icon={CheckCircle2} label="Homework completion" value={`${completionRate}%`} color={accent} />
        </div>
      </GlassCard>

      <div className="grid md:grid-cols-2 gap-4">
        <GlassCard className="p-5">
          <h3 className="text-white text-sm font-semibold mb-3">Tasks completed by time block</h3>
          <div style={{ width: "100%", height: 220 }}>
            <ResponsiveContainer>
              <BarChart data={byBlock}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
                <XAxis dataKey="name" tick={{ fill: "#9CA3AF", fontSize: 11 }} />
                <YAxis tick={{ fill: "#9CA3AF", fontSize: 11 }} allowDecimals={false} />
                <Tooltip contentStyle={{ background: "#111827", border: "1px solid #1F2937", borderRadius: 8 }} labelStyle={{ color: "#fff" }} />
                <Bar dataKey="done" fill={accent} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
        <GlassCard className="p-5">
          <h3 className="text-white text-sm font-semibold mb-3">Homework by subject</h3>
          {bySubject.length === 0 ? <Empty text="Add homework to see this chart." /> : (
            <div style={{ width: "100%", height: 220 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={bySubject} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                    {bySubject.map((_, i) => <Cell key={i} fill={pieColors[i % pieColors.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "#111827", border: "1px solid #1F2937", borderRadius: 8 }} labelStyle={{ color: "#fff" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
export default Analytics;
