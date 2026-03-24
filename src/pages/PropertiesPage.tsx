import { useState } from "react";
import { useGameStore } from "../store/gameStore";
import { formatMoney } from "../utils/format";
import type { Property } from "../types/game";

function PropertyCard({ property }: { property: Property }) {
  const { buyProperty, buyImprovement, money } = useGameStore();
  const [expanded, setExpanded] = useState(false);

  const allImproved = property.improvements.every((i) => i.purchased);

  const cityBg: Record<string, string> = {
    "New York": "linear-gradient(135deg, #1a2438, #0d2d5e)",
    "London": "linear-gradient(135deg, #1a2438, #2d1a5e)",
    "Dubai": "linear-gradient(135deg, #3d2900, #5e4200)",
    "Tokyo": "linear-gradient(135deg, #2d0d1a, #5e0a2a)",
    "Monaco": "linear-gradient(135deg, #001a2d, #003d5e)",
    "Singapore": "linear-gradient(135deg, #001a0d, #003d1a)",
  };

  return (
    <div className="card" style={{
      overflow: "hidden",
      border: property.owned ? "1px solid rgba(167,139,250,0.3)" : "1px solid var(--border)",
    }}>
      {/* Property header bg */}
      <div style={{
        background: cityBg[property.city] ?? "var(--bg-card-hover)",
        padding: "20px 16px 16px",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: 12, right: 12, fontSize: 32 }}>{property.flag}</div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", fontWeight: 600, textTransform: "uppercase", marginBottom: 4 }}>
          {property.country}
        </div>
        <div style={{ fontWeight: 800, fontSize: 16 }}>{property.name}</div>
        <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, marginTop: 2 }}>📍 {property.city}</div>

        {property.owned && (
          <div style={{ marginTop: 12 }}>
            <span className="badge badge-purple" style={{ fontSize: 10 }}>Owned</span>
            {allImproved && <span className="badge badge-gold" style={{ fontSize: 10, marginLeft: 6 }}>Fully Improved</span>}
          </div>
        )}
      </div>

      <div style={{ padding: "14px 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600, marginBottom: 2 }}>BASE INCOME</div>
            <div style={{ color: "var(--accent-purple)", fontWeight: 700 }}>{formatMoney(property.baseIncomePerHour)}/hr</div>
          </div>
          {property.owned && (
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600, marginBottom: 2 }}>PENDING RENT</div>
              <div style={{ color: "var(--accent-gold)", fontWeight: 700 }}>{formatMoney(property.pendingRent || 0)}</div>
            </div>
          )}
        </div>

        {!property.owned ? (
          <button
            className={`btn ${money >= property.basePurchaseCost ? "btn-gold" : "btn-ghost"}`}
            style={{ width: "100%", fontSize: 13 }}
            onClick={() => buyProperty(property.id)}
            disabled={money < property.basePurchaseCost}
          >
            🏠 Buy for {formatMoney(property.basePurchaseCost)}
          </button>
        ) : (
          <div>
            <button
              className="btn btn-ghost btn-sm"
              style={{ width: "100%", marginBottom: 10, fontSize: 12 }}
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? "Hide" : "Show"} Improvements ({property.improvements.filter((i) => i.purchased).length}/{property.improvements.length})
            </button>
            {expanded && (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {property.improvements.map((imp) => (
                  <div key={imp.id} style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "10px 12px",
                    background: imp.purchased ? "rgba(34,211,160,0.08)" : "rgba(255,255,255,0.03)",
                    border: `1px solid ${imp.purchased ? "rgba(34,211,160,0.2)" : "var(--border)"}`,
                    borderRadius: "var(--radius-sm)",
                  }}>
                    <span style={{ fontSize: 18 }}>{imp.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{imp.name}</div>
                      <div style={{ fontSize: 11, color: "var(--accent-green)" }}>+{formatMoney(property.baseIncomePerHour * BigInt(imp.incomeBonusPercent) / 100n)}/hr</div>
                    </div>
                    {imp.purchased ? (
                      <span className="badge badge-green" style={{ fontSize: 10 }}>✓ Done</span>
                    ) : (
                      <button
                        className={`btn btn-sm ${money >= (property.basePurchaseCost * BigInt(imp.costPercent) / 100n) ? "btn-gold" : "btn-ghost"}`}
                        style={{ fontSize: 11, padding: "5px 10px" }}
                        onClick={() => buyImprovement(property.id, imp.id)}
                        disabled={money < (property.basePurchaseCost * BigInt(imp.costPercent) / 100n)}
                      >
                        {formatMoney(property.basePurchaseCost * BigInt(imp.costPercent) / 100n)}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function PropertiesPage() {
  const { properties, money, claimAllProperties } = useGameStore();
  const propertyIncome = properties.reduce((sum, p) => {
    if (!p.owned) return sum;
    return sum + p.baseIncomePerHour + p.improvements.reduce((ib, i) => (i.purchased ? ib + (p.baseIncomePerHour * BigInt(i.incomeBonusPercent) / 100n) : ib), 0n);
  }, 0n);
  const totalPendingRent = properties.reduce((sum, p) => sum + (p.pendingRent || 0n), 0n);
  const ownedCount = properties.filter((p) => p.owned).length;

  return (
    <div className="section">
      <div className="section-header">
        <div>
          <h1 className="section-title">Properties</h1>
          <p className="section-subtitle">{ownedCount} owned · {formatMoney(propertyIncome)}/hr</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          {totalPendingRent > 0 && (
            <button
              className="btn btn-green btn-sm"
              onClick={claimAllProperties}
              style={{ padding: "6px 12px", border: "1px solid var(--accent-green)" }}
            >
              Claim {formatMoney(totalPendingRent)}
            </button>
          )}
          <div style={{
            background: "rgba(167,139,250,0.1)",
            border: "1px solid rgba(167,139,250,0.2)",
            borderRadius: "var(--radius-md)",
            padding: "6px 12px",
            textAlign: "center",
          }}>
            <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600 }}>CASH</div>
            <div style={{ color: "var(--accent-purple)", fontWeight: 800 }}>{formatMoney(money)}</div>
          </div>
        </div>
      </div>

      <div style={{ background: "rgba(167,139,250,0.08)", border: "1px solid rgba(167,139,250,0.2)", borderRadius: "var(--radius-md)", padding: "12px 16px", marginBottom: 20 }}>
        <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.5 }}>
          💡 Properties generate passive income without depreciation. Improve them with upgrades to boost hourly earnings significantly!
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
        {properties.map((p) => <PropertyCard key={p.id} property={p} />)}
      </div>
    </div>
  );
}
