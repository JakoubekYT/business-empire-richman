export function formatMoney(amount: number): string {
  if (amount >= 1e12) return `$${(amount / 1e12).toFixed(2)}T`;
  if (amount >= 1e9) return `$${(amount / 1e9).toFixed(2)}B`;
  if (amount >= 1e6) return `$${(amount / 1e6).toFixed(2)}M`;
  if (amount >= 1e3) return `$${(amount / 1e3).toFixed(1)}K`;
  return `$${amount.toFixed(2)}`;
}

export function formatNumber(amount: number): string {
  if (amount >= 1e12) return `${(amount / 1e12).toFixed(2)}T`;
  if (amount >= 1e9) return `${(amount / 1e9).toFixed(2)}B`;
  if (amount >= 1e6) return `${(amount / 1e6).toFixed(2)}M`;
  if (amount >= 1e3) return `${(amount / 1e3).toFixed(1)}K`;
  return amount.toFixed(2);
}

export function formatPercent(current: number, previous: number): string {
  if (previous === 0) return "+0.00%";
  const change = ((current - previous) / previous) * 100;
  return `${change >= 0 ? "+" : ""}${change.toFixed(2)}%`;
}

export function isPositiveChange(current: number, previous: number): boolean {
  return current >= previous;
}

export function getUpgradeCost(base: number, level: number): number {
  return Math.floor(base * Math.pow(1.5, level));
}
