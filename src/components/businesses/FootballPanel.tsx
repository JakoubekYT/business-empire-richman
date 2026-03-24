import type { Business, FootballData } from "../../types/game";
import { useGameStore } from "../../store/gameStore";
import { FOOTBALL_PLAYER_TYPES } from "../../data/gameData";
import { formatMoney } from "../../utils/format";
import { AssetImage } from "../AssetImage";

export function FootballPanel({ business }: { business: Business }) {
  const data = business.data as FootballData;
  const { money, buyFootballPlayer, upgradeStadium } = useGameStore();

  const stadiumCost = BigInt(data.stadiumLevel) * 5_000_000n;
  const matchIncome = BigInt(data.stadiumLevel) * 250n * data.ticketPrice;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* STADIUM STATS */}
        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
          <p className="text-slate-400 text-sm">Stadium Level</p>
          <div className="flex items-center justify-between mt-1">
            <p className="text-3xl font-bold text-white">Lvl {data.stadiumLevel}</p>
            <button
              onClick={() => upgradeStadium(business.id)}
              disabled={money < stadiumCost}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold rounded-lg transition-colors border border-purple-500 disabled:border-slate-600 shadow-md text-sm cursor-pointer"
            >
              Upgrade ({formatMoney(stadiumCost)})
            </button>
          </div>
          <div className="mt-4 flex flex-col gap-1">
            <div className="flex justify-between text-xs text-slate-400">
              <span>Ticket Price:</span>
              <span className="text-white">${data.ticketPrice}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-400">
              <span>Est. Passive Match Income:</span>
              <span className="text-emerald-400 font-bold">+{formatMoney(matchIncome)}/hr</span>
            </div>
          </div>
        </div>

        {/* TEAM STATS */}
        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
          <p className="text-slate-400 text-sm">Team Roster</p>
          <p className="text-3xl font-bold text-white mt-1">{data.players.length}</p>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="bg-slate-900/40 p-2 rounded-lg text-center">
              <span className="block text-xs text-slate-400">Wins</span>
              <span className="text-lg font-bold text-emerald-400">{data.wins}</span>
            </div>
            <div className="bg-slate-900/40 p-2 rounded-lg text-center">
              <span className="block text-xs text-slate-400">Losses</span>
              <span className="text-lg font-bold text-red-400">{data.losses}</span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-white mb-4">Transfer Market</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FOOTBALL_PLAYER_TYPES.map((player) => {
            const owned = data.players.includes(player.id);
            return (
              <div key={player.id} className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 flex flex-col relative group">
                <div className="relative w-full aspect-square bg-slate-900">
                  <AssetImage image={player.image} size={0} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute top-2 right-2 bg-emerald-500/80 backdrop-blur-md px-2 py-0.5 rounded text-white font-bold text-xs shadow-md border border-emerald-400">
                    {player.skill} OVR
                  </div>
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-900 to-transparent p-3 pt-12">
                     <p className="text-slate-300 text-xs font-bold uppercase tracking-wider">{player.position}</p>
                     <h4 className="font-bold text-white text-base leading-tight truncate">{player.name}</h4>
                  </div>
                </div>
                
                <div className="p-4 bg-slate-800 flex-1 flex flex-col justify-end">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-slate-400 text-xs">Cost</span>
                    <span className="text-white font-bold text-sm">{formatMoney(player.cost)}</span>
                  </div>
                  <button
                    onClick={() => buyFootballPlayer(business.id, player.id)}
                    disabled={owned || money < player.cost}
                    className={`w-full py-2 font-bold rounded-lg transition-colors border shadow-sm ${
                      owned 
                        ? 'bg-slate-700 text-emerald-400 border-slate-600 cursor-not-allowed' 
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500 cursor-pointer'
                    }`}
                  >
                    {owned ? 'Signed' : 'Sign Player'}
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
