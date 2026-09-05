import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  calculatePaymentHealthScore,
  METRIC_WEIGHTS,
  BENCHMARKS,
} from '../utils/scoreEngine';
import {
  Sliders,
  TrendingUp,
  TrendingDown,
  RotateCcw,
  Sparkles,
  Zap,
  ShieldCheck,
  Clock,
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  ArrowRight,
  Target,
  Flame,
} from 'lucide-react';

export default function ScenarioSimulator({
  baselineMetrics,
  monthlyVolume = 10000000,
  onClose,
  initialPreset = null,
}) {
  // Simulator state initialized from current baseline
  const [successRate, setSuccessRate] = useState(baselineMetrics.successRate);
  const [refundRate, setRefundRate] = useState(baselineMetrics.refundRate);
  const [settlementDelay, setSettlementDelay] = useState(baselineMetrics.settlementDelay);
  const [disputeRate, setDisputeRate] = useState(baselineMetrics.disputeRate);

  // Apply initial preset if passed
  useEffect(() => {
    if (initialPreset) {
      if (initialPreset.successRate !== undefined) setSuccessRate(initialPreset.successRate);
      if (initialPreset.refundRate !== undefined) setRefundRate(initialPreset.refundRate);
      if (initialPreset.settlementDelay !== undefined) setSettlementDelay(initialPreset.settlementDelay);
      if (initialPreset.disputeRate !== undefined) setDisputeRate(initialPreset.disputeRate);
    }
  }, [initialPreset]);

  // Baseline Calculation
  const baselineResult = calculatePaymentHealthScore({
    successRate: baselineMetrics.successRate,
    refundRate: baselineMetrics.refundRate,
    settlementDelay: baselineMetrics.settlementDelay,
    disputeRate: baselineMetrics.disputeRate,
  });

  // Simulated Calculation
  const simulatedResult = calculatePaymentHealthScore({
    successRate: parseFloat(successRate),
    refundRate: parseFloat(refundRate),
    settlementDelay: parseFloat(settlementDelay),
    disputeRate: parseFloat(disputeRate),
  });

  const scoreDelta = Math.round((simulatedResult.totalScore - baselineResult.totalScore) * 10) / 10;

  // Trigger celebration confetti when achieving 90+ score
  const [hasCelebrated, setHasCelebrated] = useState(false);
  useEffect(() => {
    if (simulatedResult.totalScore >= 90 && baselineResult.totalScore < 90 && !hasCelebrated) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#6366f1', '#06b6d4', '#f59e0b'],
      });
      setHasCelebrated(true);
    }
  }, [simulatedResult.totalScore, baselineResult.totalScore, hasCelebrated]);

  // Reset to Baseline
  const handleReset = () => {
    setSuccessRate(baselineMetrics.successRate);
    setRefundRate(baselineMetrics.refundRate);
    setSettlementDelay(baselineMetrics.settlementDelay);
    setDisputeRate(baselineMetrics.disputeRate);
    setHasCelebrated(false);
  };

  // Preset Handlers
  const applyPreset = (type) => {
    if (type === 'target90') {
      setSuccessRate(96.5);
      setRefundRate(1.6);
      setSettlementDelay(1.0);
      setDisputeRate(0.09);
    } else if (type === 'instantSettlement') {
      setSettlementDelay(1.0);
    } else if (type === 'zeroDispute') {
      setDisputeRate(0.06);
    } else if (type === 'stressTest') {
      setSuccessRate(72.5);
      setRefundRate(8.8);
      setSettlementDelay(5.5);
      setDisputeRate(1.95);
    }
  };

  // Projected Financial Lift
  const successDelta = parseFloat(successRate) - baselineMetrics.successRate;
  const disputeDelta = baselineMetrics.disputeRate - parseFloat(disputeRate);
  const settlementDeltaDays = baselineMetrics.settlementDelay - parseFloat(settlementDelay);

  const estimatedAuthRevenueImpact = Math.round(monthlyVolume * (successDelta / 100));
  const estimatedDisputeCostSavings = Math.round(monthlyVolume * (disputeDelta / 100) * 1.5);
  const workingCapitalAccelerated = Math.round((monthlyVolume / 30) * Math.max(0, settlementDeltaDays));

  // Circular gauge calculations for simulator mini-gauge
  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  const sweepAngle = 240;
  const arcLength = (sweepAngle / 360) * circumference;
  const progressLength = (Math.max(0, Math.min(100, simulatedResult.totalScore)) / 100) * arcLength;

  return (
    <div className="bg-slate-900/95 backdrop-blur-2xl border border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
      {/* Decorative Glow */}
      <div
        className="absolute top-0 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none transition-colors duration-500"
        style={{ backgroundColor: simulatedResult.tier.color }}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-xl bg-gradient-to-r from-indigo-500 to-emerald-500 text-white shadow-lg shadow-indigo-500/20">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
                What-If Scenario Simulation Studio
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  REAL-TIME REACTIVE
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Drag any metric slider to dynamically preview composite score shifts, tier qualification & revenue lift.
              </p>
            </div>
          </div>
        </div>

        {/* Reset & Close Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Live</span>
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 text-xs font-semibold transition-all"
            >
              Close
            </button>
          )}
        </div>
      </div>

      {/* Preset Quick-Buttons */}
      <div className="mb-6">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
          One-Click Simulation Presets:
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => applyPreset('target90')}
            className="px-3 py-1.5 rounded-xl bg-indigo-500/15 hover:bg-indigo-500/30 border border-indigo-500/30 text-indigo-300 text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <Target className="w-3.5 h-3.5 text-indigo-400" />
            <span>Target 90+ Score (Optimal)</span>
          </button>

          <button
            onClick={() => applyPreset('instantSettlement')}
            className="px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-300 text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Instant T+0/1 Settlement</span>
          </button>

          <button
            onClick={() => applyPreset('zeroDispute')}
            className="px-3 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/30 border border-cyan-500/30 text-cyan-300 text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Zero-Dispute Deflection</span>
          </button>

          <button
            onClick={() => applyPreset('stressTest')}
            className="px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/30 border border-rose-500/30 text-rose-300 text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            <span>Gateway Outage Stress Test</span>
          </button>
        </div>
      </div>

      {/* Main Simulator Layout: Sliders (Left) vs Live Outcome (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 7 Cols: Sliders */}
        <div className="lg:col-span-7 space-y-6">
          {/* Slider 1: Success Rate */}
          <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-bold text-slate-200">Transaction Success Rate (35%)</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-black text-indigo-400 font-sans">{successRate}%</span>
                <span className="text-[10px] text-slate-500">
                  (Actual: {baselineMetrics.successRate}%)
                </span>
              </div>
            </div>
            <input
              type="range"
              min="65.0"
              max="99.0"
              step="0.1"
              value={successRate}
              onChange={(e) => setSuccessRate(e.target.value)}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
            <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1.5 font-medium">
              <span>65% (Critical Drop)</span>
              <span>88% (Industry Benchmark)</span>
              <span>99% (Pristine)</span>
            </div>
          </div>

          {/* Slider 2: Refund Rate */}
          <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold text-slate-200">Refund Rate (20%)</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-black text-cyan-400 font-sans">{refundRate}%</span>
                <span className="text-[10px] text-slate-500">
                  (Actual: {baselineMetrics.refundRate}%)
                </span>
              </div>
            </div>
            <input
              type="range"
              min="0.4"
              max="15.0"
              step="0.1"
              value={refundRate}
              onChange={(e) => setRefundRate(e.target.value)}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
            <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1.5 font-medium">
              <span>0.4% (Lowest Returns)</span>
              <span>4.5% (Benchmark)</span>
              <span>15% (Severe Surge)</span>
            </div>
          </div>

          {/* Slider 3: Settlement Delay */}
          <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-slate-200">Settlement Delay (20%)</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-black text-emerald-400 font-sans">{settlementDelay} days</span>
                <span className="text-[10px] text-slate-500">
                  (Actual: {baselineMetrics.settlementDelay}d)
                </span>
              </div>
            </div>
            <input
              type="range"
              min="1.0"
              max="7.0"
              step="0.1"
              value={settlementDelay}
              onChange={(e) => setSettlementDelay(e.target.value)}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1.5 font-medium">
              <span>1.0 Day (T+1 Instant)</span>
              <span>2.5 Days (Average)</span>
              <span>7.0 Days (High Lag)</span>
            </div>
          </div>

          {/* Slider 4: Dispute Rate */}
          <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span className="text-xs font-bold text-slate-200">Dispute / Chargeback Rate (25%)</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-black text-rose-400 font-sans">{disputeRate}%</span>
                <span className="text-[10px] text-slate-500">
                  (Actual: {baselineMetrics.disputeRate}%)
                </span>
              </div>
            </div>
            <input
              type="range"
              min="0.02"
              max="2.50"
              step="0.01"
              value={disputeRate}
              onChange={(e) => setDisputeRate(e.target.value)}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
            />
            <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1.5 font-medium">
              <span>0.02% (Top Tier)</span>
              <span>0.65% (Benchmark)</span>
              <span>2.50% (Excessive Danger)</span>
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Live Recalculated Score & Impact Preview */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          {/* Simulated Score Card */}
          <div className="bg-slate-950/85 rounded-2xl p-5 border border-slate-800 text-center relative overflow-hidden">
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 block mb-1">
              Simulated Health Score
            </span>

            {/* Score & Gauge Mini Visual */}
            <div className="flex items-center justify-center my-2">
              <div className="relative w-[180px] h-[140px] flex items-center justify-center">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 180 180">
                  <circle
                    cx="90"
                    cy="90"
                    r={radius}
                    fill="none"
                    stroke="rgba(30, 41, 59, 0.7)"
                    strokeWidth="10"
                    strokeDasharray={`${arcLength} ${circumference}`}
                    strokeDashoffset={0}
                    strokeLinecap="round"
                    transform="rotate(150 90 90)"
                  />
                  <circle
                    cx="90"
                    cy="90"
                    r={radius}
                    fill="none"
                    stroke={simulatedResult.tier.color}
                    strokeWidth="12"
                    strokeDasharray={`${progressLength} ${circumference}`}
                    strokeDashoffset={0}
                    strokeLinecap="round"
                    transform="rotate(150 90 90)"
                    style={{
                      transition: 'stroke-dasharray 0.3s ease, stroke 0.4s ease',
                      filter: 'drop-shadow(0 0 8px ' + simulatedResult.tier.color + '60)',
                    }}
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
                  <span
                    className="text-4xl sm:text-5xl font-black tracking-tight text-white font-sans transition-all duration-300"
                    style={{ textShadow: `0 0 20px ${simulatedResult.tier.color}40` }}
                  >
                    {simulatedResult.totalScore}
                  </span>
                  <div className="mt-1 flex items-center gap-1">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${simulatedResult.tier.badgeClass}`}>
                      Grade {simulatedResult.tier.grade}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Delta Pill */}
            <div className="flex items-center justify-center gap-2 mb-2">
              <div
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black ${
                  scoreDelta > 0
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : scoreDelta < 0
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    : 'bg-slate-800 text-slate-300'
                }`}
              >
                {scoreDelta > 0 ? (
                  <TrendingUp className="w-3.5 h-3.5" />
                ) : scoreDelta < 0 ? (
                  <TrendingDown className="w-3.5 h-3.5" />
                ) : null}
                <span>
                  {scoreDelta > 0 ? `+${scoreDelta}` : scoreDelta} pts from baseline ({baselineResult.totalScore})
                </span>
              </div>
            </div>

            <p className="text-xs font-semibold text-slate-300">
              {simulatedResult.tier.statusText}
            </p>
          </div>

          {/* Simulated Financial & Gateway Impact */}
          <div className="bg-slate-950/80 rounded-2xl p-4 border border-slate-800 text-xs space-y-2.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block border-b border-slate-800 pb-1.5">
              Projected Business Impact
            </span>

            <div className="flex items-center justify-between">
              <span className="text-slate-400">Checkout Revenue Lift:</span>
              <span className={`font-bold ${estimatedAuthRevenueImpact >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {estimatedAuthRevenueImpact >= 0 ? `+₹${(estimatedAuthRevenueImpact / 100000).toFixed(2)}L/mo` : `-₹${(Math.abs(estimatedAuthRevenueImpact) / 100000).toFixed(2)}L/mo`}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400">Chargeback Cost Savings:</span>
              <span className={`font-bold ${estimatedDisputeCostSavings >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {estimatedDisputeCostSavings >= 0 ? `+₹${(estimatedDisputeCostSavings / 1000).toFixed(0)}k/mo` : `-₹${(Math.abs(estimatedDisputeCostSavings) / 1000).toFixed(0)}k/mo`}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400">Rolling Reserve Req:</span>
              <span className="font-bold text-slate-200">
                {simulatedResult.tier.reserveRequirement}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400">Gateway Route Tier:</span>
              <span className="font-bold text-indigo-400">
                {simulatedResult.tier.code === 'EXCELLENT' ? 'Tier 1 VIP' : simulatedResult.tier.code === 'HEALTHY' ? 'Standard Tier 1' : simulatedResult.tier.code === 'MODERATE' ? 'Tier 2 Secondary' : 'Restricted Sandbox'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
