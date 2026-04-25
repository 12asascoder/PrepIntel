import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import AppLayout from './components/Layout/AppLayout';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Simulator from './pages/Simulator';
import ScenarioSimulator from './pages/ScenarioSimulator';
import Sensors from './pages/Sensors';
import DigitalTwin from './pages/DigitalTwin';
import Reports from './pages/Reports';

function PrivateRoute({ children }) {
  const { user } = useApp();
  // Simplified auth for demo
  return localStorage.getItem('smartmess_token') ? children : <Navigate to="/login" />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<PrivateRoute><AppLayout><Dashboard /></AppLayout></PrivateRoute>} />
      <Route path="/simulator" element={<PrivateRoute><AppLayout><Simulator /></AppLayout></PrivateRoute>} />
      <Route path="/scenario" element={<PrivateRoute><AppLayout><ScenarioSimulator /></AppLayout></PrivateRoute>} />
      <Route path="/sensors" element={<PrivateRoute><AppLayout><Sensors /></AppLayout></PrivateRoute>} />
      <Route path="/digital-twin" element={<PrivateRoute><AppLayout><DigitalTwin /></AppLayout></PrivateRoute>} />
      <Route path="/reports" element={<PrivateRoute><AppLayout><Reports /></AppLayout></PrivateRoute>} />
    </Routes>
  );
}

function App() {
  return (
    <AppProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AppProvider>
  );
}

export default App;
