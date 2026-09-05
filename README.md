# 💳 Payment Health Score (PayHealth Intelligence Platform)

[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

An enterprise-grade **Payment Health Score & Analytics Platform** designed for merchants, fintech operators, and payment ops teams. It translates complex transaction logs, dispute frequencies, refund surges, and settlement latencies into an intuitive **0–100 Health Score** with real-time financial impact simulations and automated action recommendations.

---

## 🌟 Key Features

### 1. 🎯 Dynamic 0–100 Payment Health Engine
- Composite weighted calculation using industry-standard benchmarks.
- 4 Health Tiers: **Excellent (85–100)**, **Healthy (75–84)**, **Moderate (50–74)**, and **At Risk (<50)**.
- Real-time tier badges, reserve requirement calculations, and gateway routing priority recommendations.

### 2. 📊 Metric Breakdown & Root-Cause Attribution
Tracks and scores the 4 pillar metrics that govern merchant payment health:
- **Transaction Success Rate (35% Weight)**: Measures authorization success without gateway drop-offs.
- **Dispute & Chargeback Rate (25% Weight)**: Assesses risk vs. card network thresholds (Visa/Mastercard 0.9% rule).
- **Refund Rate (20% Weight)**: Tracks product returns and customer dissatisfaction indicators.
- **Settlement Delay (20% Weight)**: Analyzes cash-flow velocity from authorization to merchant bank crediting (T+1 to T+7).

### 3. 🎛️ Live Scenario Simulator Sandbox
- Interactive sliders to simulate "What-If" operational adjustments.
- Instant score delta calculation with estimated **Monthly Recovered Revenue** and **Cash Flow acceleration**.
- One-click presets: *Enable Dynamic Gateway Fallback (+3.5% Success)*, *Implement 3DS Frictionless Auth*, *Instant Refunds*, *Early Dispute Resolution (Ethoca/Verifi)*.

### 4. 💡 Plain-English Insights & Action Center
- Translates raw statistics into actionable business narratives.
- Payment method drill-down (UPI AutoPay, Credit Cards, Netbanking, BNPL).
- Prioritized Action Center with impact tags (**High / Medium / Low**) and 1-click simulation shortcuts.

### 5. 🏢 Pre-configured Merchant Personas & Custom Input
- **Apex Retail Labs** (D2C E-Commerce, High Volume)
- **CloudScale SaaS** (Recurring B2B Subscriptions)
- **FlashDrop Quick-Commerce** (Ultra-fast delivery, High UPI Traffic)
- **Horizon Global Travel** (High AOV, International Cross-Border)
- Custom Merchant sandbox generator.

### 6. 📐 Full Formula Transparency Modal
- Transparent math explanations, normalisation functions, and weights for full auditability and stakeholder trust.

---

## 🧮 Mathematical Scoring Formula

$$\text{Payment Health Score} = \sum_{i=1}^{4} (W_i \times S_i)$$

| Metric | Weight ($W_i$) | Target Benchmark | Scoring Range |
| :--- | :---: | :---: | :---: |
| **Transaction Success Rate** | **35%** | $\ge 98.0\%$ | $70.0\% \rightarrow 0 \text{ pts}, 98.0\% \rightarrow 100 \text{ pts}$ |
| **Dispute / Chargeback Rate** | **25%** | $\le 0.10\%$ | $2.00\% \rightarrow 0 \text{ pts}, 0.10\% \rightarrow 100 \text{ pts}$ |
| **Refund Rate** | **20%** | $\le 1.0\%$ | $12.0\% \rightarrow 0 \text{ pts}, 1.0\% \rightarrow 100 \text{ pts}$ |
| **Settlement Delay** | **20%** | $\le 1.0 \text{ day}$ | $7.0 \text{ days} \rightarrow 0 \text{ pts}, 1.0 \text{ day} \rightarrow 100 \text{ pts}$ |

---

## 🛠️ Tech Stack & Architecture

- **Frontend Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 6](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom Glassmorphism & Neon Fintech Palette
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts & Visualizations**: Custom SVG Radial Gauges, Interactive Trend Lines & Peer Benchmark comparisons

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js `18.x` or higher
- npm / yarn / pnpm

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/anujk-umar/Payment-health-Score.git
   cd Payment-health-Score
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   Visit `http://localhost:5173` (or the URL displayed in your console).

---

## 📁 Project Structure

```plaintext
Payment-health-Score/
├── public/                     # Static assets & SVG icons
├── src/
│   ├── components/             # Reusable UI components
│   │   ├── ActionCenter.jsx        # Ranked recommendations & action items
│   │   ├── FormulaModal.jsx        # Mathematical formula & transparency modal
│   │   ├── HealthScoreGauge.jsx    # SVG radial score gauge with animated needle
│   │   ├── InsightsPanel.jsx       # Dynamic plain-English insight generator
│   │   ├── LandingScreen.jsx       # Persona selector & onboarding
│   │   ├── MetricBreakdownCards.jsx # 4 core pillar metric cards with sparklines
│   │   ├── Navbar.jsx              # Global header, filters, & currency switcher
│   │   ├── PeerBenchmarkChart.jsx  # Radar / comparative industry benchmark chart
│   │   ├── ScenarioSimulator.jsx   # Interactive "What-If" sandbox simulator
│   │   └── ScoreTrendChart.jsx     # Historical score timeline & trend chart
│   ├── utils/                  # Core algorithms & mock data engines
│   │   ├── scoreEngine.js          # Core scoring math, weighting & tier logic
│   │   ├── insightsGenerator.js    # Automated root-cause narrative engine
│   │   ├── recommendationEngine.js # Ranked actionable remediation generator
│   │   └── mockDataGenerator.js    # Merchant persona generator & synthetic timelines
│   ├── App.jsx                 # Main application controller & state manager
│   ├── main.jsx                # Application root mounting
│   └── index.css               # Design tokens & Tailwind CSS configurations
├── package.json
├── vite.config.js
└── README.md
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
