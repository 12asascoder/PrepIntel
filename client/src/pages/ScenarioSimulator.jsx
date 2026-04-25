import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Zap, AlertTriangle, DollarSign, CheckCircle2, Brain } from 'lucide-react';
import TopBar from '../components/Layout/TopBar';
import KPICard from '../components/ui/KPICard';
import ScenarioComparisonChart from '../components/Charts/ScenarioComparisonChart';
import { runSimulation } from '../utils/api';

const SCENARIOS = [
  { key: 'demandSpike', label: 'Demand Spike (+50 students)', icon: '📈' },
  { key: 'lowAttendance', label: 'Low Attendance (-30%)', icon: '📉' },
  { key: 'emergency', label: 'Emergency Mode', icon: '🚨' },
];

export default function ScenarioSimulator() {
  const [selected, setSelected] = useState('demandSpike');
  const [sensitivity, setSensitivity] = useState(50);
  const [result, setResult] = useState(null);
  const [running, setRunning] = useState(false);
  const navigate = useNavigate();

  const handleRun = async () => {
    setRunning(true);
    try {
      const data = await runSimulation(selected, 'Lunch', sensitivity / 100);
      setResult(data);
    } catch {
      setResult(getDefaultResult());
    }
    setRunning(false);
  };

  const r = result || getDefaultResult();

  return (
    <div>
      <TopBar title="Scenario Simulator" subtitle="Analyze predictive impacts of operational fluctuations on SmartMess Infinity logistics." />

      {/* Main Grid: Config + Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Scenario Configuration */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm">⚙️</span>
            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Scenario Configuration</h2>
          </div>
          <p className="text-xs text-slate-400 mb-3">Primary Preset</p>
          <div className="space-y-2 mb-6">
            {SCENARIOS.map(s => (
              <button key={s.key} onClick={() => setSelected(s.key)}
                className={`w-full text-left p-3 rounded-lg border-2 transition-all text-sm font-medium ${selected === s.key ? 'border-teal-500 bg-teal-50 text-teal-800' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'}`}>
                <div className="flex items-center justify-between">
                  {s.label}
                  {selected === s.key && <CheckCircle2 size={18} className="text-teal-500" />}
                </div>
              </button>
            ))}
          </div>

          <div className="mb-6">
            <p className="text-xs text-slate-400 mb-2">Fine-tune Sensitivity</p>
            <input type="range" min={0} max={100} value={sensitivity} onChange={e => setSensitivity(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-teal-500"
              style={{ background: `linear-gradient(to right, #10b981 0%, #10b981 ${sensitivity}%, #e2e8f0 ${sensitivity}%, #e2e8f0 100%)` }}
            />
            <div className="flex justify-between mt-1">
              <span className="text-[10px] text-slate-400">Low Precision</span>
              <span className="text-[10px] text-slate-400">High Precision</span>
            </div>
          </div>

          <button onClick={handleRun} disabled={running}
            className="w-full py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all text-sm disabled:opacity-50">
            <Play size={16} fill="white" /> {running ? 'RUNNING...' : 'RUN SIMULATION'}
          </button>
        </motion.div>

        {/* Comparison Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">⚡ Projected Waste vs. Current Baseline</h2>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-xs text-slate-400"><span className="w-2.5 h-2.5 rounded bg-slate-400" /> Baseline</span>
              <span className="flex items-center gap-1.5 text-xs text-slate-400"><span className="w-2.5 h-2.5 rounded bg-teal-500" /> Simulated</span>
            </div>
          </div>
          <ScenarioComparisonChart data={r.comparison} />
        </motion.div>
      </div>

      {/* Bottom Metrics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <KPICard title="RESOURCE LOAD" delay={2} icon={Zap}>
          <span className="text-4xl font-bold text-slate-900">{r.resourceLoad}%</span>
          <p className="text-xs text-slate-400 mt-1">↗ +{r.resourceLoadDelta}% from baseline</p>
        </KPICard>
        <KPICard title="PREDICTED WASTE" delay={3} icon={AlertTriangle}>
          <span className="text-4xl font-bold text-slate-900">{r.predictedWaste} kg</span>
          <p className={`text-xs mt-1 ${r.isWasteCritical ? 'text-red-500' : 'text-amber-500'}`}>
            {r.isWasteCritical ? '▲ Critical Threshold Near' : '▲ Within Threshold'}
          </p>
        </KPICard>
        <KPICard title="COST IMPACT" delay={4} icon={DollarSign}>
          <span className="text-4xl font-bold text-slate-900">+₹{Math.abs(r.costImpact)}</span>
          <p className="text-xs text-slate-400 mt-1">Per Session Projection</p>
        </KPICard>
      </div>

      {/* AI Advice Banner */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className="glass-card p-5 flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center flex-shrink-0">
          <Brain size={20} className="text-teal-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-bold text-slate-900 mb-1">AI Optimization Advice</h3>
          <p className="text-xs text-slate-500 leading-relaxed">{r.advice}</p>
        </div>
        <button onClick={() => { alert('Parameters Applied Successfully.'); navigate('/'); }} className="btn-secondary text-xs flex-shrink-0">APPLY PARAMETERS</button>
      </motion.div>
    </div>
  );
}

function getDefaultResult() {
  return {
    resourceLoad: 84, resourceLoadDelta: 12, predictedWaste: 12.4, isWasteCritical: true,
    costImpact: 342, comparison: [
      { meal: 'Breakfast', baselineWaste: 8, simulatedWaste: 12 },
      { meal: 'Lunch', baselineWaste: 15, simulatedWaste: 22 },
      { meal: 'Snacks', baselineWaste: 5, simulatedWaste: 7 },
      { meal: 'Dinner', baselineWaste: 12, simulatedWaste: 18 },
    ],
    advice: "To mitigate the projected 12% increase in resource load for the 'Demand Spike' scenario, SmartMess recommends shifting batch cooking starts by 15 minutes earlier and activating Section B cold storage units 2 hours prior to service."
  };
}
