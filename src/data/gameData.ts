import type {
  Business, Property, Stock, CryptoCoin, LuxuryItem,
  Achievement, DailyTask, ClickUpgrade, LuxuryModifier,
  TaxiCarModel, ShippingVehicleModel, StoreProduct, ConstructionProject,
  DealerCarModel, EmployeeType, ITProject, OilWellType,
  FootballPlayerType, ClothingCollection, ClothingStore,
  RocketType, SpaceMission, FactoryProduct, DamagedUsedCar, CarIssueType,
} from "../types/game";

// ---------------------------------------------------------------------------
// CLICKER UPGRADES
// ---------------------------------------------------------------------------
export const INITIAL_CLICK_UPGRADES: ClickUpgrade[] = [
  { id: "cu_1", name: "Gold Coin", description: "Improves your taps slightly.", cost: 100, effectType: "add_click", value: 1 },
  { id: "cu_2", name: "Lucky Charm", description: "Makes every tap more effective.", cost: 1000, effectType: "add_click", value: 5 },
  { id: "cu_3", name: "Power Tap", description: "Your taps carry major weight.", cost: 10000, effectType: "add_click", value: 20 },
  { id: "cu_4", name: "Auto-Tapper", description: "Provides passive automatic clicks.", cost: 100000, effectType: "add_auto", value: 1 },
  { id: "cu_5", name: "Diamond Touch", description: "Massive multiplier to all clicks.", cost: 1000000, effectType: "mult_click", value: 5 }
];

// ---------------------------------------------------------------------------
// TAXI CAR MODELS
// ---------------------------------------------------------------------------
export const TAXI_CAR_MODELS: TaxiCarModel[] = [
  { id: "renolt_logon", name: "Renolt Logon", cost: 10_800, incomePerHour: 560, maxKm: 200_000, kmPerHour: 120, image: { id: "taxi_renolt_logon", description: "Yellow Renolt Logon economy sedan taxi cab" } },
  { id: "hendaji_elintra", name: "Hendaji Elintra", cost: 24_000, incomePerHour: 954, maxKm: 300_000, kmPerHour: 130, image: { id: "taxi_hendaji_elintra", description: "White Hendaji Elintra comfort sedan taxi" } },
  { id: "hendaji_sontair", name: "Hendaji Sontair", cost: 48_000, incomePerHour: 1_800, maxKm: 400_000, kmPerHour: 140, image: { id: "taxi_hendaji_sontair", description: "Silver Hendaji Sontair comfort plus sedan taxi" } },
  { id: "auddi_a6", name: "Auddi A6", cost: 95_000, incomePerHour: 3_200, maxKm: 500_000, kmPerHour: 150, image: { id: "taxi_auddi_a6", description: "Black Auddi A6 business class luxury sedan taxi" } },
  { id: "auddi_a8", name: "Auddi A8", cost: 180_000, incomePerHour: 6_000, maxKm: 650_000, kmPerHour: 150, image: { id: "taxi_auddi_a8", description: "Dark blue Auddi A8 premier sedan taxi" } },
  { id: "marcedes_maybach", name: "Marcedes Maybach", cost: 262_000, incomePerHour: 9_800, maxKm: 800_000, kmPerHour: 160, image: { id: "taxi_maybach", description: "Black Mercedes Maybach S-class elite limousine taxi" } },
  { id: "rolls_royth", name: "Rolls Royth Phantom", cost: 450_000, incomePerHour: 18_000, maxKm: 1_000_000, kmPerHour: 160, image: { id: "taxi_rolls", description: "White Rolls Royce Phantom elite luxury taxi" } },
];

export const TAXI_SLOT_PACKAGES = [
  { slots: 5, cost: 17_500 },
  { slots: 10, cost: 50_000 },
  { slots: 20, cost: 140_000 },
  { slots: 50, cost: 300_000 },
];

