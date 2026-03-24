// Format money as exact full number with commas, e.g. $1,224.94
export function formatMoney(amount: number | bigint): string {
  const bigAmount = BigInt(amount);
  const isNegative = bigAmount < 0n;
  const absAmount = isNegative ? -bigAmount : bigAmount;

  if (absAmount >= 1_000_000_000_000_000n) {
    const q = Number(absAmount / 1_000_000_000_000_000n) + Number(absAmount % 1_000_000_000_000_000n) / 1e15;
    return (isNegative ? "-$" : "$") + q.toFixed(2) + "Q";
  }
  if (absAmount >= 1_000_000_000_000n) {
    const t = Number(absAmount / 1_000_000_000_000n) + Number(absAmount % 1_000_000_000_000n) / 1e12;
    return (isNegative ? "-$" : "$") + t.toFixed(2) + "T";
  }
  if (absAmount >= 1_000_000_000n) {
    const b = Number(absAmount / 1_000_000_000n) + Number(absAmount % 1_000_000_000n) / 1e9;
    return (isNegative ? "-$" : "$") + b.toFixed(2) + "B";
  }

  // Below 1 billion: show exact number with commas
  return (isNegative ? "-$" : "$") + absAmount.toLocaleString("en-US");
}

// Short format for HUD where space is limited
export function formatMoneyShort(amount: number | bigint): string {
  const bigAmount = BigInt(amount);
  const isNegative = bigAmount < 0n;
  const absAmount = isNegative ? -bigAmount : bigAmount;

  if (absAmount >= 1_000_000_000_000_000n) return (isNegative ? "-$" : "$") + (Number(absAmount) / 1e15).toFixed(1) + "Q";
  if (absAmount >= 1_000_000_000_000n) return (isNegative ? "-$" : "$") + (Number(absAmount) / 1e12).toFixed(1) + "T";
  if (absAmount >= 1_000_000_000n) return (isNegative ? "-$" : "$") + (Number(absAmount) / 1e9).toFixed(2) + "B";
  if (absAmount >= 1_000_000n) return (isNegative ? "-$" : "$") + (Number(absAmount) / 1e6).toFixed(2) + "M";
  if (absAmount >= 1000n) return (isNegative ? "-$" : "$") + (Number(absAmount) / 1e3).toFixed(1) + "K";
  return (isNegative ? "-$" : "$") + Number(absAmount).toFixed(0);
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
export function formatPercent(current: number | bigint, previous: number | bigint): string {
  const cur = BigInt(current);
  const prev = BigInt(previous);
  if (prev === 0n) return "+0.00%";
  
  // Multiply by 10000 to get 2 decimal places precision after division by 100
  const changeBasis = ((cur - prev) * 10000n) / prev;
  const change = Number(changeBasis) / 100;
  return (change >= 0 ? "+" : "") + change.toFixed(2) + "%";
}

export function isPositiveChange(current: number | bigint, previous: number | bigint): boolean {
  return BigInt(current) >= BigInt(previous);
}

// Calculate upgrade cost with exponential scaling
export function getUpgradeCost(baseCost: number, currentLevel: number): number {
  return Math.floor(baseCost * Math.pow(1.5, currentLevel - 1));
}

// Format crypto amount (assuming 8 decimal precision, e.g. satoshis)
export function formatCryptoAmount(amount: bigint, symbol: string): string {
  const whole = amount / 100_000_000n;
  const fraction = amount % 100_000_000n;
  const fractionStr = fraction.toString().padStart(8, "0").replace(/0+$/, "");
  return `${whole}${fractionStr ? "." + fractionStr : ""} ${symbol}`;
}
