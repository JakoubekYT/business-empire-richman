import type { Business } from "../../types/game";
import { useGameStore } from "../../store/gameStore";
import { CLOTHING_COLLECTIONS, CLOTHING_STORES_DATA } from "../../data/gameData";
import { formatMoney } from "../../utils/format";
import { AssetImage } from "../AssetImage";

export function ClothingPanel({ business }: { business: Business }) {
  const data = business.data as Extract<import("../../types/game").BusinessData, { ownedCollections: string[], ownedStores: string[] }>;
  const { money, designClothingCollection, openClothingStore } = useGameStore();

  let baseIncome = 0n;
  data.ownedCollections.forEach(cId => {
    const c = CLOTHING_COLLECTIONS.find(cc => cc.id === cId);
    if (c) baseIncome += c.incomePerHour;
  });

  let totalMultiplier = 1n;
  data.ownedStores.forEach(sId => {
    const s = CLOTHING_STORES_DATA.find(ss => ss.id === sId);
    if (s) totalMultiplier += BigInt(s.incomeMultiplier);
  });

  const finalIncome = baseIncome * totalMultiplier;

  return (
    <div className="space-y-6">
      <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 text-center">
        <p className="text-slate-400 text-sm tracking-wider uppercase">Global Brand Income</p>
        <p className="text-4xl font-black text-fuchsia-400 mt-2">+{formatMoney(finalIncome)}<span className="text-xl text-fuchsia-600 font-bold">/hr</span></p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
           <span className="text-sm border border-slate-600 bg-slate-800 px-3 py-1 rounded-full text-slate-300 shadow-sm">
             Base: <strong>{formatMoney(baseIncome)}/hr</strong>
           </span>
           <span className="text-sm border border-fuchsia-800 bg-fuchsia-900/30 px-3 py-1 rounded-full text-fuchsia-300 shadow-inner">
             Multiplier: <strong>x{totalMultiplier.toString()}</strong>
           </span>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-white mb-4">Design Collections</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {CLOTHING_COLLECTIONS.map((c) => {
            const owned = data.ownedCollections.includes(c.id);
            return (
              <div key={c.id} className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 flex flex-col group">
                <div className="h-40 bg-slate-900 border-b border-slate-700 relative">
                  <AssetImage image={c.image} size={0} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent pointer-events-none" />
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <h4 className="font-bold text-white text-lg">{c.name}</h4>
                  <p className="text-fuchsia-400 font-medium text-sm mt-1">Base +{formatMoney(c.incomePerHour)}/hr</p>
                  <div className="mt-auto pt-4 relative z-10">
                    <button
                      onClick={() => designClothingCollection(business.id, c.id)}
                      disabled={owned || money < c.designCost}
                      className={`w-full py-2.5 font-bold rounded-lg transition-colors border shadow-md ${
                        owned 
                          ? 'bg-slate-700/50 text-fuchsia-400 border-slate-600 cursor-not-allowed' 
                          : 'bg-fuchsia-600 hover:bg-fuchsia-500 text-white border-fuchsia-500 cursor-pointer'
                      }`}
                    >
                      {owned ? 'Designed' : `Design (${formatMoney(c.designCost)})`}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-white mb-4">Open Stores Worldwide</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {CLOTHING_STORES_DATA.map((s) => {
            const owned = data.ownedStores.includes(s.id);
            return (
              <div key={s.id} className="bg-slate-800 rounded-xl p-4 border border-slate-700 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-white text-md">{s.city}</h4>
                  <p className="text-fuchsia-400 font-bold text-sm mt-1 mb-3 bg-fuchsia-900/40 inline-block px-2 py-0.5 rounded shadow-inner">+ {s.incomeMultiplier} Multiplier</p>
                </div>
                <button
                  onClick={() => openClothingStore(business.id, s.id)}
                  disabled={owned || money < s.cost}
                  className={`w-full py-2 font-bold rounded transition-colors text-xs border ${
                    owned 
                      ? 'bg-slate-700 text-fuchsia-400 border-slate-600 cursor-not-allowed shadow-none' 
                      : 'bg-slate-600 hover:bg-slate-500 text-white border-slate-500 cursor-pointer shadow-md'
                  }`}
                >
                  {owned ? 'Opened' : formatMoney(s.cost)}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
