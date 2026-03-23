import { useState } from "react";
import { useGameStore } from "../store/gameStore";
import { formatMoney, getUpgradeCost } from "../utils/format";
import type { Business } from "../types/game";

function BusinessCard({ business }: { business: Business }) {
  const { buyBusiness, upgradeBusiness, money } = useGameStore();

  const upgradeCost = getUpgradeCost(business.upgradeCost, business.level);
  const canAffordUnlock = money >= business.unlockCost;
  const canAffordUpgrade = money >= upgradeCost;
  const incomePerSec = (business.incomePerHour * business.level) / 3600;

  return (
    <div className="card" style={{
      padding: 16,
      border: business.owned ? `1px solid ${business.color}30` : "1px solid var(--border)",
      background: business.owned ? `linear-gradient(135deg, var(--bg-card), ${business.color}08)` : "var(--bg-card)",
      transition: "all 0.2s",
      animation: "slideInUp 0.3s ease",
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 12 }}>
        <div style={{
          width: 52,
          height: 52,
          borderRadius: "var(--radius-md)",
          background: business.owned ? `${business.color}20` : "rgba(255,255,255,0.04)",
          border: `1px solid ${business.owned ? business.color + "40" : "var(--border)"}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 26,
          flexShrink: 0,
        }}>
          {business.icon}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 2 }}>{business.name}</div>
          <span className="badge" style={{ fontSize: 10, background: `${business.color}15`, color: business.color, border: `1px solid ${business.color}30` }}>
            {business.category}
          </span>
        </div>
        {business.owned && (
          <span className="badge badge-green" style={{ fontSize: 10, flexShrink: 0 }}>
            Lv.{business.level}
          </span>
        )}
      </div>

      {business.owned && (
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ color: "var(--text-secondary)", fontSize: 13 }}>Income/hr</span>
            <span style={{ color: business.color, fontWeight: 700, fontSize: 13 }}>
              {formatMoney(business.incomePerHour * business.level)}
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ color: "var(--text-secondary)", fontSize: 13 }}>Income/sec</span>
            <span style={{ color: "var(--text-muted)", fontSize: 13 }}>
              {incomePerSec > 0 ? `$${incomePerSec.toFixed(2)}/s` : "$0/s"}
            </span>
          </div>
          {/* Level bar */}
          <div className="progress-bar">
            <div className="progress-fill" style={{
              width: `${(business.level / business.maxLevel) * 100}%`,
              background: business.color === "#4ade80" ? "linear-gradient(135deg, #4ade80, #22d3a0)" : `linear-gradient(135deg, ${business.color}, ${business.color}bb)`,
            }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, fontSize: 11, color: "var(--text-muted)" }}>
            <span>Level {business.level}</span>
            <span>{business.level < business.maxLevel ? `Max: ${business.maxLevel}` : "MAX LEVEL"}</span>
          </div>
        </div>
      )}

      {!business.owned && (
        <p style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 12, lineHeight: 1.4 }}>
          {business.description}
        </p>
      )}

      <div style={{ display: "flex", gap: 8 }}>
        {!business.owned ? (
          <button
            className={`btn ${canAffordUnlock ? "btn-gold" : "btn-ghost"}`}
            style={{ flex: 1, fontSize: 13 }}
            onClick={() => buyBusiness(business.id)}
            disabled={!canAffordUnlock}
          >
            {business.unlockCost === 0 ? "🚀 Start Free!" : `🔓 ${formatMoney(business.unlockCost)}`}
          </button>
        ) : (
          <>
            {business.level < business.maxLevel ? (
              <button
                className={`btn ${canAffordUpgrade ? "btn-gold" : "btn-ghost"}`}
                style={{ flex: 1, fontSize: 13 }}
                onClick={() => upgradeBusiness(business.id)}
                disabled={!canAffordUpgrade}
              >
                ⬆️ {formatMoney(upgradeCost)}
              </button>
            ) : (
              business.mergeItem ? (
                <button className="btn btn-ghost" style={{ flex: 1, fontSize: 12 }} disabled>
                  🔗 Merge: {business.mergeItem}
                </button>
              ) : (
                <div className="badge badge-gold" style={{ flex: 1, justifyContent: "center" }}>
                  ✨ Maxed Out!
                </div>
              )
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function BusinessesPage() {
  const { businesses, incomePerHour, money } = useGameStore();
  const [filter, setFilter] = useState<string>("ALL");

  const categories = ["ALL", "RETAIL", "MANUFACTURING", "SERVICE", "FINANCE", "ENTERTAINMENT", "ENERGY", "TECH"];
  const filtered = filter === "ALL" ? businesses : businesses.filter((b) => b.category === filter);
  const ownedCount = businesses.filter((b) => b.owned).length;

  return (
    <div className="section">
      <div className="section-header">
        <div>
          <h1 className="section-title">Businesses</h1>
          <p className="section-subtitle">{ownedCount} / {businesses.length} owned · {formatMoney(incomePerHour)}/hr total</p>
        </div>
        <div style={{
          background: "rgba(245,197,24,0.1)",
          border: "1px solid rgba(245,197,24,0.2)",
          borderRadius: "var(--radius-md)",
          padding: "6px 12px",
          textAlign: "center",
        }}>
          <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600 }}>CASH</div>
          <div style={{ color: "var(--accent-gold)", fontWeight: 800 }}>{formatMoney(money)}</div>
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{ overflowX: "auto", marginBottom: 20, paddingBottom: 4 }}>
        <div style={{ display: "flex", gap: 6, minWidth: "max-content" }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`btn btn-sm ${filter === cat ? "btn-gold" : "btn-ghost"}`}
              style={{ fontSize: 11, whiteSpace: "nowrap" }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Business grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
        {filtered.map((business) => (
          <BusinessCard key={business.id} business={business} />
        ))}
      </div>
    </div>
  );
}
