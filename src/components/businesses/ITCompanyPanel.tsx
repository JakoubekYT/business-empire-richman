import { useState, useEffect } from "react";
import type { Business, ITData } from "../../types/game";
import { useGameStore } from "../../store/gameStore";
import { IT_PROJECTS, EMPLOYEE_TYPES } from "../../data/gameData";
import { formatMoney, formatTimeRemaining } from "../../utils/format";
import { AssetImage } from "../AssetImage";

export function ITCompanyPanel({ business }: { business: Business }) {
  const data = business.data as ITData;
  const { money, hireITEmployee, startITProject, collectITProject } = useGameStore();
  const [activeTab, setActiveTab] = useState<"projects" | "active" | "team">("projects");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<Set<string>>(new Set());
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const int = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(int);
  }, []);

  const totalSalary = data.employees.reduce((sum, emp) => {
    const role = EMPLOYEE_TYPES.find(r => r.id === emp.roleId);
    return sum + (role?.salary || 0n);
  }, 0n);

  const busyIds = new Set(data.activeProjects.flatMap(p => p.assignedEmployeeIds));
  const freeEmployees = data.employees.filter(e => !busyIds.has(e.id));

  const toggleEmployeeSelection = (id: string) => {
    const newSel = new Set(selectedEmployeeIds);
    if (newSel.has(id)) newSel.delete(id);
    else newSel.add(id);
    setSelectedEmployeeIds(newSel);
  };

  const calculateProjectSpeed = (employeeIds: string[]) => {
    let speed = 0;
    employeeIds.forEach(eid => {
      const emp = data.employees.find(e => e.id === eid);
      if (emp) {
        const role = EMPLOYEE_TYPES.find(r => r.id === emp.roleId);
        if (role) speed += role.projectSpeed;
      }
    });
    return speed || 1; // avoid divide by zero naturally
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
          <p className="text-slate-400 text-sm">Total Employees</p>
          <p className="text-xl font-bold text-white">{data.employees.length}</p>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
          <p className="text-slate-400 text-sm">Active Developers</p>
          <p className="text-xl font-bold text-emerald-400">{busyIds.size}</p>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
          <p className="text-slate-400 text-sm">Hourly Salary Cost</p>
          <p className="text-xl font-bold text-red-400">-{formatMoney(totalSalary)}</p>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
          <p className="text-slate-400 text-sm">Projects Completed</p>
          <p className="text-xl font-bold text-white">{data.completedProjects.length}</p>
        </div>
      </div>

      <div className="flex bg-slate-800/50 rounded-lg p-1 overflow-x-auto">
        <button
          onClick={() => { setActiveTab("projects"); setSelectedProjectId(null); }}
          className={`px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${activeTab === "projects" ? "bg-cyan-600 text-white shadow-sm" : "text-slate-400 hover:text-white"}`}
        >
          Available Projects
        </button>
        <button
          onClick={() => { setActiveTab("active"); setSelectedProjectId(null); }}
          className={`flex-1 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${activeTab === "active" ? "bg-slate-700 text-white shadow-sm" : "text-slate-400 hover:text-white"}`}
        >
          Active ({data.activeProjects.length})
        </button>
        <button
          onClick={() => { setActiveTab("team"); setSelectedProjectId(null); }}
          className={`flex-1 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${activeTab === "team" ? "bg-slate-700 text-white shadow-sm" : "text-slate-400 hover:text-white"}`}
        >
          My Team
        </button>
      </div>

      {activeTab === "projects" && (
        <div className="space-y-4">
          {selectedProjectId ? (
            <div className="bg-slate-800 rounded-xl border border-cyan-500/30 overflow-hidden">
              <div className="p-4 bg-slate-900/60 flex justify-between items-center border-b border-slate-700">
                <h3 className="text-lg font-bold text-white">Assign Team for {IT_PROJECTS.find(p => p.id === selectedProjectId)?.name}</h3>
                <button onClick={() => { setSelectedProjectId(null); setSelectedEmployeeIds(new Set()); }} className="text-slate-400 hover:text-white">✕ Close</button>
              </div>
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-slate-400 mb-2">Select free employees:</p>
                  {freeEmployees.length === 0 ? (
                    <p className="text-red-400 italic text-sm p-4 bg-red-500/10 rounded-lg">No free employees. Hire more or wait for active projects to finish.</p>
                  ) : (
                    <div className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                      {freeEmployees.map(emp => {
                        const role = EMPLOYEE_TYPES.find(r => r.id === emp.roleId)!;
                        const isSelected = selectedEmployeeIds.has(emp.id);
                        return (
                          <div 
                            key={emp.id} 
                            onClick={() => toggleEmployeeSelection(emp.id)}
                            className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${isSelected ? 'bg-cyan-600/20 border-cyan-500' : 'bg-slate-900/40 border-slate-700 hover:bg-slate-700/50'}`}
                          >
                            <div>
                              <p className="text-white font-medium text-sm">{role.name}</p>
                              <p className="text-slate-400 text-xs text-cyan-400 mt-1">Speed Multiplier: {role.projectSpeed}x</p>
                            </div>
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${isSelected ? 'bg-cyan-500 border-cyan-400' : 'border-slate-500'}`}>
                              {isSelected && <span className="text-white text-xs">✓</span>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col bg-slate-900/40 p-4 rounded-xl border border-slate-700 h-full">
                  <h4 className="text-white font-medium mb-4">Project Estimation</h4>
                  
                  {(() => {
                    const proj = IT_PROJECTS.find(p => p.id === selectedProjectId)!;
                    const isEnough = selectedEmployeeIds.size >= proj.minEmployees;
                    const speed = calculateProjectSpeed(Array.from(selectedEmployeeIds));
                    const estTime = proj.baseDurationSeconds / speed;
                    
                    return (
                      <div className="space-y-4 flex-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Required Staff:</span>
                          <span className={isEnough ? "text-emerald-400 font-medium" : "text-red-400 font-medium"}>{selectedEmployeeIds.size} / {proj.minEmployees}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Total Speed Boost:</span>
                          <span className="text-cyan-400 font-medium">{speed.toFixed(1)}x</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Est. Completion Time:</span>
                          <span className="text-white font-medium font-mono">{formatTimeRemaining(estTime)}</span>
                        </div>
                        <div className="flex justify-between text-sm pt-4 border-t border-slate-700">
                          <span className="text-slate-400">Potential Reward:</span>
                          <span className="text-emerald-400 font-bold text-lg">{formatMoney(proj.reward)}</span>
                        </div>

                        <button
                          onClick={() => {
                            startITProject(business.id, selectedProjectId, Array.from(selectedEmployeeIds));
                            setSelectedProjectId(null);
                            setSelectedEmployeeIds(new Set());
                          }}
                          disabled={!isEnough}
                          className="w-full mt-auto py-3 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold rounded-lg transition-colors"
                        >
                          Launch Project
                        </button>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {IT_PROJECTS.map((proj) => (
                <div key={proj.id} className="flex flex-col bg-slate-800 rounded-xl overflow-hidden border border-slate-700">
                  <div className="flex p-4 gap-4 bg-slate-900/60 items-center justify-between border-b border-slate-700">
                    <div>
                      <h4 className="font-bold text-white text-lg">{proj.name}</h4>
                      <p className="text-slate-400 text-sm mt-1">{proj.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-cyan-400 font-bold text-lg">+{formatMoney(proj.reward)}</p>
                      <p className="text-slate-400 text-xs">Min team: {proj.minEmployees}</p>
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <p className="text-slate-300 text-sm mb-4">Base Time (1x speed): <span className="font-mono text-cyan-300 ml-1">{formatTimeRemaining(proj.baseDurationSeconds)}</span></p>
                    <button
                      onClick={() => { setSelectedProjectId(proj.id); setSelectedEmployeeIds(new Set()); }}
                      className="w-full py-2 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors border border-slate-600"
                    >
                      Assemble Team
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "active" && (
        <div className="space-y-4">
          {data.activeProjects.length === 0 ? (
            <p className="text-slate-400 italic">No development active. Find a project and assign your team.</p>
          ) : (
            data.activeProjects.map((active) => {
              const baseId = active.projectId.split("_")[0];
              const proj = IT_PROJECTS.find(p => p.id === baseId)!;
              
              const remaining = Math.max(0, active.endsAt - now) / 1000;
              const speed = calculateProjectSpeed(active.assignedEmployeeIds);
              const total = proj.baseDurationSeconds / speed;
              const progress = 100 - (remaining / total * 100);
              const isDone = remaining <= 0;

              return (
                <div key={active.projectId} className="p-4 bg-slate-800 rounded-xl border border-slate-700 flex flex-col md:flex-row items-center gap-6">
                  <div className="flex-1 w-full flex flex-col justify-center">
                    <div className="flex justify-between items-end mb-2">
                      <div>
                        <h4 className="font-bold text-white text-lg">{proj.name}</h4>
                        <p className="text-slate-400 text-xs">{active.assignedEmployeeIds.length} devs assigned ({speed.toFixed(1)}x speed)</p>
                      </div>
                      {!isDone ? (
                        <span className="text-cyan-400 font-mono font-medium">{formatTimeRemaining(remaining)}</span>
                      ) : (
                        <span className="text-cyan-400 font-bold">READY TO DELIVER</span>
                      )}
                    </div>
                    <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-1000 ${isDone ? 'bg-cyan-400' : 'bg-cyan-600'}`} 
                        style={{ width: `${Math.min(100, progress)}%` }} 
                      />
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 w-full md:w-auto items-center md:items-end min-w-[140px]">
                    <p className="text-emerald-400 font-bold mb-1">{formatMoney(proj.reward)}</p>
                    <button
                      onClick={() => collectITProject(business.id, active.projectId)}
                      disabled={!isDone}
                      className="w-full px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold rounded-lg transition-colors shadow-lg shadow-emerald-900/20"
                    >
                      Collect
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {activeTab === "team" && (
        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Hire New Staff</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {EMPLOYEE_TYPES.map(role => (
                <div key={role.id} className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 flex flex-col">
                  <div className="flex items-center gap-3 mb-3">
                    <AssetImage image={role.image} size={40} className="rounded-full" />
                    <div>
                      <h4 className="text-white font-bold text-sm leading-tight">{role.name}</h4>
                      <p className="text-slate-400 text-xs">{formatMoney(role.salary)}/hr</p>
                    </div>
                  </div>
                  <div className="bg-slate-900/50 rounded p-2 mb-4 text-xs">
                    <p className="text-slate-300">Boosts project speed by <span className="text-cyan-400 font-bold">{role.projectSpeed}x</span></p>
                  </div>
                  <button
                    onClick={() => hireITEmployee(business.id, role.id)}
                    disabled={money < role.hireBonus}
                    className="w-full mt-auto py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white text-sm font-medium rounded transition-colors"
                  >
                    Hire ({formatMoney(role.hireBonus)})
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white mb-4">Current Roster</h3>
            {data.employees.length === 0 ? (
              <p className="text-slate-400 italic">No employees hired yet.</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {data.employees.map(emp => {
                  const role = EMPLOYEE_TYPES.find(r => r.id === emp.roleId)!;
                  const isBusy = busyIds.has(emp.id);
                  return (
                    <div key={emp.id} className="bg-slate-800 p-3 rounded-xl border border-slate-700 flex flex-col items-center text-center">
                      <AssetImage image={role.image} size={48} className="rounded-full mb-2 opacity-90" />
                      <p className="text-white text-xs font-bold leading-tight">{role.name}</p>
                      <span className={`text-[10px] mt-2 px-2 py-0.5 rounded-full ${isBusy ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}`}>
                        {isBusy ? 'Working' : 'Idle'}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
