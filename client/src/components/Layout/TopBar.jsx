import { RefreshCw } from 'lucide-react';

export default function TopBar({ title, subtitle, mealCycle = 'Lunch Cycle', actions }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-sm font-semibold text-slate-800">{mealCycle}</span>
        <span className="badge-live">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
          LIVE ACTIVE
        </span>
        {subtitle && <span className="text-sm text-slate-400 ml-2">{subtitle}</span>}
      </div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{title}</h1>
          {subtitle && <p className="text-sm text-slate-400 mt-1 uppercase tracking-wider font-medium">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-3">
          {actions}
        </div>
      </div>
    </div>
  );
}
