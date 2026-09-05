import React from 'react';
import {
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Clock,
  AlertTriangle,
  RotateCcw,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Info,
} from 'lucide-react';

/**
 * Mini SVG Sparkline Generator
 */
function MiniSparkline({ data, metricKey, color = '#6366f1', isInverse = false }) {
  if (!data || data.length < 2) return null;

  const points = data.slice(-20).map((d) => d[metricKey]);
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min === 0 ? 1 : max - min;

  const width = 120;
  const height = 36;
  const padding = 4;

  const pathPoints = points.map((val, idx) => {
    const x = (idx / (points.length - 1)) * (width - padding * 2) + padding;
    // For standard metrics (higher is top). For inverse, val high is top
    const y = height - padding - ((val - min) / range) * (height - padding * 2);
    return `${x},${y}`;
  });

  const pathD = `M ${pathPoints.join(' L ')}`;
  const areaD = `${pathD} L ${width - padding},${height} L ${padding},${height} Z`;

  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id={`grad-${metricKey}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0.0" />
        </linearGradient>
      </defs>
      <path d={areaD} fill={`url(#grad-${metricKey})`} />
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function MetricBreakdownCards({
  breakdown,
  history,
  previousPeriod,
  onOpenSimulator,
}) {
  const cards = [
    {
      key: 'successRate',
      title: 'Transaction Success Rate',
      weight: '35% Factor Weight',
      icon: Zap,
      iconColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
      sparklineColor: '#6366f1',
      unit: '%',
      raw: breakdown.successRate.raw,
      subScore: breakdown.successRate.subScore,
      target: '>88.0% Benchmark',
      topPerformer: '96.8% Top 10%',
      higherIsBetter: true,
      delta: previousPeriod
        ? Math.round((breakdown.successRate.raw - previousPeriod.successRate) * 10) / 10
        : 0,
      description: 'Percentage of payment attempts authorized without customer drop-off or bank errors.',
    },
    {
      key: 'refundRate',
      title: 'Refund Rate',
      weight: '20% Factor Weight',
      icon: RotateCcw,
      iconColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
      sparklineColor: '#06b6d4',
      unit: '%',
      raw: breakdown.refundRate.raw,
      subScore: breakdown.refundRate.subScore,
      target: '<4.5% Benchmark',
      topPerformer: '1.2% Top 10%',
      higherIsBetter: false,
      delta: previousPeriod
        ? Math.round((breakdown.refundRate.raw - previousPeriod.refundRate) * 10) / 10
        : 0,
      description: 'Total volume returned to customers due to cancellations or product returns.',
    },
    {
      key: 'settlementDelay',
      title: 'Settlement Delay',
      weight: '20% Factor Weight',
      icon: Clock,
      iconColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      sparklineColor: '#10b981',
      unit: ' days',
      raw: breakdown.settlementDelay.raw,
      subScore: breakdown.settlementDelay.subScore,
      target: '<2.5d Benchmark',
      topPerformer: '1.1d Top 10%',
      higherIsBetter: false,
      delta: previousPeriod
        ? Math.round((breakdown.settlementDelay.raw - previousPeriod.settlementDelay) * 10) / 10
        : 0,
      description: 'Average business days between transaction swipe and nodal account credit.',
    },
    {
      key: 'disputeRate',
      title: 'Dispute / Chargeback',
      weight: '25% Factor Weight',
      icon: AlertTriangle,
      iconColor: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
      sparklineColor: '#f43f5e',
      unit: '%',
      raw: breakdown.disputeRate.raw,
      subScore: breakdown.disputeRate.subScore,
      target: '<0.65% Benchmark',
      topPerformer: '0.08% Top 10%',
      higherIsBetter: false,
      delta: previousPeriod
        ? Math.round((breakdown.disputeRate.raw - previousPeriod.disputeRate) * 100) / 100
        : 0,
      description: 'Chargebacks filed by cardholder issuing banks alleging fraud or non-delivery.',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const IconComponent = card.icon;
        const isGoodTrend = card.higherIsBetter
          ? card.delta >= 0
          : card.delta <= 0;

        const scoreColor =
          card.subScore >= 80
            ? 'text-emerald-400'
            : card.subScore >= 55
            ? 'text-amber-400'
            : 'text-rose-400';

        const progressBg =
          card.subScore >= 80
            ? 'bg-emerald-500'
            : card.subScore >= 55
            ? 'bg-amber-500'
            : 'bg-rose-500';

        return (
          <div
            key={card.key}
            className="group relative bg-slate-900/80 backdrop-blur-md rounded-2xl p-5 border border-slate-800/80 hover:border-slate-700 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              {/* Header: Icon + Title + Weight Badge */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className={`p-2 rounded-xl border ${card.iconColor}`}>
                  <IconComponent className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                  {card.weight}
                </span>
              </div>

              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                {card.title}
              </h3>

              {/* Main Metric Value & Delta */}
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-2xl sm:text-3xl font-black tracking-tight text-white font-sans">
                  {card.raw}
                  <span className="text-base font-medium text-slate-400 ml-0.5">{card.unit}</span>
                </span>

                {card.delta !== 0 && (
                  <div
                    className={`inline-flex items-center text-xs font-bold ${
                      isGoodTrend ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {isGoodTrend ? (
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    ) : (
                      <ArrowDownRight className="w-3.5 h-3.5" />
                    )}
                    <span>{Math.abs(card.delta)}{card.unit}</span>
                  </div>
                )}
              </div>

              {/* Sub-score Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="text-slate-400 font-medium">Factor Health</span>
                  <span className={`font-bold ${scoreColor}`}>
                    {card.subScore} <span className="text-slate-500 text-[10px]">/ 100</span>
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${progressBg} rounded-full transition-all duration-700`}
                    style={{ width: `${card.subScore}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Bottom: Sparkline + Benchmark */}
            <div className="pt-3 border-t border-slate-800/80 flex items-end justify-between gap-2">
              <div className="text-[10px] text-slate-400">
                <span className="block text-slate-500 font-semibold">{card.target}</span>
                <span className="text-indigo-400/90 font-medium">{card.topPerformer}</span>
              </div>

              {/* Mini Sparkline */}
              <div className="shrink-0">
                <MiniSparkline
                  data={history}
                  metricKey={card.key}
                  color={card.sparklineColor}
                  isInverse={!card.higherIsBetter}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
