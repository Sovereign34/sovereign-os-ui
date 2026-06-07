// ChatScreen.jsx
// Amaç:    Chat UI render'ı — mesaj listesi, input, modal'lar
// Bağlı:   useChatActions hook, useAuth, useSovereignMemory, /api/ai/session/close
// Karar:   Karar #45 (system prompt engine'e taşındı), Session 22 (useChatActions refactor)
// Dokunma: Mesaj state'i veya API rotaları değişirse useChatActions.js güncellenmeli

// Phase B.2 — aiProxy refactor
// Phase B.3 — Gerçek risk skoru entegrasyonu
// i18n   — Faz 3 güncelleme
// Karar #45 — system prompt engine'e taşındı, client'tan kaldırıldı
// Karar #45 — Sohbet / Karar ayrımı: 📋 butonu karar loglar, ↑ sadece sohbet
// Session 14 — #6: ASK_HUMAN / DENY / PERMIT verdict UI entegrasyonu
// Session 20 — Session Kapat butonu (sadece Tauri/desktop)
// Session 21 — #89 #90: SessionSummaryModal — Claude özet üretir, kullanıcı onaylar, sonra kaydedilir
// Session 22 — useChatActions hook entegrasyonu (sendMessage bölündü)

import { apiCall }  from "../../lib/apiClient";
import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { T } from "../../tokens";
import { useAuth } from "../hooks/useAuth";
import { useChatActions } from "../hooks/useChatActions";

// Tauri ortamı tespiti
const IS_TAURI = typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;

// Web'de memory sistemi yok (Karar #78) — desktop-only stub
// StorageManager @tauri-apps/plugin-fs kullandığı için web'de import edilemez
const useSovereignMemory = () => ({
  addSession:  async () => {},
  triggerSync: async () => {},
});

