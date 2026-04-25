import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layers, RefreshCw, ThermometerSun, Users, Zap, AlertCircle } from 'lucide-react';
import TopBar from '../components/Layout/TopBar';
import DonutChart from '../components/ui/DonutChart';
import KPICard from '../components/ui/KPICard';
import KitchenScene from '../components/DigitalTwin/KitchenScene';
import { fetchDigitalTwin } from '../utils/api';

export default function DigitalTwin() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadData = async () => {
    setLoading(true);
    try {
      const d = await fetchDigitalTwin();
      setData(d);
    } catch {
      setData(getFallback());
    }
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const d = data || getFallback();

  return (
    <div>
      <TopBar title="Digital Twin View" subtitle="Real-time spatial monitoring of Kitchen Unit 04-A and Mess Hall" mealCycle="Lunch Cycle"
        actions={<>
          <button className="btn-secondary" onClick={() => navigate('/sensors')}><Layers size={14} /> View Layers</button>
          <button className="btn-primary" onClick={loadData}><RefreshCw size={14} /> Sync Live Data</button>
        </>}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
        {/* Main 3D View */}
        <div className="lg:col-span-3">
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-2 relative">
            <KitchenScene zones={d.zones} />
            <div className="absolute bottom-6 left-6 glass-card p-4 bg-white/95 text-xs">
              <p className="font-bold text-slate-800 mb-2">STATUS LEGEND</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Optimal / Normal</div>
                <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Warning / Threshold</div>
                <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Critical / Danger</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-4">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-5 text-center">
            <p className="text-xs font-bold text-slate-400 tracking-widest mb-4">KITCHEN HEALTH</p>
            <div className="flex justify-center"><DonutChart value={d.kitchenHealth} size={120} /></div>
            <p className="text-xs text-slate-500 mt-4 leading-relaxed">Optimal operational state. Freezer levels and sanitation timers are within nominal ranges.</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="glass-card p-5 text-center">
            <p className="text-xs font-bold text-slate-400 tracking-widest mb-4">OPERATIONAL EFFICIENCY</p>
            <div className="flex justify-center"><DonutChart value={d.operationalEfficiency} size={120} color="#f59e0b" trackColor="#fef3c7" /></div>
            <p className="text-xs text-slate-500 mt-4 leading-relaxed">Congestion detected in Dining Area B. Recommend opening additional checkout lanes.</p>
          </motion.div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3 grid grid-cols-4 gap-4">
          <KPICard title="Avg Kitchen Temp" value={`${d.metrics.avgTemp}°C`} icon={ThermometerSun} delay={1} />
          <KPICard title="Active Diners" value={d.metrics.activeDiners} icon={Users} delay={2} />
          <KPICard title="Power Load" value={`${d.metrics.powerLoad} kW`} icon={Zap} delay={3} />
          <KPICard title="Active Alerts" value={`0${d.metrics.activeAlerts}`} icon={AlertCircle} delay={4} className="text-red-600 cursor-pointer hover:bg-slate-50 transition-colors" onClick={() => navigate('/reports')} />
        </div>

        {/* Event Log */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card p-5">
          <p className="text-sm font-bold text-slate-800 mb-4">Live Event Log</p>
          <div className="space-y-4 relative before:absolute before:inset-0 before:ml-1 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
            {d.events.map((e, i) => (
              <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className={`flex items-center justify-center w-2 h-2 rounded-full border-2 border-white ${e.type === 'danger' ? 'bg-red-500' : e.type === 'success' ? 'bg-emerald-500' : e.type === 'warning' ? 'bg-amber-500' : 'bg-slate-300'} shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2`}></div>
                <div className="w-[calc(100%-1rem)] md:w-[calc(50%-1.5rem)] p-1 rounded border border-slate-100 shadow-sm bg-white text-[10px]">
                  <p className="font-bold text-slate-800">{e.title}</p>
                  <p className="text-slate-400">{e.time} - {e.zone}</p>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => navigate('/reports')} className="w-full mt-4 text-[10px] font-bold text-teal-600 text-center hover:text-teal-700 transition-colors">View Full Audit Log</button>
        </motion.div>
      </div>
    </div>
  );
}

function getFallback() {
  return {
    kitchenHealth: 92, operationalEfficiency: 74,
    zones: [
      { id: 'prep', name: 'Prep Area', status: 'optimal' },
      { id: 'cooking', name: 'Cooking', status: 'optimal' },
      { id: 'serving', name: 'Serving', status: 'optimal' },
      { id: 'dining', name: 'Dining', status: 'warning' },
      { id: 'storage', name: 'Storage', status: 'optimal' }
    ],
    metrics: { avgTemp: 24.5, activeDiners: 142, powerLoad: 12.4, activeAlerts: 2 },
    events: [
      { type: 'success', title: 'Ventilation Cycle Started', time: '10:42:05 AM', zone: 'Zone Kitchen-Main' },
      { type: 'danger', title: 'High Occupancy Warning', time: '10:39:12 AM', zone: 'Zone Mess Hall B' },
      { type: 'success', title: 'Temp Sensor Calibration', time: '10:35:48 AM', zone: 'Freezer Unit 02' },
      { type: 'info', title: 'Maintenance Access Logged', time: '10:30:01 AM', zone: 'Rear Delivery Dock' }
    ]
  };
}