// ---------------------------------------------------------------------------
// SHIPPING VEHICLE MODELS
// ---------------------------------------------------------------------------
export const SHIPPING_VEHICLE_MODELS: ShippingVehicleModel[] = [
  { id: "fort_transeet", name: "Fort Transeet", cost: 37_000, incomePerHour: 1_200, maxKm: 300_000, kmPerHour: 200, image: { id: "shipping_fort_transeet", description: "White Fort Transit delivery van" } },
  { id: "large_truck", name: "Large Truck", cost: 120_000, incomePerHour: 4_500, maxKm: 500_000, kmPerHour: 180, image: { id: "shipping_large_truck", description: "Large white 18-wheel delivery truck" } },
  { id: "semi_trailer", name: "Semi-Trailer", cost: 350_000, incomePerHour: 14_000, maxKm: 700_000, kmPerHour: 160, image: { id: "shipping_semi_trailer", description: "Large semi-trailer truck with refrigerated cargo" } },
  { id: "mega_hauler", name: "Mega Hauler", cost: 800_000, incomePerHour: 35_000, maxKm: 900_000, kmPerHour: 150, image: { id: "shipping_mega", description: "Massive articulated mining haul truck on highway" } },
  { id: "cargo_aircraft", name: "Cargo Plane 747", cost: 4_000_000, incomePerHour: 120_000, maxKm: 50_000, kmPerHour: 800, image: { id: "shipping_cargo_aircraft", description: "White cargo aircraft freight plane Boeing 747" } },
];

export const SHIPPING_SLOT_PACKAGES = [
  { slots: 2, cost: 10_000 },
  { slots: 5, cost: 35_000 },
  { slots: 10, cost: 90_000 },
];

// ---------------------------------------------------------------------------
// STORE PRODUCTS
// ---------------------------------------------------------------------------
export const STORE_PRODUCTS: StoreProduct[] = [
  { id: "groceries", name: "Groceries & Snacks", shelfCost: 500, restockCost: 200, incomePerHour: 85, stockHours: 4, image: { id: "store_groceries", description: "Grocery shelf" } },
  { id: "electronics", name: "Electronics", shelfCost: 4_500, restockCost: 1_500, incomePerHour: 680, stockHours: 8, image: { id: "store_electronics", description: "Electronics shelf" } },
  { id: "clothing_goods", name: "Clothing", shelfCost: 2_000, restockCost: 700, incomePerHour: 310, stockHours: 6, image: { id: "store_clothing", description: "Clothing shelf" } },
  { id: "luxury_goods", name: "Luxury Goods", shelfCost: 18_000, restockCost: 6_000, incomePerHour: 2_400, stockHours: 12, image: { id: "store_luxury", description: "Luxury goods case" } },
];

// ---------------------------------------------------------------------------
// FACTORY PRODUCTS
// ---------------------------------------------------------------------------
export const FACTORY_PRODUCTS: FactoryProduct[] = [
  { id: "plastics", name: "Plastics", lineCost: 5_000, incomePerHour: 300, image: { id: "factory_plastics", description: "Plastics line" } },
  { id: "electronics_factory", name: "Electronics", lineCost: 20_000, incomePerHour: 1_000, image: { id: "factory_electronics", description: "Electronics line" } },
  { id: "auto_parts", name: "Auto Parts", lineCost: 50_000, incomePerHour: 2_800, image: { id: "factory_auto_parts", description: "Auto parts factory" } },
  { id: "machinery", name: "Precision Machinery", lineCost: 200_000, incomePerHour: 9_000, image: { id: "factory_machinery", description: "CNC machinery plant" } },
];

