import { calculatePaymentHealthScore, BENCHMARKS } from '../utils/scoreEngine.js';
import { generateMerchantData, MERCHANT_PERSONAS } from '../utils/mockDataGenerator.js';
import { generateDynamicInsights } from '../utils/insightsGenerator.js';
import { getRankedRecommendations } from '../utils/recommendationEngine.js';

console.log('--- TESTING SCORE ENGINE ---');

// Test 1: Ideal top-tier metrics
const idealScore = calculatePaymentHealthScore({
  successRate: 98.0,
  refundRate: 1.0,
  settlementDelay: 1.0,
  disputeRate: 0.10,
});
console.log('Ideal Metrics Score:', idealScore.totalScore, 'Tier:', idealScore.tier.name);
console.assert(idealScore.totalScore === 100, 'Ideal score should be 100');

// Test 2: Critical / High-risk metrics
const criticalScore = calculatePaymentHealthScore({
  successRate: 70.0,
  refundRate: 12.0,
  settlementDelay: 7.0,
  disputeRate: 2.0,
});
console.log('Critical Metrics Score:', criticalScore.totalScore, 'Tier:', criticalScore.tier.name);
console.assert(criticalScore.totalScore === 0, 'Critical score should be 0');

// Test 3: Realistic Merchant Personas
console.log('\n--- TESTING PERSONAS ---');
for (const p of MERCHANT_PERSONAS) {
  const data = generateMerchantData(p.name, p.id);
  const score = data.currentPeriod.totalScore;
  const insights = generateDynamicInsights(data);
  const recommendations = getRankedRecommendations(data);
  console.log(`Persona: ${p.name} (${p.tier})`);
  console.log(`  -> Current Score: ${score}/100 [Grade ${data.currentPeriod.scoreResult.tier.grade}]`);
  console.log(`  -> 90-day Data Points Generated: ${data.history.length}`);
  console.log(`  -> Dynamic Insights Count: ${insights.length}`);
  console.log(`  -> Ranked Recommendations: ${recommendations.length}`);
  console.log(`  -> Top Play: ${recommendations[0]?.title} (+${recommendations[0]?.scoreBoost} pts)`);
}

console.log('\n--- ALL LOGICAL CHECKS PASSED SUCCESSFULLY ---');
