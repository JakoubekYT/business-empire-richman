import { create } from "zustand";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import type { GameState, TaxiData, ShippingData, StoreData, ConstructionData, CarDealershipData, ITData, ActiveITProject } from "../types/game";
import { INITIAL_BUSINESSES, INITIAL_STOCKS, INITIAL_CRYPTO, INITIAL_LUXURY, INITIAL_ACHIEVEMENTS, INITIAL_DAILY_TASKS, INITIAL_CLICK_UPGRADES, TAXI_SLOT_PACKAGES, TAXI_CAR_MODELS, SHIPPING_SLOT_PACKAGES, SHIPPING_VEHICLE_MODELS, STORE_PRODUCTS, FACTORY_PRODUCTS, CONSTRUCTION_PROJECTS, INITIAL_PROPERTIES, DEALER_CAR_MODELS, IT_PROJECTS, EMPLOYEE_TYPES, FOOTBALL_PLAYER_TYPES, OIL_WELL_TYPES, CLOTHING_COLLECTIONS, CLOTHING_STORES_DATA, ROCKET_TYPES, SPACE_MISSIONS, generateMarketCars } from "../data/gameData";

const initialState: GameState = {
  money: 0,
  totalEarned: 0,
  netWorth: 0,
  incomePerHour: 0,
  businesses: INITIAL_BUSINESSES,
  properties: INITIAL_PROPERTIES,
  stocks: INITIAL_STOCKS,
  crypto: INITIAL_CRYPTO,
  luxuryItems: INITIAL_LUXURY,
  clickValue: 1,
  totalClicks: 0,
  clickUpgrades: [],
  autoClickRate: 0,
  achievements: INITIAL_ACHIEVEMENTS,
  dailyTasks: INITIAL_DAILY_TASKS,
  prestigeLevel: 0,
  prestigeBonus: 0,
  totalPlayTimeSeconds: 0,
  lastSavedAt: Date.now(),
  lastTickAt: Date.now(),
  lastDividendAt: Date.now(),
  notifications: [],
};