// ---------------------------------------------------------------------------
// CONSTRUCTION PROJECTS
// ---------------------------------------------------------------------------
export const CONSTRUCTION_PROJECTS: ConstructionProject[] = [
  { id: "house", name: "Small House", description: "Build a small residential house", durationSeconds: 3600, reward: 12_000, requiredEquipment: 1, requiredBuilders: 5, requiredConcrete: 200, requiredWood: 50, requiredMetal: 10, image: { id: "cons_house", description: "" } },
  { id: "apartment", name: "Apartment Building", description: "Construct an apartment complex", durationSeconds: 14_400, reward: 80_000, requiredEquipment: 2, requiredBuilders: 25, requiredConcrete: 1500, requiredWood: 400, requiredMetal: 80, image: { id: "cons_apt", description: "" } },
  { id: "office", name: "Office Block", description: "Build a commercial office building", durationSeconds: 28_800, reward: 250_000, requiredEquipment: 3, requiredBuilders: 50, requiredConcrete: 3500, requiredWood: 800, requiredMetal: 250, image: { id: "cons_office", description: "" } },
  { id: "skyscraper", name: "Skyscraper", description: "Construct a high-rise skyscraper", durationSeconds: 86_400, reward: 1_500_000, requiredEquipment: 5, requiredBuilders: 150, requiredConcrete: 12000, requiredWood: 2000, requiredMetal: 1200, image: { id: "cons_sky", description: "" } },
  { id: "stadium", name: "Sports Stadium", description: "Massive 80,000 seat stadium", durationSeconds: 259_200, reward: 6_000_000, requiredEquipment: 8, requiredBuilders: 400, requiredConcrete: 35000, requiredWood: 5000, requiredMetal: 4500, image: { id: "cons_stad", description: "" } },
];

// ---------------------------------------------------------------------------
// DEALERSHIP MODELS (DEEP MECHANICS)
// ---------------------------------------------------------------------------
export const DEALER_CAR_MODELS: DealerCarModel[] = [
  { id: "rusty_sedan", name: "Rusty Sedan", baseBuyCost: 800, maxSalePrice: 3_500, image: { id: "dlr_sedan", description: "Old used sedan car" } },
  { id: "damaged_suv", name: "Damaged SUV", baseBuyCost: 3_500, maxSalePrice: 12_000, image: { id: "dlr_suv", description: "Used SUV" } },
  { id: "wrecked_sports", name: "Wrecked Sports Car", baseBuyCost: 12_000, maxSalePrice: 48_000, image: { id: "dlr_sports", description: "Damaged sports car" } },
  { id: "accident_luxury", name: "Accident Luxury Car", baseBuyCost: 60_000, maxSalePrice: 195_000, image: { id: "dlr_luxury", description: "Crashed luxury sedan" } },
  { id: "abandoned_hypercar", name: "Abandoned Hypercar", baseBuyCost: 400_000, maxSalePrice: 1_800_000, image: { id: "dlr_hyper", description: "Dusty abandoned hypercar" } },
];

export const generateMarketCars = (): DamagedUsedCar[] => {
  return Array.from({ length: 6 }).map((_, _i) => {
    const model = DEALER_CAR_MODELS[Math.floor(Math.random() * DEALER_CAR_MODELS.length)];
    const issueTypes: CarIssueType[] = ['engine', 'transmission', 'suspension', 'body', 'interior'];
    // Give it 1 to 4 random issues
    const numIssues = Math.floor(Math.random() * 4) + 1;
    const shuffled = issueTypes.sort(() => 0.5 - Math.random()).slice(0, numIssues);
    
    let buyDiscount = 0;
    const issues = shuffled.map(type => {
      // 10-20% of max sale price is repair cost for this part
      const repairCost = Math.floor(model.maxSalePrice * (0.05 + Math.random() * 0.15));
      buyDiscount += repairCost * 1.5; // discounted heavily initially
      return {
        type,
        repairCost,
        repairTimeSeconds: Math.floor(repairCost / 10), // $10 per second logic
        isRepaired: false
      };
    });

    return {
      id: Math.random().toString(36).slice(2),
      modelId: model.id,
      buyPrice: Math.max(model.baseBuyCost, Math.floor(model.maxSalePrice - buyDiscount)),
      issues
    };
  });
};

// ---------------------------------------------------------------------------
// IT COMPANY
// ---------------------------------------------------------------------------
export const EMPLOYEE_TYPES: EmployeeType[] = [
  { id: "junior", name: "Junior Developer", salary: 20, hireBonus: 500, projectSpeed: 1, image: { id: "it_jun", description: "" } },
  { id: "mid", name: "Mid Developer", salary: 60, hireBonus: 2_000, projectSpeed: 2.5, image: { id: "it_mid", description: "" } },
  { id: "senior", name: "Senior Developer", salary: 150, hireBonus: 8_000, projectSpeed: 5, image: { id: "it_sen", description: "" } },
  { id: "designer", name: "UI Designer", salary: 50, hireBonus: 1_500, projectSpeed: 1.2, image: { id: "it_des", description: "" } },
  { id: "tester", name: "QA Tester", salary: 40, hireBonus: 1_000, projectSpeed: 1.1, image: { id: "it_qa", description: "" } },
];

