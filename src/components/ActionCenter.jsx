import React from 'react';
import {
  TrendingUp,
  Zap,
  ShieldCheck,
  Clock,
  RotateCcw,
  Sliders,
  ArrowRight,
  Flame,
  CheckCircle,
} from 'lucide-react';

export default function ActionCenter({
  recommendations,
  onApplySimulationPreset,
}) {
  return (
    <div className="bg-slate-900/80 backdrop-blur-md rounded-3xl p-6 border border-slate-800/80 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Flame className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Action Center & Optimization Playbooks
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            Ranked step-by-step actions prioritized by estimated Health Score lift and revenue gain.
          </p>
        </div>

        <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 self-start sm:self-center">
          {recommendations.length} High-Impact Plays Available
        </span>
      </div>

      {/* Ranked Recommendations List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendations.map((rec, index) => {
          return (
            <div
              key={rec.id}
              className="bg-slate-950/60 rounded-2xl p-5 border border-slate-800 hover:border-indigo-500/40 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Top bar: Rank + Category + Score Lift Badge */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-800 text-indigo-400 font-extrabold text-xs flex items-center justify-center border border-slate-700">
                      #{index + 1}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {rec.category}
                    </span>
                  </div>

                  <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs font-black">
                    <TrendingUp className="w-3 h-3 text-emerald-400" />
                    <span>+{rec.scoreBoost} pts</span>
                  </div>
                </div>

                <h4 className="text-sm font-bold text-white mb-1.5 leading-snug">
                  {rec.title}
                </h4>

                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {rec.description}
                </p>

                {/* Financial Impact & Metric Transition */}
                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs space-y-1.5 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Target Metric:</span>
                    <span className="font-semibold text-slate-200">
                      {rec.currentValue} → <strong className="text-emerald-400">{rec.targetValue}</strong>
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Financial Value:</span>
                    <span className="font-bold text-indigo-300">{rec.financialImpact}</span>
                  </div>
                </div>
              </div>

              {/* Bottom: Effort + 1-Click Simulation Trigger */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                <span className="text-[10px] font-semibold text-slate-500">
                  {rec.effort} • {rec.effortTime}
                </span>

                <button
                  onClick={() => onApplySimulationPreset(rec.presetSimulation)}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <Sliders className="w-3 h-3" />
                  <span>{rec.actionLabel}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