// -- LOGIN EKRANI ------------------------------------------------
function LoginGate({ onLogin }) {
  const { t }        = useTranslation("chat");
  const { t: tErr }  = useTranslation("errors");

  const [email,     setEmail]     = useState("");
  const [errorMsg,  setErrorMsg]  = useState(null);
  const [shake,     setShake]     = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [magicSent, setMagicSent] = useState(false);

  const { signInWithOtp } = useAuth();

  const triggerError = (msg) => {
    setErrorMsg(msg);
    setShake(true);
    setTimeout(() => { setErrorMsg(null); setShake(false); }, 2500);
  };

  const handleMagicLink = async () => {
    if (!email || loading) return;
    setLoading(true);
    try {
      await signInWithOtp(email);
      setMagicSent(true);
    } catch (err) {
      triggerError(err.message ?? t("login.error_fallback"));
    } finally {
      setLoading(false);
    }
  };

  if (magicSent) {
    return (
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
        <div style={{
          width: "100%", maxWidth: 360,
          background: T.bgSurface, border: `1px solid ${T.border}`,
          borderRadius: 16, padding: "32px 24px", textAlign: "center",
        }}>
          <div style={{ fontSize: 38, marginBottom: 16, lineHeight: 1 }}>✉️</div>
          <div style={{ fontSize: 17, fontWeight: 700, color: T.textPrimary, marginBottom: 8 }}>
            {t("login.check_email")}
          </div>
          <div style={{
            fontSize: 12, color: T.textSecondary,
            fontFamily: "'JetBrains Mono',monospace", lineHeight: 1.7,
          }}>
            {t("login.magic_sent_before")}
            <span style={{ color: T.accent }}>{email}</span>
            {t("login.magic_sent_after")}
          </div>
          <div style={{
            marginTop: 18, padding: "8px 12px",
            background: `${T.success}10`, border: `1px solid ${T.success}30`,
            borderRadius: 8,
            fontSize: 10, color: T.textTertiary,
            fontFamily: "'JetBrains Mono',monospace", lineHeight: 1.6,
          }}>
            {t("login.link_note")}
          </div>
          <button
            onClick={() => { setMagicSent(false); setEmail(""); }}
            style={{
              marginTop: 20, fontSize: 11, color: T.textTertiary,
              background: "transparent", border: "none",
              cursor: "pointer", fontFamily: "'JetBrains Mono',monospace",
              textDecoration: "underline",
            }}
          >
            {t("login.use_different")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{
        width: "100%", maxWidth: 360,
        background: T.bgSurface, border: `1px solid ${T.border}`,
        borderRadius: 16, padding: "32px 24px",
        animation: shake ? "shake .4s ease" : "none",
      }}>
        <div style={{
          width: 44, height: 44, borderRadius: 11,
          background: `linear-gradient(135deg,${T.accent},#9061F9)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 20, color: "#fff", fontWeight: 800, marginBottom: 20,
        }}>S</div>

        <div style={{ fontSize: 17, fontWeight: 700, color: T.textPrimary, marginBottom: 6 }}>
          {t("login.title")}
        </div>
        <div style={{
          fontSize: 12, color: T.textSecondary, marginBottom: 24,
          fontFamily: "'JetBrains Mono',monospace", lineHeight: 1.6,
        }}>
          {t("login.subtitle")}
        </div>

        <input
          type="email"
          placeholder={t("login.email_placeholder")}
          value={email}
          autoFocus
          onChange={e => setEmail(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleMagicLink()}
          style={{
            width: "100%", background: T.bgPrimary,
            border: `1px solid ${errorMsg ? T.danger : T.border}`, borderRadius: 9,
            padding: "12px 14px", color: T.textPrimary, fontSize: 14,
            fontFamily: "'JetBrains Mono',monospace", outline: "none",
            marginBottom: 12, caretColor: T.accent, boxSizing: "border-box",
            transition: "border-color .15s",
          }}
        />

        {errorMsg && (
          <div style={{
            fontSize: 11, color: T.danger,
            fontFamily: "'JetBrains Mono',monospace", marginBottom: 10,
          }}>
            {errorMsg}
          </div>
        )}

        <button
          onClick={handleMagicLink}
          disabled={!email || loading}
          style={{
            width: "100%", padding: "12px", borderRadius: 9, border: "none",
            background: (email && !loading) ? T.accent : T.bgElevated,
            color: (email && !loading) ? "#fff" : T.textTertiary,
            fontSize: 13, fontWeight: 700,
            cursor: (email && !loading) ? "pointer" : "not-allowed",
            fontFamily: "inherit", transition: "all .15s",
          }}
        >
          {loading ? t("login.sending") : t("login.send_btn")}
        </button>
      </div>

      <style>{`
        @keyframes shake {
          0%,100%{transform:translateX(0);}
          20%{transform:translateX(-8px);}
          40%{transform:translateX(8px);}
          60%{transform:translateX(-5px);}
          80%{transform:translateX(5px);}
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// -- VERDİCT BANNER ----------------------------------------------
function VerdictBanner({ verdict, softSteer }) {
  if (!verdict || verdict === "PERMIT") return null;

  const isAskHuman = verdict === "ASK_HUMAN";
  const color      = isAskHuman ? T.warning : T.danger;
  const icon       = isAskHuman ? "⚠️" : "🚫";
  const label      = isAskHuman ? "İNSAN ONAYI GEREKİYOR" : "ENGELLENDİ";
  const sublabel   = isAskHuman
    ? "Bu karar otomatik işleme alınamaz. Yetkili onayı bekleniyor."
    : (softSteer ?? "Bu işlem politika kurallarına göre reddedildi.");

  return (
    <div style={{
      marginTop: 10,
      padding: "10px 12px",
      background: `${color}0f`,
      border: `1px solid ${color}35`,
      borderRadius: 9,
      borderLeft: `3px solid ${color}`,
    }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 6, marginBottom: 4,
      }}>
        <span style={{ fontSize: 12 }}>{icon}</span>
        <span style={{
          fontSize: 9, fontWeight: 700, color,
          fontFamily: "'JetBrains Mono',monospace", letterSpacing: "0.06em",
        }}>
          {label}
        </span>
      </div>
      <div style={{
        fontSize: 11, color: T.textSecondary,
        fontFamily: "'JetBrains Mono',monospace", lineHeight: 1.6,
      }}>
        {sublabel}
      </div>
    </div>
  );
}

// -- SESSION KAPAT MODAL — İlk onay adımı ----------------------
function SessionCloseModal({ onConfirm, onCancel, isClosing }) {
  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "rgba(0,0,0,0.6)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 1000, padding: "24px",
    }}>
      <div style={{
        width: "100%", maxWidth: 380,
        background: T.bgSurface,
        border: `1px solid ${T.border}`,
        borderRadius: 16, padding: "28px 24px",
      }}>
        <div style={{
          fontSize: 13, fontWeight: 700, color: T.textPrimary,
          marginBottom: 8, fontFamily: "'JetBrains Mono',monospace",
        }}>
          Session'ı Kapat
        </div>
        <div style={{
          fontSize: 12, color: T.textSecondary,
          fontFamily: "'JetBrains Mono',monospace", lineHeight: 1.7,
          marginBottom: 24,
        }}>
          Session kapanış protokolü çalışacak.<br />
          Sovereign AI bu session'ın özetini üretecek.<br />
          Sen okuyup onayladıktan sonra kaydedilecek.<br />
          Devam etmek istiyor musun?
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onCancel}
            disabled={isClosing}
            style={{
              flex: 1, padding: "10px", borderRadius: 9,
              border: `1px solid ${T.border}`,
              background: "transparent",
              color: T.textSecondary,
              fontSize: 12, fontWeight: 600,
              cursor: isClosing ? "not-allowed" : "pointer",
              fontFamily: "'JetBrains Mono',monospace",
              transition: "all .15s",
            }}
          >
            İptal
          </button>
          <button
            onClick={onConfirm}
            disabled={isClosing}
            style={{
              flex: 1, padding: "10px", borderRadius: 9,
              border: "none",
              background: isClosing ? T.bgElevated : T.accent,
              color: isClosing ? T.textTertiary : "#fff",
              fontSize: 12, fontWeight: 700,
              cursor: isClosing ? "not-allowed" : "pointer",
              fontFamily: "'JetBrains Mono',monospace",
              transition: "all .15s",
              display: "flex", alignItems: "center",
              justifyContent: "center", gap: 6,
            }}
          >
            {isClosing ? (
              <>
                <div style={{
                  width: 10, height: 10,
                  border: `2px solid ${T.border}`,
                  borderTopColor: T.accent,
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite",
                }} />
                Özet üretiliyor...
              </>
            ) : "Evet, Devam Et"}
          </button>
        </div>
      </div>
    </div>
  );
}

// -- SESSION ÖZET MODAL — İnsan onayı merkezi (Karar #90) ------
// Amaç:    Claude'un ürettiği özeti kullanıcıya gösterir
//          Kullanıcı okur, düzenler, onaylarsa kaydedilir
// Edge:    Özet boşsa textarea açık gelir — kullanıcı elle yazar
//          "Kaydetme" basarsa session kapanmış ama özet kaydedilmez — uyarı chat'e düşer
function SessionSummaryModal({ summary, error, onConfirm, onCancel, isSaving, onChange }) {
  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "rgba(0,0,0,0.7)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 1000, padding: "24px",
    }}>
      <div style={{
        width: "100%", maxWidth: 540,
        background: T.bgSurface,
        border: `1px solid ${T.border}`,
        borderRadius: 16, padding: "28px 24px",
        display: "flex", flexDirection: "column", gap: 16,
        maxHeight: "82vh", overflow: "hidden",
      }}>

        <div style={{
          fontSize: 13, fontWeight: 700, color: T.textPrimary,
          fontFamily: "'JetBrains Mono',monospace", flexShrink: 0,
        }}>
          Session Özeti — Onayla ve Kaydet
        </div>

        <div style={{
          fontSize: 11, color: error ? T.warning : T.textSecondary,
          fontFamily: "'JetBrains Mono',monospace", lineHeight: 1.7,
          flexShrink: 0,
        }}>
          {error
            ? "⚠️ Özet otomatik üretilemedi. Aşağıya kendin yazabilirsin."
            : "Sovereign AI bu session'ın özetini üretti. Oku, gerekirse düzenle, sonra kaydet."}
        </div>

        <textarea
          value={summary}
          onChange={e => onChange(e.target.value)}
          rows={14}
          style={{
            width: "100%", background: T.bgPrimary,
            border: `1px solid ${T.border}`, borderRadius: 9,
            padding: "12px 14px", color: T.textPrimary, fontSize: 12,
            fontFamily: "'JetBrains Mono',monospace", lineHeight: 1.7,
            outline: "none", resize: "vertical", flexShrink: 0,
            caretColor: T.accent, boxSizing: "border-box",
            transition: "border-color .15s",
          }}
          onFocus={e => { e.target.style.borderColor = T.accent; }}
          onBlur={e => { e.target.style.borderColor = T.border; }}
        />

        <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
          <button
            onClick={onCancel}
            disabled={isSaving}
            style={{
              flex: 1, padding: "10px", borderRadius: 9,
              border: `1px solid ${T.border}`,
              background: "transparent", color: T.textSecondary,
              fontSize: 12, fontWeight: 600,
              cursor: isSaving ? "not-allowed" : "pointer",
              fontFamily: "'JetBrains Mono',monospace",
              transition: "all .15s",
            }}
          >
            Kaydetme
          </button>
          <button
            onClick={onConfirm}
            disabled={isSaving || !summary.trim()}
            style={{
              flex: 2, padding: "10px", borderRadius: 9,
              border: "none",
              background: (isSaving || !summary.trim()) ? T.bgElevated : T.accent,
              color: (isSaving || !summary.trim()) ? T.textTertiary : "#fff",
              fontSize: 12, fontWeight: 700,
              cursor: (isSaving || !summary.trim()) ? "not-allowed" : "pointer",
              fontFamily: "'JetBrains Mono',monospace",
              display: "flex", alignItems: "center",
              justifyContent: "center", gap: 6,
              transition: "all .15s",
            }}
          >
            {isSaving ? (
              <>
                <div style={{
                  width: 10, height: 10,
                  border: `2px solid ${T.border}`,
                  borderTopColor: T.accent,
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite",
                }} />
                Kaydediliyor...
              </>
            ) : "✅ Onayla ve Kaydet"}
          </button>
        </div>

      </div>
    </div>
  );
}

