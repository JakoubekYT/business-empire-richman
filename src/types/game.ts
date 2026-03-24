// =============================================
// IMAGE PLACEHOLDER SYSTEM
// Each asset has an id (filename key) and an AI prompt description.
// Place generated images in: src/assets/images/{id}.webp
// =============================================
export interface ImagePlaceholder {
  id: string;
  description: string; // AI art generation prompt
}

// =============================================
// TAXI COMPANY
// =============================================
export interface TaxiParkingSlot {
  id: number;
  cost: bigint;
  unlocked: boolean;
}

export interface TaxiCar {
  id: string;
  modelId: string;
  purchasedAt: number;
  currentKm: number;
  broken: boolean;
}

export interface TaxiCarModel {
  id: string;
  name: string;
  cost: bigint;
  incomePerHour: bigint;
  maxKm: number; // km until breakdown
  kmPerHour: number; // how fast km accumulate
  image: ImagePlaceholder;
}

export interface TaxiData {
  parkingSlots: TaxiParkingSlot[];
  ownedCars: TaxiCar[];
}

// =============================================
// CONVENIENCE STORE
// =============================================
export interface StoreProduct {
  id: string;
  name: string;
  shelfCost: bigint;    // cost to set up the shelf slot
  restockCost: bigint;  // cost to restock when empty
  incomePerHour: bigint;
  stockHours: number;   // how many hours stock lasts before needing restock
  image: ImagePlaceholder;
}

export interface OwnedStoreProduct {
  productId: string;
  restockedAt: number;  // timestamp
}

export interface StoreData {
  shelves: number; // total shelf slots owned
  activeProducts: OwnedStoreProduct[]; // products placed on shelves
}

// =============================================
// FACTORY
// =============================================
export interface FactoryProduct {
  id: string;
  name: string;
  lineCost: bigint;
  incomePerHour: bigint;
  image: ImagePlaceholder;
}

export interface FactoryLine {
  id: string;
  productId: string;
  purchasedAt: number;
}

export interface FactoryData {
  lines: FactoryLine[];
}

// =============================================
// SHIPPING COMPANY
// =============================================
export interface ShippingVehicleModel {
  id: string;
  name: string;
  cost: bigint;
  incomePerHour: bigint;
  maxKm: number;
  kmPerHour: number;
  image: ImagePlaceholder;
}

export interface ShippingVehicle {
  id: string;
  modelId: string;
  purchasedAt: number;
  currentKm: number;
  broken: boolean;
}

export interface ShippingData {
  vehicleSlots: number;
  ownedVehicles: ShippingVehicle[];
}

// =============================================
// CONSTRUCTION COMPANY
// =============================================
export interface ConstructionProject {
  id: string;
  name: string;
  description: string;
  durationSeconds: number;
  reward: bigint;
  requiredEquipment: number;
  requiredBuilders: number;
  requiredConcrete: number; // m3
  requiredWood: number; // m3
  requiredMetal: number; // tons
  image: ImagePlaceholder;
}

export interface ActiveConstruction {
  projectId: string;
  startedAt: number;
  endsAt: number;
}

export interface ConstructionData {
  equipmentCount: number;
  resources: {
    builders: number; // hired count
    concrete: number; // m3 owned
    wood: number; // m3 owned
    metal: number; // tons owned
  };
  activeProjects: ActiveConstruction[];
  completedProjects: string[]; // projectIds collected
}

// =============================================
// CAR DEALERSHIP
// =============================================
export type CarIssueType = 'engine' | 'transmission' | 'suspension' | 'body' | 'interior';

export interface DealerCarModel {
  id: string;
  name: string;
  baseBuyCost: bigint;
  maxSalePrice: bigint;
  image: ImagePlaceholder;
}

export interface DamagedUsedCar {
  id: string;
  modelId: string;
  buyPrice: bigint;
  issues: {
    type: CarIssueType;
    repairCost: bigint;
    repairTimeSeconds: number;
    isRepaired: boolean;
  }[];
}

export interface DealerOwnedCar {
  id: string;
  modelId: string;
  buyPrice: bigint;
  purchasedAt: number;
  issues: DamagedUsedCar["issues"];
  activeRepairIndex: number | null; // which issue is currently being repaired
  repairStartedAt: number | null;
  repairEndsAt: number | null;
  sold: boolean;
}

export interface CarDealershipData {
  mechanicSlots: number;
  mechanicsOwned: number;
  inventory: DealerOwnedCar[];
  market: DamagedUsedCar[]; // autos refreshes every hour
  lastMarketRefreshAt: number;
}

// =============================================
// IT COMPANY
// =============================================
export type EmployeeRole = 'junior' | 'mid' | 'senior' | 'designer' | 'tester' | 'team_leader';

export interface EmployeeType {
  id: EmployeeRole;
  name: string;
  salary: bigint; // cost/hr (deducted from income)
  hireBonus: bigint; // one-time hire cost
  projectSpeed: number; // multiplier
  image: ImagePlaceholder;
}

