/**
 * Payment Health Score Engine
 * Computes 0-100 Payment Health Score based on 4 weighted fintech metrics:
 * 1. Transaction Success Rate (35%)
 * 2. Refund Rate (20%)
 * 3. Settlement Delay (20%)
 * 4. Dispute / Chargeback Rate (25%)
 */

export const METRIC_WEIGHTS = {
  successRate: 0.35,
  refundRate: 0.20,
  settlementDelay: 0.20,
  disputeRate: 0.25,
};

export const BENCHMARKS = {
  successRate: {
    min: 70.0, // 0 pts
    target: 88.0, // 64 pts (Industry Avg)
    max: 98.0, // 100 pts
    unit: '%',
    higherIsBetter: true,
    label: 'Transaction Success Rate',
    description: 'Percentage of payment authorization attempts that successfully complete without drops or gateway errors.',
    industryAvg: 88.5,
    topPerformer: 96.8,
  },
  refundRate: {
    min: 12.0, // 0 pts
    target: 4.5, // 68 pts (Industry Avg)
    max: 1.0, // 100 pts
    unit: '%',
    higherIsBetter: false,
    label: 'Refund Rate',
    description: 'Percentage of settled volume or transaction count returned back to customers.',
    industryAvg: 4.8,
    topPerformer: 1.2,
  },
  settlementDelay: {
    min: 7.0, // 0 pts (7+ days delay)
    target: 2.5, // 75 pts (Industry Avg)
    max: 1.0, // 100 pts (T+1 day)
    unit: 'days',
    higherIsBetter: false,
    label: 'Settlement Delay',
    description: 'Average business days between customer authorization and funds crediting into merchant nodal account.',
    industryAvg: 2.8,
    topPerformer: 1.1,
  },
  disputeRate: {
    min: 2.0, // 0 pts (Card network threshold)
    target: 0.65, // 71 pts (Industry Avg)
    max: 0.10, // 100 pts
    unit: '%',
    higherIsBetter: false,
    label: 'Dispute / Chargeback Rate',
    description: 'Percentage of processed volume contested by cardholders through bank chargebacks or fraud claims.',
    industryAvg: 0.55,
    topPerformer: 0.08,
  },
};

/**
 * Clamp a number between min and max
 */
export function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

/**
 * Calculate sub-score (0-100) for Success Rate
 */
export function calculateSuccessRateSubScore(rate) {
  const { min, max } = BENCHMARKS.successRate;
  if (rate >= max) return 100;
  if (rate <= min) return 0;
  const score = ((rate - min) / (max - min)) * 100;
  return clamp(Math.round(score * 10) / 10, 0, 100);
}

/**
 * Calculate sub-score (0-100) for Refund Rate
 */
export function calculateRefundRateSubScore(rate) {
  const { min, max } = BENCHMARKS.refundRate;
  if (rate <= max) return 100;
  if (rate >= min) return 0;
  const score = ((min - rate) / (min - max)) * 100;
  return clamp(Math.round(score * 10) / 10, 0, 100);
}

/**
 * Calculate sub-score (0-100) for Settlement Delay
 */
export function calculateSettlementDelaySubScore(days) {
  const { min, max } = BENCHMARKS.settlementDelay;
  if (days <= max) return 100;
  if (days >= min) return 0;
  const score = ((min - days) / (min - max)) * 100;
  return clamp(Math.round(score * 10) / 10, 0, 100);
}

/**
 * Calculate sub-score (0-100) for Dispute Rate
 */
export function calculateDisputeRateSubScore(rate) {
  const { min, max } = BENCHMARKS.disputeRate;
  if (rate <= max) return 100;
  if (rate >= min) return 0;
  const score = ((min - rate) / (min - max)) * 100;
  return clamp(Math.round(score * 10) / 10, 0, 100);
}

/**
 * Calculate composite health score and all sub-metric components
 */
