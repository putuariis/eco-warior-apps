export type ImpactInput = { category: string; quantity: number; unit: string };
const factors: Record<string, { co2: number; waste: number }> = {
  Recycling: { co2: 1.64, waste: 1 }, Composting: { co2: 0.45, waste: 1 }, "Waste Reduction": { co2: 0.8, waste: 1 },
  "Clean Energy": { co2: 0.7, waste: 0 }, "Sustainable Transport": { co2: 0.23, waste: 0 }, Reforestation: { co2: 2.5, waste: 0 },
  "Food Waste": { co2: 0.9, waste: 1 }, "Water Conservation": { co2: 0.05, waste: 0 }, "Circular Economy": { co2: 1.2, waste: 0.8 }, Other: { co2: 0.3, waste: 0.2 }
};
export function calculateImpact({ category, quantity }: ImpactInput) {
  const factor = factors[category] ?? factors.Other;
  const co2Reduced = Math.max(0, quantity) * factor.co2;
  const wasteDiverted = Math.max(0, quantity) * factor.waste;
  const xp = Math.round(40 + co2Reduced * 8 + wasteDiverted * 4);
  const estimatedTokens = Math.max(5, Math.round(xp * 0.25));
  return { co2Reduced, wasteDiverted, xp, estimatedTokens };
}
