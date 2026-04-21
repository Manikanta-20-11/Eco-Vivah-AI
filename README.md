# 🌱 Eco-Vivah AI

> An AI-driven recommendation framework designed to enable eco-friendly decision-making for Indian wedding practices through demand prediction, logistics optimization, and qualitative reasoning.

---

## 🎯 Project Overview

Indian weddings are large-scale, resource-intensive socio-cultural events. Current sustainability initiatives surrounding them remain largely reactive and manual. **Eco-Vivah AI** bridges this gap by providing precise, real-time strategies to minimize carbon emissions, food waste, and unsustainable resource consumption while respecting cultural and budget constraints.

### Key Objectives
* **Tri-Layered Framework:** Combines Machine Learning (forecasting), Mathematical Optimization (logistics), and LLMs (qualitative support).
* **Real-Time Support:** Enables proactive adjustments throughout the multi-day wedding lifecycle.
* **Actionable Impact:** Generates strategies aligning with environmental goals, explicitly tracking metrics related to SDG 12 (Responsible Consumption) and SDG 13 (Climate Action).

---

## 🏗️ Technical Architecture (The Stack)

**Frontend (User Interface):**
* React
* Tailwind CSS

**Backend (The Engine):**
* **Predictive Layer:** Python (`scikit-learn`, `xgboost`) for training and executing demand prediction models.
* **Optimization Layer:** Python (`PuLP`, `SciPy.optimize`) for solving mathematical transportation and resource allocation models.
* **Qualitative Layer:** Google Gemini API for executing the recommendation engine logic and generating human-readable strategies.
* **Database:** MySQL / SQLite

---

## ⚙️ Core Modules & Features

### 1. Data Ingestion & Baseline Mapping
* **Wedding Planning Inputs:** Captures guest profiles, event details (e.g., Sangeet, Reception), budget constraints, cultural preferences, and supply data.
* **Sustainability Baseline:** Estimates standard food waste, energy/water usage, logistics emissions, and material/decoration waste for the chosen venue.

### 2. The Tri-Layered Intelligence
* **Quantitative ML (Demand Prediction):** Forecasts exact resource quantities (e.g., food volumes per sub-event) based on historical data and demographics to prevent over-preparation.
* **Mathematical Optimization (Routing):** Calculates the most carbon-efficient logistics/routes for vendors and guest shuttles. 
* **Qualitative LLM (Recommendation Engine):** Processes mathematical outputs alongside unstructured text (cultural nuances) to generate a holistic **Sustainability Score**, sustainable vendor suggestions, and structured waste reduction strategies.

### 3. Real-Time Execution & Output
* **Proactive Decision Support:** Ingests live updates (e.g., dynamic attendance changes, weather impacts) to dynamically recalculate models and issue mid-event operational alerts.
* **The Dashboard:** Visualizes optimized food quantities, actionable strategies, and quantified Estimated Environmental Impact metrics.
* **Human Validation Loop:** Allows event planners to accept, reject, or modify AI suggestions based on final feasibility checks.

---

## 🗺️ Development Roadmap

* **Phase 1 (Foundation):** Build the data ingestion UI (Module 1) and establish the sustainability impact mapping baseline (Module 2).
* **Phase 2 (The Math):** Develop the Machine Learning demand prediction (Module 3) and Linear Programming logistics models (Module 4) in Python.
* **Phase 3 (The Brain):** Integrate the Gemini API (Module 5) to act as the qualitative reasoning layer over the mathematical outputs.
* **Phase 4 (Validation & Live Execution):** Run historical data simulations, finalize the dashboard (Module 7), and implement the human feedback loop (Module 8).

---

## 👥 Target Audience
1. **Primary:** Wedding Planners and Event Management Agencies.
2. **Secondary:** Environmentally conscious families and couples.
3. **Tertiary:** Sustainable vendors operating within green supply chains.
