export interface Business {
  id: string;
  type: BusinessType;
  name: string;
  level: number;
  maxLevel: number;
  incomePerHour: number;
  upgradeCost: number;
  icon: string;
  color: string;
  unlockCost: number;
  owned: boolean;
  category: BusinessCategory;
  description: string;
  mergeItem?: string;
  merged?: boolean;
}

export type BusinessType =
  | "convenience_store"
  | "factory"
  | "taxi_company"
  | "shipping_company"
  | "construction_company"
  | "car_dealership"
  | "it_company"
  | "bank"
  | "football_club"
  | "oil_gas_company"
  | "clothing_brand"
  | "space_agency"
  | "holding_company";

export type BusinessCategory =
  | "RETAIL"
  | "MANUFACTURING"
  | "SERVICE"
  | "FINANCE"
  | "ENTERTAINMENT"
  | "ENERGY"
  | "TECH";

export interface Property {
  id: string;
  name: string;
  city: string;
  country: string;
  flag: string;
  baseIncomePerHour: number;
  purchaseCost: number;
  owned: boolean;
  improvements: PropertyImprovement[];
  image: string;
}

export interface PropertyImprovement {
  id: string;
  name: string;
  cost: number;
  incomeBonus: number;
  purchased: boolean;
  icon: string;
}

export interface Stock {
  ticker: string;
  name: string;
  currentPrice: number;
  previousPrice: number;
  sharesOwned: number;
  totalShares: number;
  dividendPerShare: number;
  priceHistory: number[];
  sector: string;
  color: string;
}

export interface CryptoCoin {
  id: string;
  name: string;
  symbol: string;
  currentPrice: number;
  previousPrice: number;
  amountOwned: number;
  volatility: "LOW" | "MEDIUM" | "HIGH" | "EXTREME";
  priceHistory: number[];
  color: string;
  icon: string;
}

export interface LuxuryItem {
  id: string;
  name: string;
  category: LuxuryCategory;
  cost: number;
  costCurrency?: "money" | "crypto";
  cryptoCoinId?: string;
  cryptoAmount?: number;
  description: string;
  icon: string;
  owned: boolean;
  netWorthBoost: number;
}

export type LuxuryCategory =
  | "CARS"
  | "AVIATION"
  | "MARITIME"
  | "ART"
  | "REAL_ESTATE"
  | "COLLECTIBLES";

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: "WEALTH" | "BUSINESS" | "INVESTMENT" | "LUXURY" | "SPECIAL";
  target: number;
  progress: number;
  completed: boolean;
  reward: number;
  claimed: boolean;
}

export interface DailyTask {
  id: string;
  description: string;
  target: number;
  progress: number;
  completed: boolean;
  claimed: boolean;
  reward: number;
  rewardType: "money" | "boost";
  type: "earn" | "upgrade" | "buy_stock" | "buy_crypto" | "buy_luxury";
  resetDate: string;
}

export interface GameState {
  money: number;
  totalEarned: number;
  netWorth: number;
  incomePerHour: number;
  clickIncome: number;
  totalClicks: number;
  businesses: Business[];
  properties: Property[];
  stocks: Stock[];
  crypto: CryptoCoin[];
  luxuryItems: LuxuryItem[];
  achievements: Achievement[];
  dailyTasks: DailyTask[];
  lastSaved: number;
  lastOnline: number;
  prestigeLevel: number;
  prestigeBonus: number;
  activeBoosts: ActiveBoost[];
  dayStarted: string;
  totalPlayTimeSeconds: number;
  leaderboardRank?: number;
}

export interface ActiveBoost {
  id: string;
  multiplier: number;
  expiresAt: number;
  name: string;
}