// -- MESAJ BALONU ------------------------------------------------
function MessageBubble({ msg }) {
  const { t }  = useTranslation("chat");
  const isUser   = msg.role === "user";
  const isSystem = msg.role === "system";

  if (isSystem) {
    return (
      <div style={{ textAlign: "center", padding: "6px 0" }}>
        <span style={{
          fontSize: 10, color: T.textTertiary,
          fontFamily: "'JetBrains Mono',monospace",
          background: T.bgElevated, padding: "3px 10px",
          borderRadius: 20, border: `1px solid ${T.border}`,
        }}>{msg.content}</span>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start", marginBottom: 12 }}>
      {!isUser && (
        <div style={{
          width: 28, height: 28, borderRadius: 7, flexShrink: 0,
          background: `linear-gradient(135deg,${T.accent},#9061F9)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 12, color: "#fff", fontWeight: 800,
          marginRight: 8, marginTop: 2,
        }}>S</div>
      )}
      <div style={{
        maxWidth: "78%",
        background: isUser ? T.accent : T.bgElevated,
        border: `1px solid ${isUser ? "transparent" : T.border}`,
        borderRadius: isUser ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
        padding: "10px 14px",
      }}>
        {isUser && msg.isDecision && (
          <div style={{
            fontSize: 9, fontFamily: "'JetBrains Mono',monospace",
            color: T.accent, background: `${T.accent}20`,
            padding: "2px 7px", borderRadius: 5,
            display: "inline-block", marginBottom: 6,
            border: `1px solid ${T.accent}40`,
          }}>
            📋 {t("decision.badge")}
          </div>
        )}
        <div style={{ fontSize: 14, color: T.textPrimary, lineHeight: 1.65, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
          {msg.content}
        </div>
        {msg.risk && (
          <div style={{ marginTop: 8, paddingTop: 8, borderTop: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{
              fontSize: 9, fontFamily: "'JetBrains Mono',monospace",
              color: msg.risk <= 3 ? T.success : msg.risk <= 7 ? T.warning : T.danger,
              background: `${msg.risk <= 3 ? T.success : msg.risk <= 7 ? T.warning : T.danger}14`,
              padding: "2px 7px", borderRadius: 5,
            }}>
              RISK {msg.risk}/10
            </div>
            <span style={{ fontSize: 9, color: T.textTertiary, fontFamily: "'JetBrains Mono',monospace" }}>
              {t("risk.intercepted")}
            </span>
          </div>
        )}
        {!isUser && msg.verdict && (
          <VerdictBanner verdict={msg.verdict} softSteer={msg.softSteer} />
        )}
      </div>
    </div>
  );
}

// -- TYPING INDICATOR --------------------------------------------
function TypingIndicator() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
      <div style={{
        width: 28, height: 28, borderRadius: 7, flexShrink: 0,
        background: `linear-gradient(135deg,${T.accent},#9061F9)`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 12, color: "#fff", fontWeight: 800,
      }}>S</div>
      <div style={{
        background: T.bgElevated, border: `1px solid ${T.border}`,
        borderRadius: "14px 14px 14px 4px", padding: "12px 16px",
        display: "flex", gap: 5, alignItems: "center",
      }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: 6, height: 6, borderRadius: "50%", background: T.accent,
            animation: `dot-bounce .85s ease-in-out infinite ${i * 0.2}s`,
          }} />
        ))}
      </div>
      <style>{`@keyframes dot-bounce{0%,100%{transform:scale(1);opacity:.35;}50%{transform:scale(1.6);opacity:1;}}`}</style>
    </div>
  );
}

