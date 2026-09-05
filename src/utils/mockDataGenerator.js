/**
 * Synthetic Mock Data Generator for PayHealth
 * Generates 90 days of realistic payment transaction data,
 * payment method splits, anomalies, category distributions,
 * and 3 distinct merchant personas.
 */

import { calculatePaymentHealthScore } from './scoreEngine.js';

export const MERCHANT_PERSONAS = [
  {
    id: 'apex-retail',
    name: 'Apex Retail Labs',
    tier: 'Healthy Merchant',
    industry: 'D2C Consumer Tech & Apparel',
    monthlyVolume: 14850000, // ₹1.48 Cr
    currency: 'INR',
    description: 'High-volume omnichannel retailer with automated reconciliation, smart UPI auto-routing, and proactive customer dispute prevention.',
    baseMetrics: {
      successRate: 94.6,
      refundRate: 2.1,
      settlementDelay: 1.2,
      disputeRate: 0.14,
    },
    riskProfile: 'Low Risk — Tier 1 Route',
  },
  {
    id: 'nova-dropship',
    name: 'Nova QuickDrops',
    tier: 'Struggling Merchant',
    industry: 'Cross-Border Dropshipping & Gadgets',
    monthlyVolume: 5920000, // ₹59.2 Lakhs
    currency: 'INR',
    description: 'Rapid growth merchant facing high international card declines, delayed carrier deliveries causing chargeback spikes, and slower nodal settlement.',
    baseMetrics: {
      successRate: 78.8,
      refundRate: 9.6,
      settlementDelay: 4.8,
      disputeRate: 1.72,
    },
    riskProfile: 'High Risk — 15% Reserve Applied',
  },
  {
    id: 'pulse-fit',
    name: 'Pulse Fit Subscriptions',
    tier: 'Recovering Merchant',
    industry: 'Fitness SaaS & Recurring Memberships',
    monthlyVolume: 9400000, // ₹94.0 Lakhs
    currency: 'INR',
    description: 'Subscription business that recently stabilized recurring e-mandates, reduced involuntary churn, and shifted to T+2 settlement cycle.',
    baseMetrics: {
      successRate: 87.2,
      refundRate: 4.3,
      settlementDelay: 2.1,
      disputeRate: 0.52,
    },
    riskProfile: 'Moderate — Upward Trajectory',
  },
];

export const PAYMENT_METHODS = [
  { id: 'all', name: 'All Payment Methods', icon: 'Layers' },
  { id: 'upi', name: 'UPI (GPay / PhonePe / Paytm)', share: 0.58, color: '#6366f1' },
  { id: 'cards', name: 'Cards (Visa / Master / RuPay)', share: 0.26, color: '#06b6d4' },
  { id: 'netbanking', name: 'Netbanking (HDFC / ICICI / SBI)', share: 0.11, color: '#f59e0b' },
  { id: 'wallets_bnpl', name: 'BNPL & Wallets', share: 0.05, color: '#ec4899' },
];

export const TRANSACTION_CATEGORIES = [
  { id: 'electronics', name: 'Electronics & Gadgets', avgTicket: 4800 },
  { id: 'apparel', name: 'Apparel & Fashion', avgTicket: 1950 },
  { id: 'subscriptions', name: 'Digital Subscriptions', avgTicket: 899 },
  { id: 'essentials', name: 'Grocery & Essentials', avgTicket: 650 },
];

/**
 * Seeded pseudo-random number generator for deterministic synthetic data
 */
