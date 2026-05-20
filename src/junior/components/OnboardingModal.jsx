// src/junior/components/OnboardingModal.jsx
// Phase F.2 — 4 adımlı onboarding

import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { ensureProject } from "../../utils/ensureProject.js";

const ENGINE_URL = import.meta.env.VITE_ENGINE_URL;

const T = {
  bg:       "#0F0F0F",
  surface:  "#1A1A1A",
  border:   "#2A2A2A",
  success:  "#2DD4BF",
  danger:   "#EF4444",
  accent:   "#7C3AED",
  text:     "#EDEDEC",
  muted:    "#555550",
};

export default function OnboardingModal({ onComplete }) {
  const [step,         setStep]         = useState(0);
  const [projectName,  setProjectName]  = useState("my-saas");
  const [githubToken,  setGithubToken]  = useState("");
  const [engineStatus, setEngineStatus] = useState(null); // null | "ok" | "error"
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState(null);

  const STEPS = [
    {
      id: 1,
      title: "Sovereign'a Hoş Geldin",
      desc: "AI destekli karar motoru ile kodunun kontrolünü ele al. Birkaç adımda kurulumu tamamlayalım.",
      icon: "⚡",
    },
    {
      id: 2,
      title: "İlk Projeyi Oluştur",
      desc: "Projene bir isim ver. Tüm kararlar ve hafıza bu proje altında toplanır.",
      icon: "📁",
    },
    {
      id: 3,
      title: "Engine Bağlantısı",
      desc: "Sovereign Engine'in çalışıp çalışmadığını kontrol edelim.",
      icon: "🔗",
    },
    {
      id: 4,
      title: "GitHub Bağlantısı",
      desc: "Onaylanan değişiklikler otomatik commit atılır. Sonradan da ekleyebilirsin.",
      icon: "🐙",
      optional: true,
    },
  ];

  const current    = STEPS[step];
  const isLastStep = step === STEPS.length - 1;

  const checkEngine = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${ENGINE_URL}/health`, {
        signal: AbortSignal.timeout(8000),
      });
      setEngineStatus(res.ok ? "ok" : "error");
    } catch {
      setEngineStatus("error");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    setError(null);

    // Adım 2: proje oluştur
    if (current.id === 2) {
      if (!projectName.trim()) {
        setError("Proje adı boş olamaz.");
        return;
      }
      setLoading(true);
      try {
        await ensureProject(supabase, projectName.trim());
      } catch (e) {
        setError("Proje oluşturulamadı: " + e.message);
        setLoading(false);
        return;
      }
      setLoading(false);
    }

    // Adım 4: GitHub token kaydet
    if (current.id === 4 && githubToken.trim()) {
      localStorage.setItem("github_token", githubToken.trim());
    }

    if (isLastStep) {
      onComplete();
    } else {
      setStep(s => s + 1);
    }
  };

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,.75)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 1000, padding: 16,
    }}>
      <div style={{
        width: "100%", maxWidth: 420,
        background: T.surface, border: `1px solid ${T.border}`,
        borderRadius: 16, padding: 32,
        fontFamily: "'Inter',system-ui,sans-serif",
      }}>

        {/* Progress dots */}
        <div style={{ display: "flex", gap: 6, marginBottom: 28 }}>
          {STEPS.map((s, i) => (
            <div key={s.id} style={{
              flex: 1, height: 3, borderRadius: 2,
              background: i <= step ? T.success : T.border,
              transition: "background .3s",
            }} />
          ))}
        </div>

        {/* Icon + title */}
        <div style={{ fontSize: 32, marginBottom: 12 }}>{current.icon}</div>
        <div style={{ fontSize: 11, color: T.muted, fontFamily: "'JetBrains Mono',monospace", marginBottom: 6 }}>
          ADIM {step + 1} / {STEPS.length}
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: T.text, marginBottom: 10 }}>
          {current.title}
        </h2>
        <p style={{ fontSize: 13, color: "#888884", lineHeight: 1.6, marginBottom: 24 }}>
          {current.desc}
        </p>

        {/* Adım 2 — proje adı */}
        {current.id === 2 && (
          <input
            type="text"
            value={projectName}
            onChange={e => setProjectName(e.target.value)}
            placeholder="Proje adı (örn: my-saas)"
            style={{
              width: "100%", background: T.bg, border: `1px solid ${T.border}`,
              borderRadius: 8, padding: "10px 14px", color: T.text,
              fontSize: 13, fontFamily: "inherit", outline: "none",
              marginBottom: 8,
            }}
          />
        )}

        {/* Adım 3 — engine check */}
        {current.id === 3 && (
          <div style={{ marginBottom: 16 }}>
            <button
              onClick={checkEngine}
              disabled={loading}
              style={{
                padding: "9px 18px", borderRadius: 8, border: "none",
                background: `${T.accent}22`, color: T.accent,
                fontSize: 13, fontWeight: 600, cursor: "pointer",
                fontFamily: "inherit", marginBottom: 12,
              }}
            >
              {loading ? "Kontrol ediliyor..." : "Bağlantıyı Test Et"}
            </button>
            {engineStatus === "ok" && (
              <div style={{ fontSize: 13, color: T.success }}>✅ Engine çalışıyor</div>
            )}
            {engineStatus === "error" && (
              <div style={{ fontSize: 13, color: T.danger }}>⚠️ Engine'e ulaşılamıyor — sonradan kontrol edebilirsin.</div>
            )}
          </div>
        )}

        {/* Adım 4 — github token */}
        {current.id === 4 && (
          <input
            type="password"
            value={githubToken}
            onChange={e => setGithubToken(e.target.value)}
            placeholder="GitHub Personal Access Token (opsiyonel)"
            style={{
              width: "100%", background: T.bg, border: `1px solid ${T.border}`,
              borderRadius: 8, padding: "10px 14px", color: T.text,
              fontSize: 13, fontFamily: "inherit", outline: "none",
              marginBottom: 8,
            }}
          />
        )}

        {/* Error */}
        {error && (
          <div style={{ fontSize: 12, color: T.danger, marginBottom: 12 }}>{error}</div>
        )}

        {/* Actions */}
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          {current.optional && (
            <button
              onClick={onComplete}
              style={{
                padding: "10px 18px", borderRadius: 8,
                background: "transparent", border: `1px solid ${T.border}`,
                color: T.muted, fontSize: 13, cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Atla
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={loading}
            style={{
              padding: "10px 22px", borderRadius: 8, border: "none",
              background: T.success, color: T.bg,
              fontSize: 13, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "inherit", opacity: loading ? .6 : 1,
            }}
          >
            {loading ? "..." : isLastStep ? "Başlayalım →" : "Devam →"}
          </button>
        </div>

      </div>
    </div>
  );
}
