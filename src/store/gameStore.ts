import { create } from "zustand";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import type { GameState, Stock, CryptoCoin } from "../types/game";
import {
  INITIAL_BUSINESSES,
  INITIAL_PROPERTIES,
  INITIAL_STOCKS,
  INITIAL_CRYPTO,
  INITIAL_LUXURY_ITEMS,
  INITIAL_ACHIEVEMENTS,
  INITIAL_DAILY_TASKS,
} from "../data/gameData";

function createInitialState(): GameState {
  return {
    money: 1000,
    totalEarned: 0,
    netWorth: 0,
    incomePerHour: 0,
    clickIncome: 1,
    totalClicks: 0,
    businesses: INITIAL_BUSINESSES.map((b) => ({ ...b })),
    properties: INITIAL_PROPERTIES.map((p) => ({
      ...p,
      improvements: p.improvements.map((i) => ({ ...i })),
    })),
    stocks: INITIAL_STOCKS.map((s) => ({ ...s, priceHistory: [...s.priceHistory] })),
    crypto: INITIAL_CRYPTO.map((c) => ({ ...c, priceHistory: [...c.priceHistory] })),
    luxuryItems: INITIAL_LUXURY_ITEMS.map((l) => ({ ...l })),
    achievements: INITIAL_ACHIEVEMENTS.map((a) => ({ ...a })),
    dailyTasks: INITIAL_DAILY_TASKS.map((t) => ({ ...t, resetDate: new Date().toDateString() })),
    lastSaved: Date.now(),
    lastOnline: Date.now(),
    prestigeLevel: 0,
    prestigeBonus: 1,
    activeBoosts: [],
    dayStarted: new Date().toDateString(),
    totalPlayTimeSeconds: 0,
  };
}

function calculateIncomePerHour(state: GameState): number {
  const businessIncome = state.businesses.reduce((sum, b) => {
    if (!b.owned) return sum;
    return sum + b.incomePerHour * b.level;
  }, 0);
  const propertyIncome = state.properties.reduce((sum, p) => {
    if (!p.owned) return sum;
    const improvementBonus = p.improvements.reduce((ib, imp) => (imp.purchased ? ib + imp.incomeBonus : ib), 0);
    return sum + p.baseIncomePerHour + improvementBonus;
  }, 0);
  const stockDividends = state.stocks.reduce((sum, s) => {
    return sum + s.sharesOwned * s.dividendPerShare * 1000;
  }, 0);
  return (businessIncome + propertyIncome + stockDividends) * state.prestigeBonus;
}

function calculateNetWorth(state: GameState): number {
  const luxuryWorth = state.luxuryItems.reduce((sum, l) => (l.owned ? sum + l.netWorthBoost : sum), 0);
  const propertyWorth = state.properties.reduce((sum, p) => (p.owned ? sum + p.purchaseCost : sum), 0);
  const stockWorth = state.stocks.reduce((sum, s) => sum + s.sharesOwned * s.currentPrice, 0);
  const cryptoWorth = state.crypto.reduce((sum, c) => sum + c.amountOwned * c.currentPrice, 0);
  return state.money + luxuryWorth + propertyWorth + stockWorth + cryptoWorth;
}

