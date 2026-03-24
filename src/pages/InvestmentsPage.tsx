import { useState } from "react";
import { useGameStore } from "../store/gameStore";
import { formatMoney, formatPercent, isPositiveChange } from "../utils/format";
import type { Stock } from "../types/game";

// Mini sparkline chart using SVG
function MiniChart({ data, color }: { data: (number | bigint)[]; color: string }) {
  if (data.length < 2) return null;
  const numData = data.map(v => Number(v));
  const min = Math.min(...numData);
  const max = Math.max(...numData);
  const range = max - min || 1;
  const w = 80, h = 36;
  const pts = numData.map((v, i) => `${(i / (numData.length - 1)) * w},${h - ((v - min) / range) * h}`).join(" ");

  return (
    <svg width={w} height={h} style={{ flexShrink: 0 }}>
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.8}
      />
    </svg>
  );
}

function StockCard({ stock }: { stock: Stock }) {
  const { buyShares, sellShares, money } = useGameStore();
  const [amount, setAmount] = useState(1);
  const isUp = isPositiveChange(stock.currentPrice, stock.previousPrice);
  const totalCost = stock.currentPrice * BigInt(amount);
  const canBuy = money >= totalCost;
  const canSell = stock.sharesOwned >= BigInt(amount);

  return (
    <div className="card" style={{ padding: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
        <div style={{
          width: 44,
          height: 44,
          borderRadius: "var(--radius-sm)",
          background: `${stock.color}20`,
          border: `1px solid ${stock.color}40`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 900,
          fontSize: 12,
          color: stock.color,
          flexShrink: 0,
        }}>
          {stock.ticker}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 14 }}>{stock.name}</div>
          <span className="badge" style={{ fontSize: 10, background: "rgba(255,255,255,0.06)", color: "var(--text-muted)", border: "1px solid var(--border)" }}>
            {stock.sector}
          </span>
        </div>
        <MiniChart data={stock.priceHistory} color={isUp ? "#22d3a0" : "#f43f5e"} />
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600, marginBottom: 2 }}>PRICE</div>
          <div style={{ fontWeight: 800, fontSize: 18 }}>{formatMoney(stock.currentPrice)}</div>
          <div style={{ fontSize: 12, color: isUp ? "var(--accent-green)" : "var(--accent-red)", fontWeight: 600 }}>
            {formatPercent(stock.currentPrice, stock.previousPrice)}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600, marginBottom: 2 }}>OWNED</div>
          <div style={{ fontWeight: 700, fontSize: 16 }}>{stock.sharesOwned.toString()}</div>
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
            {stock.sharesOwned > 0n ? `≈ ${formatMoney(stock.sharesOwned * stock.currentPrice)}` : "None"}
          </div>
        </div>
      </div>

      {stock.sharesOwned > 0n && (
        <div style={{ background: "rgba(245,197,24,0.08)", border: "1px solid rgba(245,197,24,0.15)", borderRadius: "var(--radius-sm)", padding: "8px 12px", marginBottom: 12, fontSize: 12 }}>
          Dividend: {formatMoney(stock.sharesOwned * stock.dividendPerShare)}/hr
        </div>
      )}

      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <button className="btn btn-ghost btn-sm" onClick={() => setAmount(Math.max(1, amount - 1))} style={{ padding: "6px 10px" }}>−</button>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Math.max(1, parseInt(e.target.value) || 1))}
            style={{ width: 56, textAlign: "center", padding: "6px 8px", fontSize: 13 }}
            min={1}
          />
          <button className="btn btn-ghost btn-sm" onClick={() => setAmount(amount + 10)} style={{ padding: "6px 10px" }}>+10</button>
        </div>
        <button
          className={`btn btn-sm ${canBuy ? "btn-green" : "btn-ghost"}`}
          style={{ flex: 1, fontSize: 12 }}
          onClick={() => { buyShares(stock.ticker, amount); }}
          disabled={!canBuy}
        >
          Buy
        </button>
        <button
          className={`btn btn-sm ${canSell ? "btn-red" : "btn-ghost"}`}
          style={{ flex: 1, fontSize: 12 }}
          onClick={() => sellShares(stock.ticker, amount)}
          disabled={!canSell}
        >
          Sell
        </button>
      </div>
    </div>
  );
}

export default function InvestmentsPage() {
  const { stocks, money } = useGameStore();

  const portfolioStockValue = stocks.reduce((s, st) => s + st.sharesOwned * st.currentPrice, 0n);
  const totalDividends = stocks.reduce((s, st) => s + st.sharesOwned * st.dividendPerShare, 0n);

  return (
    <div className="section">
      <div className="section-header">
        <div>
          <h1 className="section-title">Stock Market</h1>
          <p className="section-subtitle">Equity and Dividend Portfolio</p>
        </div>
        <div style={{
          background: "rgba(96,165,250,0.1)",
          border: "1px solid rgba(96,165,250,0.2)",
          borderRadius: "var(--radius-md)",
          padding: "6px 12px",
          textAlign: "center",
        }}>
          <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600 }}>CASH</div>
          <div style={{ color: "var(--accent-blue)", fontWeight: 800 }}>{formatMoney(money)}</div>
        </div>
      </div>

      {/* Portfolio overview */}
      <div style={{ marginBottom: 20 }}>
        <div className="stat-box" style={{ background: "rgba(96,165,250,0.08)", border: "1px solid rgba(96,165,250,0.2)" }}>
          <div className="stat-label">Total Portfolio Value</div>
          <div className="stat-value text-blue">{formatMoney(portfolioStockValue)}</div>
          <div style={{ fontSize: 11, color: "var(--accent-green)", marginTop: 4 }}>
            Passive Dividends: {formatMoney(totalDividends)}/hr
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
        {stocks.map((s) => <StockCard key={s.ticker} stock={s} />)}
      </div>
    </div>
  );
}
