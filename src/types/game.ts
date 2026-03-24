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
  cost: number;
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
  cost: number;
  incomePerHour: number;
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
  shelfCost: number;    // cost to set up the shelf slot
  restockCost: number;  // cost to restock when empty
  incomePerHour: number;
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
  lineCost: number;
  incomePerHour: number;
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
  cost: number;
  incomePerHour: number;
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
  reward: number;
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
  baseBuyCost: number;
  maxSalePrice: number;
  image: ImagePlaceholder;
}

export interface DamagedUsedCar {
  id: string;
  modelId: string;
  buyPrice: number;
  issues: {
    type: CarIssueType;
    repairCost: number;
    repairTimeSeconds: number;
    isRepaired: boolean;
  }[];
}

export interface DealerOwnedCar {
  id: string;
  modelId: string;
  buyPrice: number;
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
export type EmployeeRole = 'junior' | 'mid' | 'senior' | 'designer' | 'tester';

export interface EmployeeType {
  id: EmployeeRole;
  name: string;
  salary: number; // cost/hr (deducted from income)
  hireBonus: number; // one-time hire cost
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
  reward: number;
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
  vaultValue: number;    // current accumulated value
  lastCollectedAt: number;
}

// =============================================
// FOOTBALL CLUB
// =============================================
export interface FootballPlayerType {
  id: string;
  name: string;
  position: string;
  cost: number;
  salary: number;
  skill: number; // 1-100
  image: ImagePlaceholder;
}

export interface FootballData {
  players: string[]; // owned player type IDs
  stadiumLevel: number;
  ticketPrice: number;
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
  cost: number;
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
  designCost: number;
  incomePerHour: number;
  image: ImagePlaceholder;
}

export interface ClothingStore {
  id: string;
  city: string;
  cost: number;
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
  cost: number;
  image: ImagePlaceholder;
}

export interface SpaceMission {
  id: string;
  name: string;
  durationSeconds: number;
  reward: number;
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
  | 'space';

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
  | SpaceData;

export interface Business {
  id: string;
  type: BusinessType;
  name: string;
  unlockCost: number;
  owned: boolean;
  color: string;
  icon: string;
  description: string;
  image: ImagePlaceholder;
  data: BusinessData;
}

// =============================================
// PROPERTY RENTAL
// =============================================
export interface Tenant {
  id: string;
  name: string;
  rentPerHour: number;
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
  basePurchaseCost: number;
  baseIncomePerHour: number;
  owned: boolean;
  improvements: PropertyImprovement[];
  image: ImagePlaceholder;
  // Rental system
  rentalActive: boolean;
  rentPrice: number;          // price set by player
  tenants: Tenant[];
}

// =============================================
// STOCK
// =============================================
export interface Stock {
  ticker: string;
  name: string;
  sector: string;
  currentPrice: number;
  previousPrice: number;
  priceHistory: number[];
  sharesOwned: number;
  dividendPerShare: number;
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
  currentPrice: number;
  previousPrice: number;
  priceHistory: number[];
  amountOwned: number;
  volatility: Volatility;
  color: string;
  priceFloor?: number;    // min price (for EXXES)
  priceCeiling?: number; // max price (for EXXES)
  nftOnly?: boolean;     // ETH/TRB - only usable for NFT luxury purchases
  maxTxAmount?: number;  // max $ per transaction (for EXXES: 30 trillion)
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
  cost: number;
  image: ImagePlaceholder;
}

export interface LuxuryItem {
  id: string;
  name: string;
  description: string;
  category: LuxuryCategory;
  baseCost: number;
  costCurrency: 'money' | 'crypto';
  cryptoCoinId?: string;
  cryptoAmount?: number;
  baseNetWorthBoost: number;
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
  target: number;
  type: 'money' | 'netWorth' | 'businesses' | 'clicks' | 'properties';
  reward: number;
  completed: boolean;
  claimed: boolean;
}

// =============================================
// DAILY TASKS
// =============================================
export interface DailyTask {
  id: string;
  description: string;
  target: number;
  progress: number;
  type: 'click' | 'earn' | 'invest';
  reward: number;
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
  cost: number;
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
  money: number;
  totalEarned: number;
  netWorth: number;
  incomePerHour: number;

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
  clickValue: number;
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

  // UI
  notifications: GameNotification[];
}

