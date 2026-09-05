import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import {
  TrendingUp,
  Activity,
  AlertCircle,
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react';

export default function ScoreTrendChart({
  history,
  timeRange,
  setTimeRange,
}) {
  const [selectedMetric, setSelectedMetric] = useState('score');

  // Filter history based on time range
  const daysCount = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '60d' ? 60 : 90;
  const filteredData = history.slice(-daysCount);

  // Metric configurations
  const metricConfigs = {
    score: {
      label: 'Payment Health Score',
      unit: '/100',
      color: '#6366f1',
      gradId: 'gradScore',
      domain: [30, 100],
      referenceValue: 80,
      refLabel: 'Target Health (80)',
    },
    successRate: {
      label: 'Transaction Success Rate',
      unit: '%',
      color: '#10b981',
      gradId: 'gradSuccess',
      domain: [60, 100],
      referenceValue: 88,
      refLabel: 'Benchmark (88%)',
    },
    refundRate: {
      label: 'Refund Rate',
      unit: '%',
      color: '#06b6d4',
      gradId: 'gradRefund',
      domain: [0, 15],
      referenceValue: 4.5,
      refLabel: 'Threshold (4.5%)',
    },
    settlementDelay: {
      label: 'Settlement Delay',
      unit: ' days',
      color: '#f59e0b',
      gradId: 'gradSettlement',
      domain: [0, 8],
      referenceValue: 2.5,
      refLabel: 'Target (<2.5d)',
    },
    disputeRate: {
      label: 'Dispute / Chargeback Rate',
      unit: '%',
      color: '#f43f5e',
      gradId: 'gradDispute',
      domain: [0, 3],
      referenceValue: 0.65,
      refLabel: 'Risk Limit (0.65%)',
    },
  };

  const currentConfig = metricConfigs[selectedMetric];

  // Custom Tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      return (
        <div className="bg-slate-950/95 backdrop-blur-xl border border-slate-700/80 rounded-xl p-3 shadow-2xl text-xs z-50 min-w-[200px]">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-2">
            <span className="font-bold text-slate-200">{dataPoint.displayDate}</span>
            <span className="text-slate-400">{dataPoint.date}</span>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between font-semibold">
              <span className="text-slate-400">Health Score:</span>
              <span className="text-indigo-400 font-extrabold">{dataPoint.score}/100</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Success Rate:</span>
              <span className="text-emerald-400 font-medium">{dataPoint.successRate}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Refunds:</span>
              <span className="text-cyan-400 font-medium">{dataPoint.refundRate}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Settlement:</span>
              <span className="text-amber-400 font-medium">{dataPoint.settlementDelay}d</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Disputes:</span>
              <span className="text-rose-400 font-medium">{dataPoint.disputeRate}%</span>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[11px]">
              <span className="text-slate-500">Processed Volume:</span>
              <span className="text-slate-300">₹{(dataPoint.volume / 100000).toFixed(2)}L</span>
            </div>
          </div>

          {dataPoint.anomaly && (
            <div className="mt-2.5 p-2 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 flex items-start gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">{dataPoint.anomaly.title}</span>
                <span className="text-[10px] text-amber-200/90">{dataPoint.anomaly.impact}</span>
              </div>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-slate-900/80 backdrop-blur-md rounded-3xl p-6 border border-slate-800/80 shadow-xl">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-4 h-4 text-indigo-400" />
            <h3 className="text-base font-bold text-white tracking-tight">
              Historical Trajectory & Anomaly Timeline
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            Daily health score tracking with contextual network events and threshold boundaries.
          </p>
        </div>

        {/* Metric Selector Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-950/80 border border-slate-800 p-1 rounded-xl text-xs">
          {[
            { id: 'score', label: 'Overall Score' },
            { id: 'successRate', label: 'Success %' },
            { id: 'refundRate', label: 'Refunds %' },
            { id: 'settlementDelay', label: 'Settlement' },
            { id: 'disputeRate', label: 'Disputes' },
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedMetric(m.id)}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                selectedMetric === m.id
                  ? 'bg-indigo-600 text-white shadow-sm font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="w-full h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={filteredData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
            <defs>
              <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={currentConfig.color} stopOpacity="0.35" />
                <stop offset="100%" stopColor={currentConfig.color} stopOpacity="0.0" />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="rgba(51, 65, 85, 0.4)" vertical={false} />

            <XAxis
              dataKey="displayDate"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: 'rgba(51, 65, 85, 0.6)' }}
            />

            <YAxis
              stroke="#64748b"
              fontSize={11}
              domain={currentConfig.domain}
              tickLine={false}
              axisLine={{ stroke: 'rgba(51, 65, 85, 0.6)' }}
              tickFormatter={(val) => `${val}${currentConfig.unit}`}
            />

            <Tooltip content={<CustomTooltip />} />

            {/* Target Reference Line */}
            <ReferenceLine
              y={currentConfig.referenceValue}
              stroke="rgba(148, 163, 184, 0.5)"
              strokeDasharray="4 4"
              label={{
                value: currentConfig.refLabel,
                fill: '#94a3b8',
                fontSize: 10,
                position: 'right',
              }}
            />

            <Area
              type="monotone"
              dataKey={selectedMetric}
              stroke={currentConfig.color}
              strokeWidth={2.5}
              fill="url(#chartGrad)"
              dot={(props) => {
                const { cx, cy, payload } = props;
                if (payload.anomaly) {
                  return (
                    <circle
                      key={payload.date}
                      cx={cx}
                      cy={cy}
                      r={5}
                      fill="#f59e0b"
                      stroke="#0f172a"
                      strokeWidth={2}
                      className="animate-pulse"
                    />
                  );
                }
                return null;
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Info */}
      <div className="flex flex-wrap items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-800/80 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          <span>Yellow dots indicate network anomalies or campaign volume surges</span>
        </div>
        <span className="text-[11px] text-slate-500">
          Viewing last {daysCount} days • Updated in real-time
        </span>
      </div>
    </div>
  );
}
