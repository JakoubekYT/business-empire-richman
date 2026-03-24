import { useState, useEffect } from "react";
import type { Business, SpaceData } from "../../types/game";
import { useGameStore } from "../../store/gameStore";
import { SPACE_MISSIONS, ROCKET_TYPES } from "../../data/gameData";
import { formatMoney } from "../../utils/format";
import { AssetImage } from "../AssetImage";

export function SpacePanel({ business }: { business: Business }) {
  const data = business.data as SpaceData;
  const { money, buyRocket, buySatellite, startSpaceMission, collectSpaceMission } = useGameStore();
  const [, setTick] = useState(0);

  // Force tick every second to update mission timers
  useEffect(() => {
    const int = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(int);
  }, []);

  const satelliteCost = 2_500_000;
  const satelliteIncome = data.satellites * 150_000;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* SATELLITE NETWORK */}
        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 flex flex-col justify-between">
          <div>
            <p className="text-slate-400 text-sm">Deployed Satellite Network</p>
            <div className="flex items-center justify-between mt-1">
              <p className="text-3xl font-bold text-white">{data.satellites} Orbitting</p>
              <button
                onClick={() => buySatellite(business.id)}
                disabled={money < satelliteCost}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold rounded-lg transition-colors border border-indigo-500 disabled:border-slate-600 shadow-md text-sm cursor-pointer"
              >
                Launch (+{formatMoney(satelliteCost)})
              </button>
            </div>
            <p className="text-sm text-slate-400 mt-2">Provides steady, secure passive communications income.</p>
          </div>
          <div className="mt-4 flex justify-between bg-slate-900/40 p-3 rounded-lg border border-slate-700">
             <span className="text-slate-300">Network Revenue:</span>
             <span className="text-emerald-400 font-bold">+{formatMoney(satelliteIncome)}/hr</span>
          </div>
        </div>

        {/* FLEET */}
        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 max-h-48 overflow-y-auto custom-scrollbar">
          <p className="text-slate-400 text-sm mb-2 sticky top-0 bg-slate-800/90 py-1 z-10">Rocket Fleet Procurement</p>
          <div className="flex flex-col gap-2">
            {ROCKET_TYPES.map(r => {
              // Count owned
              const count = data.rockets.filter(id => id === r.id).length;
              return (
                <div key={r.id} className="flex items-center justify-between bg-slate-900 p-2 rounded-lg border border-slate-700">
                  <div className="flex items-center gap-2">
                     <span className="text-white font-semibold text-sm">{r.name}</span>
                     {count > 0 && <span className="bg-indigo-900/50 border border-indigo-700 text-indigo-300 text-xs px-2 py-0.5 rounded-full font-bold">Owned: {count}</span>}
                  </div>
                  <button
                    onClick={() => buyRocket(business.id, r.id)}
                    disabled={money < r.cost}
                    className="text-xs px-3 py-1 bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded text-slate-200 font-bold transition-colors disabled:opacity-50"
                  >
                    Buy {formatMoney(r.cost)}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-white mb-4">Deep Space Missions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {SPACE_MISSIONS.map((mission) => {
            // Check if there is an active instance of this mission
            const activeMission = data.activeMissions.find(m => m.missionId.startsWith(mission.id + "_"));
            const requiredRocket = ROCKET_TYPES.find(r => r.id === mission.requiredRocket);
            
            // Check if player has available rocket of required type
            const totalRocketsOfType = data.rockets.filter(id => id === mission.requiredRocket).length;
            const rocketsBusy = data.activeMissions.filter(m => m.rocketId === mission.requiredRocket).length;
            const availableRockets = totalRocketsOfType - rocketsBusy;

            let statusContent;
            
            if (activeMission) {
               const timeRemaining = Math.max(0, activeMission.endsAt - Date.now());
               const progressPercent = 100 - (timeRemaining / (mission.durationSeconds * 1000)) * 100;

               if (timeRemaining > 0) {
                 const hrs = Math.floor(timeRemaining / 3600000);
                 const mins = Math.floor((timeRemaining % 3600000) / 60000);
                 const secs = Math.floor((timeRemaining % 60000) / 1000);
                 
                 statusContent = (
                   <div className="w-full">
                     <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden mb-2">
                       <div className="h-full bg-indigo-500 transition-all duration-1000 ease-linear" style={{ width: `${progressPercent}%` }} />
                     </div>
                     <button disabled className="w-full py-2 bg-indigo-800/40 text-indigo-300 border border-indigo-700 font-bold rounded-lg cursor-not-allowed">
                       In Transit ({hrs}h {mins}m {secs}s)
                     </button>
                   </div>
                 );
               } else {
                 statusContent = (
                   <button
                     onClick={() => collectSpaceMission(business.id, activeMission.missionId)}
                     className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-900 border border-emerald-500 text-white font-bold rounded-lg transition-colors cursor-pointer animate-pulse"
                   >
                     Collect {formatMoney(mission.reward)}
                   </button>
                 );
               }
            } else {
               statusContent = (
                  <button
                    onClick={() => startSpaceMission(business.id, mission.id, mission.requiredRocket)}
                    disabled={availableRockets <= 0}
                    className={`w-full py-2 font-bold rounded-lg transition-colors border shadow-md ${
                      availableRockets > 0
                        ? 'bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-500 cursor-pointer'
                        : 'bg-slate-700 text-slate-500 border-slate-600 cursor-not-allowed'
                    }`}
                  >
                    Launch Mission
                  </button>
               );
            }

            return (
              <div key={mission.id} className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 flex flex-col group">
                <div className="h-40 bg-slate-900 border-b border-slate-700 relative">
                  <AssetImage image={mission.image} size={0} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute top-2 right-2 bg-slate-900/80 backdrop-blur-md px-2 py-1 rounded text-emerald-400 font-bold text-xs shadow-md border border-slate-600">
                    Reward: {formatMoney(mission.reward)}
                  </div>
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-900 to-transparent p-4 pt-12">
                     <h4 className="font-bold text-white text-lg leading-tight truncate drop-shadow-md">{mission.name}</h4>
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  {/* Reqs */}
                  <div className="mb-4 text-sm bg-slate-900/50 p-3 rounded border border-slate-700">
                    <div className="flex justify-between text-slate-400 mb-1">
                      <span>Requirement:</span>
                      <span className="text-slate-200">{requiredRocket?.name}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Duration:</span>
                      <span className="text-slate-200">{mission.durationSeconds >= 3600 ? `${mission.durationSeconds/3600}h` : `${mission.durationSeconds/60}m`}</span>
                    </div>
                    {!activeMission && (
                       <div className="mt-2 pt-2 border-t border-slate-700 flex justify-between items-center text-xs">
                         <span className={availableRockets > 0 ? 'text-emerald-400' : 'text-red-400'}>Available Rockets: {availableRockets}</span>
                       </div>
                    )}
                  </div>

                  {statusContent}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
