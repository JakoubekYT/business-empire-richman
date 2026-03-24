import type { Business, FactoryData } from "../../types/game";
import { useGameStore } from "../../store/gameStore";
import { FACTORY_PRODUCTS } from "../../data/gameData";
import { formatMoney } from "../../utils/format";
import { AssetImage } from "../AssetImage";

export function FactoryPanel({ business }: { business: Business }) {
  const data = business.data as FactoryData;
  const { money, buyFactoryLine } = useGameStore();

  const totalLines = data.lines.length;
  const maxLines = 10;
  
  const totalIncome = data.lines.reduce((sum, line) => {
    const prod = FACTORY_PRODUCTS.find(p => p.id === line.productId);
    return sum + (prod?.incomePerHour || 0n);
  }, 0n);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
          <p className="text-slate-400 text-sm">Active Production Lines</p>
          <div className="flex items-baseline gap-2 mt-1">
            <p className="text-2xl font-bold text-white">{totalLines}</p>
            <p className="text-slate-500">/ {maxLines} max</p>
          </div>
          <div className="w-full h-2 bg-slate-900 rounded-full mt-3 overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all" 
              style={{ width: `${(totalLines / maxLines) * 100}%` }}
            />
          </div>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
          <p className="text-slate-400 text-sm">Total Factory Output</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1">+{formatMoney(totalIncome)}/hr</p>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-white mb-4">Set Up New Production Line</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FACTORY_PRODUCTS.map((prod) => {
            const linesOfThisProd = data.lines.filter(l => l.productId === prod.id).length;
            return (
              <div key={prod.id} className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 flex flex-col">
                <div className="flex p-4 gap-4 bg-slate-900/40 border-b border-slate-700">
                  <AssetImage image={prod.image} size={64} className="rounded-lg shadow-md" />
                  <div className="flex-1">
                    <h4 className="font-bold text-white text-lg leading-tight">{prod.name}</h4>
                    <p className="text-emerald-400 font-medium text-sm mt-1">+{formatMoney(prod.incomePerHour)}/hr</p>
                  </div>
                  <div className="text-right">
                    <span className="bg-slate-800 px-2 py-1 rounded-md text-slate-300 text-xs font-bold border border-slate-600 shadow-inner">
                      {linesOfThisProd} Active
                    </span>
                  </div>
                </div>
                <div className="p-4 bg-slate-800/80 flex-1 flex flex-col justify-end">
                  <button
                    onClick={() => buyFactoryLine(business.id, prod.id, prod.lineCost)}
                    disabled={money < prod.lineCost || totalLines >= maxLines}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold rounded-lg transition-colors border border-blue-500 disabled:border-slate-600 shadow-lg"
                  >
                    Buy Line ({formatMoney(prod.lineCost)})
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
