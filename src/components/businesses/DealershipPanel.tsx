import { useState, useEffect } from "react";
import type { Business, CarDealershipData } from "../../types/game";
import { useGameStore } from "../../store/gameStore";
import { DEALER_CAR_MODELS } from "../../data/gameData";
import { formatMoney, formatTimeRemaining } from "../../utils/format";
import { AssetImage } from "../AssetImage";

export function DealershipPanel({ business }: { business: Business }) {
  const data = business.data as CarDealershipData;
  const { money, buyMechanic, refreshDealerMarket, buyDealerCar, startDealerRepair, finishDealerRepair, sellDealerCar } = useGameStore();
  const [activeTab, setActiveTab] = useState<"market" | "inventory">("market");
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const int = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(int);
  }, []);

  const idleMechanics = data.mechanicsOwned - data.inventory.filter(c => c.activeRepairIndex !== null).length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
          <p className="text-slate-400 text-sm">Mechanics</p>
          <p className="text-xl font-bold text-white">{data.mechanicsOwned} / {data.mechanicSlots}</p>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
          <p className="text-slate-400 text-sm">Idle Mechanics</p>
          <p className="text-xl font-bold text-emerald-400">{idleMechanics}</p>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
          <p className="text-slate-400 text-sm">Cars Owned</p>
          <p className="text-xl font-bold text-white">{data.inventory.filter(c => !c.sold).length}</p>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
          <p className="text-slate-400 text-sm">Active Repairs</p>
          <p className="text-xl font-bold text-amber-400">{data.inventory.filter(c => c.activeRepairIndex !== null).length}</p>
        </div>
      </div>

      <div className="flex bg-slate-800/50 rounded-lg p-1">
        <button
          onClick={() => setActiveTab("market")}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === "market" ? "bg-purple-600 text-white shadow-sm" : "text-slate-400 hover:text-white"}`}
        >
          Car Market
        </button>
        <button
          onClick={() => setActiveTab("inventory")}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === "inventory" ? "bg-slate-700 text-white shadow-sm" : "text-slate-400 hover:text-white"}`}
        >
          My Garage
        </button>
      </div>

      {activeTab === "market" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">Auctions & Listings</h3>
            <button
              onClick={() => refreshDealerMarket(business.id)}
              disabled={money < 5000}
              className="px-4 py-1.5 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white rounded text-sm transition-colors"
            >
              Refresh Market ($5,000)
            </button>
          </div>

          <div className="grid grid-cols-1 overflow-x-auto pb-4 gap-4">
            {data.market.map((car, idx) => {
              const model = DEALER_CAR_MODELS.find(m => m.id === car.modelId)!;
              return (
                <div key={idx} className="flex flex-col md:flex-row bg-slate-800 rounded-xl overflow-hidden border border-slate-700">
                  <div className="p-4 bg-slate-900/40 md:w-1/3 flex flex-col justify-center border-b md:border-b-0 md:border-r border-slate-700">
                    <AssetImage image={model.image} size={100} className="mx-auto mb-3" />
                    <h4 className="font-bold text-white text-center">{model.name}</h4>
                    <p className="text-purple-400 font-medium text-center text-lg">{formatMoney(car.buyPrice)}</p>
                    <p className="text-slate-500 text-xs text-center mt-1">Pot. Sale: {formatMoney(model.maxSalePrice)}</p>
                  </div>
                  
                  <div className="p-4 md:w-2/3 flex flex-col justify-between">
                    <div>
                      <p className="text-slate-300 text-sm font-medium mb-2">Known Issues:</p>
                      <div className="flex gap-2 flex-wrap mb-4">
                        {car.issues.map((issue, i) => (
                          <div key={i} className="flex flex-col px-3 py-1.5 bg-slate-900/50 rounded border border-red-500/30">
                            <span className="text-red-400 text-xs font-bold uppercase">{issue.type}</span>
                            <span className="text-slate-400 text-xs">Est: {formatMoney(issue.repairCost)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => buyDealerCar(business.id, car.id)}
                      disabled={money < car.buyPrice}
                      className="w-full py-2 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold rounded-lg transition-colors"
                    >
                      Buy Vehicle
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800">
            <h3 className="text-lg font-semibold text-white mb-2">Hire Mechanics</h3>
            <p className="text-slate-400 text-sm mb-4">Mechanics are needed to repair car issues simultaneously.</p>
            <button
              onClick={() => buyMechanic(business.id)}
              disabled={money < (data.mechanicsOwned + 1) * 15000 || data.mechanicsOwned >= data.mechanicSlots}
              className="px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold transition-colors"
            >
              Hire Mechanic ({formatMoney((data.mechanicsOwned + 1) * 15000)})
            </button>
          </div>
        </div>
      )}

      {activeTab === "inventory" && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Your Garage</h3>
          {data.inventory.filter(c => !c.sold).length === 0 ? (
            <p className="text-slate-400 italic">No cars in your garage. Buy some from the market.</p>
          ) : (
            <div className="space-y-4">
              {data.inventory.filter(c => !c.sold).map((car) => {
                const model = DEALER_CAR_MODELS.find(m => m.id === car.modelId)!;
                const totalInvested = car.buyPrice + car.issues.filter(i => i.isRepaired || car.activeRepairIndex !== null).reduce((s, i) => s + i.repairCost, 0);
                const penalty = car.issues.reduce((s, i) => i.isRepaired ? s : s + (i.repairCost * 1.5), 0);
                const currentSalePrice = Math.max(car.buyPrice * 0.8, model.maxSalePrice - penalty);
                const allRepaired = car.issues.every(i => i.isRepaired);
                
                return (
                  <div key={car.id} className="flex flex-col bg-slate-800 rounded-xl overflow-hidden border border-slate-700 shadow-xl">
                    <div className="flex bg-slate-900/60 p-4 border-b border-slate-700 gap-4">
                      <AssetImage image={model.image} size={64} />
                      <div className="flex-1">
                        <h4 className="font-bold text-lg text-white">{model.name}</h4>
                        <div className="flex gap-4 mt-1 text-sm">
                          <span className="text-slate-400">Total Invested: <span className="text-white">{formatMoney(totalInvested)}</span></span>
                          <span className="text-slate-400">Current Value: <span className={currentSalePrice > totalInvested ? "text-emerald-400" : "text-amber-400"}>{formatMoney(currentSalePrice)}</span></span>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <button
                          onClick={() => sellDealerCar(business.id, car.id)}
                          disabled={car.activeRepairIndex !== null}
                          className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold rounded-lg shadow-lg"
                        >
                          Sell
                        </button>
                      </div>
                    </div>

                    <div className="p-4">
                      <p className="text-slate-300 text-sm font-medium mb-3">Diagnostic Report (Issues):</p>
                      <div className="space-y-3">
                        {car.issues.map((issue, idx) => {
                          const isBeingRepaired = car.activeRepairIndex === idx;
                          
                          if (isBeingRepaired && car.repairEndsAt) {
                            const remaining = Math.max(0, car.repairEndsAt - now) / 1000;
                            const total = issue.repairTimeSeconds;
                            const progress = 100 - (remaining / total * 100);

                            if (remaining <= 0) {
                              finishDealerRepair(business.id, car.id);
                            }

                            return (
                              <div key={idx} className="flex flex-col p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
                                <div className="flex justify-between items-center text-sm mb-2">
                                  <span className="text-amber-400 font-bold flex items-center gap-2">
                                    <span className="animate-spin text-lg">⚙️</span>
                                    Repairing {issue.type}...
                                  </span>
                                  <span className="text-amber-400 font-mono">{formatTimeRemaining(remaining)}</span>
                                </div>
                                <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                                  <div className="h-full bg-amber-500 transition-all duration-1000" style={{ width: `${progress}%` }} />
                                </div>
                              </div>
                            );
                          }

                          if (issue.isRepaired) {
                            return (
                              <div key={idx} className="flex justify-between items-center p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                                <span className="text-emerald-400 font-bold line-through opacity-70 uppercase text-sm">{issue.type} Fixed</span>
                                <span className="text-emerald-500 text-lg">✓</span>
                              </div>
                            );
                          }

                          return (
                            <div key={idx} className="flex justify-between items-center p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                              <div>
                                <span className="text-red-400 font-bold uppercase text-sm block">{issue.type} Damage</span>
                                <span className="text-slate-400 text-xs">Cost: {formatMoney(issue.repairCost)} — Time: {formatTimeRemaining(issue.repairTimeSeconds)}</span>
                              </div>
                              <button
                                onClick={() => startDealerRepair(business.id, car.id, idx)}
                                disabled={car.activeRepairIndex !== null || idleMechanics === 0 || money < issue.repairCost}
                                className="px-4 py-1.5 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white rounded font-medium text-sm transition-colors"
                              >
                                Fix
                              </button>
                            </div>
                          );
                        })}
                        {allRepaired && (
                          <div className="p-3 bg-emerald-500/20 text-emerald-400 text-center font-bold rounded-lg border border-emerald-500/30">
                            Pristine Condition! Ready for maximum profit.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