export const IT_PROJECTS: ITProject[] = [
  { id: "mobile_app", name: "Mobile App", description: "Develop a smartphone app", baseDurationSeconds: 14_400, reward: 50_000, minEmployees: 1, image: { id: "it_proj1", description: "" } },
  { id: "web_platform", name: "Web Platform", description: "Build a full web platform", baseDurationSeconds: 43_200, reward: 250_000, minEmployees: 2, image: { id: "it_proj2", description: "" } },
  { id: "enterprise_crm", name: "Enterprise CRM", description: "Develop enterprise software", baseDurationSeconds: 172_800, reward: 2_000_000, minEmployees: 3, image: { id: "it_proj3", description: "" } },
  { id: "os_kernel", name: "Operating System", description: "Custom OS kernel", baseDurationSeconds: 604_800, reward: 50_000_000, minEmployees: 5, image: { id: "it_proj4", description: "" } },
];

// ---------------------------------------------------------------------------
// OIL, FOOTBALL, CLOTHING, SPACE
// ---------------------------------------------------------------------------
export const OIL_WELL_TYPES: OilWellType[] = [
  { id: "local_field", name: "Local Field", location: "Local", cost: 500_000, barrelsPerDay: 100, image: { id: "oil_1", description: "Pumpjack" } },
  { id: "gulf_coast", name: "Gulf Coast", location: "Gulf Coast", cost: 5_000_000, barrelsPerDay: 800, image: { id: "oil_2", description: "Offshore platform" } },
  { id: "north_sea", name: "North Sea", location: "North Sea", cost: 20_000_000, barrelsPerDay: 3_000, image: { id: "oil_3", description: "North sea rig" } },
  { id: "arctic_field", name: "Arctic Field", location: "Arctic", cost: 100_000_000, barrelsPerDay: 15_000, image: { id: "oil_4", description: "Arctic drill" } },
];

export const FOOTBALL_PLAYER_TYPES: FootballPlayerType[] = [
  { id: "goalkeeper", name: "Elite Goalkeeper", position: "Goalkeeper", cost: 500_000, salary: 5_000, skill: 80, image: { id: "fb_1", description: "" } },
  { id: "defender", name: "World-Class Defender", position: "Defender", cost: 800_000, salary: 7_500, skill: 85, image: { id: "fb_2", description: "" } },
  { id: "midfielder", name: "Creative Midfielder", position: "Midfielder", cost: 1_200_000, salary: 12_000, skill: 88, image: { id: "fb_3", description: "" } },
  { id: "forward", name: "Star Forward", position: "Forward", cost: 2_000_000, salary: 20_000, skill: 92, image: { id: "fb_4", description: "" } },
];

export const CLOTHING_COLLECTIONS: ClothingCollection[] = [
  { id: "streetwear", name: "Streetwear", designCost: 50_000, incomePerHour: 2_500, image: { id: "cl_1", description: "" } },
  { id: "business", name: "Business", designCost: 200_000, incomePerHour: 8_000, image: { id: "cl_2", description: "" } },
  { id: "luxury", name: "Luxury Line", designCost: 1_000_000, incomePerHour: 30_000, image: { id: "cl_3", description: "" } },
];

export const CLOTHING_STORES_DATA: ClothingStore[] = [
  { id: "store_local", city: "Local", cost: 100_000, incomeMultiplier: 1 },
  { id: "store_london", city: "London", cost: 1_000_000, incomeMultiplier: 3 },
  { id: "store_paris", city: "Paris", cost: 2_000_000, incomeMultiplier: 5 },
  { id: "store_ny", city: "New York", cost: 5_000_000, incomeMultiplier: 8 },
  { id: "store_dubai", city: "Dubai", cost: 10_000_000, incomeMultiplier: 12 },
];

