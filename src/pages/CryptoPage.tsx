import { useGameStore } from "../store/gameStore";
import { formatMoney, formatPercent, formatCryptoAmount, isPositiveChange } from "../utils/format";

export default function CryptoPage() {
  const { crypto, money, buyCrypto, sellCrypto } = useGameStore();

  return (
    <div className="section">
      <div className="section-header">
        <div>
          <h1 className="section-title">Crypto Exchange</h1>
          <p className="section-subtitle">High volatility digital assets</p>
        </div>
      </div>

      <div className="grid-auto">
        {crypto.map((coin) => {
          const isUp = isPositiveChange(coin.currentPrice, coin.previousPrice);

          return (
            <div key={coin.id} className="card" style={{ padding: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    background: coin.color + "22",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 24,
                    color: coin.color
                  }}>
                    {coin.icon}
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 16 }}>{coin.name}</div>
                    <div style={{ color: "var(--text-secondary)", fontSize: 12 }}>{coin.symbol}</div>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: 800, fontSize: 16 }}>{formatMoney(coin.currentPrice)}</div>
                  <div style={{ 
                    fontSize: 12, 
                    fontWeight: 700, 
                    color: isUp ? "var(--accent-green)" : "var(--accent-red)" 
                  }}>
                    {isUp ? "▲" : "▼"} {formatPercent(coin.currentPrice, coin.previousPrice)}
                  </div>
                </div>
              </div>

              <div style={{ 
                background: "rgba(0,0,0,0.2)", 
                borderRadius: "var(--radius-md)", 
                padding: 12, 
                marginBottom: 16,
                display: "flex",
                justifyContent: "space-between"
              }}>
                <div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600 }}>OWNED</div>
                  <div style={{ fontWeight: 700 }}>{formatCryptoAmount(coin.amountOwned, coin.symbol)}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600 }}>VALUE</div>
                  <div style={{ fontWeight: 700, color: "var(--accent-gold)" }}>{formatMoney((coin.amountOwned * coin.currentPrice) / 100_000_000n)}</div>
                </div>
              </div>

              <div className="grid-2">
                <button 
                  className="btn btn-gold btn-sm"
                  disabled={money < coin.currentPrice / 10n} // Min buy 0.1 coins
                  onClick={() => buyCrypto(coin.id, 10_000_000n)} // Buy 0.1 satoshis
                >
                  Buy 0.1
                </button>
                <button 
                  className="btn btn-ghost btn-sm"
                  disabled={coin.amountOwned <= 0n}
                  onClick={() => sellCrypto(coin.id, coin.amountOwned)}
                >
                  Sell All
                </button>
              </div>
              
              {coin.nftOnly && (
                <div style={{ 
                  marginTop: 12, 
                  fontSize: 10, 
                  color: "var(--text-secondary)", 
                  textAlign: "center",
                  background: "rgba(167, 139, 250, 0.1)",
                  padding: "4px 8px",
                  borderRadius: 4
                }}>
                  PURCHASE CURRENCY FOR PREMIUM NFT ART
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
