import React, { useState, useMemo, useRef } from 'react';
import LandingScreen from './components/LandingScreen';
import Navbar from './components/Navbar';
import HealthScoreGauge from './components/HealthScoreGauge';
import MetricBreakdownCards from './components/MetricBreakdownCards';
import ScoreTrendChart from './components/ScoreTrendChart';
import PeerBenchmarkChart from './components/PeerBenchmarkChart';
import InsightsPanel from './components/InsightsPanel';
import ActionCenter from './components/ActionCenter';
import ScenarioSimulator from './components/ScenarioSimulator';
import FormulaModal from './components/FormulaModal';

import { generateMerchantData, MERCHANT_PERSONAS } from './utils/mockDataGenerator';
import { generateDynamicInsights } from './utils/insightsGenerator';
import { getRankedRecommendations } from './utils/recommendationEngine';
import {
  Activity,
  Sliders,
  Sparkles,
  Download,
  Share2,
  CheckCircle,
  ExternalLink,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export default function App() {
  // Navigation & View State
  const [currentView, setCurrentView] = useState('dashboard'); // 'landing' | 'dashboard'
  const [selectedPersonaId, setSelectedPersonaId] = useState('apex-retail');
  const [customMerchantName, setCustomMerchantName] = useState('Apex Retail Labs');

  // Filters & Global Settings
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedMethod, setSelectedMethod] = useState('all');
  const [currency, setCurrency] = useState('INR');

  // Modals & Sandbox Triggers
  const [isFormulaOpen, setIsFormulaOpen] = useState(false);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [simulationPreset, setSimulationPreset] = useState(null);

  const simulatorSectionRef = useRef(null);

  // Generate synthetic data reactively when persona or merchant name changes
  const merchantData = useMemo(() => {
    return generateMerchantData(customMerchantName, selectedPersonaId);
  }, [customMerchantName, selectedPersonaId]);

  // Derived Dynamic Insights & Ranked Recommendations
  const dynamicInsights = useMemo(() => {
    return generateDynamicInsights(merchantData, selectedMethod);
  }, [merchantData, selectedMethod]);

  const rankedRecommendations = useMemo(() => {
    return getRankedRecommendations(merchantData);
  }, [merchantData]);

  // Handler for Selecting Persona from Landing or Navbar
  const handleSelectPersona = (personaId) => {
    setSelectedPersonaId(personaId);
    const persona = MERCHANT_PERSONAS.find((p) => p.id === personaId);
    if (persona) {
      setCustomMerchantName(persona.name);
    }
    setCurrentView('dashboard');
  };

  // Handler for Custom Merchant name
  const handleCustomMerchant = (name) => {
    setSelectedPersonaId(null);
    setCustomMerchantName(name);
    setCurrentView('dashboard');
  };

  // Trigger Simulator with Preset from Action Center
  const handleApplySimulationPreset = (preset) => {
    setSimulationPreset(preset);
    setIsSimulatorOpen(true);
    // Smooth scroll down to simulator
    setTimeout(() => {
      if (simulatorSectionRef.current) {
        simulatorSectionRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleOpenSimulator = () => {
    setSimulationPreset(null);
    setIsSimulatorOpen(true);
    setTimeout(() => {
      if (simulatorSectionRef.current) {
        simulatorSectionRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  // Quick Export Function (Simulated report download)
  const [exportNotice, setExportNotice] = useState(false);
  const handleExportReport = () => {
    setExportNotice(true);
    setTimeout(() => setExportNotice(false), 3000);
  };

  if (currentView === 'landing') {
    return (
      <LandingScreen
        onSelectMerchant={handleSelectPersona}
        onCustomMerchant={handleCustomMerchant}
      />
    );
  }

  const { currentPeriod, previousPeriod, history, persona } = merchantData;

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col antialiased selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Top Navbar */}
      <Navbar
        merchantData={merchantData}
        selectedPersonaId={selectedPersonaId}
        onSelectPersona={handleSelectPersona}
        timeRange={timeRange}
        setTimeRange={setTimeRange}
        selectedMethod={selectedMethod}
        setSelectedMethod={setSelectedMethod}
        currency={currency}
        setCurrency={setCurrency}
        onOpenFormulaModal={() => setIsFormulaOpen(true)}
        onOpenSimulator={handleOpenSimulator}
        onBackToLanding={() => setCurrentView('landing')}
      />

      {/* Main Dashboard Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        {/* Merchant Welcome Banner & Quick Action Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {merchantData.merchantName}
              </h1>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {persona.tier}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400">
              {persona.industry} • Monthly Processed Volume: {' '}
              <strong className="text-slate-200">
                {currency === 'INR'
                  ? `₹${(currentPeriod.totalVolume / 100000).toFixed(2)} Lakhs`
                  : `$${(currentPeriod.totalVolume / 85000).toFixed(1)}k`}
              </strong>
            </p>
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportReport}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-all shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>Export Health Audit</span>
            </button>

            <button
              onClick={handleOpenSimulator}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/20 hover:shadow-indigo-500/40 transition-all"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Launch Simulator</span>
            </button>
          </div>
        </div>

        {/* Export Notification Toast */}
        {exportNotice && (
          <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-emerald-950/90 border border-emerald-500/40 text-emerald-200 text-xs shadow-2xl flex items-center gap-2 animate-bounce">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>Health Score Audit PDF Report generated successfully!</span>
          </div>
        )}

        {/* 1. Large Animated Health Score Gauge */}
        <section aria-label="Health Score Overview">
          <HealthScoreGauge
            scoreResult={currentPeriod.scoreResult}
            previousScore={previousPeriod.totalScore}
            onOpenSimulator={handleOpenSimulator}
            onOpenFormula={() => setIsFormulaOpen(true)}
          />
        </section>

        {/* 2. 4 Metric Breakdown Cards with Sparklines */}
        <section aria-label="Metric Breakdown Factors">
          <MetricBreakdownCards
            breakdown={currentPeriod.scoreResult.breakdown}
            history={history}
            previousPeriod={previousPeriod}
            onOpenSimulator={handleOpenSimulator}
          />
        </section>

        {/* 3. Charts Grid: Score Trend Timeline (Left 7 Cols) + Peer Benchmark (Right 5 Cols) */}
        <section aria-label="Charts and Analytics" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7">
            <ScoreTrendChart
              history={history}
              timeRange={timeRange}
              setTimeRange={setTimeRange}
            />
          </div>
          <div className="lg:col-span-5">
            <PeerBenchmarkChart currentPeriod={currentPeriod} />
          </div>
        </section>

        {/* 4. Standout Live Scenario Simulation Sandbox */}
        <section ref={simulatorSectionRef} aria-label="Interactive Scenario Simulation">
          <ScenarioSimulator
            baselineMetrics={{
              successRate: currentPeriod.successRate,
              refundRate: currentPeriod.refundRate,
              settlementDelay: currentPeriod.settlementDelay,
              disputeRate: currentPeriod.disputeRate,
            }}
            monthlyVolume={currentPeriod.totalVolume}
            initialPreset={simulationPreset}
            onClose={() => setIsSimulatorOpen(false)}
          />
        </section>

        {/* 5. Dynamic Plain-English Insights Panel */}
        <section aria-label="Automated Plain-English Insights">
          <InsightsPanel
            insights={dynamicInsights}
            onSimulateAction={handleApplySimulationPreset}
            onOpenSimulator={handleOpenSimulator}
          />
        </section>

        {/* 6. Action Center: Ranked Recommendations */}
        <section aria-label="Ranked Action Center">
          <ActionCenter
            recommendations={rankedRecommendations}
            onApplySimulationPreset={handleApplySimulationPreset}
          />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 bg-slate-950/60 backdrop-blur-md py-6 px-4 sm:px-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-indigo-400" />
            <span className="font-bold text-slate-300">PayHealth Intelligence Platform</span>
            <span>• Razorpay & Stripe API Compliant Scoring Architecture</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => setIsFormulaOpen(true)}
              className="hover:text-white transition-colors"
            >
              Formula & Methodology
            </button>
            <span>•</span>
            <button
              onClick={() => setCurrentView('landing')}
              className="hover:text-white transition-colors"
            >
              Switch Merchant Persona
            </button>
          </div>
        </div>
      </footer>

      {/* Formula Transparency Modal */}
      <FormulaModal
        isOpen={isFormulaOpen}
        onClose={() => setIsFormulaOpen(false)}
        currentBreakdown={currentPeriod.scoreResult.breakdown}
        totalScore={currentPeriod.totalScore}
      />
    </div>
  );
}
