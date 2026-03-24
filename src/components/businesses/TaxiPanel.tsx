import { useState } from "react";
import type { Business, TaxiData } from "../../types/game";
import { useGameStore } from "../../store/gameStore";
import { TAXI_CAR_MODELS, TAXI_SLOT_PACKAGES } from "../../data/gameData";
import { formatMoney, formatKm } from "../../utils/format";
import { AssetImage } from "../AssetImage";

export function TaxiPanel({ business }: { business: Business }) {
  const data = business.data as TaxiData;
  const { money, buyTaxiSlots, buyTaxiCar, scrapTaxiCar } = useGameStore();
  const [activeTab, setActiveTab] = useState<"fleet" | "buy">("fleet");

  const totalIncome = data.ownedCars
    .filter(c => !c.broken)
    .reduce((sum, car) => sum + TAXI_CAR_MODELS.find(m => m.id === car.modelId)!.incomePerHour, 0);

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
          <p className="text-slate-400 text-sm">Income / Hour</p>
          <p className="text-xl font-bold text-white">{formatMoney(totalIncome)}</p>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
          <p className="text-slate-400 text-sm">Fleet Size</p>
          <p className="text-xl font-bold text-white">{data.ownedCars.length} / {data.parkingSlots.length}</p>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
          <p className="text-slate-400 text-sm">Active Cars</p>
          <p className="text-xl font-bold text-green-400">{data.ownedCars.filter(c => !c.broken).length}</p>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
          <p className="text-slate-400 text-sm">Broken Cars</p>
          <p className="text-xl font-bold text-red-400">{data.ownedCars.filter(c => c.broken).length}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-800/50 rounded-lg p-1">
        <button
          onClick={() => setActiveTab("fleet")}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === "fleet" ? "bg-slate-700 text-white shadow-sm" : "text-slate-400 hover:text-white"}`}
        >
          My Fleet
        </button>
        <button
          onClick={() => setActiveTab("buy")}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === "buy" ? "bg-emerald-600 text-white shadow-sm" : "text-slate-400 hover:text-white"}`}
        >
          Buy Vehicles
        </button>
      </div>

      {activeTab === "fleet" && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Your Vehicles</h3>
          {data.ownedCars.length === 0 ? (
            <p className="text-slate-400 italic">No cars in your fleet yet. Go to the Buy tab to get some.</p>
          ) : (
            <div className="space-y-3">
              {data.ownedCars.map(car => {
                const model = TAXI_CAR_MODELS.find(m => m.id === car.modelId)!;
                const progress = Math.min(100, (car.currentKm / model.maxKm) * 100);
                
                return (
                  <div key={car.id} className={`flex bg-slate-800 rounded-xl overflow-hidden border ${car.broken ? 'border-red-500/50' : 'border-slate-700'}`}>
                    <div className="p-3 shrink-0">
                      <AssetImage image={model.image} size={64} className={car.broken ? "opacity-50 grayscale" : ""} />
                    </div>
                    <div className="flex-1 p-3 flex flex-col justify-center">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-semibold text-white">{model.name}</h4>
                        {car.broken ? (
                          <span className="text-red-400 text-xs font-bold uppercase px-2 py-0.5 bg-red-400/10 rounded">Broken</span>
                        ) : (
                          <span className="text-emerald-400 text-sm font-medium">+{formatMoney(model.incomePerHour)}/hr</span>
                        )}
                      </div>
                      
                      <div className="mt-2 space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className={car.broken ? "text-red-400" : "text-slate-400"}>Mileage</span>
                          <span className="text-slate-300">{formatKm(car.currentKm)} / {formatKm(model.maxKm)}</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${car.broken ? 'bg-red-500' : progress > 80 ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                            style={{ width: `${progress}%` }} 
                          />
                        </div>
                      </div>
                    </div>
                    {car.broken && (
                      <div className="flex items-center justify-center p-4 border-l border-slate-700 bg-red-500/10">
                        <button
                          onClick={() => scrapTaxiCar(business.id, car.id)}
                          className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-bold rounded-lg shadow-lg"
                        >
                          Scrap
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-slate-800">
            <h3 className="text-lg font-semibold text-white mb-4">Buy Parking Slots</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {TAXI_SLOT_PACKAGES.map((pkg, idx) => (
                <button
                  key={idx}
                  onClick={() => buyTaxiSlots(business.id, idx)}
                  disabled={money < pkg.cost}
                  className="flex justify-between items-center p-3 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <span className="text-slate-200">+{pkg.slots} Slots</span>
                  <span className={money >= pkg.cost ? "text-emerald-400 font-medium" : "text-red-400 font-medium"}>
                    {formatMoney(pkg.cost)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "buy" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-slate-800/50 p-3 rounded-lg border border-slate-700 mb-4">
            <span className="text-slate-300">Available Parking Slots:</span>
            <span className="text-xl font-bold text-white">
              {data.parkingSlots.length - data.ownedCars.filter(c => !c.broken).length}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {TAXI_CAR_MODELS.map(model => (
              <div key={model.id} className="flex bg-slate-800 rounded-xl overflow-hidden border border-slate-700">
                <div className="p-3">
                  <AssetImage image={model.image} size={80} />
                </div>
                <div className="flex-1 p-3 flex flex-col justify-between">
                  <div>
                    <h4 className="font-semibold text-white">{model.name}</h4>
                    <p className="text-slate-400 text-sm mt-1">Earns: <span className="text-emerald-400">{formatMoney(model.incomePerHour)}/hr</span></p>
                    <p className="text-slate-400 text-xs mt-0.5">Max lifespan: {formatKm(model.maxKm)}</p>
                  </div>
                  <button
                    onClick={() => buyTaxiCar(business.id, model.id)}
                    disabled={money < model.cost || (data.parkingSlots.length - data.ownedCars.filter(c => !c.broken).length) <= 0}
                    className="mt-2 w-full py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-semibold rounded-lg transition-colors"
                  >
                    Buy for {formatMoney(model.cost)}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
