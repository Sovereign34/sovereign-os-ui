// src/components/FeatureGate.tsx
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";

const TIER_ORDER: Record<string, number> = { free: 0, solo: 1, pro: 2, team: 3 };

const TIER_LABELS: Record<string, string> = {
  solo: "Solo ($29/ay)",
  pro: "Pro ($79/ay)",
  team: "Team ($199/ay)",
};

interface FeatureGateProps {
  requiredTier: "solo" | "pro" | "team";
  feature: string;
  children: React.ReactNode;
}

export function FeatureGate({ requiredTier, feature, children }: FeatureGateProps) {
  const { tier } = useAuthStore();
  const navigate = useNavigate();

  if (TIER_ORDER[tier] >= TIER_ORDER[requiredTier]) return <>{children}</>;

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: 320,
      padding: 32,
      textAlign: "center",
      border: "1px dashed #2A2A2A",
      borderRadius: 12,
      margin: 16,
      background: "#111",
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: 12,
        background: "linear-gradient(135deg,#7C3AED,#9061F9)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 22, marginBottom: 16,
      }}>
        🔒
      </div>
      <div style={{ fontSize: 15, fontWeight: 700, color: "#EDEDEC", marginBottom: 8 }}>
        {feature}
      </div>
      <div style={{ fontSize: 13, color: "#555550", marginBottom: 24, maxWidth: 260 }}>
        Bu özellik <span style={{ color: "#2DD4BF", fontWeight: 600 }}>{TIER_LABELS[requiredTier]}</span> planı gerektirir.
      </div>
      <button
        onClick={() => navigate("/junior/fiyatlandirma")}
        style={{
          padding: "10px 24px",
          background: "#2DD4BF",
          color: "#0F0F0F",
          border: "none",
          borderRadius: 8,
          fontSize: 13,
          fontWeight: 700,
          cursor: "pointer",
          fontFamily: "inherit",
        }}
      >
        Planı Yükselt →
      </button>
    </div>
  );
}
