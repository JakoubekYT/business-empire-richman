import { useState } from "react";
import { useGameStore } from "../store/gameStore";
import { formatMoney, formatPercent, isPositiveChange } from "../utils/format";
import type { Stock, CryptoCoin } from "../types/game";

// Mini sparkline chart using SVG
function MiniChart({ data, color }: { data: number[]; color: string }) {
  if (data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 80, h = 36;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(" ");

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
  const totalCost = stock.currentPrice * amount;
  const canBuy = money >= totalCost;
  const canSell = stock.sharesOwned >= amount;

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
          <div style={{ fontWeight: 800, fontSize: 18 }}>${stock.currentPrice.toFixed(2)}</div>
          <div style={{ fontSize: 12, color: isUp ? "var(--accent-green)" : "var(--accent-red)", fontWeight: 600 }}>
            {formatPercent(stock.currentPrice, stock.previousPrice)}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600, marginBottom: 2 }}>OWNED</div>
          <div style={{ fontWeight: 700, fontSize: 16 }}>{stock.sharesOwned.toLocaleString()}</div>
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
            {stock.sharesOwned > 0 ? `≈ ${formatMoney(stock.sharesOwned * stock.currentPrice)}` : "None"}
          </div>
        </div>
      </div>

      {stock.sharesOwned > 0 && (
        <div style={{ background: "rgba(245,197,24,0.08)", border: "1px solid rgba(245,197,24,0.15)", borderRadius: "var(--radius-sm)", padding: "8px 12px", marginBottom: 12, fontSize: 12 }}>
          Dividend: {formatMoney(stock.sharesOwned * stock.dividendPerShare * 1000)}/hr
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

function CryptoCard({ coin }: { coin: CryptoCoin }) {
  const { buyCrypto, sellCrypto, money } = useGameStore();
  const [amount, setAmount] = useState(coin.currentPrice < 1 ? 100 : 1);
  const isUp = isPositiveChange(coin.currentPrice, coin.previousPrice);
  const totalCost = coin.currentPrice * amount;
  const canBuy = money >= totalCost;
  const canSell = coin.amountOwned >= amount;

  const volColors = { LOW: "var(--accent-green)", MEDIUM: "var(--accent-blue)", HIGH: "var(--accent-gold)", EXTREME: "var(--accent-red)" };

  return (
    <div className="card" style={{ padding: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
        <div style={{
          width: 44,
          height: 44,
          borderRadius: "50%",
          background: `${coin.color}20`,
          border: `1px solid ${coin.color}40`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 20,
          fontWeight: 900,
          color: coin.color,
          flexShrink: 0,
        }}>
          {coin.icon}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 14 }}>{coin.name}</div>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <span style={{ color: "var(--text-muted)", fontSize: 12 }}>{coin.symbol}</span>
            <span className="badge" style={{ fontSize: 9, background: `${volColors[coin.volatility]}15`, color: volColors[coin.volatility], border: `1px solid ${volColors[coin.volatility]}30` }}>
              {coin.volatility} VOL
            </span>
          </div>
        </div>
        <MiniChart data={coin.priceHistory} color={isUp ? "#22d3a0" : "#f43f5e"} />
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600, marginBottom: 2 }}>PRICE</div>
          <div style={{ fontWeight: 800, fontSize: 16 }}>
            {coin.currentPrice < 1 ? `$${coin.currentPrice.toFixed(4)}` : formatMoney(coin.currentPrice)}
          </div>
          <div style={{ fontSize: 12, color: isUp ? "var(--accent-green)" : "var(--accent-red)", fontWeight: 600 }}>
            {formatPercent(coin.currentPrice, coin.previousPrice)}
          </div>
        </div>
        {coin.amountOwned > 0 && (
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600, marginBottom: 2 }}>HOLDING</div>
            <div style={{ fontWeight: 700, fontSize: 14 }}>{coin.amountOwned.toFixed(4)}</div>
            <div style={{ fontSize: 12, color: "var(--accent-green)" }}>{formatMoney(coin.amountOwned * coin.currentPrice)}</div>
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <button className="btn btn-ghost btn-sm" onClick={() => setAmount(Math.max(0.001, amount / 2))} style={{ padding: "6px 10px" }}>½</button>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Math.max(0.001, parseFloat(e.target.value) || 0.001))}
            style={{ width: 64, textAlign: "center", padding: "6px 8px", fontSize: 12 }}
            step={coin.currentPrice < 1 ? 10 : 0.1}
            min={0.001}
          />
          <button className="btn btn-ghost btn-sm" onClick={() => setAmount(amount * 2)} style={{ padding: "6px 10px" }}>×2</button>
        </div>
        <button
          className={`btn btn-sm ${canBuy ? "btn-green" : "btn-ghost"}`}
          style={{ flex: 1, fontSize: 12 }}
          onClick={() => buyCrypto(coin.id, amount)}
          disabled={!canBuy}
        >
          Buy {formatMoney(totalCost)}
        </button>
        <button
          className={`btn btn-sm ${canSell ? "btn-red" : "btn-ghost"}`}
          style={{ flex: 1, fontSize: 12 }}
          onClick={() => sellCrypto(coin.id, amount)}
          disabled={!canSell}
        >
          Sell
        </button>
      </div>
    </div>
  );
}