export const ROCKET_TYPES: RocketType[] = [
  { id: "small_rocket", name: "Small Rocket", cost: 500_000, image: { id: "sp_1", description: "Small rocket" } },
  { id: "heavy_rocket", name: "Heavy Rocket", cost: 5_000_000, image: { id: "sp_2", description: "Heavy rocket" } },
  { id: "mega_rocket", name: "Mega Rocket", cost: 50_000_000, image: { id: "sp_3", description: "Mega rocket" } },
];

export const SPACE_MISSIONS: SpaceMission[] = [
  { id: "satellite", name: "Satellite", durationSeconds: 3_600, reward: 2_000_000, requiredRocket: "small_rocket", image: { id: "sm_1", description: "" } },
  { id: "lunar", name: "Lunar Mission", durationSeconds: 86_400, reward: 50_000_000, requiredRocket: "heavy_rocket", image: { id: "sm_2", description: "" } },
  { id: "mars", name: "Mars Mission", durationSeconds: 604_800, reward: 2_000_000_000, requiredRocket: "mega_rocket", image: { id: "sm_3", description: "" } },
];

// ---------------------------------------------------------------------------
// INITIAL BUSINESSES
// ---------------------------------------------------------------------------
export const INITIAL_BUSINESSES: Business[] = [
  { id: "taxi", type: "taxi", name: "Taxi Company", icon: "🚕", unlockCost: 9_999, owned: false, color: "#f5c518", description: "Buy parking slots, purchase cars and earn income.", image: { id: "b_taxi", description: "" }, data: { parkingSlots: [], ownedCars: [] } },
  { id: "store", type: "store", name: "Convenience Store", icon: "🛒", unlockCost: 4_899, owned: false, color: "#34d399", description: "Set up shelves and stock products. Restock before they run out!", image: { id: "b_store", description: "" }, data: { shelves: 0, activeProducts: [] } },
  { id: "factory", type: "factory", name: "Factory", icon: "🏭", unlockCost: 25_000, owned: false, color: "#f87171", description: "Purchase production lines and manufacture products for steady income.", image: { id: "b_factory", description: "" }, data: { lines: [] } },
  { id: "shipping", type: "shipping", name: "Shipping Company", icon: "🚢", unlockCost: 50_000, owned: false, color: "#60a5fa", description: "Buy vehicle slots and massive transport vehicles.", image: { id: "b_shipping", description: "" }, data: { vehicleSlots: 0, ownedVehicles: [] } },
  { id: "construction", type: "construction", name: "Construction Co.", icon: "🏗️", unlockCost: 80_000, owned: false, color: "#fb923c", description: "Buy equipment and take on massive building contracts.", image: { id: "b_cons", description: "" }, data: { equipmentCount: 0, resources: { builders: 0, concrete: 0, wood: 0, metal: 0 }, activeProjects: [], completedProjects: [] } },
  { id: "car_dealership", type: "car_dealership", name: "Car Dealership", icon: "🚗", unlockCost: 120_000, owned: false, color: "#a78bfa", description: "Buy used cars with complex issues, repair the engine/interior, then sell.", image: { id: "b_dlr", description: "" }, data: { mechanicSlots: 1, mechanicsOwned: 0, inventory: [], market: generateMarketCars(), lastMarketRefreshAt: Date.now() } },
  { id: "it_company", type: "it_company", name: "IT Company", icon: "💻", unlockCost: 500_000, owned: false, color: "#22d3ea", description: "Hire huge dev teams and create entire Operating Systems.", image: { id: "b_it", description: "" }, data: { employees: [], activeProjects: [], completedProjects: [] } },
  { id: "bank", type: "bank", name: "Bank", icon: "🏦", unlockCost: 10_000_000, owned: false, color: "#fbbf24", description: "Set deposit and loan rates. Collect vault when full.", image: { id: "b_bank", description: "" }, data: { vaultLevel: 1, depositRate: 3, loanRate: 12, vaultValue: 0, lastCollectedAt: Date.now() } },
  { id: "football", type: "football", name: "Football Club", icon: "⚽", unlockCost: 5_000_000, owned: false, color: "#4ade80", description: "Sign players, upgrade stadium. (Passive ticket sales for now)", image: { id: "b_fb", description: "" }, data: { players: [], stadiumLevel: 1, ticketPrice: 25, lastMatchAt: 0, wins: 0, losses: 0 } },
  { id: "oil_gas", type: "oil_gas", name: "Oil & Gas Co.", icon: "🛢️", unlockCost: 1_000_000, owned: false, color: "#94a3b8", description: "Buy global oil wells and expand your refinery.", image: { id: "b_oil", description: "" }, data: { ownedWells: [], refineryLevel: 1 } },
  { id: "clothing", type: "clothing", name: "Clothing Brand", icon: "👕", unlockCost: 2_000_000, owned: false, color: "#f472b6", description: "Design collections and open stores worldwide.", image: { id: "b_cl", description: "" }, data: { ownedCollections: [], ownedStores: [] } },
  { id: "space", type: "space", name: "Space Agency", icon: "🚀", unlockCost: 100_000_000, owned: false, color: "#818cf8", description: "Launch heavy rockets to Mars and deploy satellites.", image: { id: "b_sp", description: "" }, data: { rockets: [], satellites: 0, activeMissions: [] } },
];

