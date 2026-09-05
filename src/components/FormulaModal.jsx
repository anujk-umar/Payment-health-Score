import React from 'react';
import { METRIC_WEIGHTS, BENCHMARKS } from '../utils/scoreEngine';
import { X, HelpCircle, CheckCircle, Calculator, ShieldCheck, Zap } from 'lucide-react';

export default function FormulaModal({ isOpen, onClose, currentBreakdown, totalScore }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 relative text-slate-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              PayHealth Scoring Methodology & Formula
            </h2>
            <p className="text-xs text-slate-400">
              100% transparent mathematical weighting model for merchant risk & reliability.
            </p>
          </div>
        </div>

        {/* Master Formula Equation */}
        <div className="bg-slate-950/90 rounded-2xl p-4 border border-indigo-500/30 mb-6">
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 block mb-1">
            Master Composite Formula (0 - 100 Scale)
          </span>
          <div className="font-mono text-xs sm:text-sm text-slate-200 bg-slate-900/90 p-3 rounded-xl border border-slate-800 leading-relaxed overflow-x-auto">
            <code>
              Score = (S<sub>success</sub> × 0.35) + (S<sub>refund</sub> × 0.20) + (S<sub>settlement</sub> × 0.20) + (S<sub>dispute</sub> × 0.25)
            </code>
          </div>
        </div>

        {/* Live Calculation Proof for Current Merchant */}
        {currentBreakdown && (
          <div className="bg-slate-950/60 rounded-2xl p-4 border border-slate-800 mb-6">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block mb-3">
              Live Calculation Step-by-Step for Current Store:
            </span>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60">
                <span className="text-indigo-300">1. Success Rate ({currentBreakdown.successRate.raw}%):</span>
                <span>{currentBreakdown.successRate.subScore} pts × 0.35 = <strong>{currentBreakdown.successRate.weightedContribution} pts</strong></span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60">
                <span className="text-cyan-300">2. Refund Rate ({currentBreakdown.refundRate.raw}%):</span>
                <span>{currentBreakdown.refundRate.subScore} pts × 0.20 = <strong>{currentBreakdown.refundRate.weightedContribution} pts</strong></span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60">
                <span className="text-emerald-300">3. Settlement Delay ({currentBreakdown.settlementDelay.raw}d):</span>
                <span>{currentBreakdown.settlementDelay.subScore} pts × 0.20 = <strong>{currentBreakdown.settlementDelay.weightedContribution} pts</strong></span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60">
                <span className="text-rose-300">4. Dispute Rate ({currentBreakdown.disputeRate.raw}%):</span>
                <span>{currentBreakdown.disputeRate.subScore} pts × 0.25 = <strong>{currentBreakdown.disputeRate.weightedContribution} pts</strong></span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-indigo-950/50 border border-indigo-500/30 text-indigo-200 font-bold">
                <span>Total Composite Score:</span>
                <span className="text-sm">{totalScore} / 100</span>
              </div>
            </div>
          </div>
        )}

        {/* 4 Factor Benchmark Boundaries */}
        <div className="space-y-4 mb-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Factor Normalization Bounds
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-slate-200">1. Success Rate (35%)</span>
                <span className="text-indigo-400 font-bold">Max: ≥98%</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-snug">
                Normalized between 70% (0 pts) to 98%+ (100 pts). Non-linear scaling rewarding zero drops.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-slate-200">2. Refund Rate (20%)</span>
                <span className="text-cyan-400 font-bold">Max: ≤1.0%</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-snug">
                Normalized inversely between 12.0% (0 pts) to 1.0% (100 pts). Lower refunds yield higher points.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-slate-200">3. Settlement Delay (20%)</span>
                <span className="text-emerald-400 font-bold">Max: T+1 day</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-snug">
                Normalized between 7+ days (0 pts) to 1 day (100 pts). Fast nodal clearing prevents liquidity traps.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-slate-200">4. Dispute Rate (25%)</span>
                <span className="text-rose-400 font-bold">Max: ≤0.10%</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-snug">
                Normalized between 2.0% (0 pts) to 0.10% (100 pts). Strict penalty for exceeding card network limits.
              </p>
            </div>
          </div>
        </div>

        {/* Tier Bands */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs">
          <span className="font-bold text-slate-300 block mb-2">Score Classification Tiers:</span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[11px]">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
              <strong className="block">85 - 100 (A+)</strong>
              <span>0% Reserve / VIP</span>
            </div>
            <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/30 text-green-300">
              <strong className="block">75 - 84 (A)</strong>
              <span>2% Reserve / T+1</span>
            </div>
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300">
              <strong className="block">50 - 74 (B/C)</strong>
              <span>7.5% Reserve</span>
            </div>
            <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300">
              <strong className="block">&lt;50 (D/F)</strong>
              <span>15% Reserve / Review</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
