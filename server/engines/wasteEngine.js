import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function loadData() {
  const raw = readFileSync(join(__dirname, '..', 'data', 'seedData.json'), 'utf-8');
  return JSON.parse(raw);
}

/**
 * Waste Analytics Engine
 * 
 * Calculates food waste metrics and classifies severity.
 * 
 * Thresholds:
 *   0-5%   → LOW (green)
 *   6-15%  → WARNING (amber) 
 *   >15%   → DANGER (red)
 */
export function calculateWaste(prepared = null, consumed = null) {
  const data = loadData();
  
  if (prepared === null) prepared = data.currentSensors.foodLoad;
  if (consumed === null) consumed = prepared * 0.75; // default 75% consumption
  
  const wasteKg = Math.round((prepared - consumed) * 10) / 10;
  const wastePercent = Math.round((wasteKg / prepared) * 1000) / 10;
  
  // Cost calculation using average cost per kg
  const avgCostPerKg = data.foodItems.reduce((s, i) => s + i.costPerUnit, 0) / data.foodItems.length;
  const costLoss = Math.round(wasteKg * avgCostPerKg);
  
  // Status classification
  let status, severity;
  if (wastePercent <= 5) {
    status = 'LOW';
    severity = 'success';
  } else if (wastePercent <= 15) {
    status = 'WARNING';
    severity = 'warning';
  } else {
    status = 'DANGER';
    severity = 'danger';
  }
  
  // Daily breakdown for charts (simulated from historical)
  const history = data.historicalPreparation['Lunch'] || [];
  const dailyBreakdown = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day, i) => {
    const h = history[i % history.length];
    const w = h ? h.prepared - h.consumed : wasteKg * (0.7 + Math.random() * 0.6);
    return {
      day,
      waste: Math.round(w * 10) / 10,
      prepared: h ? h.prepared : prepared,
      consumed: h ? h.consumed : consumed,
      isToday: day === 'FRI'
    };
  });
  
  // Week-over-week change
  const prevWeekWaste = wasteKg * 1.12;
  const changePercent = Math.round(((wasteKg - prevWeekWaste) / prevWeekWaste) * 100);

  return {
    prepared,
    consumed,
    wasteKg,
    wastePercent,
    costLoss,
    status,
    severity,
    dailyBreakdown,
    changePercent,
    currency: '₹',
    lastUpdated: new Date().toISOString()
  };
}

/**
 * Get waste trend over time
 */
export function getWasteTrend() {
  const data = loadData();
  const history = data.historicalPreparation['Lunch'] || [];
  
  return history.map(h => ({
    date: h.date,
    waste: Math.round((h.prepared - h.consumed) * 10) / 10,
    wastePercent: Math.round(((h.prepared - h.consumed) / h.prepared) * 1000) / 10,
    prepared: h.prepared,
    consumed: h.consumed
  }));
}