// ---------------------------------------------------------------------------
// PROPERTIES (with percentage improvements)
// ---------------------------------------------------------------------------
export const INITIAL_PROPERTIES: Property[] = [
  { id: "apartment_prague", name: "Studio Apartment", city: "Prague", country: "Czech Republic", flag: "🇨🇿", basePurchaseCost: 85_000, baseIncomePerHour: 180, owned: false, image: { id: "prop_prg", description: "Prague apartment interior" }, rentalActive: false, rentPrice: 200, tenants: [], improvements: [{ id: "repair_adv", name: "Advanced Repair", icon: "🛠️", costPercent: 15, incomeBonusPercent: 15, purchased: false }, { id: "design_prem", name: "Premium Design", icon: "✨", costPercent: 30, incomeBonusPercent: 30, purchased: false }] },
  { id: "penthouse_london", name: "Penthouse", city: "London", country: "United Kingdom", flag: "🇬🇧", basePurchaseCost: 2_500_000, baseIncomePerHour: 4_200, owned: false, image: { id: "prop_lon", description: "London penthouse" }, rentalActive: false, rentPrice: 5_000, tenants: [], improvements: [{ id: "repair_adv", name: "Advanced Repair", icon: "🛠️", costPercent: 15, incomeBonusPercent: 15, purchased: false }, { id: "design_elite", name: "Elite Design", icon: "✨", costPercent: 40, incomeBonusPercent: 40, purchased: false }] },
  { id: "villa_monaco", name: "Seafront Villa", city: "Monaco", country: "Monaco", flag: "🇲🇨", basePurchaseCost: 15_000_000, baseIncomePerHour: 22_000, owned: false, image: { id: "prop_mon", description: "Monaco villa" }, rentalActive: false, rentPrice: 25_000, tenants: [], improvements: [{ id: "repair_adv", name: "Advanced Repair", icon: "🛠️", costPercent: 15, incomeBonusPercent: 15, purchased: false }, { id: "helipad", name: "Add Helipad", icon: "🚁", costPercent: 20, incomeBonusPercent: 25, purchased: false }] },
];

// ---------------------------------------------------------------------------
// INVESTMENTS
// ---------------------------------------------------------------------------
const makeHistory = (base: number) => Array.from({ length: 20 }, (_, _i) => base * (0.85 + Math.random() * 0.3));

