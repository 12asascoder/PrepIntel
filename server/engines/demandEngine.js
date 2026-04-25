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
 * Demand Prediction Engine
 * Predicts student attendance using:
 * - Historical attendance data (last 3 similar meals)
 * - Meal pattern analysis
 * - Trend adjustment factors
 * - Day-of-week patterns
 * 
 * Formula: Predicted Demand = average(previous 3 similar meals) + adjustment factor
 */
export function predictDemand(mealType = 'Lunch', dayType = 'weekday') {
  const data = loadData();
  const history = data.historicalAttendance[mealType] || data.historicalAttendance['Lunch'];
  
  // Get last 3 records for this meal type
  const recent = history.slice(-3);
  const avg = recent.reduce((sum, r) => sum + r.count, 0) / recent.length;
  
  // Apply adjustment factor
  const factor = data.adjustmentFactors[dayType] || 1.0;
  const predicted = Math.round(avg * factor);
  
  // Calculate confidence based on variance
  const variance = recent.reduce((sum, r) => sum + Math.pow(r.count - avg, 2), 0) / recent.length;
  const stdDev = Math.sqrt(variance);
  const confidence = Math.max(75, Math.min(99, 100 - (stdDev / avg) * 100));
  
  // Determine trend
  const trend = recent[recent.length - 1].count > recent[0].count ? 'up' : 
                recent[recent.length - 1].count < recent[0].count ? 'down' : 'stable';
  
  // Weekly pattern
  const weeklyPattern = history.map(h => ({
    day: h.day.substring(0, 3).toUpperCase(),
    count: h.count
  }));

  return {
    predictedStudents: predicted,
    confidence: Math.round(confidence * 10) / 10,
    trend,
    averageBase: Math.round(avg),
    adjustmentFactor: factor,
    dayType,
    mealType,
    weeklyPattern,
    recentHistory: recent,
    lastUpdated: new Date().toISOString()
  };
}

/**
 * Get attendance trend data for charts
 */
export function getAttendanceTrend(mealType = 'Lunch') {
  const data = loadData();
  const history = data.historicalAttendance[mealType] || [];
  return history.map(h => ({
    date: h.date,
    day: h.day,
    count: h.count
  }));
}
