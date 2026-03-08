export function calculateMinimumSellPrice(
  costPrice: number,
  marginPercentage: number
): number {
  if (costPrice < 0) {
    throw new Error("Cost price must be >= 0");
  }

  if (marginPercentage < 0) {
    throw new Error("Margin percentage must be >= 0");
  }

  return costPrice * (1 + marginPercentage / 100);
}