export interface HiredEmployee {
  id: string;
  roleId: EmployeeRole;
  hiredAt: number;
}

export interface ITProject {
  id: string;
  name: string;
  description: string;
  baseDurationSeconds: number;
  reward: bigint;
  minEmployees: number;
  image: ImagePlaceholder;
}

export interface ActiveITProject {
  projectId: string;
  startedAt: number;
  endsAt: number;
  assignedEmployeeIds: string[];
  collected: boolean;
}

export interface ITData {
  employees: HiredEmployee[];
  activeProjects: ActiveITProject[];
  completedProjects: ActiveITProject[];
}

// =============================================
// BANK
// =============================================
export interface BankData {
  vaultLevel: number;    // 1–35
  depositRate: number;   // 1–10% slider
  loanRate: number;      // 5–25% slider
  vaultValue: bigint;    // current accumulated value
  lastCollectedAt: number;
}

// =============================================
// FOOTBALL CLUB
// =============================================
export interface FootballPlayerType {
  id: string;
  name: string;
  position: string;
  cost: bigint;
  salary: bigint;
  skill: number; // 1-100
  image: ImagePlaceholder;
}

export interface FootballData {
  players: string[]; // owned player type IDs
  stadiumLevel: number;
  ticketPrice: bigint;
  lastMatchAt: number;
  wins: number;
  losses: number;
}

// =============================================
// OIL & GAS
// =============================================
export interface OilWellType {
  id: string;
  name: string;
  location: string;
  cost: bigint;
  barrelsPerDay: number;
  image: ImagePlaceholder;
}

export interface OilData {
  ownedWells: string[]; // well type IDs
  refineryLevel: number; // 1-10, affects $/barrel
}

// =============================================
// CLOTHING BRAND
// =============================================
export interface ClothingCollection {
  id: string;
  name: string;
  designCost: bigint;
  incomePerHour: bigint;
  image: ImagePlaceholder;
}

export interface ClothingStore {
  id: string;
  city: string;
  cost: bigint;
  incomeMultiplier: number;
}

export interface ClothingData {
  ownedCollections: string[];
  ownedStores: string[];
}

// =============================================
// SPACE AGENCY
// =============================================
export interface RocketType {
  id: string;
  name: string;
  cost: bigint;
  image: ImagePlaceholder;
}

export interface SpaceMission {
  id: string;
  name: string;
  durationSeconds: number;
  reward: bigint;
  requiredRocket: string;
  image: ImagePlaceholder;
}

export interface ActiveMission {
  missionId: string;
  rocketId: string;
  startedAt: number;
  endsAt: number;
  collected: boolean;
}

export interface SpaceData {
  rockets: string[]; // owned rocket type IDs
  satellites: number;
  activeMissions: ActiveMission[];
}

// =============================================
// BUSINESS (base)
// =============================================
export type BusinessType =
  | 'taxi'
  | 'store'
  | 'factory'
  | 'shipping'
  | 'construction'
  | 'car_dealership'
  | 'it_company'
  | 'bank'
  | 'football'
  | 'oil_gas'
  | 'clothing'
  | 'space'
  | 'merger'; // For holding companies, etc.

export type BusinessData =
  | TaxiData
  | StoreData
  | FactoryData
  | ShippingData
  | ConstructionData
  | CarDealershipData
  | ITData
  | BankData
  | FootballData
  | OilData
  | ClothingData
  | SpaceData
  | { mergedBy: string[], income: bigint }; // Generic data for merged entities

export interface Business {
  id: string;
  type: BusinessType;
  name: string;
  unlockCost: bigint;
  owned: boolean;
  color: string;
  icon: string;
  description: string;
  image: ImagePlaceholder;
  data: BusinessData;
}

// =============================================
// RANKS / INSIGNIA
// =============================================
export interface Rank {
  level: number;
  name: string;
  reqNetWorth: bigint;
  reqHourlyIncome: bigint;
  icon: string;
}

// =============================================
// MERGERS
// =============================================
export interface BusinessMerger {
  id: string;
  name: string;
  requiredComponents: {
    type: BusinessType;
    count?: number;
    level?: number;
    minIncome?: bigint;
    minTrucks?: number; // Specific for Shipping
  }[];
  requiredCash: bigint;
  resultingBusinessName: string;
  resultingIncome: bigint;
}

// =============================================
// PROPERTY RENTAL
// =============================================
export interface Tenant {
  id: string;
  name: string;
  rentPerHour: bigint;
  movedInAt: number;
  leavesAt: number; // timestamp when the lease ends
}

export interface PropertyImprovement {
  id: string;
  name: string;
  icon: string;
  costPercent: number; // % of base cost
  incomeBonusPercent: number; // % increase in rent cap
  purchased: boolean;
}

