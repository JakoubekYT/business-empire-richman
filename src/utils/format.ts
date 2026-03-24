// Format money as exact full number with commas, e.g. $1,224.94
// For very large numbers (quadrillions+) still uses suffix to avoid overflow
export function formatMoney(amount: number): string {
  if (!isFinite(amount)) return "$0";
  if (amount < 0) return "-" + formatMoney(-amount);

  if (amount >= 1_000_000_000_000_000) {
    return "$" + (amount / 1_000_000_000_000_000).toFixed(2) + "Q";
  }
  if (amount >= 1_000_000_000_000) {
    return "$" + (amount / 1_000_000_000_000).toFixed(2) + "T";
  }
  if (amount >= 1_000_000_000) {
    return "$" + (amount / 1_000_000_000).toFixed(2) + "B";
  }

  // Below 1 billion: show exact number with commas
  if (amount < 0.01) return "$0.00";
  return "$" + amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Short format for HUD where space is limited
export function formatMoneyShort(amount: number): string {
  if (!isFinite(amount)) return "$0";
  if (amount >= 1_000_000_000_000_000) return "$" + (amount / 1_000_000_000_000_000).toFixed(1) + "Q";
  if (amount >= 1_000_000_000_000) return "$" + (amount / 1_000_000_000_000).toFixed(1) + "T";
  if (amount >= 1_000_000_000) return "$" + (amount / 1_000_000_000).toFixed(2) + "B";
  if (amount >= 1_000_000) return "$" + (amount / 1_000_000).toFixed(2) + "M";
  if (amount >= 1_000) return "$" + (amount / 1_000).toFixed(1) + "K";
  return "$" + amount.toFixed(2);
}

// Format km driven
export function formatKm(km: number): string {
  if (km >= 1_000_000) return (km / 1_000_000).toFixed(1) + "M km";
  if (km >= 1_000) return (km / 1_000).toFixed(0) + "k km";
  return km.toFixed(0) + " km";
}

// Format time remaining
export function formatTimeRemaining(seconds: number): string {
  if (seconds <= 0) return "Done!";
  if (seconds < 60) return `${Math.ceil(seconds)}s`;
  if (seconds < 3600) return `${Math.ceil(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
  return `${Math.floor(seconds / 86400)}d ${Math.floor((seconds % 86400) / 3600)}h`;
}

// Format percentage change
export function formatPercent(current: number, previous: number): string {
  if (previous === 0) return "+0.00%";
  const change = ((current - previous) / previous) * 100;
  return (change >= 0 ? "+" : "") + change.toFixed(2) + "%";
}

export function isPositiveChange(current: number, previous: number): boolean {
  return current >= previous;
}

// Calculate upgrade cost with exponential scaling
export function getUpgradeCost(baseCost: number, currentLevel: number): number {
  return Math.floor(baseCost * Math.pow(1.5, currentLevel - 1));
}