function createSeededRandom(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return function () {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function stringToSeed(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash) + 12345;
}

/**
 * Generate 90 days of synthetic merchant data
 */
export function generateMerchantData(merchantInput = 'Apex Retail Labs', selectedPersonaId = null) {
  let persona = MERCHANT_PERSONAS.find((p) => p.id === selectedPersonaId);
  if (!persona) {
    persona = MERCHANT_PERSONAS.find(
      (p) => p.name.toLowerCase() === merchantInput.toLowerCase()
    );
  }

  // If custom merchant name
  const merchantName = persona ? persona.name : merchantInput;
  const seed = stringToSeed(merchantName);
  const rand = createSeededRandom(seed);

  const baseMetrics = persona
    ? persona.baseMetrics
    : {
        successRate: 85.0 + (rand() * 10 - 5),
        refundRate: 4.0 + (rand() * 4 - 2),
        settlementDelay: 2.5 + (rand() * 2 - 1),
        disputeRate: 0.5 + (rand() * 0.6 - 0.3),
      };

  const today = new Date();
  const history = [];

  // Generate 90 days of history
  for (let i = 89; i >= 0; i--) {
    const dateObj = new Date(today);
    dateObj.setDate(today.getDate() - i);
    const dateStr = dateObj.toISOString().split('T')[0];
    const dayOfWeek = dateObj.getDay(); // 0 = Sun, 6 = Sat
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    // Day noise factor
    const noise = (rand() - 0.5) * 2;
    const isAnomalyDay = i === 14 || i === 42 || i === 73; // Simulated realistic network/campaign events

    let dailySuccessRate = baseMetrics.successRate + noise * 1.5;
    let dailyRefundRate = baseMetrics.refundRate + noise * 0.6;
    let dailySettlementDelay = baseMetrics.settlementDelay + noise * 0.3;
    let dailyDisputeRate = baseMetrics.disputeRate + noise * 0.08;

    // Inject realistic temporal patterns & anomalies
    let anomalyInfo = null;

    if (i === 14) {
      // 14 days ago: Bank Gateway UPI Outage
      dailySuccessRate -= 8.5;
      dailySettlementDelay += 0.8;
      anomalyInfo = {
        title: 'UPI Inter-bank Switch Degradation',
        type: 'warning',
        impact: '-8.5% Success Rate',
      };
    } else if (i === 42) {
      // 42 days ago: Festival Sale Volume Surge
      dailyRefundRate += 3.2;
      dailySuccessRate += 2.0;
      anomalyInfo = {
        title: 'Mega Sale Spike (3.2x Volume)',
        type: 'info',
        impact: 'High Traffic Surge',
      };
    } else if (i === 73) {
      // 73 days ago: Fraud Ring Attack Mitigated
      dailyDisputeRate += 0.65;
      dailySuccessRate -= 3.0;
      anomalyInfo = {
        title: 'High-Value Card Velocity Flag',
        type: 'danger',
        impact: '+0.65% Dispute Spikes',
      };
    }

    // Weekend minor variance
    if (isWeekend) {
      dailySuccessRate -= 0.6;
      dailySettlementDelay += 0.4; // Weekend banking holiday
    }

    // Recovering merchant upward trajectory
    if (persona && persona.id === 'pulse-fit') {
      const recoveryProgress = (89 - i) / 89; // 0 to 1
      dailySuccessRate += recoveryProgress * 4.0;
      dailyDisputeRate -= recoveryProgress * 0.35;
      dailySettlementDelay -= recoveryProgress * 0.9;
    }

    // Struggling merchant downward pressure
    if (persona && persona.id === 'nova-dropship') {
      const struggleProgress = (89 - i) / 89;
      dailyRefundRate += struggleProgress * 2.2;
      dailyDisputeRate += struggleProgress * 0.4;
    }

    // Clamp boundaries
    dailySuccessRate = Math.min(99.4, Math.max(62.0, Math.round(dailySuccessRate * 10) / 10));
    dailyRefundRate = Math.min(18.0, Math.max(0.4, Math.round(dailyRefundRate * 10) / 10));
    dailySettlementDelay = Math.min(8.0, Math.max(0.8, Math.round(dailySettlementDelay * 10) / 10));
    dailyDisputeRate = Math.min(3.5, Math.max(0.02, Math.round(dailyDisputeRate * 100) / 100));

    const dailyScoreCalc = calculatePaymentHealthScore({
      successRate: dailySuccessRate,
      refundRate: dailyRefundRate,
      settlementDelay: dailySettlementDelay,
      disputeRate: dailyDisputeRate,
    });

    const dayVolume = Math.round(
      ((persona ? persona.monthlyVolume : 8500000) / 30) *
        (isWeekend ? 1.35 : 0.92) *
        (0.85 + rand() * 0.3)
    );

    const totalTxnCount = Math.round(dayVolume / 1450);
    const successfulTxnCount = Math.round(totalTxnCount * (dailySuccessRate / 100));
    const failedTxnCount = totalTxnCount - successfulTxnCount;
    const refundedCount = Math.round(successfulTxnCount * (dailyRefundRate / 100));
    const disputedCount = Math.round(successfulTxnCount * (dailyDisputeRate / 100));

    history.push({
      dayIndex: 89 - i,
      date: dateStr,
      displayDate: dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      score: dailyScoreCalc.totalScore,
      tier: dailyScoreCalc.tier,
      successRate: dailySuccessRate,
      refundRate: dailyRefundRate,
      settlementDelay: dailySettlementDelay,
      disputeRate: dailyDisputeRate,
      volume: dayVolume,
      txnCount: totalTxnCount,
      successfulCount: successfulTxnCount,
      failedCount: failedTxnCount,
      refundedCount,
      disputedCount,
      anomaly: anomalyInfo,
    });
  }

  // Calculate current aggregates based on last 30 days
  const last30Days = history.slice(-30);
  const prev30Days = history.slice(-60, -30);

  const calculatePeriodAverages = (period) => {
    const count = period.length;
    const avgSuccess = period.reduce((acc, d) => acc + d.successRate, 0) / count;
    const avgRefund = period.reduce((acc, d) => acc + d.refundRate, 0) / count;
    const avgSettlement = period.reduce((acc, d) => acc + d.settlementDelay, 0) / count;
    const avgDispute = period.reduce((acc, d) => acc + d.disputeRate, 0) / count;
    const totalVol = period.reduce((acc, d) => acc + d.volume, 0);
    const totalTxns = period.reduce((acc, d) => acc + d.txnCount, 0);

    const scoreResult = calculatePaymentHealthScore({
      successRate: Math.round(avgSuccess * 10) / 10,
      refundRate: Math.round(avgRefund * 10) / 10,
      settlementDelay: Math.round(avgSettlement * 10) / 10,
      disputeRate: Math.round(avgDispute * 100) / 100,
    });

    return {
      successRate: Math.round(avgSuccess * 10) / 10,
      refundRate: Math.round(avgRefund * 10) / 10,
      settlementDelay: Math.round(avgSettlement * 10) / 10,
      disputeRate: Math.round(avgDispute * 100) / 100,
      totalScore: scoreResult.totalScore,
      scoreResult,
      totalVolume: totalVol,
      totalTxns,
    };
  };

  const currentPeriod = calculatePeriodAverages(last30Days);
  const previousPeriod = calculatePeriodAverages(prev30Days);

  // Method breakdown (UPI, Cards, Netbanking, Wallets)
  const methodBreakdown = [
    {
      method: 'UPI',
      name: 'UPI Instant (GPay / PhonePe)',
      share: 62.4,
      volume: Math.round(currentPeriod.totalVolume * 0.624),
      successRate: Math.min(99, Math.round((currentPeriod.successRate + 1.8) * 10) / 10),
      avgSettlement: 1.0,
      disputeRate: Math.max(0.01, Math.round((currentPeriod.disputeRate * 0.35) * 100) / 100),
      color: '#6366f1',
    },
    {
      method: 'Cards',
      name: 'Credit & Debit Cards (Visa / MC)',
      share: 24.2,
      volume: Math.round(currentPeriod.totalVolume * 0.242),
      successRate: Math.round((currentPeriod.successRate - 3.2) * 10) / 10,
      avgSettlement: Math.round((currentPeriod.settlementDelay + 0.6) * 10) / 10,
      disputeRate: Math.round((currentPeriod.disputeRate * 2.1) * 100) / 100,
      color: '#06b6d4',
    },
    {
      method: 'Netbanking',
      name: 'Net Banking (Top 5 Banks)',
      share: 9.6,
      volume: Math.round(currentPeriod.totalVolume * 0.096),
      successRate: Math.round((currentPeriod.successRate - 1.1) * 10) / 10,
      avgSettlement: Math.round((currentPeriod.settlementDelay + 0.3) * 10) / 10,
      disputeRate: 0.05,
      color: '#f59e0b',
    },
    {
      method: 'BNPL_Wallets',
      name: 'BNPL & Digital Wallets',
      share: 3.8,
      volume: Math.round(currentPeriod.totalVolume * 0.038),
      successRate: Math.round((currentPeriod.successRate + 0.4) * 10) / 10,
      avgSettlement: Math.round((currentPeriod.settlementDelay + 0.8) * 10) / 10,
      disputeRate: 0.12,
      color: '#ec4899',
    },
  ];

  // Category breakdown
  const categoryBreakdown = [
    {
      name: 'Electronics & Gadgets',
      share: 38,
      successRate: Math.round((currentPeriod.successRate - 1.4) * 10) / 10,
      refundRate: Math.round((currentPeriod.refundRate + 2.1) * 10) / 10,
      disputeRate: Math.round((currentPeriod.disputeRate * 1.6) * 100) / 100,
    },
    {
      name: 'Apparel & Lifestyle',
      share: 32,
      successRate: Math.round((currentPeriod.successRate + 0.8) * 10) / 10,
      refundRate: Math.round((currentPeriod.refundRate + 1.2) * 10) / 10,
      disputeRate: Math.round((currentPeriod.disputeRate * 0.8) * 100) / 100,
    },
    {
      name: 'Digital Subscriptions',
      share: 18,
      successRate: Math.round((currentPeriod.successRate + 1.5) * 10) / 10,
      refundRate: Math.max(0.5, Math.round((currentPeriod.refundRate - 1.8) * 10) / 10),
      disputeRate: Math.round((currentPeriod.disputeRate * 0.9) * 100) / 100,
    },
    {
      name: 'Grocery & Essentials',
      share: 12,
      successRate: Math.round((currentPeriod.successRate + 2.4) * 10) / 10,
      refundRate: Math.max(0.2, Math.round((currentPeriod.refundRate - 2.5) * 10) / 10),
      disputeRate: 0.02,
    },
  ];

  return {
    merchantName,
    persona: persona || {
      id: 'custom',
      name: merchantName,
      tier: 'Custom Merchant',
      industry: 'E-Commerce & Digital Commerce',
      monthlyVolume: currentPeriod.totalVolume,
      description: 'Personalized live synthetic dataset for ' + merchantName,
    },
    history,
    currentPeriod,
    previousPeriod,
    methodBreakdown,
    categoryBreakdown,
  };
}
