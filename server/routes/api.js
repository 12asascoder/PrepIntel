import { Router } from 'express';
import { predictDemand, getAttendanceTrend } from '../engines/demandEngine.js';
import { calculateOptimalPreparation } from '../engines/preparationEngine.js';
import { simulateOutcome, getScenarios } from '../engines/simulationEngine.js';
import { calculateWaste, getWasteTrend } from '../engines/wasteEngine.js';
import { assessRisk } from '../engines/riskEngine.js';
import { generateRecommendations } from '../engines/recommendationEngine.js';
import { calculateSustainability } from '../engines/sustainabilityEngine.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import jwt from 'jsonwebtoken';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const router = Router();
const JWT_SECRET = 'smartmess-infinity-secret-2026';

function loadData() {
  return JSON.parse(readFileSync(join(__dirname, '..', 'data', 'seedData.json'), 'utf-8'));
}

// Auth
router.post('/auth/login', (req, res) => {
  const { username, password } = req.body;
  const data = loadData();
  const user = data.users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
  res.json({ token, user: { id: user.id, name: user.name, facility: user.facility, role: user.role } });
});

// Dashboard — aggregated
router.get('/dashboard', (req, res) => {
  const mealType = req.query.meal || 'Lunch';
  const demand = predictDemand(mealType);
  const preparation = calculateOptimalPreparation(demand.predictedStudents, mealType);
  const waste = calculateWaste(preparation.totalRecommendedKg, preparation.projectedConsumed);
  const risk = assessRisk();
  const recs = generateRecommendations(preparation, waste, risk);
  const sustainability = calculateSustainability(waste);
  const data = loadData();

  res.json({
    mealCycle: mealType, shift: 'Afternoon', status: 'LIVE ACTIVE',
    demand, preparation, waste, risk, recommendations: recs, sustainability,
    inventory: data.currentSensors.inventory,
    kitchenFeed: { staffCount: 12, ppeStatus: 'All PPE On', cameraId: 'LIVE CAM 01' }
  });
});

// Individual endpoints
router.get('/predict/:mealType', (req, res) => {
  res.json(predictDemand(req.params.mealType));
});

router.get('/preparation/:mealType', (req, res) => {
  const demand = predictDemand(req.params.mealType);
  res.json(calculateOptimalPreparation(demand.predictedStudents, req.params.mealType));
});

router.post('/simulate', (req, res) => {
  const { scenario = 'demandSpike', mealType = 'Lunch', sensitivity = 0.5 } = req.body;
  res.json(simulateOutcome(scenario, mealType, sensitivity));
});

router.get('/scenarios', (req, res) => { res.json(getScenarios()); });

router.get('/sensors', (req, res) => {
  const data = loadData();
  res.json({ sensors: data.currentSensors, thresholds: { gas: 600, smoke: 500, temperature: 35 }, lastUpdated: new Date().toISOString() });
});

router.post('/sensors/update', (req, res) => {
  const updates = req.body;
  const risk = assessRisk(updates);
  res.json({ sensors: updates, risk, lastUpdated: new Date().toISOString() });
});

router.get('/waste', (req, res) => { res.json(calculateWaste()); });
router.get('/waste/trend', (req, res) => { res.json(getWasteTrend()); });
router.get('/risk', (req, res) => { res.json(assessRisk()); });
router.get('/recommendations', (req, res) => {
  const demand = predictDemand('Lunch');
  const prep = calculateOptimalPreparation(demand.predictedStudents);
  const waste = calculateWaste();
  const risk = assessRisk();
  res.json(generateRecommendations(prep, waste, risk));
});
router.get('/sustainability', (req, res) => { res.json(calculateSustainability()); });

router.get('/digital-twin', (req, res) => {
  const risk = assessRisk();
  const data = loadData();
  res.json({
    kitchenHealth: 92, operationalEfficiency: 74,
    zones: [
      { id: 'prep', name: 'Prep Area', status: 'optimal', occupancy: 4 },
      { id: 'cooking', name: 'Cooking Station', status: risk.gas.status === 'DANGER' ? 'critical' : 'optimal', occupancy: 6 },
      { id: 'serving', name: 'Serving Line', status: 'optimal', occupancy: 3 },
      { id: 'dining', name: 'Dining Hall', status: 'warning', occupancy: 142 },
      { id: 'storage', name: 'Cold Storage', status: 'optimal', occupancy: 1 }
    ],
    metrics: { avgTemp: data.currentSensors.temperature, activeDiners: 142, powerLoad: 12.4, activeAlerts: risk.alertCount },
    events: [
      { type: 'success', title: 'Ventilation Cycle Started', time: '10:42:05 AM', zone: 'Zone Kitchen-Main' },
      { type: 'danger', title: 'High Occupancy Warning', time: '10:39:12 AM', zone: 'Zone Mess Hall B' },
      { type: 'success', title: 'Temp Sensor Calibration', time: '10:35:48 AM', zone: 'Freezer Unit 02' },
      { type: 'info', title: 'Maintenance Access Logged', time: '10:30:01 AM', zone: 'Rear Delivery Dock' }
    ],
    lastUpdated: new Date().toISOString()
  });
});

router.get('/reports', (req, res) => {
  const trend = getAttendanceTrend('Lunch');
  const wasteTrend = getWasteTrend();
  res.json({ attendanceTrend: trend, wasteTrend, generatedAt: new Date().toISOString() });
});

export default router;
