import { useNavigate, useLocation } from "react-router-dom";
import { useGameStore } from "../store/gameStore";
import { formatMoney } from "../utils/format";
import { InsigniaModal } from "./InsigniaModal";

const navItems = [
  { path: "/businesses", icon: "💼", label: "Business" },
  { path: "/investments", icon: "📈", label: "Invest" },
  { path: "/properties", icon: "🏘️", label: "Property" },
  { path: "/crypto", icon: "₿", label: "Crypto" },
  { path: "/profile", icon: "👤", label: "Profile" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { money, incomePerHour } = useGameStore();

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
      {/* Top Bar */}
      <header style={{
        height: "var(--nav-height)",
        background: "rgba(13,20,37,0.95)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        padding: "0 20px",
        gap: 16,
        flexShrink: 0,
        zIndex: 100,
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 900, fontSize: 18 }}>
          <span style={{ fontSize: 22 }}>💼</span>
          <span style={{
            background: "linear-gradient(135deg, #f5c518, #e8971a)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontWeight: 900,
          }}>RichMan</span>
        </div>

        <div style={{ flex: 1 }} />

        {/* Money display */}
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{
            background: "rgba(245,197,24,0.1)",
            border: "1px solid rgba(245,197,24,0.2)",
            borderRadius: "var(--radius-md)",
            padding: "6px 14px",
            textAlign: "center",
          }}>
            <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Cash</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: "var(--accent-gold)" }}>{formatMoney(money)}</div>
          </div>
          <div style={{
            background: "rgba(34,211,160,0.1)",
            border: "1px solid rgba(34,211,160,0.2)",
            borderRadius: "var(--radius-md)",
            padding: "6px 14px",
            textAlign: "center",
            display: "none",
          }} className="desktop-only">
            <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>/hr</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: "var(--accent-green)" }}>{formatMoney(incomePerHour)}</div>
          </div>
        </div>

        {/* Desktop nav */}
        <nav style={{ display: "flex", gap: 4 }} className="desktop-nav">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                background: location.pathname === item.path ? "rgba(245,197,24,0.15)" : "transparent",
                border: "none",
                borderRadius: "var(--radius-sm)",
                padding: "8px 14px",
                color: location.pathname === item.path ? "var(--accent-gold)" : "var(--text-muted)",
                cursor: "pointer",
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 600,
                fontSize: 13,
                display: "flex",
                alignItems: "center",
                gap: 6,
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                if (location.pathname !== item.path) {
                  (e.target as HTMLButtonElement).style.color = "var(--text-primary)";
                }
              }}
              onMouseLeave={(e) => {
                if (location.pathname !== item.path) {
                  (e.target as HTMLButtonElement).style.color = "var(--text-muted)";
                }
              }}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </header>

      {/* Page content */}
      <main style={{ flex: 1, overflowY: "auto", paddingBottom: "80px" }}>
        {children}
      </main>

      <InsigniaModal />

      {/* Mobile bottom nav */}
      <nav style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: "var(--nav-bottom)",
        background: "rgba(13,20,37,0.97)",
        backdropFilter: "blur(20px)",
        borderTop: "1px solid var(--border)",
        display: "flex",
        zIndex: 100,
      }} className="mobile-nav">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 3,
                border: "none",
                background: "transparent",
                cursor: "pointer",
                color: isActive ? "var(--accent-gold)" : "var(--text-muted)",
                fontFamily: "'Outfit', sans-serif",
                fontSize: 10,
                fontWeight: 600,
                transition: "all 0.2s",
                position: "relative",
              }}
            >
              {isActive && (
                <div style={{
                  position: "absolute",
                  top: 0,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 32,
                  height: 2,
                  borderRadius: "0 0 2px 2px",
                  background: "var(--accent-gold)",
                }} />
              )}
              <span style={{ fontSize: 20 }}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <style>{`
        @media (min-width: 769px) {
          .mobile-nav { display: none !important; }
          .desktop-nav { display: flex !important; }
          .desktop-only { display: block !important; }
          main { padding-bottom: 0 !important; }
        }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
        }
      `}</style>
    </div>
  );
}