export const INITIAL_STOCKS: Stock[] = [
  { ticker: "TXI",  name: "TechX Industries",    sector: "Technology", currentPrice: 142.50, previousPrice: 138.20, priceHistory: makeHistory(140),    sharesOwned: 0, dividendPerShare: 2.80, color: "#60a5fa" },
  { ticker: "GMV",  name: "GlobaMoVe",           sector: "Transport",  currentPrice: 67.30,  previousPrice: 70.10,  priceHistory: makeHistory(68),     sharesOwned: 0, dividendPerShare: 1.80, color: "#f5c518" },
  { ticker: "NFB",  name: "NeoFinBank",          sector: "Finance",    currentPrice: 89.75,  previousPrice: 92.40,  priceHistory: makeHistory(91),     sharesOwned: 0, dividendPerShare: 3.50, color: "#fbbf24" },
  { ticker: "ADD",  name: "AD&D Corporation",    sector: "Technology", currentPrice: 228.40, previousPrice: 221.10, priceHistory: makeHistory(225),    sharesOwned: 0, dividendPerShare: 5.32, color: "#a78bfa" },
  { ticker: "XOM",  name: "XonMobyll",           sector: "Energy",     currentPrice: 115.60, previousPrice: 118.90, priceHistory: makeHistory(117),    sharesOwned: 0, dividendPerShare: 4.10, color: "#34d399" },
  { ticker: "VLR",  name: "Valera Energy",       sector: "Energy",     currentPrice: 54.20,  previousPrice: 51.80,  priceHistory: makeHistory(53),     sharesOwned: 0, dividendPerShare: 3.90, color: "#f97316" },
  { ticker: "PHM",  name: "Phillipo Mores",      sector: "Consumer",   currentPrice: 41.80,  previousPrice: 43.50,  priceHistory: makeHistory(42),     sharesOwned: 0, dividendPerShare: 2.60, color: "#ec4899" },
  { ticker: "RNT",  name: "Renault SA",          sector: "Automotive", currentPrice: 12.30,  previousPrice: 11.90,  priceHistory: makeHistory(12),     sharesOwned: 0, dividendPerShare: 1.20, color: "#94a3b8" },
  { ticker: "DZL",  name: "Dazzele Inc",         sector: "Consumer",   currentPrice: 8.75,   previousPrice: 9.10,   priceHistory: makeHistory(9),      sharesOwned: 0, dividendPerShare: 0.90, color: "#fb7185" },
  { ticker: "SPX",  name: "SpaceXel",            sector: "Aerospace",  currentPrice: 680.00, previousPrice: 650.00, priceHistory: makeHistory(660),    sharesOwned: 0, dividendPerShare: 0.50, color: "#818cf8" },
];

export const INITIAL_CRYPTO: CryptoCoin[] = [
  {
    id: "btc", name: "Bitcoin", symbol: "BTC", icon: "₿",
    currentPrice: 68_000, previousPrice: 65_000, priceHistory: makeHistory(66000),
    amountOwned: 0, volatility: "MEDIUM", color: "#f5c518"
  },
  {
    id: "exxes", name: "EXXES", symbol: "EXX", icon: "💎",
    currentPrice: 375_000, previousPrice: 370_000, priceHistory: makeHistory(380_000),
    amountOwned: 0, volatility: "EXTREME", color: "#f472b6",
    priceFloor: 355_000, priceCeiling: 410_000, maxTxAmount: 30_000_000_000_000
  },
  {
    id: "eth", name: "Ethereum", symbol: "ETH", icon: "Ξ",
    currentPrice: 3_200, previousPrice: 3_100, priceHistory: makeHistory(3150),
    amountOwned: 0, volatility: "HIGH", color: "#818cf8",
    nftOnly: true
  },
  {
    id: "trb", name: "TRB Token", symbol: "TRB", icon: "🔷",
    currentPrice: 1_200, previousPrice: 1_100, priceHistory: makeHistory(1230),
    amountOwned: 0, volatility: "HIGH", color: "#38bdf8",
    priceFloor: 960, priceCeiling: 1_500, nftOnly: true
  },
];


// ---------------------------------------------------------------------------
// LUXURY ITEMS (WITH DEEP PREMIUM MODIFIERS)
// ---------------------------------------------------------------------------
const carModifiers: LuxuryModifier[] = [
  { id: "prem", label: "Premium Equipment", costPercent: 40, netWorthBoostPercent: 40, icon: "✨" },
  { id: "eng_bst", label: "Engine BST", costPercent: 15, netWorthBoostPercent: 15, icon: "⚙️" },
  { id: "eng_sp", label: "Engine S+", costPercent: 35, netWorthBoostPercent: 35, icon: "🔥" },
];

const jetModifiers: LuxuryModifier[] = [
  { id: "prem", label: "Premium Design", costPercent: 25, netWorthBoostPercent: 25, icon: "✨" },
  { id: "hire_team", label: "Hire a team", costPercent: 10, netWorthBoostPercent: 15, icon: "👨‍✈️" },
];

