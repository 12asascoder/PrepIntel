import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function loadData() {
  const raw = readFileSync(join(__dirname, '..', 'data', 'seedData.json'), 'utf-8');
  return JSON.parse(raw);
}

const THRESHOLDS = {
  gas: { normal: 300, warning: 450, danger: 600, unit: 'ppm', label: 'Gas Levels' },
  smoke: { normal: 200, warning: 350, danger: 500, unit: 'ppm', label: 'Smoke Detection' },
  temperature: { normal: 25, warning: 30, danger: 35, unit: '°C', label: 'Ambient Temp' }
};

export function assessRisk(sensorData = null) {
  const data = loadData();
  const sensors = sensorData || data.currentSensors;
  const gasLevel = sensors.gas || 0;
  const smokeLevel = sensors.smoke || 0;
  const tempLevel = sensors.temperature || 0;

  const gasRisk = classifySensor('gas', gasLevel);
  const smokeRisk = classifySensor('smoke', smokeLevel);
  const tempRisk = classifySensor('temperature', tempLevel);

  const risks = [gasRisk, smokeRisk, tempRisk];
  const hasDanger = risks.some(r => r.status === 'DANGER');
  const hasWarning = risks.some(r => r.status === 'WARNING');

  let overallStatus = 'SAFE', overallSeverity = 'success';
  if (hasDanger) { overallStatus = 'CRITICAL'; overallSeverity = 'danger'; }
  else if (hasWarning) { overallStatus = 'CAUTION'; overallSeverity = 'warning'; }

  const alerts = [];
  if (gasRisk.status !== 'NORMAL') alerts.push({ type: 'gas', severity: gasRisk.severity, message: `Gas at ${gasLevel}ppm - ${gasRisk.status}`, timestamp: new Date().toISOString() });
  if (smokeRisk.status !== 'NORMAL') alerts.push({ type: 'smoke', severity: smokeRisk.severity, message: `Smoke at ${smokeLevel}ppm - ${smokeRisk.status}`, timestamp: new Date().toISOString() });
  if (tempRisk.status !== 'NORMAL') alerts.push({ type: 'temperature', severity: tempRisk.severity, message: `Temp at ${tempLevel}°C - ${tempRisk.status}`, timestamp: new Date().toISOString() });

  return { gas: { ...gasRisk, value: gasLevel }, smoke: { ...smokeRisk, value: smokeLevel }, temperature: { ...tempRisk, value: tempLevel }, overallStatus, overallSeverity, alerts, alertCount: alerts.length, lastUpdated: new Date().toISOString() };
}

function classifySensor(type, value) {
  const t = THRESHOLDS[type];
  if (value >= t.danger) return { status: 'DANGER', severity: 'danger', label: t.label, unit: t.unit };
  if (value >= t.warning) return { status: 'WARNING', severity: 'warning', label: t.label, unit: t.unit };
  return { status: 'NORMAL', severity: 'success', label: t.label, unit: t.unit };
}

export { THRESHOLDS };