export default function InvestmentsPage() {
  const { stocks, crypto, money } = useGameStore();
  const [tab, setTab] = useState<"stocks" | "crypto">("stocks");

  const portfolioStockValue = stocks.reduce((s, st) => s + st.sharesOwned * st.currentPrice, 0);
  const portfolioCryptoValue = crypto.reduce((s, c) => s + c.amountOwned * c.currentPrice, 0);
  const totalDividends = stocks.reduce((s, st) => s + st.sharesOwned * st.dividendPerShare * 1000, 0);

  return (
    <div className="section">
      <div className="section-header">
        <div>
          <h1 className="section-title">Investments</h1>
          <p className="section-subtitle">Stocks + Crypto portfolio</p>
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
      <div className="grid-2" style={{ marginBottom: 20, gap: 10 }}>
        <div className="stat-box" style={{ background: "rgba(96,165,250,0.08)", border: "1px solid rgba(96,165,250,0.2)" }}>
          <div className="stat-label">Stocks Value</div>
          <div className="stat-value text-blue">{formatMoney(portfolioStockValue)}</div>
          <div style={{ fontSize: 11, color: "var(--accent-green)", marginTop: 4 }}>+{formatMoney(totalDividends)}/hr</div>
        </div>
        <div className="stat-box" style={{ background: "rgba(245,197,24,0.08)", border: "1px solid rgba(245,197,24,0.2)" }}>
          <div className="stat-label">Crypto Value</div>
          <div className="stat-value text-gold">{formatMoney(portfolioCryptoValue)}</div>
          <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>High volatility</div>
        </div>
      </div>

      {/* Tab */}
      <div className="tabs" style={{ marginBottom: 20 }}>
        <button className={`tab ${tab === "stocks" ? "active" : ""}`} onClick={() => setTab("stocks")}>📈 Stocks (10)</button>
        <button className={`tab ${tab === "crypto" ? "active" : ""}`} onClick={() => setTab("crypto")}>₿ Crypto (11)</button>
      </div>

      {tab === "stocks" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
          {stocks.map((s) => <StockCard key={s.ticker} stock={s} />)}
        </div>
      )}

      {tab === "crypto" && (
        <div>
          <div style={{ background: "rgba(244,63,94,0.08)", border: "1px solid rgba(244,63,94,0.15)", borderRadius: "var(--radius-md)", padding: "12px 16px", marginBottom: 16 }}>
            <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.5 }}>
              ⚠️ Cryptocurrency is highly volatile. <strong>Exxes (EXX)</strong> is extremely volatile — potential trillions in profit or loss per trade in late game!
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
            {crypto.map((c) => <CryptoCard key={c.id} coin={c} />)}
          </div>
        </div>
      )}
    </div>
  );
}