export function calculatePaymentHealthScore(metrics) {
  const {
    successRate = 90.0,
    refundRate = 3.5,
    settlementDelay = 2.0,
    disputeRate = 0.4,
  } = metrics;

  const successSubScore = calculateSuccessRateSubScore(successRate);
  const refundSubScore = calculateRefundRateSubScore(refundRate);
  const settlementSubScore = calculateSettlementDelaySubScore(settlementDelay);
  const disputeSubScore = calculateDisputeRateSubScore(disputeRate);

  const weightedSuccess = successSubScore * METRIC_WEIGHTS.successRate;
  const weightedRefund = refundSubScore * METRIC_WEIGHTS.refundRate;
  const weightedSettlement = settlementSubScore * METRIC_WEIGHTS.settlementDelay;
  const weightedDispute = disputeSubScore * METRIC_WEIGHTS.disputeRate;

  const totalScoreRaw = weightedSuccess + weightedRefund + weightedSettlement + weightedDispute;
  const totalScore = clamp(Math.round(totalScoreRaw * 10) / 10, 0, 100);

  const tier = getScoreTier(totalScore);

  return {
    totalScore,
    totalScoreRaw,
    tier,
    breakdown: {
      successRate: {
        raw: successRate,
        subScore: successSubScore,
        weight: METRIC_WEIGHTS.successRate,
        weightedContribution: Math.round(weightedSuccess * 10) / 10,
        benchmark: BENCHMARKS.successRate,
        status: getMetricStatus('successRate', successSubScore),
      },
      refundRate: {
        raw: refundRate,
        subScore: refundSubScore,
        weight: METRIC_WEIGHTS.refundRate,
        weightedContribution: Math.round(weightedRefund * 10) / 10,
        benchmark: BENCHMARKS.refundRate,
        status: getMetricStatus('refundRate', refundSubScore),
      },
      settlementDelay: {
        raw: settlementDelay,
        subScore: settlementSubScore,
        weight: METRIC_WEIGHTS.settlementDelay,
        weightedContribution: Math.round(weightedSettlement * 10) / 10,
        benchmark: BENCHMARKS.settlementDelay,
        status: getMetricStatus('settlementDelay', settlementSubScore),
      },
      disputeRate: {
        raw: disputeRate,
        subScore: disputeSubScore,
        weight: METRIC_WEIGHTS.disputeRate,
        weightedContribution: Math.round(weightedDispute * 10) / 10,
        benchmark: BENCHMARKS.disputeRate,
        status: getMetricStatus('disputeRate', disputeSubScore),
      },
    },
  };
}

/**
 * Categorize composite score into tiers, grades, colors, and operational impacts
 */
export function getScoreTier(score) {
  if (score >= 85) {
    return {
      name: 'Excellent',
      code: 'EXCELLENT',
      grade: 'A+',
      color: '#10b981', // emerald-500
      bgClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      badgeClass: 'bg-emerald-500 text-slate-950 font-bold',
      gradient: 'from-emerald-500 to-teal-400',
      glowClass: 'glow-emerald',
      statusText: 'Optimal Payment Flow',
      reserveRequirement: '0% Rolling Reserve',
      routingPriority: 'Priority Tier 1 (Lowest interchange fee)',
      summary: 'Your payment pipeline operates with top-decile reliability, low friction, and minimal chargeback exposure.',
    };
  } else if (score >= 75) {
    return {
      name: 'Healthy',
      code: 'HEALTHY',
      grade: 'A',
      color: '#22c55e', // green-500
      bgClass: 'bg-green-500/10 text-green-400 border-green-500/30',
      badgeClass: 'bg-green-500 text-slate-950 font-bold',
      gradient: 'from-green-500 to-emerald-400',
      glowClass: 'glow-emerald',
      statusText: 'Strong Health',
      reserveRequirement: '2% Standard Reserve',
      routingPriority: 'Standard High Routing',
      summary: 'Solid payment performance across all channels with minor room for settlement or auth rate optimization.',
    };
  } else if (score >= 50) {
    return {
      name: 'Moderate',
      code: 'MODERATE',
      grade: 'B-',
      color: '#f59e0b', // amber-500
      bgClass: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      badgeClass: 'bg-amber-500 text-slate-950 font-bold',
      gradient: 'from-amber-500 to-yellow-400',
      glowClass: 'glow-amber',
      statusText: 'Attention Advised',
      reserveRequirement: '7.5% Rolling Reserve',
      routingPriority: 'Restricted Multi-gateway routing',
      summary: 'Elevated friction detected. Success rate drops or delayed settlements are impacting merchant cash flow.',
    };
  } else {
    return {
      name: 'At Risk',
      code: 'AT_RISK',
      grade: 'D',
      color: '#f43f5e', // rose-500
      bgClass: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
      badgeClass: 'bg-rose-500 text-slate-950 font-bold',
      gradient: 'from-rose-500 to-red-400',
      glowClass: 'glow-rose',
      statusText: 'High Risk Alert',
      reserveRequirement: '15% Excessive Reserve Held',
      routingPriority: 'High Risk Gateway Pool (Review in progress)',
      summary: 'Critical warning: High dispute or refund frequency threatens merchant account standing and payment processing capabilities.',
    };
  }
}

/**
 * Metric specific status
 */
function getMetricStatus(metricKey, subScore) {
  if (subScore >= 80) return { label: 'Optimal', type: 'good', color: 'text-emerald-400' };
  if (subScore >= 55) return { label: 'Average', type: 'warning', color: 'text-amber-400' };
  return { label: 'Critical', type: 'danger', color: 'text-rose-400' };
}
