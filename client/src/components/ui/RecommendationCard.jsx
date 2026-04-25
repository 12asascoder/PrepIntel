import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RecommendationCard({ type, title, description, age, onApply }) {
  const typeColors = {
    OPTIMIZE: 'bg-teal-600',
    ADJUST: 'bg-amber-500',
    ALERT: 'bg-red-500',
    SCHEDULE: 'bg-blue-500',
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="glass-card p-4 flex items-start gap-3"
    >
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1.5">
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold text-white ${typeColors[type] || typeColors.OPTIMIZE}`}>
            {type}
          </span>
          <span className="text-[10px] text-slate-400 ml-auto">{age}</span>
        </div>
        <p className="text-sm font-semibold text-slate-800">{title}</p>
        <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{description}</p>
      </div>
      <button onClick={onApply} className="mt-2 w-7 h-7 rounded-full bg-teal-500 flex items-center justify-center hover:bg-teal-600 transition-colors">
        <Plus size={14} className="text-white" />
      </button>
    </motion.div>
  );
}
