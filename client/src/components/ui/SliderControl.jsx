export default function SliderControl({ label, value, min, max, unit, onChange }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-600">{label}</span>
        <span className="text-lg font-bold text-slate-900">{value}{unit}</span>
      </div>
      <div className="relative">
        <input type="range" min={min} max={max} value={value} onChange={e => onChange(Number(e.target.value))}
          className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-teal-500"
          style={{ background: `linear-gradient(to right, #10b981 0%, #10b981 ${pct}%, #e2e8f0 ${pct}%, #e2e8f0 100%)` }}
        />
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-slate-400">{min}{unit}</span>
          <span className="text-[10px] text-slate-400">{max}{unit}</span>
        </div>
      </div>
    </div>
  );
}
