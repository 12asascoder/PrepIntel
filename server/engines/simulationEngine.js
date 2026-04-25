import { calculateOptimalPreparation } from './preparationEngine.js';
import { predictDemand } from './demandEngine.js';

/**
 * Outcome Simulation Engine
 * 
 * Simulates outcomes for different preparation scenarios BEFORE cooking begins.
 * Supports what-if analysis: demand spikes, attendance drops, emergency mode.
 */

const SCENARIOS = {
  demandSpike: {
    name: 'Demand Spike (+50 students)',
    studentDelta: 50,
    multiplier: 1.0,
    description: 'Simulates max load and occupancy across all zones.'
  },
  lowAttendance: {
    name: 'Low Attendance (-30%)',
    studentDelta: 0,
    multiplier: 0.7,
    description: 'Models reduced turnout scenario for resource optimization.'
  },
  emergency: {
    name: 'Emergency Mode',
    studentDelta: 80,
    multiplier: 1.15,
    description: 'Emergency demand spike with maximum buffer allocation.'
  }
};

export function getScenarios() {
  return SCENARIOS;
}

/**
 * Run a simulation for a given scenario
 */
export function simulateOutcome(scenarioKey = 'demandSpike', mealType = 'Lunch', sensitivity = 0.5) {
  const scenario = SCENARIOS[scenarioKey] || SCENARIOS.demandSpike;
  const demand = predictDemand(mealType);
  
  // Calculate baseline
  const baselineStudents = demand.predictedStudents;
  const baseline = calculateOptimalPreparation(baselineStudents, mealType);
  
  // Calculate simulated scenario
  const simulatedStudents = Math.round(
    (baselineStudents + scenario.studentDelta) * scenario.multiplier
  );
  const simulated = calculateOptimalPreparation(simulatedStudents, mealType);
  
  // Apply sensitivity adjustment (0 = conservative, 1 = aggressive)
  const sensitivityFactor = 0.8 + (sensitivity * 0.4); // 0.8 to 1.2
  
  // Per-meal comparison for chart
  const mealTypes = ['Breakfast', 'Lunch', 'Snacks', 'Dinner'];
  const comparison = mealTypes.map(mt => {
    const baseDemand = predictDemand(mt);
    const simDemand = Math.round(
      (baseDemand.predictedStudents + scenario.studentDelta) * scenario.multiplier
    );
    const basePrep = calculateOptimalPreparation(baseDemand.predictedStudents, mt);
    const simPrep = calculateOptimalPreparation(simDemand, mt);
    
    return {
      meal: mt,
      baselineWaste: basePrep.projectedWaste,
      simulatedWaste: Math.round(simPrep.projectedWaste * sensitivityFactor * 10) / 10
    };
  });
  
  // Resource load calculation
  const resourceLoad = Math.min(100, Math.round(
    (simulated.totalRecommendedKg / baseline.totalRecommendedKg) * 80 * sensitivityFactor
  ));
  
  // Cost impact
  const costDelta = simulated.totalCost - baseline.totalCost;
  const wasteDelta = simulated.projectedWaste - baseline.projectedWaste;
  
  // AI optimization advice
  const advice = generateAdvice(scenarioKey, resourceLoad, wasteDelta, costDelta);

  return {
    scenario: scenario.name,
    scenarioKey,
    sensitivity,
    baselineStudents,
    simulatedStudents,
    baseline: {
      totalKg: baseline.totalRecommendedKg,
      waste: baseline.projectedWaste,
      cost: baseline.totalCost
    },
    simulated: {
      totalKg: simulated.totalRecommendedKg,
      waste: simulated.projectedWaste,
      cost: simulated.totalCost
    },
    resourceLoad,
    resourceLoadDelta: resourceLoad - 80,
    predictedWaste: simulated.projectedWaste,
    wasteDelta: Math.round(wasteDelta * 10) / 10,
    costImpact: costDelta,
    comparison,
    advice,
    isWasteCritical: simulated.projectedWastePercent > 12,
    lastUpdated: new Date().toISOString()
  };
}

function generateAdvice(scenario, resourceLoad, wasteDelta, costDelta) {
  const adviceMap = {
    demandSpike: `To mitigate the projected ${Math.abs(Math.round(resourceLoad - 80))}% increase in resource load for the 'Demand Spike' scenario, SmartMess recommends shifting batch cooking starts by 15 minutes earlier and activating Section B cold storage units 2 hours prior to service.`,
    lowAttendance: `With projected ${Math.abs(Math.round(wasteDelta))}kg reduction in consumption, consider reducing primary grain preparation by 20% and reallocating fresh produce to next-day meal cycles to minimize spoilage.`,
    emergency: `Emergency protocol activated. Recommend pre-staging buffer inventory from cold storage, activating all cooking stations, and notifying supply chain for potential same-day restocking. Estimated additional cost: ₹${Math.abs(costDelta)}.`
  };
  
  return adviceMap[scenario] || adviceMap.demandSpike;
}
