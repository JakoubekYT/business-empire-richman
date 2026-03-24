import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { useGameStore } from "./store/gameStore";
import Layout from "./components/Layout";
import AuthPage from "./pages/AuthPage";
import BusinessesPage from "./pages/BusinessesPage";
import PropertiesPage from "./pages/PropertiesPage";
import InvestmentsPage from "./pages/InvestmentsPage";
import CryptoPage from "./pages/CryptoPage";
import ProfilePage from "./pages/ProfilePage";
import { MonopolyAnimation } from "./components/MonopolyAnimation";
import "./index.css";

function GameLoader() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", flexDirection: "column", gap: 16, background: "var(--bg-primary)" }}>
      <div style={{ fontSize: 48 }}>💼</div>
      <div className="spinner" />
      <div style={{ color: "var(--text-secondary)", fontSize: 14 }}>Loading your empire...</div>
    </div>
  );
}

function ProtectedApp() {
  const { user, loading } = useAuth();
  const { tick, updateMarketPrices, saveGame } = useGameStore();

  useEffect(() => {
    if (!user) return;
    const tickInterval = setInterval(() => tick(), 1000);
    const marketInterval = setInterval(() => updateMarketPrices(), 5000);
    const saveInterval = setInterval(() => saveGame(), 30000);
    return () => {
      clearInterval(tickInterval);
      clearInterval(marketInterval);
      clearInterval(saveInterval);
    };
  }, [user]);

  if (loading) return <GameLoader />;
  if (!user) return <AuthPage />;

  return (
    <Layout>
      <MonopolyAnimation />
      <Routes>
        <Route path="/businesses" element={<BusinessesPage />} />
        <Route path="/properties" element={<PropertiesPage />} />
        <Route path="/investments" element={<InvestmentsPage />} />
        <Route path="/crypto" element={<CryptoPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/" element={<Navigate to="/businesses" replace />} />
        <Route path="*" element={<Navigate to="/businesses" replace />} />
      </Routes>
    </Layout>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ProtectedApp />
      </AuthProvider>
    </BrowserRouter>
  );
}
