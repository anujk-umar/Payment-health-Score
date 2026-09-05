import React, { useState } from 'react';
import { MERCHANT_PERSONAS } from '../utils/mockDataGenerator';
import {
  Activity,
  ArrowRight,
  ShieldCheck,
  Zap,
  TrendingUp,
  Sliders,
  CheckCircle2,
  Sparkles,
  AlertTriangle,
  Building2,
} from 'lucide-react';

export default function LandingScreen({ onSelectMerchant, onCustomMerchant }) {
  const [customName, setCustomName] = useState('');

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (customName.trim()) {
      onCustomMerchant(customName.trim());
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden">
      {/* Background Decorative Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none animate-pulse-subtle" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-indigo-950/30 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Top Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md px-6 py-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 p-0.5 shadow-lg shadow-indigo-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Activity className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent">
              PayHealth
            </span>
            <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
              v2.4 Pro
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            Live Scoring Engine
          </span>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="hidden sm:inline">Razorpay & Stripe Compatible</span>
        </div>
      </header>

      {/* Main Hero & Persona Launchpad */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex-1 flex flex-col justify-center z-10 w-full">
        {/* Hero Title */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-medium mb-4">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            0–100 FICO-Style Payment Reliability Score
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-4 leading-tight">
            Know Your Store's{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-emerald-300 to-teal-200 bg-clip-text text-transparent">
              Payment Health Score
            </span>
          </h1>
          <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto">
            A single unified credit-score metric calculated from your transaction success rates, refund velocity, settlement delays, and dispute ratios.
          </p>
        </div>

        {/* Section 1: 1-Click Preset Personas */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold tracking-wider uppercase text-slate-400 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-indigo-400" />
              Select a Demo Merchant Persona to Explore
            </h2>
            <span className="text-xs text-slate-500">3 distinct health profiles</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {MERCHANT_PERSONAS.map((persona) => {
              const isHealthy = persona.id === 'apex-retail';
              const isStruggling = persona.id === 'nova-dropship';
              const isRecovering = persona.id === 'pulse-fit';

              const cardBorder = isHealthy
                ? 'border-emerald-500/30 hover:border-emerald-400/80 hover:shadow-emerald-500/10'
                : isStruggling
                ? 'border-rose-500/30 hover:border-rose-400/80 hover:shadow-rose-500/10'
                : 'border-amber-500/30 hover:border-amber-400/80 hover:shadow-amber-500/10';

              const badgeColor = isHealthy
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : isStruggling
                ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/30';

              const scoreEstimate = isHealthy ? '89' : isStruggling ? '45' : '68';

              return (
                <div
                  key={persona.id}
                  onClick={() => onSelectMerchant(persona.id)}
                  className={`group relative bg-slate-900/80 backdrop-blur-md rounded-2xl p-6 border ${cardBorder} shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer flex flex-col justify-between`}
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${badgeColor}`}>
                        {persona.tier}
                      </span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black tracking-tight text-white">{scoreEstimate}</span>
                        <span className="text-xs text-slate-500">/100</span>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors mb-1">
                      {persona.name}
                    </h3>
                    <p className="text-xs text-indigo-400/90 font-medium mb-3">{persona.industry}</p>
                    <p className="text-xs text-slate-400 leading-relaxed mb-5 line-clamp-3">
                      {persona.description}
                    </p>

                    {/* Metric Quick Stats */}
                    <div className="grid grid-cols-2 gap-2.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs mb-5">
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase font-semibold">Success Auth</span>
                        <span className="font-bold text-slate-200">{persona.baseMetrics.successRate}%</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase font-semibold">Settlement</span>
                        <span className="font-bold text-slate-200">{persona.baseMetrics.settlementDelay} days</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase font-semibold">Dispute Rate</span>
                        <span className="font-bold text-slate-200">{persona.baseMetrics.disputeRate}%</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase font-semibold">Refunds</span>
                        <span className="font-bold text-slate-200">{persona.baseMetrics.refundRate}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Launch CTA */}
                  <button className="w-full py-2.5 px-4 rounded-xl bg-slate-800 group-hover:bg-indigo-600 text-white text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-indigo-600/30">
                    Launch Persona Dashboard
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 2: Custom Merchant Sign-in */}
        <div className="bg-slate-900/50 backdrop-blur-md rounded-2xl border border-slate-800 p-6 sm:p-8 max-w-2xl mx-auto w-full mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Or Enter Your Store / Brand Name</h3>
              <p className="text-xs text-slate-400">Generate a live synthetic scoring dataset for your brand</p>
            </div>
          </div>

          <form onSubmit={handleCustomSubmit} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder="e.g. Zomato Direct, Acme Electronics, CloudNine..."
              className="flex-1 bg-slate-950/80 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
            <button
              type="submit"
              disabled={!customName.trim()}
              className="py-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold shadow-lg shadow-indigo-600/20 hover:shadow-indigo-500/40 transition-all flex items-center justify-center gap-2 shrink-0"
            >
              Analyze Store
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80">
            <Sliders className="w-5 h-5 text-indigo-400 mb-2" />
            <h4 className="text-xs font-bold text-slate-200 mb-1">Live Scenario Sandbox</h4>
            <p className="text-[11px] text-slate-400 leading-snug">
              Drag interactive sliders to simulate what-if impact on score & revenue.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80">
            <TrendingUp className="w-5 h-5 text-emerald-400 mb-2" />
            <h4 className="text-xs font-bold text-slate-200 mb-1">Dynamic NLP Insights</h4>
            <p className="text-[11px] text-slate-400 leading-snug">
              Automated plain-English explanations identifying root causes & spikes.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80">
            <ShieldCheck className="w-5 h-5 text-cyan-400 mb-2" />
            <h4 className="text-xs font-bold text-slate-200 mb-1">Impact-Ranked Actions</h4>
            <p className="text-[11px] text-slate-400 leading-snug">
              Clear recommendations ranked by potential score points gained.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80">
            <Activity className="w-5 h-5 text-amber-400 mb-2" />
            <h4 className="text-xs font-bold text-slate-200 mb-1">Transparent Formula</h4>
            <p className="text-[11px] text-slate-400 leading-snug">
              100% auditable 4-factor formula with clear normalization bounds.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 py-4 px-6 text-center text-xs text-slate-500">
        PayHealth SaaS — Merchant Payment Performance Intelligence Platform
      </footer>
    </div>
  );
}
