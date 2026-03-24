import { useState } from "react";
import type { Business, BankData } from "../../types/game";
import { useGameStore } from "../../store/gameStore";
import { formatMoney } from "../../utils/format";

export function BankPanel({ business }: { business: Business }) {
  const data = business.data as BankData;
  const { money, setBankRates, upgradeBankVault, collectBankVault } = useGameStore();
  const [depositRate, setLocalDepositRate] = useState(data.depositRate);
  const [loanRate, setLocalLoanRate] = useState(data.loanRate);

  // Sync to store when dragging stops
  const handleRateChange = () => {
    setBankRates(business.id, depositRate, loanRate);
  };

  const vaultCapacity = data.vaultLevel * 50_000_000;
  const vaultPercent = Math.min(100, (data.vaultValue / vaultCapacity) * 100);
  const upgradeCost = data.vaultLevel * 10_000_000;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 flex flex-col items-center justify-center text-center">
          <div className="w-32 h-32 rounded-full border-4 relative flex items-center justify-center mb-4 transition-colors"
               style={{ 
                 borderColor: vaultPercent === 100 ? '#10b981' : '#f59e0b',
                 background: `conic-gradient(${vaultPercent === 100 ? '#10b981' : '#f59e0b'} ${vaultPercent}%, transparent 0)`
               }}>
            <div className="absolute inset-2 bg-slate-900 rounded-full flex flex-col items-center justify-center">
              <span className="text-2xl">🏦</span>
              <span className="text-xs text-slate-400 font-bold mt-1">{vaultPercent.toFixed(1)}%</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">{formatMoney(data.vaultValue)}</h3>
          <p className="text-slate-400 text-sm mb-4">Vault Capacity: {formatMoney(vaultCapacity)}</p>
          
          <button
            onClick={() => collectBankVault(business.id)}
            disabled={data.vaultValue <= 0}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold rounded-lg transition-colors shadow-lg"
          >
            Collect Funds
          </button>
        </div>

        <div className="space-y-4">
          <div className="bg-slate-800/50 p-5 rounded-xl border border-slate-700">
            <h4 className="text-white font-bold mb-4">Vault Level {data.vaultLevel}</h4>
            <p className="text-sm text-slate-400 mb-4">Upgrade vault to increase maximum storage capacity and prevent overflowing.</p>
            <button
              onClick={() => upgradeBankVault(business.id)}
              disabled={money < upgradeCost || data.vaultLevel >= 35}
              className="w-full py-2 bg-amber-600 hover:bg-amber-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold rounded-lg transition-colors"
            >
              Upgrade Vault ({formatMoney(upgradeCost)})
            </button>
          </div>

          <div className="bg-slate-800/50 p-5 rounded-xl border border-slate-700 space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-300 font-medium">Deposit Rate</span>
                <span className="text-emerald-400 font-bold bg-emerald-900/30 px-2 py-0.5 rounded">{depositRate.toFixed(1)}%</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="0.1"
                value={depositRate}
                onChange={(e) => setLocalDepositRate(parseFloat(e.target.value))}
                onMouseUp={handleRateChange}
                onTouchEnd={handleRateChange}
                className="w-full accent-emerald-500"
              />
              <p className="text-xs text-slate-500 mt-1">Higher rate = fills faster, costs more.</p>
            </div>

            <div className="pt-4 border-t border-slate-700">
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-300 font-medium">Loan Rate</span>
                <span className="text-amber-400 font-bold bg-amber-900/30 px-2 py-0.5 rounded">{loanRate.toFixed(1)}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="25"
                step="0.1"
                value={loanRate}
                onChange={(e) => setLocalLoanRate(parseFloat(e.target.value))}
                onMouseUp={handleRateChange}
                onTouchEnd={handleRateChange}
                className="w-full accent-amber-500"
              />
              <p className="text-xs text-slate-500 mt-1">Higher rate = more profit per loan, fills slower.</p>
            </div>
            
            <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700">
              <p className="text-xs text-slate-400 text-center">Net Margin: <span className="text-cyan-400 font-bold">{(loanRate - depositRate).toFixed(1)}%</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
