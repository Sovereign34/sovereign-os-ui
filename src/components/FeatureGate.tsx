// src/components/FeatureGate.tsx
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "../stores/authStore";

const TIER_ORDER: Record<string, number> = { free: 0, solo: 1, pro: 2, team: 3 };

interface FeatureGateProps {
  requiredTier: "solo" | "pro" | "team";
  feature: string;
  children: React.ReactNode;
}

export function FeatureGate({ requiredTier, feature, children }: FeatureGateProps) {
  const { tier } = useAuthStore();
  const navigate = useNavigate();
  const { t } = useTranslation("errors");
  const { t: tPricing } = useTranslation("pricing");

  if (TIER_ORDER[tier] >= TIER_ORDER[requiredTier]) return <>{children}</>;

  const tierLabel = `${tPricing(`plans.${requiredTier}.name`)} (${tPricing(`plans.${requiredTier}.price`)}${tPricing(`plans.${requiredTier}.period`)})`;

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
        {t("feature_locked", { tier: tierLabel })}
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
        {t("upgrade_prompt")}
      </button>
    </div>
  );
}