export const useGameStore = create<GameState & {
  uid: string | null;
  setUid: (uid: string | null) => void;
  
  // Save/Load
  loadProfile: (uid: string) => Promise<void>;
  saveProfile: (uid: string) => Promise<void>;
  loadGame: (uid: string) => Promise<void>;
  saveGame: () => Promise<void>;
  
  // Core Game Loop
  tick: () => void;
  click: () => void;

  // New Deep Luxury & Properties
  buyProperty: (propertyId: string) => void;
  buyPropertyImprovement: (propertyId: string, improvementId: string) => void;
  buyImprovement: (propertyId: string, improvementId: string) => void;
  buyLuxuryItem: (itemId: string, selectedModifiers: string[]) => void;
  buyLuxury: (itemId: string) => void;
  sellLuxuryItem: (itemId: string) => void;

  // Clicker Upgrades
  buyClickUpgrade: (upgradeId: string) => void;

  // Rewards
  claimAchievement: (id: string) => void;
  claimDailyTask: (id: string) => void;

  // Investments
  buyShares: (ticker: string, amount: number) => void;
  sellShares: (ticker: string, amount: number) => void;
  buyCrypto: (coinId: string, amount: number) => void;
  sellCrypto: (coinId: string, amount: number) => void;

  // Business unlocks
  unlockBusiness: (id: string) => void;

  // TAXI
  buyTaxiSlots: (businessId: string, packageIndex: number) => void;
  buyTaxiCar: (businessId: string, modelId: string) => void;
  scrapTaxiCar: (businessId: string, carId: string) => void;

  // STORE
  buyStoreShelf: (businessId: string) => void;
  buyStoreProduct: (businessId: string, productId: string) => void;
  restockProduct: (businessId: string, activeProductIndex: number) => void;

  // FACTORY
  buyFactoryLine: (businessId: string, productId: string, cost: number) => void;

  // SHIPPING
  buyShippingSlots: (businessId: string, packageIndex: number) => void;
  buyShippingVehicle: (businessId: string, modelId: string) => void;
  scrapShippingVehicle: (businessId: string, vehicleId: string) => void;

  // CONSTRUCTION
  buyConstructionEquipment: (businessId: string) => void;
  buyConstructionResource: (businessId: string, type: 'builders' | 'concrete' | 'wood' | 'metal', amount: number, cost: number) => void;
  startConstructionProject: (businessId: string, projectId: string) => void;
  collectConstructionProject: (businessId: string, activeProjectId: string) => void;

  // DEALERSHIP (DEEP MECHANICS)
  buyMechanic: (businessId: string) => void;
  refreshDealerMarket: (businessId: string) => void;
  buyDealerCar: (businessId: string, marketCarId: string) => void;
  startDealerRepair: (businessId: string, inventoryCarId: string, issueIndex: number) => void;
  finishDealerRepair: (businessId: string, inventoryCarId: string) => void;
  sellDealerCar: (businessId: string, inventoryCarId: string) => void;

  // IT COMPANY
  hireITEmployee: (businessId: string, roleId: string) => void;
  startITProject: (businessId: string, projectId: string, assignedEmployeeIds: string[]) => void;
  collectITProject: (businessId: string, activeProjectId: string) => void;

  // BANK
  setBankRates: (businessId: string, depositRate: number, loanRate: number) => void;
  upgradeBankVault: (businessId: string) => void;
  collectBankVault: (businessId: string) => void;

  // FOOTBALL
  buyFootballPlayer: (businessId: string, playerId: string) => void;
  upgradeStadium: (businessId: string) => void;

  // OIL & GAS
  buyOilWell: (businessId: string, wellId: string) => void;
  upgradeRefinery: (businessId: string) => void;

  // CLOTHING
  designClothingCollection: (businessId: string, collectionId: string) => void;
  openClothingStore: (businessId: string, storeId: string) => void;
  
  // SPACE
  buyRocket: (businessId: string, rocketId: string) => void;
  buySatellite: (businessId: string) => void;
  startSpaceMission: (businessId: string, missionId: string, rocketId: string) => void;
  collectSpaceMission: (businessId: string, activeMissionId: string) => void;
  updateMarketPrices: () => void;

}>((set, get) => ({
  ...initialState,
  uid: null,
  setUid: (uid) => set({ uid }),

  loadProfile: async (uid) => {
    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data().gameState as GameState;
        if (data) {
          // offline calculation
          const now = Date.now();
          const msPassed = now - (data.lastTickAt || now);
          const offlineEarned = (data.incomePerHour / 3600000) * msPassed;
          
          set({
            ...initialState,
            ...data,
            money: data.money + offlineEarned,
            totalEarned: data.totalEarned + offlineEarned,
            lastTickAt: now,
          });
        }
      }
    } catch (e) {
      console.error(e);
    }
  },
  saveProfile: async (uid) => {
    try {
      const state = get();
      const stToSave = { ...state } as any;
      // @ts-ignore
      delete stToSave.loadProfile; delete stToSave.saveProfile; delete stToSave.loadGame; delete stToSave.saveGame;
      delete stToSave.tick; delete stToSave.click; delete stToSave.updateMarketPrices;
      
      await setDoc(doc(db, "users", uid), { gameState: { ...stToSave, lastSavedAt: Date.now() } }, { merge: true });
    } catch (e) {
      console.error(e);
    }
  },
  
  loadGame: async (uid) => {
    await get().loadProfile(uid);
  },
  
  saveGame: async () => {
    const { uid } = get();
    if (uid) await get().saveProfile(uid);
  },


  click: () => set(state => {
    const earned = state.clickValue * (1 + state.prestigeBonus);
    return {
      money: state.money + earned,
      totalEarned: state.totalEarned + earned,
      totalClicks: state.totalClicks + 1,
    };
  }),

  buyClickUpgrade: (upgradeId) => set(state => {
     if (state.clickUpgrades.includes(upgradeId)) return state;
     const upgrade = INITIAL_CLICK_UPGRADES.find(u => u.id === upgradeId);
     if (!upgrade || state.money < upgrade.cost) return state;
     
     let newClickValue = state.clickValue;
     let newAutoClick = state.autoClickRate;

     if (upgrade.effectType === 'add_click') newClickValue += upgrade.value;
     else if (upgrade.effectType === 'mult_click') newClickValue *= upgrade.value;
     else if (upgrade.effectType === 'add_auto') newAutoClick += upgrade.value;

     return {
        money: state.money - upgrade.cost,
        clickUpgrades: [...state.clickUpgrades, upgradeId],
        clickValue: newClickValue,
        autoClickRate: newAutoClick
     };
  }),

  claimAchievement: (id) => set(state => {
     const ach = state.achievements.find(a => a.id === id);
     if (!ach || !ach.completed || ach.claimed) return state;
     return {
        money: state.money + ach.reward,
        totalEarned: state.totalEarned + ach.reward,
        achievements: state.achievements.map(a => a.id === id ? { ...a, claimed: true } : a)
     };
  }),

  claimDailyTask: (id) => set(state => {
     const task = state.dailyTasks.find(t => t.id === id);
     if (!task || !task.completed || task.claimed) return state;
     return {
        money: state.money + task.reward,
        totalEarned: state.totalEarned + task.reward,
        dailyTasks: state.dailyTasks.map(t => t.id === id ? { ...t, claimed: true } : t)
     };
  }),

  buyProperty: (propertyId) => set(state => {
    const prop = state.properties.find(p => p.id === propertyId);
    if (!prop || prop.owned || state.money < prop.basePurchaseCost) return state;

    return {
      money: state.money - prop.basePurchaseCost,
      netWorth: state.netWorth + prop.basePurchaseCost,
      properties: state.properties.map(p => p.id === propertyId ? { ...p, owned: true } : p)
    };
  }),

  buyPropertyImprovement: (propertyId, improvementId) => set(state => {
    const prop = state.properties.find(p => p.id === propertyId);
    if (!prop || !prop.owned) return state;

    const imp = prop.improvements.find(i => i.id === improvementId);
    if (!imp || imp.purchased) return state;

    const cost = prop.basePurchaseCost * (imp.costPercent / 100);
    if (state.money < cost) return state;

    const newImprovements = prop.improvements.map(i => i.id === improvementId ? { ...i, purchased: true } : i);

    return {
      money: state.money - cost,
      netWorth: state.netWorth + cost,
      properties: state.properties.map(p => p.id === propertyId ? { ...p, improvements: newImprovements } : p)
    };
  }),

  buyLuxury: (itemId) => get().buyLuxuryItem(itemId, []),

  buyImprovement: (propId, impId) => get().buyPropertyImprovement(propId, impId),

  buyShares: (ticker, amount) => set(state => {
    const stock = state.stocks.find(s => s.ticker === ticker);
    if (!stock) return state;
    const totalCost = stock.currentPrice * amount;
    if (state.money < totalCost) return state;
    return {
      money: state.money - totalCost,
      stocks: state.stocks.map(s => s.ticker === ticker ? { ...s, sharesOwned: s.sharesOwned + amount } : s)
    };
  }),

  sellShares: (ticker, amount) => set(state => {
    const stock = state.stocks.find(s => s.ticker === ticker);
    if (!stock || stock.sharesOwned < amount) return state;
    const revenue = stock.currentPrice * amount;
    return {
      money: state.money + revenue,
      stocks: state.stocks.map(s => s.ticker === ticker ? { ...s, sharesOwned: s.sharesOwned - amount } : s)
    };
  }),

  buyCrypto: (coinId, amount) => set(state => {
    const coin = state.crypto.find(c => c.id === coinId);
    if (!coin) return state;
    const totalCost = coin.currentPrice * amount;
    if (state.money < totalCost) return state;
    return {
      money: state.money - totalCost,
      crypto: state.crypto.map(c => c.id === coinId ? { ...c, amountOwned: c.amountOwned + amount } : c)
    };
  }),

  sellCrypto: (coinId, amount) => set(state => {
    const coin = state.crypto.find(c => c.id === coinId);
    if (!coin || coin.amountOwned < amount) return state;
    const revenue = coin.currentPrice * amount;
    return {
      money: state.money + revenue,
      crypto: state.crypto.map(c => c.id === coinId ? { ...c, amountOwned: c.amountOwned - amount } : c)
    };
  }),

  buyLuxuryItem: (itemId, selectedModifiers) => set(state => {
    const item = state.luxuryItems.find(i => i.id === itemId);
    if (!item || item.owned) return state;

    // Calculate percent additions
    let priceMultiplier = 1;
    let nwMultiplier = 1;

    selectedModifiers.forEach(modId => {
      const m = item.availableModifiers.find(max => max.id === modId);
      if (m) {
        priceMultiplier += (m.costPercent / 100);
        nwMultiplier += (m.netWorthBoostPercent / 100);
      }
    });

    const finalCost = item.baseCost * priceMultiplier;

    if (item.costCurrency === 'money') {
      if (state.money < finalCost) return state;
      return {
        money: state.money - finalCost,
        netWorth: state.netWorth + (item.baseNetWorthBoost * nwMultiplier),
        luxuryItems: state.luxuryItems.map(i => i.id === itemId ? { ...i, owned: true, appliedModifiers: selectedModifiers } : i)
      };
    } else {
      // Crypto purchase (skipping deep logic for brevity, assuming standard deduct)
      return state;
    }
  }),

  sellLuxuryItem: (itemId) => set(state => {
    const item = state.luxuryItems.find(i => i.id === itemId);
    if (!item || !item.owned || item.costCurrency !== 'money') return state;

    let priceMultiplier = 1;
    let nwMultiplier = 1;
    item.appliedModifiers.forEach(modId => {
       const m = item.availableModifiers.find(max => max.id === modId);
       if (m) {
         priceMultiplier += (m.costPercent / 100);
         nwMultiplier += (m.netWorthBoostPercent / 100);
       }
    });

    const sellPrice = (item.baseCost * priceMultiplier) * 0.8; // Lose 20% value on sell

    return {
      money: state.money + sellPrice,
      netWorth: state.netWorth - (item.baseNetWorthBoost * nwMultiplier),
      luxuryItems: state.luxuryItems.map(i => i.id === itemId ? { ...i, owned: false, appliedModifiers: [] } : i)
    };
  }),

  unlockBusiness: (id) => set(state => {
    const bus = state.businesses.find(b => b.id === id);
    if (!bus || bus.owned || state.money < bus.unlockCost) return state;
    return {
      money: state.money - bus.unlockCost,
      netWorth: state.netWorth + bus.unlockCost,
      businesses: state.businesses.map(b => b.id === id ? { ...b, owned: true } : b)
    };
  }),

  // ==========================================
  // TAXI
  // ==========================================
  buyTaxiSlots: (bizId, idx) => set(state => {
    const b = state.businesses.find(b => b.id === bizId);
    if (!b || b.type !== 'taxi') return state;
    const pkg = TAXI_SLOT_PACKAGES[idx];
    if (state.money < pkg.cost) return state;

    const data = b.data as TaxiData;
    const newSlots = Array.from({ length: pkg.slots }).map((_, i) => ({ id: data.parkingSlots.length + i, cost: 500, unlocked: true }));

    return {
      money: state.money - pkg.cost,
      businesses: state.businesses.map(bus => bus.id === bizId ? { ...bus, data: { ...data, parkingSlots: [...data.parkingSlots, ...newSlots] } } : bus)
    };
  }),

  buyTaxiCar: (bizId, modelId) => set(state => {
    const b = state.businesses.find(b => b.id === bizId);
    if (!b || b.type !== 'taxi') return state;
    const model = TAXI_CAR_MODELS.find(m => m.id === modelId);
    const data = b.data as TaxiData;
    const active = data.ownedCars.filter(c => !c.broken).length;

    if (!model || state.money < model.cost || active >= data.parkingSlots.length) return state;

    const car = { id: Math.random().toString(36).slice(2), modelId, purchasedAt: Date.now(), currentKm: 0, broken: false };

    return {
      money: state.money - model.cost,
      businesses: state.businesses.map(bus => bus.id === bizId ? { ...bus, data: { ...data, ownedCars: [...data.ownedCars, car] } } : bus)
    };
  }),

  scrapTaxiCar: (bizId, carId) => set(state => {
    const b = state.businesses.find(b => b.id === bizId);
    if (!b || b.type !== 'taxi') return state;
    const data = b.data as TaxiData;
    return {
      businesses: state.businesses.map(bus => bus.id === bizId ? { ...bus, data: { ...data, ownedCars: data.ownedCars.filter(c => c.id !== carId) } } : bus)
    };
  }),

  // ==========================================
  // STORE
  // ==========================================
  buyStoreShelf: (bizId) => set(state => {
    const b = state.businesses.find(b => b.id === bizId);
    if (!b || b.type !== 'store') return state;
    const data = b.data as StoreData;
    const cost = (data.shelves + 1) * 1500;
    if (data.shelves >= 20 || state.money < cost) return state;

    return {
      money: state.money - cost,
      businesses: state.businesses.map(bus => bus.id === bizId ? { ...bus, data: { ...data, shelves: data.shelves + 1 } } : bus)
    };
  }),

  buyStoreProduct: (bizId, productId) => set(state => {
    const b = state.businesses.find(b => b.id === bizId);
    if (!b || b.type !== 'store') return state;
    const data = b.data as StoreData;
    const prod = STORE_PRODUCTS.find(p => p.id === productId);
    if (!prod || state.money < prod.shelfCost || data.activeProducts.length >= data.shelves) return state;

    return {
      money: state.money - prod.shelfCost,
      businesses: state.businesses.map(bus => bus.id === bizId ? { ...bus, data: { ...data, activeProducts: [...data.activeProducts, { productId, restockedAt: Date.now() }] } } : bus)
    };
  }),

  restockProduct: (bizId, activeIndex) => set(state => {
    const b = state.businesses.find(b => b.id === bizId);
    if (!b || b.type !== 'store') return state;
    const data = b.data as StoreData;
    const active = data.activeProducts[activeIndex];
    if (!active) return state;
    const prod = STORE_PRODUCTS.find(p => p.id === active.productId)!;
    if (state.money < prod.restockCost) return state;

    const newActive = [...data.activeProducts];
    newActive[activeIndex] = { ...active, restockedAt: Date.now() };

    return {
      money: state.money - prod.restockCost,
      businesses: state.businesses.map(bus => bus.id === bizId ? { ...bus, data: { ...data, activeProducts: newActive } } : bus)
    };
  }),

  // ==========================================
  // SHIPPING
  // ==========================================
  buyShippingSlots: (bizId, idx) => set(state => {
    // simplified identically to taxi
    const b = state.businesses.find(b => b.id === bizId);
    if (!b || b.type !== 'shipping') return state;
    const pkg = SHIPPING_SLOT_PACKAGES[idx];
    if (state.money < pkg.cost) return state;
    const data = b.data as ShippingData;
    return { money: state.money - pkg.cost, businesses: state.businesses.map(bus => bus.id === bizId ? { ...bus, data: { ...data, vehicleSlots: data.vehicleSlots + pkg.slots } } : bus) };
  }),

  buyShippingVehicle: (bizId, modelId) => set(state => {
    const b = state.businesses.find(b => b.id === bizId);
    if (!b || b.type !== 'shipping') return state;
    const model = SHIPPING_VEHICLE_MODELS.find(m => m.id === modelId);
    const data = b.data as ShippingData;
    const active = data.ownedVehicles.filter(v => !v.broken).length;
    if (!model || state.money < model.cost || active >= data.vehicleSlots) return state;
    const vehicle = { id: Math.random().toString(36).slice(2), modelId, purchasedAt: Date.now(), currentKm: 0, broken: false };
    return { money: state.money - model.cost, businesses: state.businesses.map(bus => bus.id === bizId ? { ...bus, data: { ...data, ownedVehicles: [...data.ownedVehicles, vehicle] } } : bus) };
  }),

  scrapShippingVehicle: (bizId, vehicleId) => set(state => {
    const b = state.businesses.find(b => b.id === bizId);
    if (!b || b.type !== 'shipping') return state;
    const data = b.data as ShippingData;
    return { businesses: state.businesses.map(bus => bus.id === bizId ? { ...bus, data: { ...data, ownedVehicles: data.ownedVehicles.filter(v => v.id !== vehicleId) } } : bus) };
  }),

  // ==========================================
  // FACTORY
  // ==========================================
  buyFactoryLine: (bizId, productId, cost) => set(state => {
    const b = state.businesses.find(b => b.id === bizId);
    if (!b || b.type !== 'factory' || state.money < cost) return state;
    
    const data = b.data as Extract<import("../types/game").BusinessData, { lines: any[] }>;
    if (data.lines.length >= 10) return state; // Max 10 lines

    const line = { id: Math.random().toString(36).slice(2), productId, purchasedAt: Date.now() };

    return {
      money: state.money - cost,
      businesses: state.businesses.map(bus => bus.id === bizId ? { ...bus, data: { ...data, lines: [...data.lines, line] } } : bus)
    };
  }),

  // ==========================================
  // CONSTRUCTION
  // ==========================================
  buyConstructionEquipment: (bizId) => set(state => {
    const b = state.businesses.find(b => b.id === bizId);
    if (!b || b.type !== 'construction') return state;
    const data = b.data as ConstructionData;
    const cost = (data.equipmentCount + 1) * 25000;
    if (state.money < cost) return state;
    return { money: state.money - cost, businesses: state.businesses.map(bus => bus.id === bizId ? { ...bus, data: { ...data, equipmentCount: data.equipmentCount + 1 } } : bus) };
  }),

  buyConstructionResource: (bizId, type, amount, cost) => set(state => {
    const b = state.businesses.find(b => b.id === bizId);
    if (!b || b.type !== 'construction') return state;
    if (state.money < cost) return state;
    const data = b.data as ConstructionData;
    return {
      money: state.money - cost,
      businesses: state.businesses.map(bus => bus.id === bizId ? { ...bus, data: { ...data, resources: { ...data.resources, [type]: data.resources[type] + amount } } } : bus)
    };
  }),

  startConstructionProject: (bizId, projectId) => set(state => {
    const b = state.businesses.find(b => b.id === bizId);
    if (!b || b.type !== 'construction') return state;
    const data = b.data as ConstructionData;
    const proj = CONSTRUCTION_PROJECTS.find(p => p.id === projectId);
    if (!proj) return state;

    // Check equipment availability
    const usedEq = data.activeProjects.reduce((sum, p) => sum + CONSTRUCTION_PROJECTS.find(cp => cp.id === p.projectId)!.requiredEquipment, 0);
    if (data.equipmentCount - usedEq < proj.requiredEquipment) return state;

    // Check resources
    if (data.resources.builders < proj.requiredBuilders ||
        data.resources.concrete < proj.requiredConcrete ||
        data.resources.wood < proj.requiredWood ||
        data.resources.metal < proj.requiredMetal) {
      return state;
    }

    const active = { projectId: projectId + "_" + Date.now(), startedAt: Date.now(), endsAt: Date.now() + (proj.durationSeconds * 1000) };
    
    return {
      businesses: state.businesses.map(bus => bus.id === bizId ? {
        ...bus,
        data: {
          ...data,
          resources: {
            builders: data.resources.builders - proj.requiredBuilders,
            concrete: data.resources.concrete - proj.requiredConcrete,
            wood: data.resources.wood - proj.requiredWood,
            metal: data.resources.metal - proj.requiredMetal
          },
          activeProjects: [...data.activeProjects, active]
        }
      } : bus)
    };
  }),

  collectConstructionProject: (bizId, activeId) => set(state => {
    const b = state.businesses.find(b => b.id === bizId);
    if (!b || b.type !== 'construction') return state;
    const data = b.data as ConstructionData;
    const active = data.activeProjects.find(p => p.projectId === activeId);
    if (!active || Date.now() < active.endsAt) return state; // not done

    // The logic: projectId currently has the timestamp appended, need to split to get the base id
    const baseProjectId = active.projectId.split("_")[0];
    const proj = CONSTRUCTION_PROJECTS.find(p => p.id === baseProjectId);
    if (!proj) return state;

    return {
      money: state.money + proj.reward,
      totalEarned: state.totalEarned + proj.reward,
      businesses: state.businesses.map(bus => bus.id === bizId ? {
        ...bus,
        data: {
          ...data,
          activeProjects: data.activeProjects.filter(p => p.projectId !== activeId),
          completedProjects: [...data.completedProjects, baseProjectId]
        }
      } : bus)
    };
  }),

  // ==========================================
  // DEALERSHIP DEEP MECHANICS
  // ==========================================
  buyMechanic: (bizId) => set(state => {
    const b = state.businesses.find(b => b.id === bizId);
    if (!b || b.type !== 'car_dealership') return state;
    const data = b.data as CarDealershipData;
    const cost = (data.mechanicsOwned + 1) * 15_000;
    if (state.money < cost || data.mechanicsOwned >= data.mechanicSlots) return state;
    return { money: state.money - cost, businesses: state.businesses.map(bus => bus.id === bizId ? { ...bus, data: { ...data, mechanicsOwned: data.mechanicsOwned + 1 } } : bus) };
  }),

  refreshDealerMarket: (bizId) => set(state => {
    const b = state.businesses.find(b => b.id === bizId);
    if (!b || b.type !== 'car_dealership') return state;
    const data = b.data as CarDealershipData;
    // Costs $5000 to refresh market
    if (state.money < 5000) return state;
    return { money: state.money - 5000, businesses: state.businesses.map(bus => bus.id === bizId ? { ...bus, data: { ...data, market: generateMarketCars(), lastMarketRefreshAt: Date.now() } } : bus) };
  }),

  buyDealerCar: (bizId, marketCarId) => set(state => {
    const b = state.businesses.find(b => b.id === bizId);
    if (!b || b.type !== 'car_dealership') return state;
    const data = b.data as CarDealershipData;
    const mCar = data.market.find(c => c.id === marketCarId);
    if (!mCar || state.money < mCar.buyPrice) return state;

    const newMCar = { ...mCar, id: Math.random().toString(36).slice(2) }; // new ID for inventory

    return {
      money: state.money - mCar.buyPrice,
      businesses: state.businesses.map(bus => bus.id === bizId ? { ...bus, data: { ...data, market: data.market.filter(c => c.id !== marketCarId), inventory: [...data.inventory, { ...newMCar, purchasedAt: Date.now(), activeRepairIndex: null, repairStartedAt: null, repairEndsAt: null, sold: false }] } } : bus)
    };
  }),

  startDealerRepair: (bizId, invId, issueIdx) => set(state => {
    const b = state.businesses.find(b => b.id === bizId);
    if (!b || b.type !== 'car_dealership') return state;
    const data = b.data as CarDealershipData;
    const car = data.inventory.find(c => c.id === invId);
    if (!car || car.sold) return state;

    const issue = car.issues[issueIdx];
    if (!issue || issue.isRepaired || car.activeRepairIndex !== null) return state;
    
    // Check if mechanic is free
    const busyMechanics = data.inventory.filter(c => c.activeRepairIndex !== null).length;
    if (busyMechanics >= data.mechanicsOwned) return state;

    if (state.money < issue.repairCost) return state;

    const newInv = data.inventory.map(c => {
      if (c.id === invId) {
        return { ...c, activeRepairIndex: issueIdx, repairStartedAt: Date.now(), repairEndsAt: Date.now() + (issue.repairTimeSeconds * 1000) };
      }
      return c;
    });

    return {
      money: state.money - issue.repairCost,
      businesses: state.businesses.map(bus => bus.id === bizId ? { ...bus, data: { ...data, inventory: newInv } } : bus)
    };
  }),

  finishDealerRepair: (bizId, invId) => set(state => {
    const b = state.businesses.find(b => b.id === bizId);
    if (!b || b.type !== 'car_dealership') return state;
    const data = b.data as CarDealershipData;
    const car = data.inventory.find(c => c.id === invId);
    if (!car || car.activeRepairIndex === null || car.sold || Date.now() < car.repairEndsAt!) return state;

    const newInv = data.inventory.map(c => {
      if (c.id === invId) {
        const issues = [...c.issues];
        issues[c.activeRepairIndex!] = { ...issues[c.activeRepairIndex!], isRepaired: true };
        return { ...c, issues, activeRepairIndex: null, repairStartedAt: null, repairEndsAt: null };
      }
      return c;
    });

    return { businesses: state.businesses.map(bus => bus.id === bizId ? { ...bus, data: { ...data, inventory: newInv } } : bus) };
  }),

  sellDealerCar: (bizId, invId) => set(state => {
    const b = state.businesses.find(b => b.id === bizId);
    if (!b || b.type !== 'car_dealership') return state;
    const data = b.data as CarDealershipData;
    const car = data.inventory.find(c => c.id === invId);
    if (!car || car.sold || car.activeRepairIndex !== null) return state;

    const model = DEALER_CAR_MODELS.find((m) => m.id === car.modelId);
    if (!model) return state;
    
    // Calculate sell price based on un-repaired issues
    const penalty = car.issues.reduce((sum, issue) => issue.isRepaired ? sum : sum + (issue.repairCost * 1.5), 0);
    const sellPrice = Math.max(car.buyPrice * 0.8, model.maxSalePrice - penalty); // can lose money if sold without repair

    const newInv = data.inventory.map(c => c.id === invId ? { ...c, sold: true } : c);

    return {
      money: state.money + sellPrice,
      totalEarned: state.totalEarned + (sellPrice - car.buyPrice),
      businesses: state.businesses.map(bus => bus.id === bizId ? { ...bus, data: { ...data, inventory: newInv } } : bus)
    };
  }),

  // ==========================================
  // IT COMPANY
  // ==========================================
  hireITEmployee: (bizId, roleId) => set(state => {
    const b = state.businesses.find(b => b.id === bizId);
    if (!b || b.type !== 'it_company') return state;
    const role = EMPLOYEE_TYPES.find((r) => r.id === roleId);
    if (!role || state.money < role.hireBonus) return state;
    
    const data = b.data as ITData;
    const employee = { id: Math.random().toString(36).slice(2), roleId: role.id as any, hiredAt: Date.now() };

    return {
      money: state.money - role.hireBonus,
      businesses: state.businesses.map(bus => bus.id === bizId ? { ...bus, data: { ...data, employees: [...data.employees, employee] } } as import("../types/game").Business : bus)
    };
  }),

  startITProject: (bizId, projectId, assignedEmployeeIds) => set(state => {
    const b = state.businesses.find(b => b.id === bizId);
    if (!b || b.type !== 'it_company') return state;
    const proj = IT_PROJECTS.find((p) => p.id === projectId);
    const data = b.data as ITData;
    
    if (!proj || assignedEmployeeIds.length < proj.minEmployees) return state;

    // Check if employees are already busy
    const busyIds = new Set(data.activeProjects.flatMap((p) => p.assignedEmployeeIds));
    if (assignedEmployeeIds.some(id => busyIds.has(id))) return state;

    // Calculate speed multiplier
    let totalSpeed = 0;
    assignedEmployeeIds.forEach(eid => {
      const emp = data.employees.find((e) => e.id === eid);
      if (emp) {
        const r = EMPLOYEE_TYPES.find((type) => type.id === emp.roleId);
        if (r) totalSpeed += r.projectSpeed;
      }
    });

    const realDurationSeconds = proj.baseDurationSeconds / (totalSpeed || 1);
    const activeId = projectId + "_" + Date.now();

    const active: ActiveITProject = { projectId: activeId, startedAt: Date.now(), endsAt: Date.now() + (realDurationSeconds * 1000), assignedEmployeeIds, collected: false };

    return {
      businesses: state.businesses.map(bus => bus.id === bizId ? { ...bus, data: { ...data, activeProjects: [...data.activeProjects, active] } } as import("../types/game").Business : bus)
    };
  }),

  collectITProject: (bizId, activeId) => set(state => {
    const b = state.businesses.find(b => b.id === bizId);
    if (!b || b.type !== 'it_company') return state;
    
    const data = b.data as ITData;
    const active = data.activeProjects.find((p) => p.projectId === activeId);
    if (!active || Date.now() < active.endsAt || active.collected) return state;

    const baseId = active.projectId.split("_")[0];
    const proj = IT_PROJECTS.find((p) => p.id === baseId);
    if (!proj) return state;

    return {
      money: state.money + proj.reward,
      totalEarned: state.totalEarned + proj.reward,
      businesses: state.businesses.map(bus => bus.id === bizId ? {
        ...bus,
        data: {
          ...data,
          activeProjects: data.activeProjects.filter((p) => p.projectId !== activeId),
          completedProjects: [...data.completedProjects, { ...active, collected: true }]
        }
      } as import("../types/game").Business : bus)
    };
  }),

  // ==========================================
  // BANK
  // ==========================================
  setBankRates: (bizId, depositRate, loanRate) => set(state => {
    const b = state.businesses.find(b => b.id === bizId);
    if (!b || b.type !== 'bank') return state;
    const data = b.data as Extract<import("../types/game").BusinessData, { vaultLevel: number, depositRate: number, loanRate: number }>;
    return {
      businesses: state.businesses.map(bus => bus.id === bizId ? { ...bus, data: { ...data, depositRate, loanRate } } : bus)
    };
  }),

  upgradeBankVault: (bizId) => set(state => {
    const b = state.businesses.find(b => b.id === bizId);
    if (!b || b.type !== 'bank') return state;
    const data = b.data as Extract<import("../types/game").BusinessData, { vaultLevel: number }>;
    const cost = data.vaultLevel * 10_000_000;
    if (state.money < cost || data.vaultLevel >= 35) return state;
    return {
      money: state.money - cost,
      businesses: state.businesses.map(bus => bus.id === bizId ? { ...bus, data: { ...data, vaultLevel: data.vaultLevel + 1 } } : bus)
    };
  }),

  collectBankVault: (bizId) => set(state => {
    const b = state.businesses.find(b => b.id === bizId);
    if (!b || b.type !== 'bank') return state;
    const data = b.data as Extract<import("../types/game").BusinessData, { vaultValue: number, lastCollectedAt: number }>;
    const amount = data.vaultValue;
    if (amount <= 0) return state;
    return {
      money: state.money + amount,
      totalEarned: state.totalEarned + amount,
      businesses: state.businesses.map(bus => bus.id === bizId ? { ...bus, data: { ...data, vaultValue: 0, lastCollectedAt: Date.now() } } : bus)
    };
  }),

  // ==========================================
  // FOOTBALL
  // ==========================================
  buyFootballPlayer: (bizId, playerId) => set(state => {
    const b = state.businesses.find(b => b.id === bizId);
    if (!b || b.type !== 'football') return state;
    const data = b.data as Extract<import("../types/game").BusinessData, { players: string[] }>;
    const playerDef = FOOTBALL_PLAYER_TYPES.find(p => p.id === playerId);
    
    if (!playerDef || state.money < playerDef.cost || data.players.includes(playerId)) return state;

    return {
      money: state.money - playerDef.cost,
      businesses: state.businesses.map(bus => bus.id === bizId ? {
        ...bus,
        data: { ...data, players: [...data.players, playerId] }
      } : bus)
    };
  }),

  upgradeStadium: (bizId) => set(state => {
    const b = state.businesses.find(b => b.id === bizId);
    if (!b || b.type !== 'football') return state;
    const data = b.data as Extract<import("../types/game").BusinessData, { stadiumLevel: number, ticketPrice: number }>;
    
    const cost = data.stadiumLevel * 5_000_000;
    if (state.money < cost) return state;

    return {
      money: state.money - cost,
      businesses: state.businesses.map(bus => bus.id === bizId ? {
        ...bus,
        data: { ...data, stadiumLevel: data.stadiumLevel + 1, ticketPrice: data.ticketPrice + 5 }
      } : bus)
    };
  }),

  // ==========================================
  // OIL & GAS
  // ==========================================
  buyOilWell: (bizId, wellId) => set(state => {
    const b = state.businesses.find(b => b.id === bizId);
    if (!b || b.type !== 'oil_gas') return state;
    const data = b.data as Extract<import("../types/game").BusinessData, { ownedWells: string[] }>;
    const well = OIL_WELL_TYPES.find((w) => w.id === wellId);
    
    if (!well || state.money < well.cost || data.ownedWells.includes(wellId)) return state;

    return {
      money: state.money - well.cost,
      businesses: state.businesses.map(bus => bus.id === bizId ? {
        ...bus,
        data: { ...data, ownedWells: [...data.ownedWells, wellId] }
      } : bus)
    };
  }),

  upgradeRefinery: (bizId) => set(state => {
    const b = state.businesses.find(b => b.id === bizId);
    if (!b || b.type !== 'oil_gas') return state;
    const data = b.data as Extract<import("../types/game").BusinessData, { refineryLevel: number }>;
    
    const cost = data.refineryLevel * 50_000_000;
    if (state.money < cost || data.refineryLevel >= 10) return state;

    return {
      money: state.money - cost,
      businesses: state.businesses.map(bus => bus.id === bizId ? {
        ...bus,
        data: { ...data, refineryLevel: data.refineryLevel + 1 }
      } : bus)
    };
  }),

  // ==========================================
  // CLOTHING BRAND
  // ==========================================
  designClothingCollection: (bizId, collectionId) => set(state => {
    const b = state.businesses.find(b => b.id === bizId);
    if (!b || b.type !== 'clothing') return state;
    const data = b.data as Extract<import("../types/game").BusinessData, { ownedCollections: string[] }>;
    const collection = CLOTHING_COLLECTIONS.find((c) => c.id === collectionId);
    
    if (!collection || state.money < collection.designCost || data.ownedCollections.includes(collectionId)) return state;

    return {
      money: state.money - collection.designCost,
      businesses: state.businesses.map(bus => bus.id === bizId ? {
        ...bus,
        data: { ...data, ownedCollections: [...data.ownedCollections, collectionId] }
      } : bus)
    };
  }),

  openClothingStore: (bizId, storeId) => set(state => {
    const b = state.businesses.find(b => b.id === bizId);
    if (!b || b.type !== 'clothing') return state;
    const data = b.data as Extract<import("../types/game").BusinessData, { ownedStores: string[] }>;
    const storeDef = CLOTHING_STORES_DATA.find((s) => s.id === storeId);
    
    if (!storeDef || state.money < storeDef.cost || data.ownedStores.includes(storeId)) return state;

    return {
      money: state.money - storeDef.cost,
      businesses: state.businesses.map(bus => bus.id === bizId ? {
        ...bus,
        data: { ...data, ownedStores: [...data.ownedStores, storeId] }
      } : bus)
    };
  }),

  // ==========================================
  // SPACE AGENCY
  // ==========================================
  buyRocket: (bizId, rocketId) => set(state => {
    const b = state.businesses.find(b => b.id === bizId);
    if (!b || b.type !== 'space') return state;
    const data = b.data as Extract<import("../types/game").BusinessData, { rockets: string[] }>;
    const rocketDef = ROCKET_TYPES.find((r) => r.id === rocketId);
    
    if (!rocketDef || state.money < rocketDef.cost) return state;

    return {
      money: state.money - rocketDef.cost,
      businesses: state.businesses.map(bus => bus.id === bizId ? {
        ...bus,
        data: { ...data, rockets: [...data.rockets, rocketId] }
      } : bus)
    };
  }),

  buySatellite: (bizId) => set(state => {
    const b = state.businesses.find(b => b.id === bizId);
    if (!b || b.type !== 'space') return state;
    const data = b.data as Extract<import("../types/game").BusinessData, { satellites: number }>;
    
    const cost = 2_500_000;
    if (state.money < cost) return state;

    return {
      money: state.money - cost,
      businesses: state.businesses.map(bus => bus.id === bizId ? {
        ...bus,
        data: { ...data, satellites: data.satellites + 1 }
      } : bus)
    };
  }),

  startSpaceMission: (bizId, missionId, rocketId) => set(state => {
    const b = state.businesses.find(b => b.id === bizId);
    if (!b || b.type !== 'space') return state;
    const data = b.data as import("../types/game").SpaceData;
    const mission = SPACE_MISSIONS.find((m) => m.id === missionId);
    
    if (!mission || !data.rockets.includes(rocketId) || mission.requiredRocket !== rocketId) return state;
    
    // Check if rocket is already busy on active mission
    const rocketBusy = data.activeMissions.some(m => !m.collected && m.rocketId === rocketId);
    if (rocketBusy) return state;

    const activeId = missionId + "_" + Date.now();
    const active = {
      missionId: activeId,
      rocketId,
      startedAt: Date.now(),
      endsAt: Date.now() + (mission.durationSeconds * 1000),
      collected: false
    };

    return {
      businesses: state.businesses.map(bus => bus.id === bizId ? {
        ...bus,
        data: { ...data, activeMissions: [...data.activeMissions, active] }
      } as import("../types/game").Business : bus)
    };
  }),

  collectSpaceMission: (bizId, activeMissionId) => set(state => {
    const b = state.businesses.find(b => b.id === bizId);
    if (!b || b.type !== 'space') return state;
    
    const data = b.data as import("../types/game").SpaceData;
    const active = data.activeMissions.find((m) => m.missionId === activeMissionId);
    if (!active || Date.now() < active.endsAt || active.collected) return state;

    const baseId = active.missionId.split("_")[0];
    const mission = SPACE_MISSIONS.find((m) => m.id === baseId);
    if (!mission) return state;

    return {
      money: state.money + mission.reward,
      totalEarned: state.totalEarned + mission.reward,
      businesses: state.businesses.map(bus => bus.id === bizId ? {
        ...bus,
        data: {
          ...data,
          activeMissions: data.activeMissions.filter((m) => m.missionId !== activeMissionId),
          // optionally store completed elsewhere
        }
      } as import("../types/game").Business : bus)
    };
  }),

  tick: () => set(state => {
    const now = Date.now();
    const dt = now - state.lastTickAt;
    if (dt < 500) return state; // Only process at least every 0.5s

    let income = 0;
    let expenses = 0;
    
    // Auto clickers
    if (state.autoClickRate > 0) {
      income += (state.autoClickRate * state.clickValue * (1 + state.prestigeBonus)) * (dt / 1000);
    }

    const nextBusinesses = state.businesses.map(bus => {
      if (!bus.owned) return bus;

      if (bus.type === 'taxi') {
        const data = bus.data as TaxiData;
        const newCars = data.ownedCars.map(car => {
          if (car.broken) return car;
          const model = TAXI_CAR_MODELS.find(m => m.id === car.modelId);
          if (!model) return car;
          const drivenKm = model.kmPerHour * (dt / 3600000);
          const currentKm = car.currentKm + drivenKm;
          if (currentKm >= model.maxKm) {
            return { ...car, currentKm: model.maxKm, broken: true };
          }
          income += model.incomePerHour * (dt / 3600000);
          return { ...car, currentKm };
        });
        return { ...bus, data: { ...data, ownedCars: newCars } };
      }

      if (bus.type === 'store') {
        const data = bus.data as StoreData;
        data.activeProducts.forEach(ap => {
          const prod = STORE_PRODUCTS.find(p => p.id === ap.productId);
          if (prod) {
            const outOfStock = (now - ap.restockedAt) / 3600000 >= prod.stockHours;
            if (!outOfStock) income += prod.incomePerHour * (dt / 3600000);
          }
        });
        return bus;
      }

      if (bus.type === 'factory') {
        const data = bus.data as import('../types/game').FactoryData;
        data.lines.forEach(line => {
          const prod = FACTORY_PRODUCTS.find(p => p.id === line.productId);
          if (prod) income += prod.incomePerHour * (dt / 3600000);
        });
        return bus;
      }

      if (bus.type === 'shipping') {
        const data = bus.data as ShippingData;
        const newVehicles = data.ownedVehicles.map(v => {
          if (v.broken) return v;
          const model = SHIPPING_VEHICLE_MODELS.find(m => m.id === v.modelId);
          if (!model) return v;
          const drivenKm = model.kmPerHour * (dt / 3600000);
          const currentKm = v.currentKm + drivenKm;
          if (currentKm >= model.maxKm) {
            return { ...v, currentKm: model.maxKm, broken: true };
          }
          income += model.incomePerHour * (dt / 3600000);
          return { ...v, currentKm };
        });
        return { ...bus, data: { ...data, ownedVehicles: newVehicles } };
      }

      if (bus.type === 'bank') {
        const data = bus.data as import('../types/game').BankData;
        // The bank vault fills passively based on deposit/loan rate spread
        const spread = data.loanRate - data.depositRate;
        const vaultCapacity = data.vaultLevel * 50_000_000;
        if (data.vaultValue < vaultCapacity) {
          // Base fill: spread * 100k per hour. Higher spread = faster fill
          const vaultFill = Math.max(0, spread * 100_000) * (dt / 3600000);
          const newVault = Math.min(vaultCapacity, data.vaultValue + vaultFill);
          return { ...bus, data: { ...data, vaultValue: newVault } };
        }
        return bus;
      }

      if (bus.type === 'it_company') {
        const data = bus.data as ITData;
        // Deduct employee salaries each hr
        const totalSalaryPerHr = data.employees.reduce((sum, emp) => {
          const role = EMPLOYEE_TYPES.find(r => r.id === emp.roleId);
          return sum + (role?.salary ?? 0);
        }, 0);
        expenses += totalSalaryPerHr * (dt / 3600000);
        return bus;
      }

      if (bus.type === 'football') {
        const data = bus.data as import('../types/game').FootballData;
        // Passive ticket income from stadium
        income += (data.stadiumLevel * 250 * data.ticketPrice) * (dt / 3600000);
        // Player salary drain
        const playerSalaries = data.players.reduce((sum, playerId) => {
          const p = FOOTBALL_PLAYER_TYPES.find(fp => fp.id === playerId);
          return sum + (p?.salary ?? 0);
        }, 0);
        expenses += playerSalaries * (dt / 3600000);
        return bus;
      }

      if (bus.type === 'oil_gas') {
        const data = bus.data as import('../types/game').OilData;
        let totalBarrelsRate = 0;
        data.ownedWells.forEach(wellId => {
          const w = OIL_WELL_TYPES.find(ww => ww.id === wellId);
          if (w) totalBarrelsRate += w.barrelsPerDay;
        });
        const barrelPrice = 80 + (data.refineryLevel * 10);
        income += ((totalBarrelsRate / 24) * barrelPrice) * (dt / 3600000);
        return bus;
      }

      if (bus.type === 'clothing') {
        const data = bus.data as import('../types/game').ClothingData;
        let baseIncome = 0;
        data.ownedCollections.forEach(cId => {
          const c = CLOTHING_COLLECTIONS.find(cc => cc.id === cId);
          if (c) baseIncome += c.incomePerHour;
        });
        let totalMultiplier = 1;
        data.ownedStores.forEach(sId => {
          const s = CLOTHING_STORES_DATA.find(ss => ss.id === sId);
          if (s) totalMultiplier += s.incomeMultiplier;
        });
        income += (baseIncome * totalMultiplier) * (dt / 3600000);
        return bus;
      }

      if (bus.type === 'space') {
        const data = bus.data as import('../types/game').SpaceData;
        income += (data.satellites * 150_000) * (dt / 3600000);
        return bus;
      }

      // Auto-refresh dealership market each hour
      if (bus.type === 'car_dealership') {
        const data = bus.data as CarDealershipData;
        if (now - data.lastMarketRefreshAt > 3600000) {
          return { ...bus, data: { ...data, market: generateMarketCars(), lastMarketRefreshAt: now } };
        }
      }

      // Construction is manual collect — no passive here
      return bus;
    });

    // Property rental income
    const nextProperties = state.properties.map(prop => {
      if (prop.owned && prop.rentalActive && prop.tenants.length > 0) {
        // Remove expired tenants
        const activeTenants = prop.tenants.filter(t => now < t.leavesAt);
        const rentIncome = activeTenants.reduce((s, t) => s + t.rentPerHour, 0) * (dt / 3600000);
        income += rentIncome;
        if (activeTenants.length !== prop.tenants.length) {
          return { ...prop, tenants: activeTenants, rentalActive: activeTenants.length > 0 };
        }
      }
      return prop;
    });

    // 3-hour Dividend Payout
    let dividendPayout = 0;
    let newLastDividendAt = state.lastDividendAt;
    const THREE_HOURS = 3 * 60 * 60 * 1000;
    if (now - state.lastDividendAt >= THREE_HOURS) {
      state.stocks.forEach(s => {
        if (s.sharesOwned > 0) {
          // dividendPerShare is annual yield %, so per 3h payout = (price * yield/100) / (365*8) per share
          dividendPayout += s.sharesOwned * s.currentPrice * (s.dividendPerShare / 100) / (365 * 8);
        }
      });
      newLastDividendAt = now;
      income += dividendPayout;
    }

    // Recalculate incomePerHour based on current dt earnings (annualise the dt window)
    const newIncomePerHour = income > 0 ? (income / (dt / 3600000)) : state.incomePerHour * 0.99;

    // Recalculate netWorth: cash + business assets + stock holdings + crypto + property + luxury
    const stockValue = state.stocks.reduce((s, st) => s + st.sharesOwned * st.currentPrice, 0);
    const cryptoValue = state.crypto.reduce((s, c) => s + c.amountOwned * c.currentPrice, 0);
    const propertyValue = state.properties.reduce((s, p) => p.owned ? s + p.basePurchaseCost : s, 0);
    const luxuryValue = state.luxuryItems.reduce((s, l) => l.owned ? s + l.baseCost : s, 0);
    const newNetWorth = (state.money + income - expenses) + stockValue + cryptoValue + propertyValue + luxuryValue;

    return {
      money: Math.max(0, state.money + income - expenses),
      totalEarned: state.totalEarned + Math.max(0, income),
      netWorth: Math.max(0, newNetWorth),
      incomePerHour: Math.max(0, newIncomePerHour),
      businesses: nextBusinesses,
      properties: nextProperties,
      lastTickAt: now,
      lastDividendAt: newLastDividendAt,
      totalPlayTimeSeconds: state.totalPlayTimeSeconds + (dt / 1000),
    };
  }),

  updateMarketPrices: () => set(state => {
    const nextStocks = state.stocks.map(s => {
      const change = (Math.random() - 0.48) * 0.025; // slight upward bias
      const newPrice = Math.max(0.01, s.currentPrice * (1 + change));
      return {
        ...s,
        previousPrice: s.currentPrice,
        currentPrice: newPrice,
        priceHistory: [...s.priceHistory.slice(-29), newPrice]
      };
    });
    const nextCrypto = state.crypto.map(c => {
      // Respect floor/ceiling if set
      const change = (Math.random() - 0.5) * 0.15;
      let newPrice = Math.max(0.0001, c.currentPrice * (1 + change));
      if (c.priceFloor && newPrice < c.priceFloor) newPrice = c.priceFloor * (1 + Math.random() * 0.02);
      if (c.priceCeiling && newPrice > c.priceCeiling) newPrice = c.priceCeiling * (1 - Math.random() * 0.02);
      return {
        ...c,
        previousPrice: c.currentPrice,
        currentPrice: newPrice,
        priceHistory: [...c.priceHistory.slice(-29), newPrice]
      };
    });
    return { stocks: nextStocks, crypto: nextCrypto };
  }),

}));

