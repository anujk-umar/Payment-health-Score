/**
 * Recommendation & Action Center Engine
 * Ranks actionable operational steps based on simulated Health Score impact
 * and estimated revenue recovery for the merchant.
 */

import { calculatePaymentHealthScore } from './scoreEngine.js';

export function getRankedRecommendations(merchantData) {
  if (!merchantData || !merchantData.currentPeriod) return [];

  const { currentPeriod, methodBreakdown } = merchantData;
  const currentMetrics = {
    successRate: currentPeriod.successRate,
    refundRate: currentPeriod.refundRate,
    settlementDelay: currentPeriod.settlementDelay,
    disputeRate: currentPeriod.disputeRate,
  };

  const currentScore = currentPeriod.totalScore;
  const monthlyVol = currentPeriod.totalVolume;

  const candidateActions = [];

  // Recommendation 1: Smart Dynamic Routing & Auto-Retry for UPI / Cards
  if (currentMetrics.successRate < 96.0) {
    const targetSuccess = Math.min(97.0, currentMetrics.successRate + 4.2);
    const simScore = calculatePaymentHealthScore({
      ...currentMetrics,
      successRate: targetSuccess,
    }).totalScore;
    const scoreBoost = Math.round((simScore - currentScore) * 10) / 10;
    const recoveredRevenue = Math.round(monthlyVol * 0.042);

    candidateActions.push({
      id: 'dynamic-routing',
      title: 'Enable Smart Dynamic Gateway Routing & Instant Retry',
      category: 'Auth Optimization',
      targetMetric: 'successRate',
      currentValue: `${currentMetrics.successRate}%`,
      targetValue: `${targetSuccess}%`,
      scoreBoost: Math.max(0.5, scoreBoost),
      financialImpact: `+₹${(recoveredRevenue / 100000).toFixed(2)} Lakhs/mo recovered volume`,
      effort: 'Low Effort',
      effortTime: '1-click Gateway Config',
      impactLevel: 'High Impact',
      badgeColor: 'indigo',
      description:
        'Automatically switches degraded acquiring bank routes in real-time and executes silent 3D Secure / OTP auto-read to capture dropped transactions.',
      actionLabel: 'Simulate Smart Routing',
      presetSimulation: {
        successRate: targetSuccess,
      },
    });
  }

  // Recommendation 2: Pre-Dispute Deflection & Alert Integration (Ethoca / Verifi)
  if (currentMetrics.disputeRate > 0.2) {
    const targetDispute = Math.max(0.08, Math.round((currentMetrics.disputeRate * 0.35) * 100) / 100);
    const simScore = calculatePaymentHealthScore({
      ...currentMetrics,
      disputeRate: targetDispute,
    }).totalScore;
    const scoreBoost = Math.round((simScore - currentScore) * 10) / 10;
    const disputeCostSaved = Math.round(monthlyVol * ((currentMetrics.disputeRate - targetDispute) / 100) * 1.5);

    candidateActions.push({
      id: 'pre-dispute-alert',
      title: 'Deploy Pre-Dispute Auto-Refund Deflection Protocol',
      category: 'Chargeback Defense',
      targetMetric: 'disputeRate',
      currentValue: `${currentMetrics.disputeRate}%`,
      targetValue: `${targetDispute}%`,
      scoreBoost: Math.max(0.5, scoreBoost),
      financialImpact: `₹${(disputeCostSaved / 1000).toFixed(0)}k in avoided chargeback fees & penalties`,
      effort: 'Medium Effort',
      effortTime: '2 Days Webhook Setup',
      impactLevel: 'Critical Impact',
      badgeColor: 'rose',
      description:
        'Intercepts incoming cardholder dispute alerts from issuing banks before they become formal chargebacks, issuing an automated refund within 4 hours.',
      actionLabel: 'Simulate Fraud Deflection',
      presetSimulation: {
        disputeRate: targetDispute,
      },
    });
  }

  // Recommendation 3: Accelerated Nodal Settlement Cycle (T+1 / Instant)
  if (currentMetrics.settlementDelay > 1.2) {
    const targetSettlement = 1.0;
    const daysReduced = Math.round((currentMetrics.settlementDelay - targetSettlement) * 10) / 10;
    const simScore = calculatePaymentHealthScore({
      ...currentMetrics,
      settlementDelay: targetSettlement,
    }).totalScore;
    const scoreBoost = Math.round((simScore - currentScore) * 10) / 10;
    const workingCapitalReleased = Math.round((monthlyVol / 30) * daysReduced);

    candidateActions.push({
      id: 'instant-settlement',
      title: `Transition to T+1 Instant Nodal Settlement (Reduce by ${daysReduced} days)`,
      category: 'Treasury & Liquidity',
      targetMetric: 'settlementDelay',
      currentValue: `${currentMetrics.settlementDelay} days`,
      targetValue: `${targetSettlement} day`,
      scoreBoost: Math.max(0.5, scoreBoost),
      financialImpact: `₹${(workingCapitalReleased / 100000).toFixed(2)} Lakhs faster working capital access`,
      effort: 'Low Effort',
      effortTime: 'Bank Verification',
      impactLevel: 'High Impact',
      badgeColor: 'emerald',
      description:
        'Activates priority multi-bank settlement rails (IMPS/RTGS direct clearing) to credit merchant bank accounts within 24 hours of batch cutoff.',
      actionLabel: 'Simulate T+1 Settlement',
      presetSimulation: {
        settlementDelay: targetSettlement,
      },
    });
  }

  // Recommendation 4: Instant Refund & Store Credit Exchange Loop
  if (currentMetrics.refundRate > 2.5) {
    const targetRefund = Math.max(1.2, Math.round((currentMetrics.refundRate * 0.6) * 10) / 10);
    const simScore = calculatePaymentHealthScore({
      ...currentMetrics,
      refundRate: targetRefund,
    }).totalScore;
    const scoreBoost = Math.round((simScore - currentScore) * 10) / 10;
    const retainedVolume = Math.round(monthlyVol * ((currentMetrics.refundRate - targetRefund) / 100));

    candidateActions.push({
      id: 'instant-refund-exchange',
      title: 'Automate Instant Refunds & Offer Store Credit Bonus Incentives',
      category: 'Customer Experience',
      targetMetric: 'refundRate',
      currentValue: `${currentMetrics.refundRate}%`,
      targetValue: `${targetRefund}%`,
      scoreBoost: Math.max(0.5, scoreBoost),
      financialImpact: `₹${(retainedVolume / 100000).toFixed(2)} Lakhs retained GMV through store vouchers`,
      effort: 'Low Effort',
      effortTime: 'Checkout Widget',
      impactLevel: 'Medium Impact',
      badgeColor: 'amber',
      description:
        'Offer customers 110% immediate store credit wallet vouchers for returns before initiating standard source bank refund reversals.',
      actionLabel: 'Simulate Refund Retention',
      presetSimulation: {
        refundRate: targetRefund,
      },
    });
  }

  // Sort descending by scoreBoost (ranked recommendations)
  return candidateActions.sort((a, b) => b.scoreBoost - a.scoreBoost);
}
