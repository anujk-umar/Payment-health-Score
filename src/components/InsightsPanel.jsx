import React, { useState } from 'react';
import {
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  AlertOctagon,
  ArrowRight,
  Info,
  Filter,
} from 'lucide-react';

export default function InsightsPanel({
  insights,
  onSimulateAction,
  onOpenSimulator,
}) {
  const [filterType, setFilterType] = useState('all');

  const filteredInsights = insights.filter((item) => {
    if (filterType === 'all') return true;
    if (filterType === 'risks') return item.type === 'critical' || item.type === 'warning';
    if (filterType === 'positive') return item.type === 'positive';
    return true;
  });

  return (
    <div className="bg-slate-900/80 backdrop-blur-md rounded-3xl p-6 border border-slate-800/80 shadow-xl">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Dynamic AI & Rule-Generated Insights
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            Real-time plain-English diagnostics calculated from current transaction variance & channel mix.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-950/80 border border-slate-800 p-1 rounded-xl text-xs">
          {[
            { id: 'all', label: `All (${insights.length})` },
            {
              id: 'risks',
              label: `Risks & Alerts (${insights.filter((i) => i.type !== 'positive').length})`,
            },
            {
              id: 'positive',
              label: `Wins (${insights.filter((i) => i.type === 'positive').length})`,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                filterType === tab.id
                  ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Insights Cards List */}
      <div className="space-y-3.5">
        {filteredInsights.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-slate-950/40 border border-slate-800/60 text-slate-400 text-xs">
            No specific insights matching this filter right now.
          </div>
        ) : (
          filteredInsights.map((insight) => {
            const isCritical = insight.type === 'critical';
            const isWarning = insight.type === 'warning';
            const isPositive = insight.type === 'positive';

            const borderStyle = isCritical
              ? 'border-rose-500/30 bg-rose-500/5 hover:border-rose-500/50'
              : isWarning
              ? 'border-amber-500/30 bg-amber-500/5 hover:border-amber-500/50'
              : 'border-emerald-500/30 bg-emerald-500/5 hover:border-emerald-500/50';

            const badgeStyle = isCritical
              ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
              : isWarning
              ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
              : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';

            const Icon = isCritical
              ? AlertOctagon
              : isWarning
              ? AlertTriangle
              : CheckCircle2;

            return (
              <div
                key={insight.id}
                className={`p-4 rounded-2xl border ${borderStyle} transition-all duration-200 flex flex-col sm:flex-row items-start justify-between gap-4`}
              >
                <div className="flex items-start gap-3 flex-1">
                  <div className={`p-2 rounded-xl border mt-0.5 shrink-0 ${badgeStyle}`}>
                    <Icon className="w-4 h-4" />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeStyle}`}>
                        {insight.tag}
                      </span>
                      {insight.metricDelta && (
                        <span className="text-[11px] font-semibold text-slate-400">
                          Driver: <strong className="text-slate-200">{insight.metricDelta}</strong>
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-bold text-white mb-1 leading-snug">
                      {insight.title}
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {insight.description}
                    </p>
                  </div>
                </div>

                {insight.actionable && (
                  <button
                    onClick={onOpenSimulator}
                    className="self-end sm:self-center shrink-0 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                  >
                    <span>Simulate Fix</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
