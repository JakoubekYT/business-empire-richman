import type { Business } from "../../types/game";
import { useGameStore } from "../../store/gameStore";
import { OIL_WELL_TYPES } from "../../data/gameData";
import { formatMoney } from "../../utils/format";
import { AssetImage } from "../AssetImage";

export function OilGasPanel({ business }: { business: Business }) {
  const data = business.data as Extract<import("../../types/game").BusinessData, { ownedWells: string[], refineryLevel: number }>;
  const { money, buyOilWell, upgradeRefinery } = useGameStore();

  const refineryCost = data.refineryLevel * 50_000_000;
  const barrelPrice = 80 + (data.refineryLevel * 10);
  
  let totalBarrelsPerDay = 0;
  data.ownedWells.forEach(wId => {
    const well = OIL_WELL_TYPES.find(w => w.id === wId);
    if (well) totalBarrelsPerDay += well.barrelsPerDay;
  });

  const incomePerHour = (totalBarrelsPerDay / 24) * barrelPrice;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* REFINERY STATS */}
        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
          <p className="text-slate-400 text-sm">Refinery Level</p>
          <div className="flex items-center justify-between mt-1">
            <p className="text-3xl font-bold text-white">Lvl {data.refineryLevel}</p>
            <button
              onClick={() => upgradeRefinery(business.id)}
              disabled={money < refineryCost || data.refineryLevel >= 10}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold rounded-lg transition-colors border border-blue-500 disabled:border-slate-600 shadow-md text-sm cursor-pointer"
            >
              {data.refineryLevel >= 10 ? 'MAX LVL' : `Upgrade (${formatMoney(refineryCost)})`}
            </button>
          </div>
          <div className="mt-4 flex flex-col gap-1 text-sm bg-slate-900/50 p-3 rounded-lg border border-slate-700">
            <div className="flex justify-between text-slate-400">
               <span>Sale Price per Barrel:</span>
               <span className="text-white font-bold">${barrelPrice}</span>
            </div>
            <div className="flex justify-between text-slate-400">
               <span>Total Flow (Barrels/Day):</span>
               <span className="text-white font-bold">{totalBarrelsPerDay.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* OVERALL INCOME */}
        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 flex flex-col justify-center items-center">
          <p className="text-slate-400 text-sm">Combined Production Value</p>
          <p className="text-4xl font-black text-emerald-400 mt-2">+{formatMoney(incomePerHour)}<span className="text-xl text-emerald-600 font-bold">/hr</span></p>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-white mb-4">Global Oil Wells</h3>
        <div className="flex flex-col gap-3">
          {OIL_WELL_TYPES.map((well) => {
            const owned = data.ownedWells.includes(well.id);
            return (
              <div key={well.id} className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 flex flex-col sm:flex-row shadow-lg">
                <div className="w-full sm:w-48 h-32 bg-slate-900 border-b md:border-b-0 border-r border-slate-700">
                  <AssetImage image={well.image} size={0} className="w-full h-full object-cover" />
                </div>
                <div className="p-4 flex-1 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                       <h4 className="font-bold text-white text-lg">{well.name}</h4>
                       <span className="px-2 py-0.5 rounded text-xs font-bold bg-slate-700 text-slate-300 uppercase tracking-wide border border-slate-600">
                         {well.location}
                       </span>
                    </div>
                    <p className="text-slate-400 text-sm mt-1">Flow Rate: <span className="text-blue-400 font-bold">{well.barrelsPerDay.toLocaleString()}</span> bbl/day</p>
                    <p className="text-emerald-400 font-bold text-sm mt-1">
                      Gross: +{formatMoney((well.barrelsPerDay / 24) * barrelPrice)}/hr
                    </p>
                  </div>
                  <div className="w-full sm:w-auto text-right flex flex-col sm:items-end w-full">
                    {owned ? (
                      <div className="px-4 py-2 border-2 border-slate-600 bg-slate-700/50 text-slate-300 font-bold rounded-lg text-center cursor-not-allowed">
                        Acquired
                      </div>
                    ) : (
                      <button
                        onClick={() => buyOilWell(business.id, well.id)}
                        disabled={money < well.cost}
                        className="w-full sm:w-auto px-6 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold rounded-lg transition-colors border border-emerald-500 disabled:border-slate-600 shadow-md cursor-pointer"
                      >
                        Buy ({formatMoney(well.cost)})
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