const yachtModifiers: LuxuryModifier[] = [
  { id: "prem", label: "Premium Design", costPercent: 30, netWorthBoostPercent: 30, icon: "✨" },
  { id: "hire_team", label: "Hire a team", costPercent: 15, netWorthBoostPercent: 20, icon: "👨‍✈️" },
];

const yachtLocations = [
  { id: "loc_public", name: "Public Harbor", cost: 0, image: { id: "loc_harbor", description: "Standard public harbor" } },
  { id: "loc_dubai", name: "Dubai Marina", cost: 1_000_000, image: { id: "loc_dubai_marina", description: "Luxury Dubai Marina" } },
  { id: "loc_monaco", name: "Monaco Port", cost: 5_000_000, image: { id: "loc_monaco_port", description: "Exotic Monaco port full of yachts" } },
];

export const INITIAL_LUXURY: LuxuryItem[] = [
  { id: "lux_car_sport", name: "Ferarry 250 GDO", icon: "🏎️", description: "Beautiful red sports car", category: "CARS", baseCost: 120_000, costCurrency: "money", baseNetWorthBoost: 100_000, owned: false, image: { id: "lux_fer", description: "Red Ferrari" }, availableModifiers: carModifiers, appliedModifiers: [] },
  { id: "lux_car_super", name: "Lumbogini Avent", icon: "🏎️", description: "Sharp angular supercar", category: "CARS", baseCost: 1_500_000, costCurrency: "money", baseNetWorthBoost: 1_200_000, owned: false, image: { id: "lux_lam", description: "Lambo" }, availableModifiers: carModifiers, appliedModifiers: [] },
  { id: "lux_jet_small", name: "AeroBus 480 Prestige", icon: "✈️", description: "Standard private jet", category: "AVIATION", baseCost: 8_000_000, costCurrency: "money", baseNetWorthBoost: 7_000_000, owned: false, image: { id: "lux_jet1", description: "Private Jet" }, availableModifiers: jetModifiers, appliedModifiers: [] },
  { id: "lux_jet_large", name: "Boeing 747 VIP", icon: "🛫", description: "Massive private plane", category: "AVIATION", baseCost: 80_000_000, costCurrency: "money", baseNetWorthBoost: 75_000_000, owned: false, image: { id: "lux_jet2", description: "Boeing 747 private" }, availableModifiers: jetModifiers, appliedModifiers: [] },
  { id: "lux_yacht_small", name: "Garden Yacht", icon: "🛥️", description: "Beautiful 30m yacht", category: "MARITIME", baseCost: 5_000_000, costCurrency: "money", baseNetWorthBoost: 4_000_000, owned: false, image: { id: "lux_yt1", description: "Yacht on water" }, availableModifiers: yachtModifiers, availableLocations: yachtLocations, selectedLocationId: null, appliedModifiers: [] },
  { id: "lux_yacht_mega", name: "Mega Yacht Eclipse", icon: "🚢", description: "100m mega yacht", category: "MARITIME", baseCost: 200_000_000, costCurrency: "money", baseNetWorthBoost: 180_000_000, owned: false, image: { id: "lux_yt2", description: "Mega yacht" }, availableModifiers: yachtModifiers, availableLocations: yachtLocations, selectedLocationId: null, appliedModifiers: [] },
  { id: "lux_nft", name: "Exclusive NFT", icon: "🎨", description: "A digital masterpiece", category: "ART", baseCost: 500_000, costCurrency: "crypto", cryptoCoinId: "exx", cryptoAmount: 500_000, baseNetWorthBoost: 2_000_000, owned: false, image: { id: "lux_nft", description: "NFT art" }, availableModifiers: [], appliedModifiers: [] },
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [{ id: "first_click", name: "First Step", description: "Click the coin", icon: "👆", target: 1, type: "clicks", reward: 100, completed: false, claimed: false }];
export const INITIAL_DAILY_TASKS: DailyTask[] = [{ id: "task_clicks", description: "Click 50 times", target: 50, progress: 0, type: "click", reward: 5_000, completed: false, claimed: false }];
