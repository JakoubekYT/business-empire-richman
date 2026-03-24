import { useState, useRef } from "react";
import { useGameStore } from "../store/gameStore";
import { formatMoney } from "../utils/format";
import type { Business } from "../types/game";
import { BusinessDetailPanel } from "../components/BusinessDetailPanel";

interface ClickParticle {
  id: number;
  x: number;
  y: number;
  value: number;
}

function BusinessCard({ business, onClick }: { business: Business, onClick?: () => void }) {
  const { unlockBusiness, money } = useGameStore();
  const canAffordUnlock = money >= business.unlockCost;

  return (
    <div className="card" onClick={business.owned ? onClick : undefined} style={{
      padding: 16,
      border: business.owned ? `1px solid ${business.color}30` : "1px solid var(--border)",
      background: business.owned ? `linear-gradient(135deg, var(--bg-card), ${business.color}08)` : "var(--bg-card)",
      transition: "all 0.2s",
      animation: "slideInUp 0.3s ease",
      cursor: business.owned ? "pointer" : "default",
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
          <span className="badge" style={{ fontSize: 10, background: `${business.color}15`, color: business.color, border: `1px solid ${business.color}30`, textTransform: 'uppercase' }}>
            {business.type.replace('_', ' ')}
          </span>
        </div>
        {business.owned && (
          <span className="badge badge-green" style={{ fontSize: 10, flexShrink: 0 }}>
            ACQUIRED
          </span>
        )}
      </div>

      {business.owned ? (
        <div style={{ marginBottom: 12 }}>
          <p style={{ color: "var(--text-secondary)", fontSize: 13, marginBottom: 12, lineHeight: 1.4 }}>
             Tap to open the business management panel and expand your empire's reach.
          </p>
          <button
            className="btn btn-gold w-full"
            style={{ fontSize: 13 }}
            onClick={onClick}
          >
            Manage Enterprise
          </button>
        </div>
      ) : (
        <div>
          <p style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 12, lineHeight: 1.4 }}>
            {business.description}
          </p>
          <button
            className={`btn w-full ${canAffordUnlock ? "btn-gold" : "btn-ghost"}`}
            style={{ fontSize: 13 }}
            onClick={(e) => { e.stopPropagation(); unlockBusiness(business.id); }}
            disabled={!canAffordUnlock}
          >
            {business.unlockCost === 0 ? "🚀 Start Free!" : `🔓 ${formatMoney(business.unlockCost)}`}
          </button>
        </div>
      )}
    </div>
  );
}

export default function BusinessesPage() {
  const { businesses, incomePerHour, money, click, clickValue } = useGameStore();
  const [filter, setFilter] = useState<string>("ALL");
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  
  const [particles, setParticles] = useState<ClickParticle[]>([]);
  const [clickAnim, setClickAnim] = useState(false);
  const particleIdRef = useRef(0);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    click();
    setClickAnim(true);
    setTimeout(() => setClickAnim(false), 100);
    const rect = e.currentTarget.getBoundingClientRect();
    const id = particleIdRef.current++;
    setParticles((prev) => [...prev, { id, x: e.clientX - rect.left, y: e.clientY - rect.top, value: clickValue }]);
    setTimeout(() => setParticles((prev) => prev.filter((p) => p.id !== id)), 800);
  };

  const categories = ["ALL", "taxi", "car_dealership", "store", "factory", "shipping", "construction", "it_company", "bank", "football", "oil_gas", "clothing", "space", "merger"];
  const filtered = filter === "ALL" ? businesses : businesses.filter((b) => b.type === filter);
  const ownedCount = businesses.filter((b) => b.owned).length;

  return (
    <div className="section">
      <div className="section-header">
        <div>
          <h1 className="section-title">Empire</h1>
          <p className="section-subtitle">{ownedCount} / {businesses.length} ventures · {formatMoney(incomePerHour)}/hr</p>
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

      {/* Manual Clicker Area */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 32, marginTop: 12 }}>
        <div 
          onClick={handleClick}
          style={{ 
            position: "relative", 
            cursor: "pointer",
            width: 140,
            height: 140,
            borderRadius: "50%",
            background: clickAnim ? "var(--accent-gold)" : "rgba(245,197,24,0.1)",
            border: "2px solid var(--accent-gold)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 48,
            transition: "all 0.1s ease",
            transform: clickAnim ? "scale(0.95)" : "scale(1)",
            boxShadow: clickAnim ? "0 0 40px rgba(245,197,24,0.4)" : "none",
            userSelect: "none"
          }}
        >
          💰
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
              zIndex: 10
            }}>
              +${p.value}
            </div>
          ))}
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
          <BusinessCard key={business.id} business={business} onClick={() => setSelectedBusiness(business)} />
        ))}
      </div>

      {/* Detail Panel overlay */}
      {selectedBusiness && (
        <BusinessDetailPanel
          business={selectedBusiness}
          onClose={() => setSelectedBusiness(null)}
        />
      )}
    </div>
  );
}