export interface Property {
  id: string;
  name: string;
  city: string;
  country: string;
  flag: string;
  basePurchaseCost: bigint;
  baseIncomePerHour: bigint;
  owned: boolean;
  improvements: PropertyImprovement[];
  image: ImagePlaceholder;
  // Rental system
  rentalActive: boolean;
  rentPrice: bigint;          // price set by player
  tenants: Tenant[];
  pendingRent: bigint;
}

// =============================================
// STOCK
// =============================================
export interface Stock {
  ticker: string;
  name: string;
  sector: string;
  currentPrice: bigint;
  previousPrice: bigint;
  priceHistory: bigint[];
  sharesOwned: bigint;
  dividendPerShare: bigint;
  color: string;
}

// =============================================
// CRYPTO
// =============================================
export type Volatility = 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME';

export interface CryptoCoin {
  id: string;
  name: string;
  symbol: string;
  icon: string;
  currentPrice: bigint;
  previousPrice: bigint;
  priceHistory: bigint[];
  amountOwned: bigint;
  volatility: Volatility;
  color: string;
  priceFloor?: bigint;    // min price (for EXXES)
  priceCeiling?: bigint; // max price (for EXXES)
  nftOnly?: boolean;     // ETH/TRB - only usable for NFT luxury purchases
  maxTxAmount?: bigint;  // max $ per transaction (for EXXES: 30 trillion)
}

// =============================================
// LUXURY (with Premium Modifiers)
// =============================================
export type LuxuryCategory = 'CARS' | 'AVIATION' | 'MARITIME' | 'ART' | 'REAL_ESTATE' | 'COLLECTIBLES';

export interface LuxuryModifier {
  id: string;
  label: string; // e.g. "Premium", "Hire Team", "Advanced Engine"
  costPercent: number; // percent increase on base cost (e.g. 30)
  netWorthBoostPercent: number; // percent increase on net worth (e.g. 50)
  icon: string;
}

export interface LuxuryLocation {
  id: string;
  name: string;
  cost: bigint;
  image: ImagePlaceholder;
}

export interface LuxuryItem {
  id: string;
  name: string;
  description: string;
  category: LuxuryCategory;
  baseCost: bigint;
  costCurrency: 'money' | 'crypto';
  cryptoCoinId?: string;
  cryptoAmount?: bigint;
  baseNetWorthBoost: bigint;
  owned: boolean;
  icon: string;
  image: ImagePlaceholder;
  availableModifiers: LuxuryModifier[];
  appliedModifiers: string[]; // ids of applied modifiers at time of purchase
  availableLocations?: LuxuryLocation[]; // for yachts/real estate
  selectedLocationId?: string | null;
}

// =============================================
// ACHIEVEMENTS
// =============================================
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  target: bigint;
  type: 'money' | 'netWorth' | 'businesses' | 'clicks' | 'properties';
  reward: bigint;
  completed: boolean;
  claimed: boolean;
}

// =============================================
// DAILY TASKS
// =============================================
export interface DailyTask {
  id: string;
  description: string;
  target: bigint;
  progress: number;
  type: 'click' | 'earn' | 'invest';
  reward: bigint;
  completed: boolean;
  claimed: boolean;
}

// =============================================
// CLICKER UPGRADES
// =============================================
export interface ClickUpgrade {
  id: string;
  name: string;
  description: string;
  cost: bigint;
  effectType: 'add_click' | 'mult_click' | 'add_auto';
  value: number;
  owned?: boolean;
  icon?: string;
}

// =============================================
// NOTIFICATIONS
// =============================================
export interface GameNotification {
  id: string;
  message: string;
  emoji: string;
  timestamp: number;
  actionLabel?: string;
  actionType?: 'collect_bank' | 'replace_car' | 'collect_project' | 'sell_car';
  actionPayload?: string; // businessId or carId etc.
}

// =============================================
// GLOBAL GAME STATE
// =============================================
export interface GameState {
  // Core economy
  money: bigint;
  totalEarned: bigint;
  netWorth: bigint;
  incomePerHour: bigint;

  // Businesses
  businesses: Business[];

  // Properties
  properties: Property[];

  // Investments
  stocks: Stock[];
  crypto: CryptoCoin[];

  // Luxury
  luxuryItems: LuxuryItem[];

  // Clicker
  clickValue: bigint;
  totalClicks: number;
  clickUpgrades: string[];
  autoClickRate: number;

  // Progress tracking
  achievements: Achievement[];
  dailyTasks: DailyTask[];

  // Prestige
  prestigeLevel: number;
  prestigeBonus: number;

  // Meta
  totalPlayTimeSeconds: number;
  lastSavedAt: number;
  lastTickAt: number;
  lastDividendAt: number; // timestamp of last 3-hour dividend payout

  // Progress
  currentRankLevel: number;
  unlockedMergers: string[]; // ids of discovered mergers

  // UI
  notifications: GameNotification[];
}

