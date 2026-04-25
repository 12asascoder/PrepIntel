import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import TopBar from '../components/Layout/TopBar';
import { fetchSensors } from '../utils/api';
import SliderControl from '../components/ui/SliderControl';
import StatusBadge from '../components/ui/StatusBadge';

export default function Sensors() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try { const d = await fetchSensors(); setData(d); } 
      catch { setData({ sensors: { temperature: 28, gas: 720, smoke: 540, foodLoad: 60, studentCount: 218 } }); }
      setLoading(false);
    };
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <TopBar title="Sensor Telemetry" subtitle="Detailed view of all active IoT nodes" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <SensorPanel title="Ambient Temperature" value={data.sensors.temperature} unit="°C" min={0} max={50} status={data.sensors.temperature > 35 ? 'DANGER' : 'NORMAL'} />
        <SensorPanel title="Gas Levels (Methane/CO2)" value={data.sensors.gas} unit="ppm" min={0} max={1000} status={data.sensors.gas > 600 ? 'DANGER' : 'NORMAL'} />
        <SensorPanel title="Smoke / Particulate" value={data.sensors.smoke} unit="ppm" min={0} max={1000} status={data.sensors.smoke > 500 ? 'WARNING' : 'NORMAL'} />
        <SensorPanel title="Food Load Station 1" value={data.sensors.foodLoad} unit="kg" min={0} max={200} status="NORMAL" />
        <SensorPanel title="Mess Hall Occupancy" value={data.sensors.studentCount} unit="pax" min={0} max={500} status="NORMAL" />
      </div>
    </div>
  );
}

function SensorPanel({ title, value, unit, min, max, status }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
        <StatusBadge status={status} size="sm" />
      </div>
      <div className="text-4xl font-bold text-slate-900 mb-6">{value} <span className="text-lg text-slate-400 font-medium">{unit}</span></div>
      <SliderControl label="Calibration" value={value} min={min} max={max} unit={unit} onChange={() => {}} />
    </motion.div>
  );
}