function mergeStateWithDefaults(saved: Partial<GameState>): GameState {
  const defaults = createInitialState();
  return {
    ...defaults,
    ...saved,
    businesses: saved.businesses
      ? defaults.businesses.map((defaultB) => {
          const savedB = saved.businesses!.find((b) => b.id === defaultB.id);
          return savedB ? { ...defaultB, ...savedB } : defaultB;
        })
      : defaults.businesses,
    properties: saved.properties
      ? defaults.properties.map((defaultP) => {
          const savedP = saved.properties!.find((p) => p.id === defaultP.id);
          if (!savedP) return defaultP;
          return {
            ...defaultP,
            ...savedP,
            improvements: defaultP.improvements.map((defaultI) => {
              const savedI = savedP.improvements?.find((i) => i.id === defaultI.id);
              return savedI ? { ...defaultI, ...savedI } : defaultI;
            }),
          };
        })
      : defaults.properties,
    stocks: saved.stocks
      ? defaults.stocks.map((defaultS) => {
          const savedS = saved.stocks!.find((s) => s.ticker === defaultS.ticker);
          return savedS ? { ...defaultS, ...savedS, priceHistory: savedS.priceHistory ?? defaultS.priceHistory } : defaultS;
        })
      : defaults.stocks,
    crypto: saved.crypto
      ? defaults.crypto.map((defaultC) => {
          const savedC = saved.crypto!.find((c) => c.id === defaultC.id);
          return savedC ? { ...defaultC, ...savedC, priceHistory: savedC.priceHistory ?? defaultC.priceHistory } : defaultC;
        })
      : defaults.crypto,
    luxuryItems: saved.luxuryItems
      ? defaults.luxuryItems.map((defaultL) => {
          const savedL = saved.luxuryItems!.find((l) => l.id === defaultL.id);
          return savedL ? { ...defaultL, ...savedL } : defaultL;
        })
      : defaults.luxuryItems,
    achievements: saved.achievements
      ? defaults.achievements.map((defaultA) => {
          const savedA = saved.achievements!.find((a) => a.id === defaultA.id);
          return savedA ? { ...defaultA, ...savedA } : defaultA;
        })
      : defaults.achievements,
    dailyTasks: saved.dailyTasks
      ? (() => {
          const today = new Date().toDateString();
          return defaults.dailyTasks.map((defaultT) => {
            const savedT = saved.dailyTasks!.find((t) => t.id === defaultT.id);
            if (!savedT || savedT.resetDate !== today) {
              return { ...defaultT, resetDate: today };
            }
            return { ...defaultT, ...savedT };
          });
        })()
      : defaults.dailyTasks,
  };
}

interface GameStore extends GameState {
  uid: string | null;
  setUid: (uid: string | null) => void;
  loadGame: (uid: string) => Promise<void>;
  saveGame: () => Promise<void>;
  addMoney: (amount: number) => void;
  click: () => void;
  buyBusiness: (id: string) => void;
  upgradeBusiness: (id: string) => void;
  buyProperty: (id: string) => void;
  buyImprovement: (propertyId: string, improvementId: string) => void;
  buyShares: (ticker: string, amount: number) => void;
  sellShares: (ticker: string, amount: number) => void;
  buyCrypto: (coinId: string, amount: number) => void;
  sellCrypto: (coinId: string, amount: number) => void;
  buyLuxury: (id: string) => void;
  claimAchievement: (id: string) => void;
  claimDailyTask: (id: string) => void;
  tick: (deltaSeconds: number) => void;
  updateMarketPrices: () => void;
  prestige: () => void;
  applyOfflineEarnings: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  uid: null,
  ...createInitialState(),

  setUid: (uid) => set({ uid }),

