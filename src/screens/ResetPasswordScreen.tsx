// src/screens/ResetPasswordScreen.tsx
// Session 10 — Şifre sıfırlama ekranı
// Supabase magic link ile gelinen /sifre-sifirla rotasında yeni şifre belirlenir.

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function ResetPasswordScreen() {
  const navigate = useNavigate();

  const [pass,    setPass]    = useState("");
  const [pass2,   setPass2]   = useState("");
  const [error,   setError]   = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ready,   setReady]   = useState(false);

  // Supabase magic link callback — session hash'ten oturumu çöz
  useEffect(() => {
    supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setReady(true);
      }
    });
  }, []);

  const handleSubmit = async () => {
    if (pass !== pass2) { setError("Şifreler eşleşmiyor"); return; }
    if (pass.length < 6) { setError("Şifre en az 6 karakter olmalı"); return; }

    setLoading(true); setError(null);
    try {
      const { error: err } = await supabase.auth.updateUser({ password: pass });
      if (err) throw err;
      setSuccess(true);
      setTimeout(() => navigate("/giris"), 2500);
    } catch (e: any) {
      setError(e.message ?? "Şifre güncellenemedi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#0F0F0F",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Inter', system-ui, sans-serif", padding: 16,
    }}>
      <div style={{
        width: "100%", maxWidth: 360,
        background: "#1A1A1A", border: "1px solid #2A2A2A",
        borderRadius: 16, padding: "36px 28px",
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10, margin: "0 auto 14px",
            background: "linear-gradient(135deg,#7C3AED,#9061F9)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, color: "#fff", fontWeight: 800,
          }}>S</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#EDEDEC" }}>Yeni Şifre Belirle</div>
          <div style={{
            fontSize: 11, color: "#555550", marginTop: 4,
            fontFamily: "'JetBrains Mono', monospace",
          }}>sovereign-engine · auth</div>
        </div>

        {success ? (
          <div style={{
            padding: "14px", borderRadius: 10, textAlign: "center",
            background: "#22C55E18", border: "1px solid #22C55E40",
          }}>
            <div style={{ fontSize: 22, marginBottom: 8 }}>✅</div>
            <div style={{ fontSize: 13, color: "#EDEDEC", fontWeight: 600 }}>Şifre güncellendi</div>
            <div style={{ fontSize: 11, color: "#777770", marginTop: 4 }}>
              Giriş ekranına yönlendiriliyorsun...
            </div>
          </div>
        ) : !ready ? (
          <div style={{ textAlign: "center", color: "#555550", fontSize: 12, padding: "20px 0" }}>
            <div style={{ marginBottom: 8, fontSize: 20 }}>⏳</div>
            Link doğrulanıyor...
          </div>
        ) : (
          <>
            <input
              type="password" placeholder="Yeni şifre (min. 6 karakter)"
              value={pass} onChange={e => setPass(e.target.value)}
              style={inputStyle}
            />
            <input
              type="password" placeholder="Yeni şifre tekrar"
              value={pass2} onChange={e => setPass2(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
              style={{ ...inputStyle, marginTop: 8 }}
            />

            {pass && pass2 && pass !== pass2 && (
              <div style={{
                marginTop: 6, fontSize: 11, color: "#EF4444",
                fontFamily: "'JetBrains Mono', monospace",
              }}>Şifreler eşleşmiyor</div>
            )}

            {error && (
              <div style={{
                marginTop: 10, padding: "8px 12px", borderRadius: 8,
                background: "#EF444418", border: "1px solid #EF444440",
                fontSize: 11, color: "#EF4444", fontFamily: "'JetBrains Mono', monospace",
              }}>{error}</div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading || !pass || !pass2 || pass !== pass2}
              style={{
                ...btnStyle,
                background: (!loading && pass && pass === pass2)
                  ? "linear-gradient(135deg,#7C3AED,#9061F9)" : "#2A2A2A",
                color: (!loading && pass && pass === pass2) ? "#fff" : "#555550",
                cursor: (!loading && pass && pass === pass2) ? "pointer" : "not-allowed",
                marginTop: 14,
              }}
            >
              {loading ? "Güncelleniyor..." : "Şifreyi Güncelle →"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%", background: "#0F0F0F",
  border: "1px solid #2A2A2A", borderRadius: 8,
  padding: "11px 14px", color: "#EDEDEC",
  fontSize: 14, fontFamily: "inherit", outline: "none",
  caretColor: "#7C3AED", boxSizing: "border-box",
};

const btnStyle: React.CSSProperties = {
  width: "100%", padding: "12px",
  borderRadius: 8, border: "none",
  fontSize: 13, fontWeight: 700,
  fontFamily: "inherit", transition: "all .15s",
};
      
