export default function ProgressBar({ value, max = 100, color = 'bg-teal-500', label, showValue = true }) {
  const pct = Math.min(100, (value / max) * 100);
  const barColor = pct < 40 ? 'bg-red-500' : pct < 70 ? 'bg-amber-500' : color;
  return (
    <div className="space-y-1.5">
      {(label || showValue) && (
        <div className="flex items-center justify-between">
          {label && <span className="text-xs font-medium text-slate-600">{label}</span>}
          {showValue && <span className="text-xs font-bold text-slate-700">{value}%</span>}
        </div>
      )}
      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ease-out ${barColor}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
