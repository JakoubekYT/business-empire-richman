import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useGameStore } from "../store/gameStore";
import { formatMoney } from "../utils/format";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const { totalEarned, netWorth, totalClicks, totalPlayTimeSeconds, businesses, properties, achievements, prestigeLevel, prestigeBonus, prestige, saveGame } = useGameStore();
  const [saving, setSaving] = useState(false);
  const [showPrestige, setShowPrestige] = useState(false);

  const ownedBusiness = businesses.filter((b) => b.owned).length;
  const ownedProps = properties.filter((p) => p.owned).length;
  const completedAchievements = achievements.filter((a) => a.completed).length;
  const hours = Math.floor(totalPlayTimeSeconds / 3600);
  const mins = Math.floor((totalPlayTimeSeconds % 3600) / 60);

  const handleSave = async () => {
    setSaving(true);
    await saveGame();
    setTimeout(() => setSaving(false), 1000);
  };

  const canPrestige = totalEarned >= 1000000000;

  return (
    <div className="section">
      <h1 className="section-title" style={{ marginBottom: 20 }}>Profile</h1>

      {/* User Info */}
      <div className="card" style={{ padding: 24, marginBottom: 16, display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{
          width: 72,
          height: 72,
          borderRadius: "50%",
          background: user?.photoURL ? "transparent" : "var(--gradient-gold)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 32,
          fontWeight: 900,
          flexShrink: 0,
          overflow: "hidden",
          border: "2px solid rgba(245,197,24,0.3)",
        }}>
          {user?.photoURL ? (
            <img src={user.photoURL} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            user?.displayName?.[0]?.toUpperCase() ?? "👤"
          )}
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: 20 }}>{user?.displayName ?? "Anonymous"}</div>
          <div style={{ color: "var(--text-secondary)", fontSize: 14, marginTop: 2 }}>{user?.email}</div>
          <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
            {prestigeLevel > 0 && (
              <span className="badge badge-gold">⭐ Prestige {prestigeLevel}</span>
            )}
            <span className="badge badge-purple">+{((prestigeBonus - 1) * 100).toFixed(0)}% income bonus</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <h3 style={{ fontWeight: 700, marginBottom: 12, fontSize: 15 }}>📊 Statistics</h3>
      <div className="grid-2" style={{ marginBottom: 20, gap: 10 }}>
        <div className="stat-box">
          <div className="stat-label">Total Earned</div>
          <div className="stat-value text-gold" style={{ fontSize: 18 }}>{formatMoney(totalEarned)}</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Net Worth</div>
          <div className="stat-value text-green" style={{ fontSize: 18 }}>{formatMoney(netWorth)}</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Businesses</div>
          <div className="stat-value" style={{ fontSize: 18 }}>{ownedBusiness} / 12</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Properties</div>
          <div className="stat-value" style={{ fontSize: 18 }}>{ownedProps} / {properties.length}</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Total Clicks</div>
          <div className="stat-value" style={{ fontSize: 18 }}>{totalClicks.toLocaleString()}</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Play Time</div>
          <div className="stat-value" style={{ fontSize: 16 }}>{hours}h {mins}m</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Achievements</div>
          <div className="stat-value" style={{ fontSize: 18 }}>{completedAchievements} / {achievements.length}</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Prestige Level</div>
          <div className="stat-value text-purple" style={{ fontSize: 18 }}>⭐ {prestigeLevel}</div>
        </div>
      </div>

      {/* Actions */}
      <h3 style={{ fontWeight: 700, marginBottom: 12, fontSize: 15 }}>⚙️ Actions</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
        <button
          className="btn btn-gold"
          onClick={handleSave}
          disabled={saving}
          style={{ justifyContent: "flex-start", gap: 12 }}
        >
          <span style={{ fontSize: 18 }}>💾</span>
          {saving ? "Saving..." : "Save Game Now"}
        </button>

        {/* Prestige */}
        <div className="card" style={{
          padding: 16,
          border: canPrestige ? "1px solid rgba(167,139,250,0.4)" : "1px solid var(--border)",
          background: canPrestige ? "rgba(167,139,250,0.06)" : "var(--bg-card)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <span style={{ fontSize: 24 }}>⭐</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700 }}>Prestige Reset</div>
              <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                Reset progress for +10% permanent income bonus
              </div>
            </div>
          </div>
          {!canPrestige && (
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 10 }}>
              Requires $1B total earned. You have {formatMoney(totalEarned)}.
            </div>
          )}
          {canPrestige && !showPrestige && (
            <button className="btn btn-ghost" style={{ width: "100%", fontSize: 13 }} onClick={() => setShowPrestige(true)}>
              ⚠️ Click to Prestige (irreversible!)
            </button>
          )}
          {showPrestige && (
            <div>
              <p style={{ color: "var(--accent-red)", fontSize: 13, marginBottom: 10 }}>
                ⚠️ All money and businesses will be reset! Your +10% income bonus is permanent.
              </p>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn btn-ghost btn-sm" style={{ flex: 1 }} onClick={() => setShowPrestige(false)}>Cancel</button>
                <button className="btn btn-red btn-sm" style={{ flex: 1 }} onClick={() => { prestige(); setShowPrestige(false); }}>✓ Prestige!</button>
              </div>
            </div>
          )}
        </div>

        <button
          className="btn btn-ghost"
          onClick={logout}
          style={{ justifyContent: "flex-start", gap: 12, color: "var(--accent-red)", borderColor: "rgba(244,63,94,0.3)" }}
        >
          <span style={{ fontSize: 18 }}>🚪</span>
          Sign Out
        </button>
      </div>

      {/* About */}
      <div className="card" style={{ padding: 16, textAlign: "center" }}>
        <div style={{ fontSize: 28, marginBottom: 8 }}>💼</div>
        <div style={{ fontWeight: 800, marginBottom: 4 }}>RichMan Empire</div>
        <div style={{ color: "var(--text-muted)", fontSize: 12 }}>
          Inspired by Business Empire: RichMan<br />
          Built with React + Firebase
        </div>
      </div>
    </div>
  );
}