  loadGame: async (uid: string) => {
    try {
      const docRef = doc(db, "users", uid, "game", "state");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const savedData = docSnap.data() as Partial<GameState>;
        const mergedState = mergeStateWithDefaults(savedData);
        // Apply offline earnings
        const now = Date.now();
        const offlineSeconds = Math.min((now - (mergedState.lastOnline || now)) / 1000, 86400); // max 24h
        const offlineEarnings = (mergedState.incomePerHour / 3600) * offlineSeconds;
        set({
          ...mergedState,
          money: mergedState.money + offlineEarnings,
          totalEarned: mergedState.totalEarned + offlineEarnings,
          lastOnline: now,
          uid,
        });
      } else {
        const fresh = createInitialState();
        set({ ...fresh, uid, lastOnline: Date.now() });
      }
    } catch (err) {
      console.error("Failed to load game:", err);
      set({ uid });
    }
  },

  saveGame: async () => {
    const state = get();
    if (!state.uid) return;
    try {
      const incomePerHour = calculateIncomePerHour(state);
      const netWorth = calculateNetWorth(state);
      const saveData: GameState = {
        money: state.money,
        totalEarned: state.totalEarned,
        netWorth,
        incomePerHour,
        clickIncome: state.clickIncome,
        totalClicks: state.totalClicks,
        businesses: state.businesses,
        properties: state.properties,
        stocks: state.stocks,
        crypto: state.crypto,
        luxuryItems: state.luxuryItems,
        achievements: state.achievements,
        dailyTasks: state.dailyTasks,
        lastSaved: Date.now(),
        lastOnline: Date.now(),
        prestigeLevel: state.prestigeLevel,
        prestigeBonus: state.prestigeBonus,
        activeBoosts: state.activeBoosts,
        dayStarted: state.dayStarted,
        totalPlayTimeSeconds: state.totalPlayTimeSeconds,
      };
      const docRef = doc(db, "users", state.uid, "game", "state");
      await setDoc(docRef, saveData);
      // Update leaderboard entry
      const lbRef = doc(db, "leaderboard", state.uid);
      await setDoc(lbRef, { netWorth, uid: state.uid, updatedAt: Date.now() }, { merge: true });
    } catch (err) {
      console.error("Failed to save game:", err);
    }
  },

  addMoney: (amount) =>
    set((state) => {
      const newTotal = state.totalEarned + amount;
      const achievements = state.achievements.map((a) => {
        if (a.category === "WEALTH" && !a.completed) {
          const progress = Math.min(newTotal, a.target);
          return { ...a, progress, completed: progress >= a.target };
        }
        return a;
      });
      return { money: state.money + amount, totalEarned: newTotal, achievements };
    }),

  click: () => {
    const state = get();
    const boostMultiplier = state.activeBoosts.reduce((m, b) => (Date.now() < b.expiresAt ? m * b.multiplier : m), 1);
    const earned = state.clickIncome * boostMultiplier * state.prestigeBonus;
    const newClicks = state.totalClicks + 1;
    const dailyTasks = state.dailyTasks.map((t) =>
      t.id === "click_task" && !t.completed
        ? { ...t, progress: Math.min(t.progress + 1, t.target), completed: t.progress + 1 >= t.target }
        : t
    );
    const achievements = state.achievements.map((a) => {
      if (a.id === "click_master") {
        const progress = Math.min(newClicks, a.target);
        return { ...a, progress, completed: progress >= a.target };
      }
      return a;
    });
    set((s) => ({
      money: s.money + earned,
      totalEarned: s.totalEarned + earned,
      totalClicks: newClicks,
      dailyTasks,
      achievements,
    }));
  },

  buyBusiness: (id) => {
    const state = get();
    const business = state.businesses.find((b) => b.id === id);
    if (!business || business.owned || state.money < business.unlockCost) return;
    const businesses = state.businesses.map((b) =>
      b.id === id ? { ...b, owned: true, level: 1 } : b
    );
    const ownedCount = businesses.filter((b) => b.owned).length;
    const achievements = state.achievements.map((a) => {
      if (a.category === "BUSINESS" && !a.completed) {
        const progress = Math.min(ownedCount, a.target);
        return { ...a, progress, completed: progress >= a.target };
      }
      return a;
    });
    set((s) => ({
      money: s.money - business.unlockCost,
      businesses,
      achievements,
      clickIncome: s.clickIncome + 1,
    }));
  },

  upgradeBusiness: (id) => {
    const state = get();
    const business = state.businesses.find((b) => b.id === id);
    if (!business || !business.owned || business.level >= business.maxLevel) return;
    const cost = Math.floor(business.upgradeCost * Math.pow(1.5, business.level));
    if (state.money < cost) return;
    const businesses = state.businesses.map((b) =>
      b.id === id
        ? {
            ...b,
            level: b.level + 1,
            upgradeCost: Math.floor(b.upgradeCost * 1.5),
          }
        : b
    );
    const upgrades = (state.dailyTasks.find((t) => t.id === "upgrade_task")?.progress ?? 0) + 1;
    const dailyTasks = state.dailyTasks.map((t) =>
      t.id === "upgrade_task" && !t.completed
        ? { ...t, progress: Math.min(upgrades, t.target), completed: upgrades >= t.target }
        : t
    );
    set((s) => ({
      money: s.money - cost,
      businesses,
      dailyTasks,
    }));
  },

  buyProperty: (id) => {
    const state = get();
    const property = state.properties.find((p) => p.id === id);
    if (!property || property.owned || state.money < property.purchaseCost) return;
    const properties = state.properties.map((p) => (p.id === id ? { ...p, owned: true } : p));
    const achievements = state.achievements.map((a) => {
      if (a.id === "first_property" && !a.completed) {
        return { ...a, progress: 1, completed: true };
      }
      return a;
    });
    set((s) => ({
      money: s.money - property.purchaseCost,
      properties,
      achievements,
    }));
  },

  buyImprovement: (propertyId, improvementId) => {
    const state = get();
    const property = state.properties.find((p) => p.id === propertyId);
    if (!property || !property.owned) return;
    const improvement = property.improvements.find((i) => i.id === improvementId);
    if (!improvement || improvement.purchased || state.money < improvement.cost) return;
    const properties = state.properties.map((p) =>
      p.id === propertyId
        ? {
            ...p,
            improvements: p.improvements.map((i) =>
              i.id === improvementId ? { ...i, purchased: true } : i
            ),
          }
        : p
    );
    set((s) => ({ money: s.money - improvement.cost, properties }));
  },

  buyShares: (ticker, amount) => {
    const state = get();
    const stock = state.stocks.find((s) => s.ticker === ticker);
    if (!stock) return;
    const totalCost = stock.currentPrice * amount;
    if (state.money < totalCost) return;
    const stocks = state.stocks.map((s) =>
      s.ticker === ticker ? { ...s, sharesOwned: s.sharesOwned + amount } : s
    );
    const achievements = state.achievements.map((a) => {
      if (a.id === "first_stock" && !a.completed) return { ...a, progress: 1, completed: true };
      return a;
    });
    const dailyTasks = state.dailyTasks.map((t) =>
      t.id === "stock_task" && !t.completed
        ? { ...t, progress: Math.min(t.progress + amount, t.target), completed: t.progress + amount >= t.target }
        : t
    );
    set((s) => ({ money: s.money - totalCost, stocks, achievements, dailyTasks }));
  },

  sellShares: (ticker, amount) => {
    const state = get();
    const stock = state.stocks.find((s) => s.ticker === ticker);
    if (!stock || stock.sharesOwned < amount) return;
    const proceeds = stock.currentPrice * amount;
    const stocks = state.stocks.map((s) =>
      s.ticker === ticker ? { ...s, sharesOwned: Math.max(0, s.sharesOwned - amount) } : s
    );
    set((s) => ({ money: s.money + proceeds, totalEarned: s.totalEarned + proceeds, stocks }));
  },

  buyCrypto: (coinId, amount) => {
    const state = get();
    const coin = state.crypto.find((c) => c.id === coinId);
    if (!coin) return;
    const totalCost = coin.currentPrice * amount;
    if (state.money < totalCost) return;
    const crypto = state.crypto.map((c) =>
      c.id === coinId ? { ...c, amountOwned: c.amountOwned + amount } : c
    );
    const achievements = state.achievements.map((a) => {
      if (a.id === "first_crypto" && !a.completed) return { ...a, progress: 1, completed: true };
      return a;
    });
    const dailyTasks = state.dailyTasks.map((t) =>
      t.id === "crypto_task" && !t.completed
        ? { ...t, progress: Math.min(t.progress + 1, t.target), completed: true }
        : t
    );
    set((s) => ({ money: s.money - totalCost, crypto, achievements, dailyTasks }));
  },

  sellCrypto: (coinId, amount) => {
    const state = get();
    const coin = state.crypto.find((c) => c.id === coinId);
    if (!coin || coin.amountOwned < amount) return;
    const proceeds = coin.currentPrice * amount;
    const crypto = state.crypto.map((c) =>
      c.id === coinId ? { ...c, amountOwned: Math.max(0, c.amountOwned - amount) } : c
    );
    set((s) => ({ money: s.money + proceeds, totalEarned: s.totalEarned + proceeds, crypto }));
  },

  buyLuxury: (id) => {
    const state = get();
    const item = state.luxuryItems.find((l) => l.id === id);
    if (!item || item.owned) return;
    if (item.costCurrency === "crypto" && item.cryptoCoinId) {
      const coin = state.crypto.find((c) => c.id === item.cryptoCoinId);
      if (!coin || coin.amountOwned < (item.cryptoAmount ?? 0)) return;
      const crypto = state.crypto.map((c) =>
        c.id === item.cryptoCoinId ? { ...c, amountOwned: c.amountOwned - (item.cryptoAmount ?? 0) } : c
      );
      const luxuryItems = state.luxuryItems.map((l) => (l.id === id ? { ...l, owned: true } : l));
      set({ crypto, luxuryItems });
    } else {
      if (state.money < item.cost) return;
      const luxuryItems = state.luxuryItems.map((l) => (l.id === id ? { ...l, owned: true } : l));
      const achievements = state.achievements.map((a) => {
        if ((a.id === "first_car" && item.category === "CARS") || (a.id === "first_jet" && item.category === "AVIATION")) {
          return { ...a, progress: 1, completed: true };
        }
        return a;
      });
      set((s) => ({ money: s.money - item.cost, luxuryItems, achievements }));
    }
  },

  claimAchievement: (id) => {
    const state = get();
    const achievement = state.achievements.find((a) => a.id === id);
    if (!achievement || !achievement.completed || achievement.claimed) return;
    const achievements = state.achievements.map((a) => (a.id === id ? { ...a, claimed: true } : a));
    set((s) => ({ money: s.money + achievement.reward, totalEarned: s.totalEarned + achievement.reward, achievements }));
  },

  claimDailyTask: (id) => {
    const state = get();
    const task = state.dailyTasks.find((t) => t.id === id);
    if (!task || !task.completed || task.claimed) return;
    const dailyTasks = state.dailyTasks.map((t) => (t.id === id ? { ...t, claimed: true } : t));
    set((s) => ({ money: s.money + task.reward, totalEarned: s.totalEarned + task.reward, dailyTasks }));
  },

  tick: (deltaSeconds) => {
    const state = get();
    const incomePerHour = calculateIncomePerHour(state);
    const earned = (incomePerHour / 3600) * deltaSeconds;
    const netWorth = calculateNetWorth(state);
    if (earned <= 0) {
      set({ incomePerHour, netWorth, totalPlayTimeSeconds: state.totalPlayTimeSeconds + deltaSeconds });
      return;
    }
    const newTotal = state.totalEarned + earned;
    const achievements = state.achievements.map((a) => {
      if (a.category === "WEALTH" && !a.completed) {
        const progress = Math.min(newTotal, a.target);
        return { ...a, progress, completed: progress >= a.target };
      }
      return a;
    });
    const dailyEarnTask = state.dailyTasks.map((t) =>
      t.id === "earn_task" && !t.completed
        ? { ...t, progress: Math.min(t.progress + earned, t.target), completed: t.progress + earned >= t.target }
        : t
    );
    set({
      money: state.money + earned,
      totalEarned: newTotal,
      incomePerHour,
      netWorth,
      achievements,
      dailyTasks: dailyEarnTask,
      totalPlayTimeSeconds: state.totalPlayTimeSeconds + deltaSeconds,
    });
  },

  updateMarketPrices: () => {
    set((state) => {
      const volatilityMap = { LOW: 0.005, MEDIUM: 0.015, HIGH: 0.04, EXTREME: 0.12 };
      const stocks: Stock[] = state.stocks.map((s) => {
        const change = (Math.random() - 0.48) * s.currentPrice * 0.02;
        const newPrice = Math.max(s.currentPrice * 0.5, s.currentPrice + change);
        const history = [...s.priceHistory.slice(-29), newPrice];
        return { ...s, previousPrice: s.currentPrice, currentPrice: Math.round(newPrice * 100) / 100, priceHistory: history };
      });
      const crypto: CryptoCoin[] = state.crypto.map((c) => {
        const vol = volatilityMap[c.volatility];
        const change = (Math.random() - 0.48) * c.currentPrice * vol;
        const newPrice = Math.max(c.currentPrice * 0.1, c.currentPrice + change);
        const history = [...c.priceHistory.slice(-29), newPrice];
        return { ...c, previousPrice: c.currentPrice, currentPrice: Math.round(newPrice * 1000) / 1000, priceHistory: history };
      });
      return { stocks, crypto };
    });
  },

  prestige: () => {
    const state = get();
    if (state.totalEarned < 1000000000) return; // Require 1B total earned
    const newPrestigeLevel = state.prestigeLevel + 1;
    const newBonus = 1 + newPrestigeLevel * 0.1;
    const fresh = createInitialState();
    set({
      ...fresh,
      money: 1000,
      uid: state.uid,
      prestigeLevel: newPrestigeLevel,
      prestigeBonus: newBonus,
    });
  },

  applyOfflineEarnings: () => {
    // Applied on load from loadGame
  },
}));
