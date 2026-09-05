import React from 'react';
import { METRIC_WEIGHTS } from '../utils/scoreEngine';
import {
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  Zap,
  Info,
  Sliders,
  CheckCircle2,
  AlertOctagon,
  AlertTriangle,
} from 'lucide-react';

export default function HealthScoreGauge({
  scoreResult,
  previousScore,
  onOpenSimulator,
  onOpenFormula,
}) {
  const { totalScore, tier, breakdown } = scoreResult;

  const scoreDiff = previousScore
    ? Math.round((totalScore - previousScore) * 10) / 10
    : 0;

  // Circular gauge math (240 degree sweep from -120 to +120)
  const radius = 105;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius;
  const sweepAngle = 240; // degrees
  const arcLength = (sweepAngle / 360) * circumference;
  
  // Normalized score percentage (0-100)
  const clampedScore = Math.max(0, Math.min(100, totalScore));
  const progressLength = (clampedScore / 100) * arcLength;

  return (
    <div className="relative bg-slate-900/80 backdrop-blur-xl border border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden">
      {/* Ambient background glow according to tier */}
      <div
        className={`absolute -top-16 -left-16 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none transition-colors duration-700`}
        style={{ backgroundColor: tier.color }}
      />
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
        {/* Left: Interactive Circular Gauge */}
        <div className="flex flex-col items-center shrink-0">
          <div className="relative w-[270px] h-[240px] flex items-center justify-center">
            <svg
              className="w-full h-full overflow-visible"
              viewBox="0 0 260 260"
            >
              <defs>
                <linearGradient id="scoreGaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f43f5e" />     {/* Red (<50) */}
                  <stop offset="50%" stopColor="#f59e0b" />    {/* Yellow (50-75) */}
                  <stop offset="85%" stopColor="#10b981" />    {/* Green (75-100) */}
                  <stop offset="100%" stopColor="#06b6d4" />   {/* Cyan / Pristine */}
                </linearGradient>

                <linearGradient id="activeArcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={tier.color} />
                  <stop offset="100%" stopColor="#6366f1" />
                </linearGradient>

                <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Background Full Track */}
              <circle
                cx="130"
                cy="130"
                r={radius}
                fill="none"
                stroke="rgba(30, 41, 59, 0.7)"
                strokeWidth={strokeWidth}
                strokeDasharray={`${arcLength} ${circumference}`}
                strokeDashoffset={0}
                strokeLinecap="round"
                transform="rotate(150 130 130)"
              />

              {/* Benchmark Band Indicators along the arc */}
              {/* Red Band: 0 to 50 */}
              <circle
                cx="130"
                cy="130"
                r={radius}
                fill="none"
                stroke="rgba(244, 63, 94, 0.2)"
                strokeWidth={strokeWidth}
                strokeDasharray={`${(50 / 100) * arcLength} ${circumference}`}
                strokeDashoffset={0}
                strokeLinecap="round"
                transform="rotate(150 130 130)"
              />

              {/* Active Progress Arc */}
              <circle
                cx="130"
                cy="130"
                r={radius}
                fill="none"
                stroke="url(#scoreGaugeGrad)"
                strokeWidth={strokeWidth + 2}
                strokeDasharray={`${progressLength} ${circumference}`}
                strokeDashoffset={0}
                strokeLinecap="round"
                transform="rotate(150 130 130)"
                style={{
                  transition: 'stroke-dasharray 1s cubic-bezier(0.16, 1, 0.3, 1), stroke 0.6s ease',
                  filter: 'url(#glowEffect)',
                }}
              />

              {/* Tick Marks */}
              {[0, 25, 50, 75, 100].map((tick) => {
                const angle = 150 + (tick / 100) * sweepAngle;
                const rad = (angle * Math.PI) / 180;
                const x1 = 130 + (radius - 16) * Math.cos(rad);
                const y1 = 130 + (radius - 16) * Math.sin(rad);
                const x2 = 130 + (radius - 23) * Math.cos(rad);
                const y2 = 130 + (radius - 23) * Math.sin(rad);
                return (
                  <line
                    key={tick}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="rgba(148, 163, 184, 0.4)"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                );
              })}
            </svg>

            {/* Inner Center Display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
              <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">
                Payment Health
              </span>
              <div className="flex items-baseline justify-center">
                <span
                  className="text-5xl sm:text-6xl font-black tracking-tight text-white transition-all duration-500 font-sans"
                  style={{ textShadow: `0 0 25px ${tier.color}40` }}
                >
                  {totalScore}
                </span>
                <span className="text-sm font-semibold text-slate-500 ml-1">/100</span>
              </div>

              {/* Grade Pill */}
              <div className="mt-1 flex items-center gap-1.5">
                <span className={`px-2 py-0.5 rounded-md text-xs font-extrabold ${tier.badgeClass}`}>
                  Grade {tier.grade}
                </span>
                <span className={`text-xs font-semibold ${tier.color === '#10b981' ? 'text-emerald-400' : tier.color === '#f59e0b' ? 'text-amber-400' : 'text-rose-400'}`}>
                  {tier.name}
                </span>
              </div>
            </div>
          </div>

          {/* Color Scale Reference Legend */}
          <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-500" /> &lt;50 At Risk
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500" /> 50-74 Fair
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> 75-100 Optimal
            </span>
          </div>
        </div>

        {/* Right: Score Insights, Reserve Status & Factor Contribution */}
        <div className="flex-1 w-full flex flex-col justify-between">
          <div>
            {/* Header Status & Period Delta */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 rounded-full animate-pulse"
                  style={{ backgroundColor: tier.color }}
                />
                <span className="text-base sm:text-lg font-bold text-white">
                  {tier.statusText}
                </span>
              </div>

              {scoreDiff !== 0 && (
                <div
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                    scoreDiff > 0
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  {scoreDiff > 0 ? (
                    <TrendingUp className="w-3.5 h-3.5" />
                  ) : (
                    <TrendingDown className="w-3.5 h-3.5" />
                  )}
                  <span>
                    {scoreDiff > 0 ? `+${scoreDiff}` : scoreDiff} pts vs prev period
                  </span>
                </div>
              )}
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
              {tier.summary}
            </p>

            {/* Merchant Gateway Eligibility & Reserve Status Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-5">
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
                <div className="text-xs">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Reserve Policy</span>
                  <span className="font-bold text-slate-200">{tier.reserveRequirement}</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
                <div className="text-xs">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Gateway Priority</span>
                  <span className="font-bold text-slate-200 truncate">{tier.routingPriority}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 4 Factor Contribution Progress Bars */}
          <div className="bg-slate-950/60 rounded-2xl p-4 border border-slate-800/80">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-bold text-slate-300">
                Factor Contribution to 100 pts
              </span>
              <button
                onClick={onOpenFormula}
                className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
              >
                <Info className="w-3 h-3" />
                View Math Formula
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Success Rate */}
              <div>
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="text-slate-400">Success (35%)</span>
                  <span className="font-bold text-slate-200">
                    {breakdown.successRate.weightedContribution} <span className="text-slate-500">/ 35</span>
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full transition-all duration-700"
                    style={{
                      width: `${(breakdown.successRate.subScore / 100) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Refund Rate */}
              <div>
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="text-slate-400">Refunds (20%)</span>
                  <span className="font-bold text-slate-200">
                    {breakdown.refundRate.weightedContribution} <span className="text-slate-500">/ 20</span>
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cyan-500 rounded-full transition-all duration-700"
                    style={{
                      width: `${(breakdown.refundRate.subScore / 100) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Settlement Delay */}
              <div>
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="text-slate-400">Settlement (20%)</span>
                  <span className="font-bold text-slate-200">
                    {breakdown.settlementDelay.weightedContribution} <span className="text-slate-500">/ 20</span>
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                    style={{
                      width: `${(breakdown.settlementDelay.subScore / 100) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Dispute Rate */}
              <div>
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="text-slate-400">Disputes (25%)</span>
                  <span className="font-bold text-slate-200">
                    {breakdown.disputeRate.weightedContribution} <span className="text-slate-500">/ 25</span>
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-rose-500 rounded-full transition-all duration-700"
                    style={{
                      width: `${(breakdown.disputeRate.subScore / 100) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
