/**
 * Sustainability Score Engine
 * Score 0-100 based on: Waste (40%), Water (30%), Energy (30%)
 */
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function loadData() {
  return JSON.parse(readFileSync(join(__dirname, '..', 'data', 'seedData.json'), 'utf-8'));
}

export function calculateSustainability(wasteData = null) {
  const data = loadData();
  const wastePercent = wasteData?.wastePercent || 25;
  const waterUsage = data.waterUsagePerMeal || 850;
  const energyUsage = data.energyUsagePerMeal || 42;
  const waterBaseline = data.waterBaseline || 1000;
  const energyBaseline = data.energyBaseline || 50;

  // Waste score: 100 if 0% waste, 0 if 50%+ waste
  const wasteScore = Math.max(0, Math.min(100, 100 - (wastePercent * 2)));
  // Water score: ratio of usage vs baseline
  const waterScore = Math.max(0, Math.min(100, (1 - (waterUsage / waterBaseline) + 0.15) * 100));
  // Energy score: ratio of usage vs baseline
  const energyScore = Math.max(0, Math.min(100, (1 - (energyUsage / energyBaseline) + 0.16) * 100));

  const overall = Math.round(wasteScore * 0.4 + waterScore * 0.3 + energyScore * 0.3);
  let grade;
  if (overall >= 90) grade = 'A+';
  else if (overall >= 80) grade = 'A';
  else if (overall >= 70) grade = 'B';
  else if (overall >= 60) grade = 'C';
  else grade = 'D';

  return {
    overall, grade,
    breakdown: { waste: { score: Math.round(wasteScore), weight: 40 }, water: { score: Math.round(waterScore), weight: 30, usage: waterUsage, baseline: waterBaseline }, energy: { score: Math.round(energyScore), weight: 30, usage: energyUsage, baseline: energyBaseline } },
    lastUpdated: new Date().toISOString()
  };
}
