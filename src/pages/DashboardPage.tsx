import { useState, useRef } from "react";
import { useGameStore } from "../store/gameStore";
import { useAuth } from "../contexts/AuthContext";
import { formatMoney } from "../utils/format";

interface ClickParticle {
  id: number;
  x: number;
  y: number;
  value: number;
}

export default function DashboardPage() {
  const { money, totalEarned, incomePerHour, netWorth, click, achievements, dailyTasks, claimAchievement, claimDailyTask, businesses, properties } = useGameStore();
  const { user } = useAuth();
  const [particles, setParticles] = useState<ClickParticle[]>([]);
  const [clickAnim, setClickAnim] = useState(false);
  const particleIdRef = useRef(0);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    click();
    setClickAnim(true);
    setTimeout(() => setClickAnim(false), 100);
    const rect = e.currentTarget.getBoundingClientRect();
    const id = particleIdRef.current++;
    setParticles((prev) => [...prev, { id, x: e.clientX - rect.left, y: e.clientY - rect.top, value: 1 }]);
    setTimeout(() => setParticles((prev) => prev.filter((p) => p.id !== id)), 800);
  };

  const ownedBusinesses = businesses.filter((b) => b.owned).length;
  const ownedProperties = properties.filter((p) => p.owned).length;
  const unclaimedAchievements = achievements.filter((a) => a.completed && !a.claimed);

  return (
    <div className="section">
      {/* Welcome */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800 }}>
          Welcome back, {user?.displayName?.split(" ")[0] ?? "Boss"} 👋
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: 14, marginTop: 4 }}>
          Your empire is generating {formatMoney(incomePerHour)}/hr
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid-2" style={{ marginBottom: 20, gap: 12 }}>
        <div className="stat-box" style={{ background: "rgba(245,197,24,0.08)", border: "1px solid rgba(245,197,24,0.2)" }}>
          <div className="stat-label">Cash</div>
          <div className="stat-value text-gold" style={{ fontSize: 22 }}>{formatMoney(money)}</div>
        </div>
        <div className="stat-box" style={{ background: "rgba(34,211,160,0.08)", border: "1px solid rgba(34,211,160,0.2)" }}>
          <div className="stat-label">Income / hr</div>
          <div className="stat-value text-green" style={{ fontSize: 22 }}>{formatMoney(incomePerHour)}</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Net Worth</div>
          <div className="stat-value text-blue">{formatMoney(netWorth)}</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Total Earned</div>
          <div className="stat-value text-purple">{formatMoney(totalEarned)}</div>
        </div>
      </div>

      {/* Click button */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
        <div style={{ position: "relative", display: "inline-block" }}>
          <button
            onClick={handleClick}
            style={{
              width: 160,
              height: 160,
              borderRadius: "50%",
              background: clickAnim
                ? "radial-gradient(circle, #ffe564, #f5c518)"
                : "radial-gradient(circle at 40% 40%, #ffe564, #e8971a)",
              border: "3px solid rgba(245,197,24,0.5)",
              cursor: "pointer",
              fontSize: 52,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: clickAnim
                ? "0 0 60px rgba(245,197,24,0.7), 0 0 120px rgba(245,197,24,0.3)"
                : "0 0 30px rgba(245,197,24,0.3), 0 8px 32px rgba(0,0,0,0.4)",
              transform: clickAnim ? "scale(0.94)" : "scale(1)",
              transition: "all 0.08s ease",
              animation: "pulse-glow 2s ease-in-out infinite",
              userSelect: "none",
            }}
          >
            💰
          </button>
          {/* Particles */}
          {particles.map((p) => (
            <div key={p.id} style={{
              position: "absolute",
              left: p.x,
              top: p.y,
              pointerEvents: "none",
              color: "var(--accent-gold)",
              fontWeight: 800,
              fontSize: 16,
              animation: "slideInUp 0.8s ease forwards",
              opacity: 0,
            }}>
              +${p.value}
            </div>
          ))}
        </div>
      </div>

      <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: 13, marginBottom: 24 }}>
        Tap the coin to earn money! 💡
      </p>

      {/* Quick Stats */}
      <div className="card" style={{ padding: 16, marginBottom: 16 }}>
        <h3 style={{ fontWeight: 700, marginBottom: 12, fontSize: 15 }}>📊 Empire Overview</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "var(--text-secondary)", fontSize: 14 }}>🏢 Businesses Owned</span>
            <span className="badge badge-blue">{ownedBusinesses} / 12</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "var(--text-secondary)", fontSize: 14 }}>🏘️ Properties Owned</span>
            <span className="badge badge-purple">{ownedProperties} / {properties.length}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "var(--text-secondary)", fontSize: 14 }}>🏆 Achievements</span>
            <span className="badge badge-gold">{achievements.filter((a) => a.completed).length} / {achievements.length}</span>
          </div>
        </div>
      </div>

      {/* Achievements to claim */}
      {unclaimedAchievements.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <h3 style={{ fontWeight: 700, marginBottom: 12, fontSize: 15 }}>🏆 Ready to Claim!</h3>
          {unclaimedAchievements.map((a) => (
            <div key={a.id} className="card" style={{ padding: 16, marginBottom: 8, border: "1px solid rgba(245,197,24,0.3)", background: "rgba(245,197,24,0.05)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 28 }}>{a.icon}</span>
                  <div>
                    <div style={{ fontWeight: 700 }}>{a.name}</div>
                    <div style={{ color: "var(--text-secondary)", fontSize: 13 }}>{a.description}</div>
                  </div>
                </div>
                <button className="btn btn-gold btn-sm" onClick={() => claimAchievement(a.id)}>
                  +{formatMoney(a.reward)}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Daily Tasks */}
      <div style={{ marginBottom: 16 }}>
        <h3 style={{ fontWeight: 700, marginBottom: 12, fontSize: 15 }}>📋 Daily Tasks</h3>
        {dailyTasks.map((t) => (
          <div key={t.id} className="card" style={{ padding: 14, marginBottom: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: t.completed ? 0 : 10 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: t.completed ? "var(--text-secondary)" : "var(--text-primary)" }}>
                  {t.description}
                </div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
                  Reward: {formatMoney(t.reward)}
                </div>
              </div>
              {t.completed && !t.claimed && (
                <button className="btn btn-gold btn-sm" onClick={() => claimDailyTask(t.id)}>
                  Claim!
                </button>
              )}
              {t.claimed && <span className="badge badge-green">Claimed ✓</span>}
            </div>
            {!t.completed && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--text-muted)", marginBottom: 4 }}>
                  <span>{formatMoney(t.progress)} / {formatMoney(t.target)}</span>
                  <span>{Math.min(100, Math.round((t.progress / t.target) * 100))}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill green" style={{ width: `${Math.min(100, (t.progress / t.target) * 100)}%` }} />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
