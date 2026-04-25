import { useState, useEffect } from 'react';
import TopBar from '../components/Layout/TopBar';
import TrendChart from '../components/Charts/TrendChart';
import { fetchReports } from '../utils/api';

export default function Reports() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchReports().then(setData).catch(() => {
      setData({
        attendanceTrend: [
          { date: 'Mon', count: 225 }, { date: 'Tue', count: 218 }, { date: 'Wed', count: 210 }, { date: 'Thu', count: 222 }, { date: 'Fri', count: 215 }
        ],
        wasteTrend: [
          { date: 'Mon', waste: 14 }, { date: 'Tue', waste: 16 }, { date: 'Wed', waste: 13 }, { date: 'Thu', waste: 15 }, { date: 'Fri', waste: 12 }
        ]
      });
    });
  }, []);

  if (!data) return null;

  return (
    <div>
      <TopBar title="Reports & Analytics" subtitle="Historical data and trend analysis" />
      <div className="grid grid-cols-1 gap-6">
        <div className="glass-card p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Attendance Trend</h3>
          <TrendChart data={data.attendanceTrend} dataKey="count" xKey="date" color="#10b981" />
        </div>
        <div className="glass-card p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Waste Trend</h3>
          <TrendChart data={data.wasteTrend} dataKey="waste" xKey="date" color="#ef4444" />
        </div>
      </div>
    </div>
  );
}
