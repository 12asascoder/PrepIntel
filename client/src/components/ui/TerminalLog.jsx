import { useState, useEffect, useRef } from 'react';
import { Trash2 } from 'lucide-react';

const SAMPLE_LOGS = [
  { ts: '14:22:01.03', type: 'info', text: 'simulation.sync: start' },
  { ts: '14:22:01.05', type: 'data', text: 'payload: {\n  "sensor_id": "SN-8821",\n  "type": "temp",\n  "value": 24.52,\n  "unit": "celsius",\n  "status": "nominal"\n}' },
  { ts: '14:22:04.12', type: 'event', text: 'event.trigger: attendance_on' },
  { ts: '14:22:04.15', type: 'data', text: 'payload: {\n  "zone": "west_wing",\n  "count": 14,\n  "motion": true\n}' },
  { ts: '14:22:08.55', type: 'warn', text: 'system.warn: high_load_detected' },
  { ts: '14:22:08.57', type: 'error', text: 'payload: {\n  "strain_idx": 0.82,\n  "threshold": 0.86,\n  "action": "notify_eng"\n}' },
  { ts: '14:22:12.01', type: 'info', text: 'simulation.sync: update' },
  { ts: '14:22:12.03', type: 'data', text: 'payload: {\n  "sensor_id": "SN 8821",\n  "value": 24.58\n}' },
  { ts: '14:22:15.08', type: 'info', text: 'ping: relay_01 - 12ms' },
  { ts: '14:22:25.03', type: 'info', text: 'simulation.sync: heartbeat' },
  { ts: '14:22:28.05', type: 'info', text: 'status: 200 OK' },
];

export default function TerminalLog({ logs: externalLogs }) {
  const [logs, setLogs] = useState(externalLogs || SAMPLE_LOGS);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [logs]);

  const colorMap = { info: 'text-emerald-400', data: 'text-slate-400', event: 'text-cyan-400', warn: 'text-amber-400', error: 'text-red-400' };

  return (
    <div className="terminal-bg flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Raw Data Log</span>
        </div>
        <button onClick={() => setLogs([])} className="text-slate-500 hover:text-slate-300"><Trash2 size={14} /></button>
      </div>
      <div ref={scrollRef} className="flex-1 overflow-auto p-4 space-y-1 max-h-[500px]">
        {logs.map((log, i) => (
          <div key={i} className="leading-relaxed">
            <span className="text-slate-600">[{log.ts}] </span>
            <span className={colorMap[log.type] || 'text-slate-400'} style={{ whiteSpace: 'pre-wrap' }}>{log.text}</span>
          </div>
        ))}
      </div>
      <div className="px-4 py-2 border-t border-white/5 flex items-center gap-2">
        <span className="text-slate-600 text-xs">CONSOLE</span>
        <span className="text-slate-500 text-xs">{'>'}</span>
        <input type="text" placeholder="Type command..." className="flex-1 bg-transparent text-xs text-slate-300 outline-none placeholder-slate-600" />
      </div>
    </div>
  );
}
