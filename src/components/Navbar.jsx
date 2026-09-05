import React from 'react';
import { MERCHANT_PERSONAS, PAYMENT_METHODS } from '../utils/mockDataGenerator';
import {
  Activity,
  Sliders,
  HelpCircle,
  Calendar,
  Layers,
  ChevronDown,
  RotateCcw,
  Sparkles,
  Building,
  DollarSign,
  IndianRupee,
} from 'lucide-react';

export default function Navbar({
  merchantData,
  selectedPersonaId,
  onSelectPersona,
  timeRange,
  setTimeRange,
  selectedMethod,
  setSelectedMethod,
  currency,
  setCurrency,
  onOpenFormulaModal,
  onOpenSimulator,
  onBackToLanding,
}) {
  return (
    <header className="sticky top-0 z-30 bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-6 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left: Brand + Persona Selector */}
        <div className="flex items-center justify-between md:justify-start gap-4">
          <div
            onClick={onBackToLanding}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Activity className="w-4 h-4 text-indigo-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-extrabold tracking-tight text-white group-hover:text-indigo-300 transition-colors">
                  PayHealth
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  LIVE
                </span>
              </div>
              <span className="text-[10px] text-slate-400 block -mt-0.5">Health Score Studio</span>
            </div>
          </div>

          {/* Persona Switcher Dropdown */}
          <div className="relative flex items-center">
            <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs">
              <Building className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <select
                value={selectedPersonaId || 'custom'}
                onChange={(e) => onSelectPersona(e.target.value)}
                className="bg-transparent text-slate-200 text-xs font-semibold focus:outline-none cursor-pointer pr-1"
              >
                {MERCHANT_PERSONAS.map((p) => (
                  <option key={p.id} value={p.id} className="bg-slate-900 text-slate-100">
                    {p.name} ({p.tier.split(' ')[0]})
                  </option>
                ))}
                {(!selectedPersonaId || selectedPersonaId === 'custom') && (
                  <option value="custom" className="bg-slate-900 text-slate-100">
                    {merchantData.merchantName} (Custom)
                  </option>
                )}
              </select>
            </div>
          </div>
        </div>

        {/* Right: Controls & Actions */}
        <div className="flex flex-wrap items-center justify-between md:justify-end gap-2.5">
          {/* Time Range Toggle */}
          <div className="flex items-center bg-slate-900/90 border border-slate-800 rounded-xl p-1 text-xs">
            <Calendar className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-1" />
            {[
              { id: '7d', label: '7D' },
              { id: '30d', label: '30D' },
              { id: '60d', label: '60D' },
              { id: '90d', label: '90D' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTimeRange(t.id)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  timeRange === t.id
                    ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Payment Method Filter */}
          <div className="flex items-center bg-slate-900/90 border border-slate-800 rounded-xl px-2.5 py-1 text-xs text-slate-300">
            <Layers className="w-3.5 h-3.5 text-slate-400 mr-1.5" />
            <select
              value={selectedMethod}
              onChange={(e) => setSelectedMethod(e.target.value)}
              className="bg-transparent text-slate-200 text-xs font-medium focus:outline-none cursor-pointer"
            >
              {PAYMENT_METHODS.map((m) => (
                <option key={m.id} value={m.id} className="bg-slate-900 text-slate-100">
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          {/* Currency Toggle */}
          <button
            onClick={() => setCurrency(currency === 'INR' ? 'USD' : 'INR')}
            title="Toggle Currency (₹ INR / $ USD)"
            className="flex items-center justify-center p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-all text-xs font-semibold"
          >
            {currency === 'INR' ? (
              <span className="flex items-center gap-0.5">₹ <span className="text-[10px] text-slate-500">INR</span></span>
            ) : (
              <span className="flex items-center gap-0.5">$ <span className="text-[10px] text-slate-500">USD</span></span>
            )}
          </button>

          {/* Formula Transparency Button */}
          <button
            onClick={onOpenFormulaModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-all"
          >
            <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Formula Guide</span>
          </button>

          {/* Simulate Scenario Button (Standout CTA) */}
          <button
            onClick={onOpenSimulator}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-emerald-500 hover:from-indigo-500 hover:to-emerald-400 text-white text-xs font-bold shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Simulate Scenario</span>
          </button>
        </div>
      </div>
    </header>
  );
}
