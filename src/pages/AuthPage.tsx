import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function AuthPage() {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, error } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (mode === "signin") {
      await signInWithEmail(email, password);
    } else {
      await signUpWithEmail(email, password, displayName);
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    setLoading(true);
    await signInWithGoogle();
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--bg-primary)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Animated background orbs */}
      {[...Array(5)].map((_, i) => (
        <div key={i} style={{
          position: "absolute",
          width: `${150 + i * 80}px`,
          height: `${150 + i * 80}px`,
          borderRadius: "50%",
          background: i % 2 === 0
            ? "radial-gradient(circle, rgba(245,197,24,0.08), transparent)"
            : "radial-gradient(circle, rgba(96,165,250,0.06), transparent)",
          top: `${10 + i * 18}%`,
          left: `${-5 + i * 22}%`,
          animation: `float ${4 + i}s ease-in-out infinite`,
          animationDelay: `${i * 0.5}s`,
          pointerEvents: "none",
        }} />
      ))}

      <div style={{ width: "100%", maxWidth: 420, position: "relative", zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 64, marginBottom: 12, animation: "float 4s ease-in-out infinite" }}>💼</div>
          <h1 style={{
            fontSize: 36,
            fontWeight: 900,
            background: "linear-gradient(135deg, #f5c518, #e8971a)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: 8,
          }}>RichMan Empire</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: 15 }}>
            Build your business empire from scratch
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-bright)",
          borderRadius: "var(--radius-xl)",
          padding: 32,
          boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
        }}>
          {/* Tabs */}
          <div className="tabs" style={{ marginBottom: 24 }}>
            <button className={`tab ${mode === "signin" ? "active" : ""}`} onClick={() => setMode("signin")}>Sign In</button>
            <button className={`tab ${mode === "signup" ? "active" : ""}`} onClick={() => setMode("signup")}>Sign Up</button>
          </div>

          {/* Google button */}
          <button
            className="btn btn-ghost btn-lg"
            style={{ width: "100%", marginBottom: 20, gap: 12 }}
            onClick={handleGoogle}
            disabled={loading}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div className="divider" style={{ flex: 1, margin: 0 }} />
            <span style={{ color: "var(--text-muted)", fontSize: 12, fontWeight: 600 }}>OR</span>
            <div className="divider" style={{ flex: 1, margin: 0 }} />
          </div>

          {/* Email form */}
          <form onSubmit={handleEmail} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {mode === "signup" && (
              <input
                type="text"
                placeholder="Display Name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
              />
            )}
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password (min. 6 chars)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />

            {error && (
              <div style={{
                background: "rgba(244,63,94,0.1)",
                border: "1px solid rgba(244,63,94,0.3)",
                borderRadius: "var(--radius-sm)",
                padding: "10px 14px",
                color: "var(--accent-red)",
                fontSize: 13,
              }}>
                {error.replace("Firebase: ", "").replace(/\(auth\/[^)]+\)/, "").trim()}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-gold btn-lg"
              style={{ width: "100%", marginTop: 4 }}
              disabled={loading}
            >
              {loading ? "Loading..." : mode === "signin" ? "Sign In" : "Create Account"}
            </button>
          </form>
        </div>

        <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: 12, marginTop: 24 }}>
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
