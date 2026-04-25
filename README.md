# SmartMess Infinity
**Autonomous Meal Preparation Intelligence & Digital Twin Platform**

SmartMess Infinity is a software-based digital twin and decision intelligence platform designed to solve one core problem: **Determining the optimal quantity of food to prepare before cooking begins.** 

Instead of reacting to waste after food is prepared, the system predicts meal demand, simulates outcomes, recommends preparation quantities, detects risk conditions, and optimizes operations before waste occurs. It is an Autonomous Meal Preparation Intelligence Platform.

## Core Ideology & Flywheel
**Predict → Decide → Simulate → Optimize → Learn**

The platform operates on a continuous feedback loop. By utilizing a suite of 8 backend intelligence engines, SmartMess prevents institutional kitchen food overproduction, unpredictable attendance losses, and safety hazards.

---

## 🏗️ System Architecture

### 1. Decision Intelligence Layer (CORE)
*   **Demand Prediction Engine:** Estimates meal demand using historical attendance, meal types, trends, and event scenarios.
*   **Preparation Optimization Engine:** Calculates optimal food quantity recommendations (e.g., kg of Rice, Dal) based on predicted demand and buffers.
*   **Outcome Simulation Engine:** Simulates outcomes for preparation options ("What-If" scenarios like Demand Spikes or Low Attendance) before cooking begins.

### 2. Operational Intelligence Layer
*   **Waste Analytics & Cost Engine:** Calculates projected food waste and the exact estimated financial loss (₹). Categorizes severity based on thresholds (Low/Warning/Danger).
*   **Kitchen Risk Detection Engine:** Monitors virtual sensors (Gas, Smoke, Temp) and generates alerts based on safety thresholds.
*   **Autonomous Recommendation Engine:** Generates proactive operational suggestions (e.g., "Reduce rice by 12kg", "Increase dal by 4%").
*   **Sustainability Score Engine:** Generates a 0–100 score weighted on waste, energy, and water efficiency.

---

## 💻 Tech Stack
*   **Frontend**: React (Vite), Tailwind CSS, Recharts, Framer Motion, **Three.js** (`@react-three/fiber`, `@react-three/drei`).
*   **Backend**: Node.js, Express.
*   **Storage**: JSON file storage mimicking a relational database structure.

---

## 🚀 Setup & Installation Instructions

The project is divided into two directories: `client` (Frontend) and `server` (Backend).

### 1. Start the Backend API
The backend serves the REST API and the 8 Intelligence Engines.
```bash
cd server
npm install
npm start
```
*The server will run on **http://localhost:5001**.*

### 2. Start the Frontend Application
The frontend contains the Dashboards, Simulators, and the 3D Digital Twin.
```bash
cd client
npm install
npm run dev
```
*The client will run on **http://localhost:5173** (or 5174 if port is in use).*

### 3. Login
Navigate to the frontend URL in your browser and log in using the default credentials:
*   **Username:** `admin`
*   **Password:** `admin123`

---

## 📊 Application Pages & Features

1.  **Command Center Dashboard (`/`)**: The main hub showing Predicted Demand, Recommended Food breakdown, Preparation Accuracy donut, projected Waste & Cost charts, and the live 3D Kitchen Visual Feed.
2.  **Simulation Environment (`/simulator`)**: Real-time control and manipulation of virtual IoT endpoints (Attendance, Load, Gas, Smoke) via toggles and sliders, accompanied by a raw Terminal Log.
3.  **Scenario Simulator (`/scenario`)**: Run predictive impacts of operational fluctuations (Demand Spikes, Low Attendance) to compare baseline vs. simulated waste, generating AI Optimization Advice.
4.  **Digital Twin View (`/digital-twin`)**: A fully interactive **3D visualization** of Kitchen Unit 04-A built with Three.js. Features solid 3D models of Prep Counters, Cooking Stations, Serving Lines, and Dining Tables, topped with pulsing, color-coded health status nodes.
5.  **Reports & Analytics (`/reports`)**: Historical data and trend analysis charts for attendance and waste over time.
6.  **Sensors Telemetry (`/sensors`)**: Granular, detailed views of all active virtual IoT nodes.

---

## 🚨 Threshold Rules
| Parameter | Normal (Optimal) | Warning | Danger (Critical) |
| :--- | :--- | :--- | :--- |
| **Waste** | 0-5% | 6-15% | >15% |
| **Temp** | <30°C | 30-35°C | >35°C |
| **Gas** | <400 ppm | 400-600 ppm | >600 ppm |
| **Smoke** | <300 ppm | 300-500 ppm | >500 ppm |

---
*SmartMess Infinity supports UN SDGs 2, 9, 11, and 12 through autonomous waste prevention and sustainable operations.*
