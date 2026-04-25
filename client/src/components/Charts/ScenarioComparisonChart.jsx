import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function ScenarioComparisonChart({ data }) {
  const defaultData = [
    { meal: 'Breakfast', baselineWaste: 8, simulatedWaste: 12 },
    { meal: 'Lunch', baselineWaste: 15, simulatedWaste: 22 },
    { meal: 'Snacks', baselineWaste: 5, simulatedWaste: 7 },
    { meal: 'Dinner', baselineWaste: 12, simulatedWaste: 18 },
  ];
  const chartData = data || defaultData;

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={chartData} barCategoryGap="25%">
        <XAxis dataKey="meal" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b', fontWeight: 500 }} />
        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
        <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: 8, fontSize: 12, color: '#fff' }} />
        <Legend wrapperStyle={{ fontSize: 11 }} />
        <Bar dataKey="baselineWaste" name="Baseline" fill="#94a3b8" radius={[4, 4, 0, 0]} />
        <Bar dataKey="simulatedWaste" name="Simulated" fill="#10b981" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
