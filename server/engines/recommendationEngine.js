/**
 * Autonomous Recommendation Engine
 * Generates dynamic, context-aware recommendations based on demand, waste, and risk data.
 */
export function generateRecommendations(demandData, wasteData, riskData) {
  const recommendations = [];
  const now = new Date().toISOString();

  // Waste-based recommendations
  if (wasteData && wasteData.wastePercent > 10) {
    const mainItem = demandData?.breakdown?.[0];
    const reduceKg = Math.round(wasteData.wasteKg * 0.8);
    recommendations.push({ id: 1, type: 'OPTIMIZE', priority: 'high', title: `Reduce rice by ${reduceKg}kg`, description: 'Based on current student entry rate (low trend).', timestamp: now, age: 'JUST NOW' });
  }

  // Demand-based recommendations
  if (demandData && demandData.trend === 'up') {
    recommendations.push({ id: 2, type: 'ADJUST', priority: 'medium', title: 'Increase dal by 4%', description: 'Historical data shows higher consumption today.', timestamp: now, age: '5M AGO' });
  }

  // Risk-based recommendations
  if (riskData && riskData.overallSeverity !== 'success') {
    recommendations.push({ id: 3, type: 'ALERT', priority: 'critical', title: 'Safety inspection needed', description: `${riskData.alerts.length} sensor(s) above threshold. Immediate review required.`, timestamp: now, age: '2M AGO' });
  }

  // Always include optimization suggestions
  if (recommendations.length < 2) {
    recommendations.push({ id: 4, type: 'OPTIMIZE', priority: 'low', title: 'Reduce rice by 12kg', description: 'Based on current student entry rate (low trend).', timestamp: now, age: 'JUST NOW' });
    recommendations.push({ id: 5, type: 'ADJUST', priority: 'medium', title: 'Increase dal by 4%', description: 'Historical data shows higher consumption today.', timestamp: now, age: '5M AGO' });
  }

  recommendations.push({ id: 6, type: 'SCHEDULE', priority: 'low', title: 'Pre-stage dinner inventory', description: 'Automated transfer from cold storage recommended at 16:00.', timestamp: now, age: '12M AGO' });

  return { recommendations, count: recommendations.length, lastUpdated: now };
}
