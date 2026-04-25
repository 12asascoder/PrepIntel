import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function WasteChart({ data }) {
  const defaultData = [
    { day: 'MON', waste: 14, isToday: false },
    { day: 'TUE', waste: 16, isToday: false },
    { day: 'WED', waste: 13, isToday: false },
    { day: 'THU', waste: 15, isToday: true },
    { day: 'FRI', waste: 0, isToday: false },
    { day: 'SAT', waste: 0, isToday: false },
  ];
  const chartData = data || defaultData;

  return (
    <ResponsiveContainer width="100%" height={160}>
      <BarChart data={chartData} barCategoryGap="30%">
        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} />
        <YAxis hide />
        <Tooltip
          contentStyle={{ background: '#1e293b', border: 'none', borderRadius: 8, fontSize: 12, color: '#fff' }}
          cursor={{ fill: 'rgba(16,185,129,0.05)' }}
        />
        <Bar dataKey="waste" radius={[4, 4, 0, 0]}>
          {chartData.map((entry, i) => (
            <Cell key={i} fill={entry.isToday ? '#10b981' : '#cbd5e1'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
