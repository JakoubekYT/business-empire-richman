import { useState, useEffect } from "react";
import type { Business, StoreData } from "../../types/game";
import { useGameStore } from "../../store/gameStore";
import { STORE_PRODUCTS } from "../../data/gameData";
import { formatMoney, formatTimeRemaining } from "../../utils/format";
import { AssetImage } from "../AssetImage";

export function StorePanel({ business }: { business: Business }) {
  const data = business.data as StoreData;
  const { money, buyStoreShelf, buyStoreProduct, restockProduct } = useGameStore();
  const [activeTab, setActiveTab] = useState<"shelves" | "buy">("shelves");
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const int = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(int);
  }, []);

  const totalIncome = data.activeProducts.reduce((sum, ap) => {
    const product = STORE_PRODUCTS.find(p => p.id === ap.productId)!;
    const isOut = (now - ap.restockedAt) / 3600000 >= product.stockHours;
    return sum + (isOut ? 0 : product.incomePerHour);
  }, 0);

  const outOfStockCount = data.activeProducts.filter(ap => {
    const product = STORE_PRODUCTS.find(p => p.id === ap.productId)!;
    return (now - ap.restockedAt) / 3600000 >= product.stockHours;
  }).length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
          <p className="text-slate-400 text-sm">Income / Hour</p>
          <p className="text-xl font-bold text-white">{formatMoney(totalIncome)}</p>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
          <p className="text-slate-400 text-sm">Shelves Used</p>
          <p className="text-xl font-bold text-white">{data.activeProducts.length} / {data.shelves}</p>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
          <p className="text-slate-400 text-sm">Active Products</p>
          <p className="text-xl font-bold text-emerald-400">{data.activeProducts.length - outOfStockCount}</p>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
          <p className="text-slate-400 text-sm">Out of Stock</p>
          <p className="text-xl font-bold text-amber-400">{outOfStockCount}</p>
        </div>
      </div>

      <div className="flex bg-slate-800/50 rounded-lg p-1">
        <button
          onClick={() => setActiveTab("shelves")}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === "shelves" ? "bg-slate-700 text-white shadow-sm" : "text-slate-400 hover:text-white"}`}
        >
          My Shelves
        </button>
        <button
          onClick={() => setActiveTab("buy")}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === "buy" ? "bg-teal-600 text-white shadow-sm" : "text-slate-400 hover:text-white"}`}
        >
          Buy Products
        </button>
      </div>

      {activeTab === "shelves" && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Your Shelves</h3>
          {data.activeProducts.length === 0 ? (
            <p className="text-slate-400 italic">No products on your shelves. Go to the Buy tab.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {data.activeProducts.map((ap, idx) => {
                const product = STORE_PRODUCTS.find(p => p.id === ap.productId)!;
                const msPassed = now - ap.restockedAt;
                const msTotal = product.stockHours * 3600000;
                const outOfStock = msPassed >= msTotal;
                const secondsLeft = Math.max(0, (msTotal - msPassed) / 1000);
                const progress = Math.min(100, (msPassed / msTotal) * 100);

                return (
                  <div key={idx} className={`flex flex-col bg-slate-800 rounded-xl overflow-hidden border ${outOfStock ? 'border-amber-500/50' : 'border-slate-700'}`}>
                    <div className="p-3 flex items-center gap-3 bg-slate-800/80">
                      <AssetImage image={product.image} size={48} className={outOfStock ? "opacity-50 grayscale" : ""} />
                      <div className="flex-1">
                        <h4 className="font-semibold text-white truncate text-sm">{product.name}</h4>
                        <div className="flex justify-between items-center mt-1">
                          <span className={outOfStock ? "text-amber-400 text-xs font-bold uppercase" : "text-emerald-400 text-xs font-medium"}>
                            {outOfStock ? "Needs Restock" : `+${formatMoney(product.incomePerHour)}/hr`}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="px-3 pb-3">
                      <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden mb-1">
                        <div 
                          className={`h-full ${outOfStock ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                          style={{ width: `${100 - progress}%` }} 
                        />
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>Stock Remaining</span>
                        <span>{outOfStock ? "0s" : formatTimeRemaining(secondsLeft)}</span>
                      </div>
                      
                      {outOfStock && (
                        <button
                          onClick={() => restockProduct(business.id, idx)}
                          disabled={money < product.restockCost}
                          className="mt-3 w-full py-1.5 text-xs bg-amber-600 hover:bg-amber-500 disabled:bg-slate-700 text-white font-bold rounded shadow-lg transition-colors"
                        >
                          Restock for {formatMoney(product.restockCost)}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-slate-800">
            <h3 className="text-lg font-semibold text-white mb-2">Buy More Shelf Units</h3>
            <p className="text-slate-400 text-sm mb-4">Each shelf allows you to stock one product type.</p>
            <button
              onClick={() => buyStoreShelf(business.id)}
              disabled={money < (data.shelves + 1) * 1500 || data.shelves >= 20}
              className="w-full sm:w-auto px-6 py-3 rounded-lg bg-teal-600 hover:bg-teal-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold transition-colors"
            >
              Buy New Shelf ({formatMoney((data.shelves + 1) * 1500)})
            </button>
          </div>
        </div>
      )}

      {activeTab === "buy" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-slate-800/50 p-3 rounded-lg border border-slate-700 mb-4">
            <span className="text-slate-300">Free Shelves Available:</span>
            <span className="text-xl font-bold text-white">
              {data.shelves - data.activeProducts.length}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {STORE_PRODUCTS.map(product => (
              <div key={product.id} className="flex flex-col bg-slate-800 rounded-xl overflow-hidden border border-slate-700 p-4">
                <div className="flex gap-4">
                  <AssetImage image={product.image} size={64} />
                  <div>
                    <h4 className="font-semibold text-white">{product.name}</h4>
                    <p className="text-emerald-400 text-sm font-medium mt-1">Earns: {formatMoney(product.incomePerHour)}/hr</p>
                  </div>
                </div>
                
                <div className="mt-4 bg-slate-900/50 p-3 rounded-lg text-xs space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Stock lasts:</span>
                    <span className="text-slate-200">{product.stockHours} hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Restock cost:</span>
                    <span className="text-slate-200">{formatMoney(product.restockCost)}</span>
                  </div>
                </div>
                
                <button
                  onClick={() => buyStoreProduct(business.id, product.id)}
                  disabled={money < product.shelfCost || data.activeProducts.length >= data.shelves}
                  className="mt-auto w-full py-2 bg-teal-600 hover:bg-teal-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-semibold rounded-lg transition-colors"
                >
                  Setup for {formatMoney(product.shelfCost)}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
