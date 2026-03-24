import { useState, useEffect } from "react";
import type { Business, ConstructionData } from "../../types/game";
import { useGameStore } from "../../store/gameStore";
import { CONSTRUCTION_PROJECTS } from "../../data/gameData";
import { formatMoney, formatTimeRemaining } from "../../utils/format";

export function ConstructionPanel({ business }: { business: Business }) {
  const data = business.data as ConstructionData;
  const { money, buyConstructionEquipment, buyConstructionResource, startConstructionProject, collectConstructionProject } = useGameStore();
  const [activeTab, setActiveTab] = useState<"projects" | "active">("projects");
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const int = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(int);
  }, []);

  const usedEquipment = data.activeProjects.reduce((sum, p) => {
    const baseId = p.projectId.split("_")[0];
    const proj = CONSTRUCTION_PROJECTS.find(cp => cp.id === baseId);
    return sum + (proj?.requiredEquipment || 0);
  }, 0);

  const freeEquipment = data.equipmentCount - usedEquipment;

  const handleBuyResource = (type: 'builders' | 'concrete' | 'wood' | 'metal', amount: number, cost: number) => {
    buyConstructionResource(business.id, type, amount, cost);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
          <p className="text-slate-400 text-sm">Equipment</p>
          <div className="flex justify-between items-baseline mt-1">
            <p className="text-xl font-bold text-white">{freeEquipment} <span className="text-sm text-slate-500 font-normal">/ {data.equipmentCount} free</span></p>
          </div>
          <button
            onClick={() => buyConstructionEquipment(business.id)}
            disabled={money < (BigInt(data.equipmentCount) + 1n) * 25000n}
            className="w-full mt-3 py-1.5 bg-orange-600 hover:bg-orange-500 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded text-xs transition-colors"
          >
            Buy +1 ({formatMoney((BigInt(data.equipmentCount) + 1n) * 25000n)})
          </button>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 flex flex-col">
          <p className="text-slate-400 text-sm">Builders</p>
          <p className="text-xl font-bold text-white flex-1 mt-1">{data.resources.builders}</p>
          <button onClick={() => handleBuyResource('builders', 10, 5000)} disabled={money < 5000n} className="w-full py-1.5 mt-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white rounded text-xs transition-colors">Buy 10 ($5K)</button>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 flex flex-col">
          <p className="text-slate-400 text-sm">Concrete <span className="text-xs font-normal">tons</span></p>
          <p className="text-xl font-bold text-white flex-1 mt-1">{data.resources.concrete}</p>
          <button onClick={() => handleBuyResource('concrete', 100, 2000)} disabled={money < 2000n} className="w-full py-1.5 mt-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white rounded text-xs transition-colors">Buy 100 ($2K)</button>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 flex flex-col">
          <p className="text-slate-400 text-sm">Wood <span className="text-xs font-normal">m3</span></p>
          <p className="text-xl font-bold text-white flex-1 mt-1">{data.resources.wood}</p>
          <button onClick={() => handleBuyResource('wood', 100, 1500)} disabled={money < 1500n} className="w-full py-1.5 mt-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white rounded text-xs transition-colors">Buy 100 ($1.5K)</button>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 flex flex-col">
          <p className="text-slate-400 text-sm">Metal <span className="text-xs font-normal">t</span></p>
          <p className="text-xl font-bold text-white flex-1 mt-1">{data.resources.metal}</p>
          <button onClick={() => handleBuyResource('metal', 50, 4000)} disabled={money < 4000n} className="w-full py-1.5 mt-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white rounded text-xs transition-colors">Buy 50 ($4K)</button>
        </div>
      </div>

      <div className="flex bg-slate-800/50 rounded-lg p-1">
        <button
          onClick={() => setActiveTab("projects")}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === "projects" ? "bg-orange-600 text-white shadow-sm" : "text-slate-400 hover:text-white"}`}
        >
          Available Contracts
        </button>
        <button
          onClick={() => setActiveTab("active")}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === "active" ? "bg-slate-700 text-white shadow-sm" : "text-slate-400 hover:text-white"}`}
        >
          Active Projects ({data.activeProjects.length})
        </button>
      </div>

      {activeTab === "projects" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CONSTRUCTION_PROJECTS.map((proj) => {
            const canAfford = 
              data.resources.builders >= proj.requiredBuilders &&
              data.resources.concrete >= proj.requiredConcrete &&
              data.resources.wood >= proj.requiredWood &&
              data.resources.metal >= proj.requiredMetal &&
              freeEquipment >= proj.requiredEquipment;

            return (
              <div key={proj.id} className="flex flex-col bg-slate-800 rounded-xl overflow-hidden border border-slate-700">
                <div className="flex p-4 gap-4 bg-slate-900/60 items-center justify-between border-b border-slate-700">
                  <div>
                    <h4 className="font-bold text-white text-lg">{proj.name}</h4>
                    <p className="text-slate-400 text-sm">{proj.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-orange-400 font-bold text-lg">+{formatMoney(proj.reward)}</p>
                    <p className="text-slate-400 text-sm">⏱️ {formatTimeRemaining(proj.durationSeconds)}</p>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col">
                  <p className="text-slate-300 text-sm font-medium mb-3">Requirements:</p>
                  <div className="grid grid-cols-2 gap-2 mb-6">
                    <div className={`text-xs px-2 py-1 rounded bg-slate-900 ${data.resources.builders >= proj.requiredBuilders ? "text-emerald-400" : "text-red-400"}`}>
                      Builders: {proj.requiredBuilders} ({data.resources.builders})
                    </div>
                    <div className={`text-xs px-2 py-1 rounded bg-slate-900 ${freeEquipment >= proj.requiredEquipment ? "text-emerald-400" : "text-red-400"}`}>
                      Equip: {proj.requiredEquipment} ({freeEquipment})
                    </div>
                    <div className={`text-xs px-2 py-1 rounded bg-slate-900 ${data.resources.concrete >= proj.requiredConcrete ? "text-emerald-400" : "text-red-400"}`}>
                      Concrete: {proj.requiredConcrete} ({data.resources.concrete})
                    </div>
                    <div className={`text-xs px-2 py-1 rounded bg-slate-900 ${data.resources.wood >= proj.requiredWood ? "text-emerald-400" : "text-red-400"}`}>
                      Wood: {proj.requiredWood} ({data.resources.wood})
                    </div>
                    <div className={`text-xs px-2 py-1 rounded bg-slate-900 ${data.resources.metal >= proj.requiredMetal ? "text-emerald-400" : "text-red-400"}`}>
                      Metal: {proj.requiredMetal} ({data.resources.metal})
                    </div>
                  </div>

                  <button
                    onClick={() => startConstructionProject(business.id, proj.id)}
                    disabled={!canAfford}
                    className="w-full mt-auto py-2.5 bg-orange-600 hover:bg-orange-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold rounded-lg transition-colors"
                  >
                    Accept Contract
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === "active" && (
        <div className="space-y-4">
          {data.activeProjects.length === 0 ? (
            <p className="text-slate-400 italic">No active projects right now. Accept a contract to begin building.</p>
          ) : (
            data.activeProjects.map((active) => {
              const baseId = active.projectId.split("_")[0];
              const proj = CONSTRUCTION_PROJECTS.find(p => p.id === baseId)!;
              
              const remaining = Math.max(0, active.endsAt - now) / 1000;
              const total = proj.durationSeconds;
              const progress = 100 - (remaining / total * 100);
              const isDone = remaining <= 0;

              return (
                <div key={active.projectId} className="p-4 bg-slate-800 rounded-xl border border-slate-700 flex flex-col sm:flex-row items-center gap-6">
                  <div className="flex-1 w-full">
                    <div className="flex justify-between mb-2">
                      <h4 className="font-bold text-white text-lg">{proj.name}</h4>
                      {!isDone ? (
                        <span className="text-orange-400 font-mono font-medium">{formatTimeRemaining(remaining)}</span>
                      ) : (
                        <span className="text-emerald-400 font-bold">COMPLETED</span>
                      )}
                    </div>
                    <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden mb-2">
                      <div 
                        className={`h-full transition-all duration-1000 ${isDone ? 'bg-emerald-500' : 'bg-orange-500'}`} 
                        style={{ width: `${Math.min(100, progress)}%` }} 
                      />
                    </div>
                    <p className="text-sm text-slate-400">Reward: <span className="text-emerald-400 font-bold">{formatMoney(proj.reward)}</span></p>
                  </div>
                  
                  <button
                    onClick={() => collectConstructionProject(business.id, active.projectId)}
                    disabled={!isDone}
                    className="w-full sm:w-auto px-8 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold rounded-lg transition-colors min-w-[140px]"
                  >
                    Collect
                  </button>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
