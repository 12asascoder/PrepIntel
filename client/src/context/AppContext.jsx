import { createContext, useContext, useState, useCallback } from 'react';

const AppContext = createContext(null);

const DEFAULT_SENSORS = { studentCount: 218, foodLoad: 60, temperature: 28, gas: 720, smoke: 540, inventory: { dryStorage: 82, coldStorage: 45, freshProduce: 68 } };

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [mealCycle, setMealCycle] = useState('Lunch');
  const [sensors, setSensors] = useState(DEFAULT_SENSORS);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sensorToggles, setSensorToggles] = useState({ attendance: true, loadSensor: false, gasDetection: false, smokeDetection: false });

  const login = useCallback((userData) => { setUser(userData); localStorage.setItem('smartmess_user', JSON.stringify(userData)); }, []);
  const logout = useCallback(() => { setUser(null); localStorage.removeItem('smartmess_user'); localStorage.removeItem('smartmess_token'); }, []);

  const updateSensor = useCallback((key, value) => {
    setSensors(prev => ({ ...prev, [key]: value }));
  }, []);

  const toggleSensor = useCallback((key) => {
    setSensorToggles(prev => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const resetSensors = useCallback(() => { setSensors(DEFAULT_SENSORS); }, []);

  const value = { user, login, logout, mealCycle, setMealCycle, sensors, setSensors, updateSensor, resetSensors, sensorToggles, toggleSensor, dashboardData, setDashboardData, loading, setLoading };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
