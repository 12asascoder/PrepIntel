export default function StatusBadge({ status, size = 'md' }) {
  const colors = {
    NORMAL: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    SAFE: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    LOW: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    WARNING: 'bg-amber-50 text-amber-700 border-amber-200',
    CAUTION: 'bg-amber-50 text-amber-700 border-amber-200',
    DANGER: 'bg-red-50 text-red-700 border-red-200',
    CRITICAL: 'bg-red-50 text-red-700 border-red-200',
  };
  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs';
  return (
    <span className={`inline-flex items-center rounded-full font-bold border ${sizeClass} ${colors[status] || colors.NORMAL}`}>
      {status}
    </span>
  );
}
