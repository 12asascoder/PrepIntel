import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, Play, Zap, AlertTriangle, RotateCcw, Users, Weight, Gauge, Activity } from 'lucide-react';
import TopBar from '../components/Layout/TopBar';
import SliderControl from '../components/ui/SliderControl';
import ToggleSwitch from '../components/ui/ToggleSwitch';
import TerminalLog from '../components/ui/TerminalLog';
import { useApp } from '../context/AppContext';

export default function Simulator() {
  const { sensors, updateSensor, sensorToggles, toggleSensor, resetSensors } = useApp();
  const [temp, setTemp] = useState(24.5);
  const [activeNodes] = useState(124);
  const [latency] = useState(14.2);
  const navigate = useNavigate();

  return (
    <div>
      <TopBar title="Simulation Environment" subtitle="Real-time control and manipulation of virtual IoT endpoints"
        mealCycle="Lunch Cycle"
        actions={<>
          <button className="btn-secondary" onClick={() => navigate('/scenario')}><Eye size={14} /> View Simulations</button>
          <button className="btn-primary" onClick={() => alert('New session started.')}><Play size={14} /> Start New Session</button>
        </>}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        {/* Virtual Sensor Array */}
        <div className="lg:col-span-2">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Zap size={18} className="text-teal-500" />
                <h2 className="text-lg font-bold text-slate-900">Virtual Sensor Array</h2>
              </div>
              <span className="badge-live">LIVE LINK ACTIVE</span>
            </div>

            {/* Temperature Slider */}
            <div className="mb-6">
              <SliderControl label="TEMPERATURE SIMULATION (°C)" value={temp} min={-20} max={100} unit="°" onChange={setTemp} />
            </div>

            {/* Sensor Toggles */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="glass-card p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users size={16} className="text-slate-400" />
                </div>
                <ToggleSwitch label="Attendance" sublabel="Occupancy Detection" enabled={sensorToggles.attendance} onToggle={() => toggleSensor('attendance')} />
              </div>
              <div className="glass-card p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Weight size={16} className="text-slate-400" />
                </div>
                <ToggleSwitch label="Load Sensor" sublabel="Strain Calculation" enabled={sensorToggles.loadSensor} onToggle={() => toggleSensor('loadSensor')} />
              </div>
              <div className="glass-card p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Gauge size={16} className="text-slate-400" />
                </div>
                <ToggleSwitch label="Gas Detection" sublabel="Methane & CO2" enabled={sensorToggles.gasDetection} onToggle={() => toggleSensor('gasDetection')} />
              </div>
              <div className="glass-card p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Activity size={16} className="text-slate-400" />
                </div>
                <ToggleSwitch label="Smoke Detection" sublabel="Particle Simulation" enabled={sensorToggles.smokeDetection} onToggle={() => toggleSensor('smokeDetection')} />
              </div>
            </div>

            {/* Scenarios */}
            <h3 className="text-xl font-bold text-slate-900 mb-4">Scenarios</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-3">
                <ScenarioBtn icon={<TrendIcon />} title="Generate Peak Demand" desc="Simulates max load and occupancy across all zones." onClick={() => navigate('/scenario')} />
                <ScenarioBtn icon={<AlertTriangle size={18} className="text-amber-500" />} title="Simulate Gas Leak" desc="Triggers immediate critical alerts and ventilation failsafe." onClick={() => alert('Gas leak scenario simulated.')} />
                <ScenarioBtn icon={<RotateCcw size={18} className="text-slate-400" />} title="Reset Sensors" desc="Reverts all values to default industrial baseline." onClick={() => { resetSensors(); alert('Sensors reset.'); }} />
              </div>
              <div className="glass-card p-4 bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 cursor-pointer hover:opacity-95 transition-opacity" onClick={() => navigate('/digital-twin')}>
                <h4 className="text-white font-semibold mb-2">Visualizer</h4>
                <p className="text-slate-400 text-xs mb-4">Spatial distribution of current simulation parameters (Click for Digital Twin).</p>
                <div className="h-40 flex items-center justify-center">
                  <div className="grid grid-cols-3 gap-3">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className={`w-10 h-10 rounded-lg ${i % 3 === 0 ? 'bg-teal-500/20 border border-teal-500/30' : 'bg-slate-700/50 border border-slate-600/30'} flex items-center justify-center`}>
                        <div className={`w-2 h-2 rounded-full ${i % 3 === 0 ? 'bg-teal-400' : 'bg-slate-500'}`} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Raw Data Log */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <TerminalLog />
        </motion.div>
      </div>

      {/* Bottom Status Bar */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="grid grid-cols-4 gap-4 mt-4">
        <StatusMetric label="ACTIVE NODES" value={activeNodes} badge="+2.4%" badgeColor="text-teal-600" />
        <StatusMetric label="LATENCY (MS)" value={latency} badge="Stable" badgeColor="text-teal-600" />
        <StatusMetric label="PACKET LOSS" value="0.00%" badge="Optimal" badgeColor="text-teal-600" />
        <StatusMetric label="UPTIME" value="99.9%" badge="✓" badgeColor="text-teal-600" />
      </motion.div>
    </div>
  );
}

function ScenarioBtn({ icon, title, desc, onClick }) {
  return (
    <button onClick={onClick} className="glass-card p-4 w-full text-left hover:shadow-md transition-all flex items-start gap-3">
      <div className="mt-0.5">{icon}</div>
      <div>
        <p className="text-sm font-semibold text-slate-800">{title}</p>
        <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
      </div>
    </button>
  );
}

function TrendIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></svg>;
}

function StatusMetric({ label, value, badge, badgeColor }) {
  return (
    <div className="glass-card p-4">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
      <div className="flex items-baseline gap-2 mt-1">
        <span className="text-2xl font-bold text-slate-900">{value}</span>
        <span className={`text-xs font-semibold ${badgeColor}`}>{badge}</span>
      </div>
    </div>
  );
}
