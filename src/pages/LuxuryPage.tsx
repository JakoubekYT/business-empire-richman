import { useState } from "react";
import { useGameStore } from "../store/gameStore";
import { formatMoney } from "../utils/format";
import type { LuxuryItem, LuxuryCategory } from "../types/game";

const CATEGORY_ICONS: Record<LuxuryCategory, string> = {
  CARS: "🏎️",
  AVIATION: "✈️",
  MARITIME: "⚓",
  ART: "🎨",
  REAL_ESTATE: "🏝️",
  COLLECTIBLES: "💎",
};

const CATEGORY_LABELS: Record<LuxuryCategory, string> = {
  CARS: "Cars",
  AVIATION: "Aviation",
  MARITIME: "Maritime",
  ART: "Art & NFTs",
  REAL_ESTATE: "Real Estate",
  COLLECTIBLES: "Collectibles",
};

function LuxuryCard({ item }: { item: LuxuryItem }) {
  const { buyLuxuryItem, money, crypto } = useGameStore();

  const canAfford = item.costCurrency === "crypto" && item.cryptoCoinId
    ? crypto.find((c) => c.id === item.cryptoCoinId)?.amountOwned ?? 0 >= (item.cryptoAmount ?? 0)
    : money >= item.baseCost;

  const priceDisplay = item.costCurrency === "crypto" && item.cryptoCoinId
    ? `${item.cryptoAmount}`
    : formatMoney(item.baseCost);

  return (
    <div className="card" style={{
      padding: 20,
      border: item.owned
        ? "1px solid rgba(245,197,24,0.4)"
        : canAfford ? "1px solid rgba(96,165,250,0.2)" : "1px solid var(--border)",
      background: item.owned
        ? "linear-gradient(135deg, rgba(245,197,24,0.06), rgba(232,151,26,0.04))"
        : "var(--bg-card)",
      position: "relative",
      overflow: "hidden",
      transition: "all 0.2s",
    }}>
      {item.owned && (
        <div style={{
          position: "absolute",
          top: 12,
          right: 12,
          background: "var(--gradient-gold)",
          borderRadius: "50%",
          width: 28,
          height: 28,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 14,
        }}>✓</div>
      )}

      <div style={{ fontSize: 40, marginBottom: 12, textAlign: "center" }}>{item.icon}</div>
      <h3 style={{ fontWeight: 800, fontSize: 16, marginBottom: 6, textAlign: "center" }}>{item.name}</h3>
      <p style={{ color: "var(--text-secondary)", fontSize: 13, textAlign: "center", lineHeight: 1.4, marginBottom: 16 }}>
        {item.description}
      </p>

      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16, padding: "10px 0", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div>
          <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600, marginBottom: 2 }}>PRICE</div>
          <div style={{ fontWeight: 800, color: item.costCurrency === "crypto" ? "var(--accent-red)" : "var(--accent-gold)" }}>
            {priceDisplay}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600, marginBottom: 2 }}>NET WORTH +</div>
          <div style={{ fontWeight: 700, color: "var(--accent-green)" }}>{formatMoney(item.baseNetWorthBoost)}</div>
        </div>
      </div>

      {item.owned ? (
        <div className="badge badge-gold" style={{ width: "100%", justifyContent: "center", padding: "10px 0" }}>
          ✨ Owned
        </div>
      ) : (
        <button
          className={`btn ${canAfford ? "btn-gold" : "btn-ghost"}`}
          style={{ width: "100%", fontSize: 14 }}
          onClick={() => buyLuxuryItem(item.id, [])}
          disabled={!canAfford}
        >
          {canAfford ? `Buy for ${priceDisplay}` : `Need ${priceDisplay}`}
        </button>
      )}
    </div>
  );
}

export default function LuxuryPage() {
  const { luxuryItems, money, netWorth } = useGameStore();
  const [filter, setFilter] = useState<LuxuryCategory | "ALL">("ALL");

  const filtered = filter === "ALL" ? luxuryItems : luxuryItems.filter((l) => l.category === filter);
  const ownedItems = luxuryItems.filter((l) => l.owned);
  const ownedNetWorth = ownedItems.reduce((s, l) => s + l.baseNetWorthBoost, 0);

  return (
    <div className="section">
      <div style={{ marginBottom: 24 }}>
        <h1 className="section-title">Luxury Items</h1>
        <p className="section-subtitle">{ownedItems.length} items owned · {formatMoney(ownedNetWorth)} in luxury assets</p>
      </div>

      <div className="grid-2" style={{ marginBottom: 20, gap: 10 }}>
        <div className="stat-box" style={{ background: "rgba(245,197,24,0.08)", border: "1px solid rgba(245,197,24,0.2)" }}>
          <div className="stat-label">Cash</div>
          <div className="stat-value text-gold" style={{ fontSize: 18 }}>{formatMoney(money)}</div>
        </div>
        <div className="stat-box" style={{ background: "rgba(34,211,160,0.08)", border: "1px solid rgba(34,211,160,0.2)" }}>
          <div className="stat-label">Net Worth</div>
          <div className="stat-value text-green" style={{ fontSize: 18 }}>{formatMoney(netWorth)}</div>
        </div>
      </div>

      {/* Category filter */}
      <div style={{ overflowX: "auto", marginBottom: 20, paddingBottom: 4 }}>
        <div style={{ display: "flex", gap: 6, minWidth: "max-content" }}>
          <button
            className={`btn btn-sm ${filter === "ALL" ? "btn-gold" : "btn-ghost"}`}
            onClick={() => setFilter("ALL")}
          >
            All ({luxuryItems.length})
          </button>
          {(Object.keys(CATEGORY_LABELS) as LuxuryCategory[]).map((cat) => (
            <button
              key={cat}
              className={`btn btn-sm ${filter === cat ? "btn-gold" : "btn-ghost"}`}
              onClick={() => setFilter(cat)}
              style={{ fontSize: 12 }}
            >
              {CATEGORY_ICONS[cat]} {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
        {filtered.map((item) => <LuxuryCard key={item.id} item={item} />)}
      </div>
    </div>
  );
}
