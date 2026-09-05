import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { BENCHMARKS } from '../utils/scoreEngine';
import { Users, CheckCircle2, AlertTriangle, ArrowUpRight } from 'lucide-react';

export default function PeerBenchmarkChart({ currentPeriod }) {
  const { successRate, refundRate, settlementDelay, disputeRate, scoreResult } = currentPeriod;

  // Normalized Factor Score Data (0-100) for clean comparison across all 4 dimensions
  const benchmarkData = [
    {
      metric: 'Success Rate (35%)',
      you: scoreResult.breakdown.successRate.subScore,
      industryAvg: 64, // ~88% normalized
      top10: 95, // ~96.8% normalized
      yourRaw: `${successRate}%`,
      indRaw: `${BENCHMARKS.successRate.industryAvg}%`,
      topRaw: `${BENCHMARKS.successRate.topPerformer}%`,
    },
    {
      metric: 'Refund Rate (20%)',
      you: scoreResult.breakdown.refundRate.subScore,
      industryAvg: 68, // ~4.8% normalized
      top10: 98, // ~1.2% normalized
      yourRaw: `${refundRate}%`,
      indRaw: `${BENCHMARKS.refundRate.industryAvg}%`,
      topRaw: `${BENCHMARKS.refundRate.topPerformer}%`,
    },
    {
      metric: 'Settlement (20%)',
      you: scoreResult.breakdown.settlementDelay.subScore,
      industryAvg: 70, // ~2.8d normalized
      top10: 98, // ~1.1d normalized
      yourRaw: `${settlementDelay}d`,
      indRaw: `${BENCHMARKS.settlementDelay.industryAvg}d`,
      topRaw: `${BENCHMARKS.settlementDelay.topPerformer}d`,
    },
    {
      metric: 'Dispute Rate (25%)',
      you: scoreResult.breakdown.disputeRate.subScore,
      industryAvg: 76, // ~0.55% normalized
      top10: 99, // ~0.08% normalized
      yourRaw: `${disputeRate}%`,
      indRaw: `${BENCHMARKS.disputeRate.industryAvg}%`,
      topRaw: `${BENCHMARKS.disputeRate.topPerformer}%`,
    },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const item = benchmarkData.find((d) => d.metric === label);
      return (
        <div className="bg-slate-950/95 backdrop-blur-xl border border-slate-700 rounded-xl p-3 shadow-2xl text-xs z-50 min-w-[200px]">
          <span className="font-bold text-slate-200 block border-b border-slate-800 pb-1 mb-2">
            {label}
          </span>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-indigo-400 font-bold">
              <span>Your Store:</span>
              <span>{payload[0].value} pts ({item ? item.yourRaw : ''})</span>
            </div>
            <div className="flex items-center justify-between text-slate-400 font-medium">
              <span>Industry Avg:</span>
              <span>{payload[1].value} pts ({item ? item.indRaw : ''})</span>
            </div>
            <div className="flex items-center justify-between text-emerald-400 font-medium">
              <span>Top 10% Leaders:</span>
              <span>{payload[2].value} pts ({item ? item.topRaw : ''})</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-slate-900/80 backdrop-blur-md rounded-3xl p-6 border border-slate-800/80 shadow-xl flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-2 mb-1">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-400" />
            <h3 className="text-base font-bold text-white tracking-tight">
              Peer & Industry Benchmark
            </h3>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
            Normalized 0-100 pts
          </span>
        </div>
        <p className="text-xs text-slate-400 mb-5">
          Side-by-side factor scoring comparison vs 2,500+ Indian & Global fintech merchants.
        </p>

        {/* Grouped Bar Chart */}
        <div className="w-full h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={benchmarkData}
              margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
              barCategoryGap="25%"
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(51, 65, 85, 0.4)" vertical={false} />
              <XAxis
                dataKey="metric"
                stroke="#64748b"
                fontSize={10}
                tickLine={false}
                axisLine={{ stroke: 'rgba(51, 65, 85, 0.6)' }}
              />
              <YAxis
                stroke="#64748b"
                fontSize={10}
                domain={[0, 100]}
                tickLine={false}
                axisLine={{ stroke: 'rgba(51, 65, 85, 0.6)' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                iconType="circle"
                iconSize={8}
              />
              <Bar dataKey="you" name="Your Store" fill="#6366f1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="industryAvg" name="Industry Avg" fill="#64748b" radius={[4, 4, 0, 0]} />
              <Bar dataKey="top10" name="Top 10% Leaders" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Comparison Summary Pill */}
      <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-indigo-500" />
          <span>Composite Score: <strong>{scoreResult.totalScore} pts</strong> (vs Industry 72.5)</span>
        </span>
        <span className="text-emerald-400 font-semibold flex items-center gap-0.5">
          {scoreResult.totalScore >= 72.5 ? (
            <>+{(scoreResult.totalScore - 72.5).toFixed(1)} pts vs peers <ArrowUpRight className="w-3 h-3" /></>
          ) : (
            <span className="text-rose-400">{(scoreResult.totalScore - 72.5).toFixed(1)} pts vs peers</span>
          )}
        </span>
      </div>
    </div>
  );
}
