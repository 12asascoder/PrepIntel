const API = 'http://localhost:5001/api';

export async function fetchDashboard(meal = 'Lunch') {
  const res = await fetch(`${API}/dashboard?meal=${meal}`);
  return res.json();
}
export async function fetchSensors() {
  const res = await fetch(`${API}/sensors`);
  return res.json();
}
export async function updateSensors(data) {
  const res = await fetch(`${API}/sensors/update`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  return res.json();
}
export async function runSimulation(scenario, mealType, sensitivity) {
  const res = await fetch(`${API}/simulate`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ scenario, mealType, sensitivity }) });
  return res.json();
}
export async function fetchDigitalTwin() {
  const res = await fetch(`${API}/digital-twin`);
  return res.json();
}
export async function fetchReports() {
  const res = await fetch(`${API}/reports`);
  return res.json();
}
export async function loginUser(username, password) {
  const res = await fetch(`${API}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }) });
  if (!res.ok) throw new Error('Invalid credentials');
  return res.json();
}
