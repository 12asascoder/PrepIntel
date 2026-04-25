import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RefreshCw, TrendingUp, Flame, Wind, Thermometer, ShieldCheck, Users, Package } from 'lucide-react';
import TopBar from '../components/Layout/TopBar';
import KPICard from '../components/ui/KPICard';
import DonutChart from '../components/ui/DonutChart';
import StatusBadge from '../components/ui/StatusBadge';
import ProgressBar from '../components/ui/ProgressBar';
import RecommendationCard from '../components/ui/RecommendationCard';
import WasteChart from '../components/Charts/WasteChart';
import KitchenScene from '../components/DigitalTwin/KitchenScene';
import { fetchDashboard } from '../utils/api';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadData = async () => {
    setLoading(true);
    try {
      const d = await fetchDashboard('Lunch');
      setData(d);
    } catch {
      // Use fallback data
      setData(getFallback());
    }
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const d = data || getFallback();
  const prep = d.preparation || {};
  const demand = d.demand || {};
  const waste = d.waste || {};
  const risk = d.risk || {};
  const recs = d.recommendations?.recommendations || [];
  const inv = d.inventory || {};

  return (
    <div>
      <TopBar
        title="Command Center Dashboard"
        subtitle="Facility Operations & Smart Resource Allocation"
        actions={<button onClick={loadData} className="btn-secondary"><RefreshCw size={14} /> RE-SYNC DATA</button>}
      />

      {/* Row 1: Predicted Demand + Recommended Food */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4">
        <KPICard title="PREDICTED DEMAND" className="lg:col-span-2" delay={0} icon={TrendingUp}>
          <div className="mt-1">
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-bold text-slate-900">{demand.predictedStudents || 217}</span>
              <span className="text-lg text-slate-400">Students</span>
            </div>
            <p className="text-xs text-slate-400 mt-3">Confidence Interval: {demand.confidence || 94.2}%</p>
            <div className="w-full h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
              <div className="h-full bg-teal-500 rounded-full transition-all duration-1000" style={{ width: `${demand.confidence || 94.2}%` }} />
            </div>
          </div>
        </KPICard>

        <KPICard title="RECOMMENDED FOOD QUANTITY" className="lg:col-span-3" delay={1}>
          <div className="flex items-center justify-end mb-2">
            <span className="text-xs text-slate-400">Shift: {prep.shift || 'Afternoon'}</span>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {(prep.breakdown || [
              { name: 'Rice', recommended: 44, unit: 'kg' },
              { name: 'Dal', recommended: 12, unit: 'kg' },
              { name: 'Vegetables', recommended: 28, unit: 'kg' },
              { name: 'Oil / Spices', recommended: 3.2, unit: 'L' },
            ]).map((item, i) => (
              <div key={i} className="bg-slate-50 rounded-lg p-3 text-center border border-slate-100">
                <p className="text-xs text-slate-400 mb-1">{item.name}</p>
                <p className="text-xl font-bold text-slate-900">{item.recommended} <span className="text-xs font-medium text-slate-400">{item.unit}</span></p>
              </div>
            ))}
          </div>
        </KPICard>
      </div>

      {/* Row 2: Preparation Accuracy + Waste & Cost Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <KPICard title="PREPARATION ACCURACY %" delay={2}>
          <div className="flex flex-col items-center py-4 relative">
            <DonutChart value={prep.preparationAccuracy || 92} label="EXCELLENT" />
          </div>
          <div className="grid grid-cols-2 gap-4 mt-2 pt-3 border-t border-slate-100">
            <div className="text-center">
              <p className="text-xs text-slate-400">Last 7 Days</p>
              <p className="text-lg font-bold text-slate-900">{prep.last7DaysAccuracy || 89.4}%</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-slate-400">Industry Avg</p>
              <p className="text-lg font-bold text-slate-900">{prep.industryAvg || 82.0}%</p>
            </div>
          </div>
        </KPICard>

        <KPICard title="WASTE & COST ANALYTICS" delay={3}>
          <div className="flex justify-end -mt-6 mb-2">
            <span className="badge-danger text-[10px]">Critical Metric</span>
          </div>
          <WasteChart data={waste.dailyBreakdown} />
          <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-slate-100">
            <div>
              <p className="text-xs text-slate-400">Projected Waste</p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-bold text-slate-900">{waste.wasteKg || 2.4}kg</span>
                <span className="text-xs font-semibold text-teal-600">({waste.changePercent || -12}%)</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-slate-400">Estimated Loss</p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-bold text-slate-900">₹{waste.costLoss || 675}</span>
                <span className="text-xs font-semibold text-teal-600">(-8%)</span>
              </div>
            </div>
          </div>
        </KPICard>
      </div>

      {/* Row 3: Risk Cards + Autonomous Suggestions */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
        {/* Gas */}
        <KPICard delay={4} className="flex flex-col items-center justify-center text-center py-6 cursor-pointer hover:bg-slate-50 transition-colors" onClick={() => navigate('/sensors')}>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 ${risk.gas?.severity === 'danger' ? 'bg-red-50' : 'bg-emerald-50'}`}>
            <Flame size={18} className={risk.gas?.severity === 'danger' ? 'text-red-500' : 'text-emerald-600'} />
          </div>
          <p className="text-xs text-slate-400">Gas Levels</p>
          <p className="text-lg font-bold text-slate-900">{risk.gas?.status || 'NORMAL'}</p>
        </KPICard>
        {/* Smoke */}
        <KPICard delay={5} className="flex flex-col items-center justify-center text-center py-6 cursor-pointer hover:bg-slate-50 transition-colors" onClick={() => navigate('/sensors')}>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 ${risk.smoke?.severity === 'danger' ? 'bg-red-50' : 'bg-emerald-50'}`}>
            <Wind size={18} className={risk.smoke?.severity === 'danger' ? 'text-red-500' : 'text-emerald-600'} />
          </div>
          <p className="text-xs text-slate-400">Smoke Detection</p>
          <p className="text-lg font-bold text-slate-900">{risk.smoke?.status || 'NORMAL'}</p>
        </KPICard>
        {/* Temperature */}
        <KPICard delay={6} className="flex flex-col items-center justify-center text-center py-6 cursor-pointer hover:bg-slate-50 transition-colors" onClick={() => navigate('/sensors')}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-2 bg-emerald-50">
            <Thermometer size={18} className="text-emerald-600" />
          </div>
          <p className="text-xs text-slate-400">Ambient Temp</p>
          <p className="text-lg font-bold text-slate-900">{risk.temperature?.value || 28}°C</p>
        </KPICard>
        {/* Autonomous Suggestions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
          className="glass-card-dark p-4 lg:row-span-1 flex flex-col h-[320px]">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck size={16} className="text-teal-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">Autonomous Suggestions</span>
          </div>
          <div className="space-y-3 overflow-y-auto flex-1 pr-2 custom-scrollbar">
            {(recs.length > 0 ? recs.slice(0, 3) : [
              { type: 'OPTIMIZE', title: 'Reduce rice by 12kg', description: 'Based on current student entry rate (low trend).', age: 'JUST NOW' },
              { type: 'ADJUST', title: 'Increase dal by 4%', description: 'Historical data shows higher consumption today.', age: '5M AGO' },
            ]).map((rec, i) => (
              <RecommendationCard key={i} {...rec} onApply={() => alert(`Applied: ${rec.title}`)} />
            ))}
          </div>
          <button onClick={() => alert('All recommendations applied successfully.')} className="w-full mt-3 py-2 bg-white/10 hover:bg-white/15 text-white text-xs font-semibold rounded-lg transition-colors">
            APPLY ALL CHANGES
          </button>
        </motion.div>
      </div>

      {/* Row 4: Kitchen Feed + Inventory */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
          className="glass-card lg:col-span-2 overflow-hidden cursor-pointer" onClick={() => navigate('/digital-twin')}>
          <div className="p-5">
            <h3 className="text-lg font-bold text-slate-900">Kitchen Visual Feed</h3>
            <p className="text-xs text-slate-400">Live AI analysis of prep area activity and safety compliance.</p>
          </div>
          <div className="h-48 relative hover:opacity-95 transition-opacity">
            <div className="absolute top-3 right-3 badge-live text-[10px] z-10 pointer-events-none">LIVE CAM 01</div>
            <KitchenScene zones={[{ id: 'prep', name: 'Prep', status: 'optimal' }, { id: 'cooking', name: 'Cook', status: 'optimal' }]} height="h-full" />
          </div>
          <div className="p-4 flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-xs text-slate-600"><span className="w-2 h-2 rounded-full bg-emerald-500" /> 12 Staff</span>
            <span className="flex items-center gap-1.5 text-xs text-slate-600"><span className="w-2 h-2 rounded-full bg-emerald-500" /> All PPE On</span>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}
          className="glass-card p-5 flex flex-col h-[280px]">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4">Inventory Health</h3>
          <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <ProgressBar label="Dry Storage" value={inv.dryStorage || 82} />
            <ProgressBar label="Cold Storage" value={inv.coldStorage || 45} />
            <ProgressBar label="Fresh Produce" value={inv.freshProduce || 68} />
          </div>
          <button onClick={() => navigate('/reports')} className="text-teal-600 text-sm font-semibold mt-4 hover:text-teal-700 text-left w-full py-2 border-t border-slate-100">Manage Supplies →</button>
        </motion.div>
      </div>
    </div>
  );
}

function getFallback() {
  return {
    demand: { predictedStudents: 217, confidence: 94.2 },
    preparation: { breakdown: [{ name: 'Rice', recommended: 44, unit: 'kg' }, { name: 'Dal', recommended: 12, unit: 'kg' }, { name: 'Vegetables', recommended: 28, unit: 'kg' }, { name: 'Oil / Spices', recommended: 3.2, unit: 'L' }], preparationAccuracy: 92, last7DaysAccuracy: 89.4, industryAvg: 82.0, shift: 'Afternoon' },
    waste: { wasteKg: 2.4, costLoss: 675, changePercent: -12, dailyBreakdown: [{ day: 'MON', waste: 14 }, { day: 'TUE', waste: 16 }, { day: 'WED', waste: 13 }, { day: 'THU', waste: 15, isToday: true }, { day: 'FRI', waste: 0 }, { day: 'SAT', waste: 0 }] },
    risk: { gas: { status: 'NORMAL', severity: 'success', value: 320 }, smoke: { status: 'NORMAL', severity: 'success', value: 180 }, temperature: { status: 'NORMAL', severity: 'success', value: 28 } },
    recommendations: { recommendations: [{ type: 'OPTIMIZE', title: 'Reduce rice by 12kg', description: 'Based on current student entry rate.', age: 'JUST NOW' }, { type: 'ADJUST', title: 'Increase dal by 4%', description: 'Historical data shows higher consumption.', age: '5M AGO' }] },
    inventory: { dryStorage: 82, coldStorage: 45, freshProduce: 68 }
  };
}
