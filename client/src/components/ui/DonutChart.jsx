export default function DonutChart({ value, size = 140, strokeWidth = 12, color = '#10b981', trackColor = '#e2e8f0', label, sublabel }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  const center = size / 2;

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle cx={center} cy={center} r={radius} fill="none" stroke={trackColor} strokeWidth={strokeWidth} />
        <circle
          cx={center} cy={center} r={radius} fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center" style={{ width: size, height: size }}>
        <span className="text-3xl font-bold text-slate-900">{value}%</span>
        {label && <span className="text-xs font-semibold text-teal-600 uppercase">{label}</span>}
      </div>
      {sublabel && <p className="text-xs text-slate-400 mt-2">{sublabel}</p>}
    </div>
  );
}
