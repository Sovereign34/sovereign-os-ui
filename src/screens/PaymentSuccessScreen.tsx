import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";

export default function PaymentSuccessScreen() {
  const navigate       = useNavigate();
  const refreshProfile = useAuthStore(s => s.refreshProfile);

  useEffect(() => {
    const t = setTimeout(async () => {
      await refreshProfile();
      navigate("/junior/hafiza");
    }, 2500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{
      minHeight: "100vh", background: "#0D0D0D",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      fontFamily: "'DM Mono', monospace", color: "#E5E5E5",
      gap: 16,
    }}>
      <div style={{ fontSize: 40 }}>✅</div>
      <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Ödeme alındı</h2>
      <p style={{ color: "#666", fontSize: 13 }}>
        Plan güncelleniyor, yönlendiriliyorsun…
      </p>
    </div>
  );
      }
