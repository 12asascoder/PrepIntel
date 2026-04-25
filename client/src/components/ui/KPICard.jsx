import { motion } from 'framer-motion';

export default function KPICard({ title, value, unit, subtitle, icon: Icon, trend, trendValue, children, className = '', delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay * 0.1 }}
      className={`glass-card p-5 ${className}`}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="kpi-label">{title}</span>
        {Icon && <Icon size={18} className="text-slate-400" />}
        {trend && (
          <span className={`text-xs font-semibold ${trend === 'up' ? 'text-teal-600' : trend === 'down' ? 'text-red-500' : 'text-slate-400'}`}>
            {trendValue}
          </span>
        )}
      </div>
      {value !== undefined && (
        <div className="flex items-baseline gap-2">
          <span className="kpi-value">{value}</span>
          {unit && <span className="text-lg text-slate-400 font-medium">{unit}</span>}
        </div>
      )}
      {subtitle && <p className="text-xs text-slate-400 mt-2">{subtitle}</p>}
      {children}
    </motion.div>
  );
}