// -- VERDİCT → RENK yardımcısı -----------------------------------
const verdictColor = (verdict, risk) => {
  if (verdict === "DENY")      return T.danger;
  if (verdict === "ASK_HUMAN") return T.warning;
  if (verdict === "PERMIT")    return T.success;
  return risk <= 3 ? T.success : risk <= 7 ? T.warning : T.danger;
};

// -- SESSION KAPAT — backend çağrısı (adım 1) --------------------
// Edge: backend timeout → catch, hata chat'e düşer, modal kapanır
const fetchSessionClose = async ({ userId, messages }) => {
  const history = messages.filter(m => m.role !== "system");
  return apiCall("/api/ai/session/close", {
    method: "POST",
    body: JSON.stringify({
      project_id: userId,   // TODO: PROD — gerçek project_id props/context'ten gelmeli
      messages:   history.map(m => ({ role: m.role, content: m.content })),
    }),
  });
};

// -- ANA CHAT EKRANI ---------------------------------------------
export default function ChatScreen() {
  const { t }          = useTranslation("chat");
  const { t: tCommon } = useTranslation("common");

  const { user, loading: authLoading } = useAuth();

  // TODO: PROD — project_id gerçek değeri props/context'ten gelmeli
  const { addSession, triggerSync } = useSovereignMemory(null);

  const [messages,         setMessages]         = useState([
    { role: "system", content: t("system.active") },
  ]);
  const [input,            setInput]            = useState("");
  const [showCloseModal,   setShowCloseModal]   = useState(false);
  const [isClosing,        setIsClosing]        = useState(false);
  const [sessionSummary,   setSessionSummary]   = useState("");
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [summaryError,     setSummaryError]     = useState(null);
  const [isSavingSummary,  setIsSavingSummary]  = useState(false);

  const bottomRef   = useRef(null);
  const textareaRef = useRef(null);

  // ── useChatActions hook — loading + engineLog hook içinde yönetilir
  const { loading, engineLog, sendMessage } = useChatActions({
    messages,
    setMessages,
    userId: user?.id,
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  if (authLoading) return (
    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center", fontFamily: "'JetBrains Mono',monospace" }}>
        <div style={{
          width: 20, height: 20,
          border: `2px solid ${T.border}`,
          borderTopColor: T.accent,
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
          margin: "0 auto 12px",
        }} />
        <span style={{ fontSize: 11, color: T.textTertiary }}>
          {tCommon("actions.connecting")}
        </span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );

  if (!user) return <LoginGate onLogin={() => {}} />;

  // ── Adım 1: Modal onayı → backend çağrısı → özet modal'a geç ─
  const handleSessionClose = async () => {
    setIsClosing(true);
    try {
      const data = await fetchSessionClose({ userId: user.id, messages });
      setSessionSummary(data.summary_content ?? "");
      setSummaryError(data.summary_error ?? null);
      setShowCloseModal(false);
      setShowSummaryModal(true);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { role: "system", content: `Session kapatma hatası: ${err.message}` },
      ]);
      setShowCloseModal(false);
    } finally {
      setIsClosing(false);
    }
  };

  // ── Adım 2: Kullanıcı özeti onaylar → kaydet ──────────────────
  const handleSummaryConfirm = async () => {
    setIsSavingSummary(true);
    try {
      await addSession({
        content:    sessionSummary,
        project_id: user.id,   // TODO: PROD — gerçek project_id props/context'ten gelmeli
      });
      await triggerSync();
      setShowSummaryModal(false);
      setSessionSummary("");
      setSummaryError(null);
      setMessages(prev => [
        ...prev,
        { role: "system", content: "✅ Session kapatıldı. Özet kaydedildi." },
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { role: "system", content: `Kayıt hatası: ${err.message}` },
      ]);
    } finally {
      setIsSavingSummary(false);
    }
  };

  // ── Özet modalı iptal → session kapanmış ama özet yok ─────────
  const handleSummaryCancel = () => {
    setShowSummaryModal(false);
    setSessionSummary("");
    setSummaryError(null);
    setMessages(prev => [
      ...prev,
      { role: "system", content: "⚠️ Session kapatıldı ama özet kaydedilmedi." },
    ]);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input, false);
      setInput("");
    }
  };

  const handleSend = (isDecision) => {
    sendMessage(input, isDecision);
    setInput("");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>

      {/* Session Kapat Modal — ilk onay adımı */}
      {showCloseModal && (
        <SessionCloseModal
          onConfirm={handleSessionClose}
          onCancel={() => setShowCloseModal(false)}
          isClosing={isClosing}
        />
      )}

      {/* Session Özet Modal — insan onayı merkezi (Karar #90) */}
      {showSummaryModal && (
        <SessionSummaryModal
          summary={sessionSummary}
          error={summaryError}
          onConfirm={handleSummaryConfirm}
          onCancel={handleSummaryCancel}
          isSaving={isSavingSummary}
          onChange={setSessionSummary}
        />
      )}

      {/* Üst bar */}
      <div style={{
        padding: "12px 16px", borderBottom: `1px solid ${T.border}`,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: T.bgSurface, flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: T.success }} />
          <span style={{ fontSize: 11, color: T.success, fontFamily: "'JetBrains Mono',monospace", fontWeight: 600 }}>
            {t("header.engine_active")}
          </span>

          {/* Session Kapat — sadece Tauri/desktop */}
          {IS_TAURI && (
            <button
              onClick={() => setShowCloseModal(true)}
              title="Session'ı Kapat"
              style={{
                marginLeft: 8,
                padding: "3px 10px",
                borderRadius: 6,
                border: `1px solid ${T.border}`,
                background: "transparent",
                color: T.textTertiary,
                fontSize: 9,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "'JetBrains Mono',monospace",
                letterSpacing: "0.04em",
                transition: "all .15s",
              }}
              onMouseEnter={e => {
                e.target.style.borderColor = T.warning;
                e.target.style.color = T.warning;
              }}
              onMouseLeave={e => {
                e.target.style.borderColor = T.border;
                e.target.style.color = T.textTertiary;
              }}
            >
              SESSION KAPAT
            </button>
          )}
        </div>

        {engineLog && (
          <div style={{
            fontSize: 10, fontFamily: "'JetBrains Mono',monospace",
            color:       verdictColor(engineLog.status, engineLog.risk),
            background: `${verdictColor(engineLog.status, engineLog.risk)}12`,
            padding: "3px 9px", borderRadius: 6,
            border: `1px solid ${verdictColor(engineLog.status, engineLog.risk)}30`,
          }}>
            {engineLog.status} · RISK {engineLog.risk}/10
            {engineLog.policy ? ` · ${engineLog.policy}` : ""}
          </div>
        )}

        <span style={{ fontSize: 10, color: T.textTertiary, fontFamily: "'JetBrains Mono',monospace" }}>
          {user.email}
        </span>
      </div>

      {/* Mesajlar */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column" }}>
        {messages.map((msg, i) => <MessageBubble key={i} msg={msg} />)}
        {loading && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ padding: "12px 16px", borderTop: `1px solid ${T.border}`, background: T.bgSurface, flexShrink: 0 }}>
        <div style={{
          display: "flex", gap: 10, alignItems: "flex-end",
          background: T.bgPrimary, border: `1px solid ${T.border}`,
          borderRadius: 12, padding: "10px 14px",
        }}>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t("input.placeholder")}
            rows={1}
            style={{
              flex: 1, background: "transparent", border: "none",
              color: T.textPrimary, fontSize: 14, fontFamily: "inherit",
              outline: "none", resize: "none", lineHeight: 1.5,
              caretColor: T.accent, maxHeight: 120, overflowY: "auto",
            }}
          />

          <button
            onClick={() => handleSend(true)}
            disabled={!input.trim() || loading}
            title={t("input.decision_tooltip")}
            style={{
              height: 36, padding: "0 10px", borderRadius: 9,
              border: `1px solid ${input.trim() && !loading ? T.accent : T.border}`,
              background: "transparent",
              color: input.trim() && !loading ? T.accent : T.textTertiary,
              cursor: input.trim() && !loading ? "pointer" : "not-allowed",
              fontSize: 14, flexShrink: 0, transition: "all .15s",
            }}
          >
            📋
          </button>

          <button
            onClick={() => handleSend(false)}
            disabled={!input.trim() || loading}
            style={{
              width: 36, height: 36, borderRadius: 9, border: "none",
              background: input.trim() && !loading ? T.accent : T.bgElevated,
              color: input.trim() && !loading ? "#fff" : T.textTertiary,
              cursor: input.trim() && !loading ? "pointer" : "not-allowed",
              fontSize: 16, display: "flex", alignItems: "center",
              justifyContent: "center", flexShrink: 0, transition: "all .15s",
            }}
          >↑</button>
        </div>

        <div style={{ marginTop: 6, fontSize: 10, color: T.textTertiary, fontFamily: "'JetBrains Mono',monospace", textAlign: "center" }}>
          ↑ {t("footer.chat_note")} · 📋 {t("footer.decision_note")}
        </div>
      </div>
    </div>
  );
}
