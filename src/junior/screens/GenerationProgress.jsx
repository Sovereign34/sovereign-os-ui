/**
 * src/junior/screens/GenerationProgress.jsx
 *
 * TB-15 — Generation progress panel
 *
 * Görev:
 *   Proje oluşturulunca dosya bazlı ✅ animasyonu gösterir.
 *   Generation tamamlanınca sistem tarafından önerilen ilk karar
 *   textarea'ya dolu gelir; kullanıcı düzenleyip onaylar.
 *
 * Akış:
 *   1. OnboardingScreen → proje oluşturuldu → bu ekrana yönlendirilir
 *   2. /api/project/:id/status her 2sn polling
 *   3. files listesi dinamik — endpoint'ten gelen her dosya render edilir
 *   4. is_extra: true → sarı "extra" rozeti
 *   5. gen_status === 'completed' → suggested_first_decision textarea'ya basılır
 *   6. Kullanıcı onaylar → Chat'e yönlendirilir
 *
 * Sabitler:
 *   POLL_INTERVAL   2000ms  — polling sıklığı
 *   ROW_HEIGHT      34px    — virtualized liste satır yüksekliği
 *   VISIBLE_ROWS    14      — aynı anda DOM'da olan satır sayısı
 *   OVERSCAN        4       — scroll buffer
 *
 * Props:
 *   projectId    string   — oluşturulan projenin ID'si
 *   projectName  string   — proje adı
 *   onComplete   function — kullanıcı onayladığında çağrılır (firstDecision: string) => void
 *
 * Bağımlılıklar:
 *   projectRouter.ts → GET /api/project/:id/status
 *     response.files              — dinamik dosya listesi
 *     response.gen_status         — 'pending' | 'in_progress' | 'completed' | 'failed'
 *     response.suggested_first_decision — sistem önerisi (null ise henüz üretilmemiş)
 *
 * Dokunma:
 *   ROW_HEIGHT değiştirme — VirtualList hesapları buna bağlı
 *   POLL_INTERVAL 500ms altına indirme — engine yük dengesi bozulur
 *   suggested_first_decision null kontrolü kaldırma — öneri henüz gelmeden input açılır
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

// ── Sabitler ──────────────────────────────────────────────────────────────
const POLL_INTERVAL = 2000;
const ROW_HEIGHT    = 34;
const VISIBLE_ROWS  = 14;
const OVERSCAN      = 4;

const API_BASE = import.meta.env.VITE_ENGINE_URL ?? "";

// ── Renk paleti ───────────────────────────────────────────────────────────
const C = {
  bg:        "#060d18",
  surface:   "#080f1c",
  border:    "#0d1929",
  accent:    "#2DD4BF",
  purple:    "#818CF8",
  warn:      "#F59E0B",
  danger:    "#EF4444",
  textPrim:  "#e2e8f0",
  textSec:   "#94a3b8",
  textMuted: "#334155",
  textDim:   "#1e3a5f",
};

// ── Durum rengi / prefix ──────────────────────────────────────────────────
const STATE_COLOR  = {
  waiting: C.textDim,
  writing: C.purple,
  done:    C.accent,
  flash:   "#ffffff",
  failed:  C.danger,
};
const STATE_PREFIX = {
  waiting: "  ·",
  writing: "  ▸",
  done:    "  ✓",
  flash:   "  ✓",
  failed:  "  ✗",
};

// ── Typewriter hook ───────────────────────────────────────────────────────
function useTypewriter(text, speed = 22, active = true) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone]           = useState(false);
  useEffect(() => {
    if (!active) { setDisplayed(""); setDone(false); return; }
    setDisplayed(""); setDone(false);
    let i = 0;
    const id = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) { clearInterval(id); setDone(true); }
    }, speed);
    return () => clearInterval(id);
  }, [text, speed, active]);
  return { displayed, done };
}

// ── Tek dosya satırı ──────────────────────────────────────────────────────
function FileRow({ file, uiState, isActive }) {
  const { displayed, done: twDone } = useTypewriter(
    file.file_name, 22,
    isActive && uiState === "writing"
  );
  const color  = STATE_COLOR[uiState]  ?? C.textDim;
  const prefix = STATE_PREFIX[uiState] ?? "  ·";

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "10px",
      height: `${ROW_HEIGHT}px`, padding: "0 20px",
      fontFamily: "'JetBrains Mono','Fira Code','Courier New',monospace",
      fontSize: "13px", boxSizing: "border-box",
      borderBottom: `1px solid ${C.bg}`,
    }}>
      <span style={{
        color, minWidth: "18px",
        transition: "color 0.25s",
        fontWeight: (uiState === "done" || uiState === "flash") ? 700 : 400,
      }}>
        {prefix}
      </span>
      <span style={{
        color, transition: "color 0.25s",
        flex: 1, overflow: "hidden",
        textOverflow: "ellipsis", whiteSpace: "nowrap",
      }}>
        {uiState === "writing" ? displayed : file.file_name}
        {uiState === "writing" && !twDone && (
          <span style={{ animation: "blink 0.7s step-end infinite" }}>▌</span>
        )}
      </span>
      <span style={{ display: "flex", gap: "5px", alignItems: "center", flexShrink: 0 }}>
        {file.is_extra && (
          <span style={{
            fontSize: "9px", color: C.warn,
            background: "#2d1f00", padding: "1px 5px", borderRadius: "3px",
          }}>
            extra
          </span>
        )}
        {file.storage_target === "supabase" && (uiState === "done" || uiState === "flash") && (
          <span style={{
            fontSize: "9px", color: C.accent,
            background: "#0d2d2a", padding: "1px 5px", borderRadius: "3px",
          }}>
            ↑ cloud
          </span>
        )}
        {uiState === "failed" && (
          <span style={{ fontSize: "9px", color: C.danger, cursor: "help" }}>ⓘ</span>
        )}
      </span>
    </div>
  );
}

// ── Özet satırı ───────────────────────────────────────────────────────────
function StatusSummary({ files, uiStates }) {
  const done   = Object.values(uiStates).filter(s => s === "done" || s === "flash").length;
  const failed = Object.values(uiStates).filter(s => s === "failed").length;
  const extra  = files.filter(f => f.is_extra).length;
  const total  = files.length;

  return (
    <div style={{
      display: "flex", gap: "14px",
      padding: "8px 20px 6px",
      fontFamily: "monospace", fontSize: "11px",
      borderBottom: `1px solid ${C.bg}`,
    }}>
      <span style={{ color: C.accent }}>✓ {done}</span>
      {failed > 0 && <span style={{ color: C.danger }}>✗ {failed}</span>}
      {extra  > 0 && <span style={{ color: C.warn }}>+ {extra} extra</span>}
      <span style={{ color: C.textDim, marginLeft: "auto" }}>{total} dosya</span>
    </div>
  );
}

// ── Virtualized liste ─────────────────────────────────────────────────────
function VirtualList({ files, uiStates, activeFileName }) {
  const containerRef = useRef(null);
  const [scrollTop, setScrollTop] = useState(0);
  const containerH = VISIBLE_ROWS * ROW_HEIGHT;
  const totalH     = files.length * ROW_HEIGHT;

  // Aktif satırı viewport içinde tut
  useEffect(() => {
    if (!activeFileName || !containerRef.current) return;
    const idx = files.findIndex(f => f.file_name === activeFileName);
    if (idx < 0) return;
    const itemTop    = idx * ROW_HEIGHT;
    const itemBottom = itemTop + ROW_HEIGHT;
    const st = containerRef.current.scrollTop;
    if (itemTop < st) {
      containerRef.current.scrollTop = itemTop;
    } else if (itemBottom > st + containerH) {
      containerRef.current.scrollTop = itemBottom - containerH;
    }
  }, [activeFileName, files, containerH]);

  const startIdx = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - OVERSCAN);
  const endIdx   = Math.min(files.length, Math.ceil((scrollTop + containerH) / ROW_HEIGHT) + OVERSCAN);
  const visible  = files.slice(startIdx, endIdx);

  return (
    <div
      ref={containerRef}
      onScroll={e => setScrollTop(e.currentTarget.scrollTop)}
      style={{
        height: `${containerH}px`,
        overflowY: "auto",
        position: "relative",
        scrollbarWidth: "thin",
        scrollbarColor: `${C.textDim} ${C.bg}`,
      }}
    >
      <div style={{ height: `${totalH}px`, position: "relative" }}>
        <div style={{ position: "absolute", top: `${startIdx * ROW_HEIGHT}px`, width: "100%" }}>
          {visible.map(file => (
            <FileRow
              key={file.file_name}
              file={file}
              uiState={uiStates[file.file_name] ?? "waiting"}
              isActive={file.file_name === activeFileName}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── İlk karar input ───────────────────────────────────────────────────────
// Sistem önerisi textarea'ya dolu gelir.
// Kullanıcı düzenleyebilir veya direkt "Onayla →" ile geçer.
function FirstDecisionInput({ suggestion, onSubmit }) {
  const [value, setValue]         = useState(suggestion ?? "");
  const [focused, setFocused]     = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const ref = useRef(null);

  // Öneri geç gelirse (null → string) textarea'yı güncelle
  useEffect(() => {
    if (suggestion && !value) setValue(suggestion);
  }, [suggestion]);

  useEffect(() => {
    setTimeout(() => ref.current?.focus(), 300);
  }, []);

  function submit() {
    const v = value.trim();
    if (v && !submitted) {
      setSubmitted(true);
      onSubmit?.(v);
    }
  }

  const isReady = value.trim().length > 0 && !submitted;

  return (
    <div style={{ marginTop: "32px", animation: "riseUp 0.6s cubic-bezier(0.16,1,0.3,1) both" }}>
      {/* Ayraç */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "18px" }}>
        <div style={{ flex: 1, height: "1px", background: `linear-gradient(90deg,${C.accent}33,transparent)` }} />
        <span style={{
          fontSize: "10px", color: C.accent,
          fontFamily: "monospace", letterSpacing: "0.15em",
        }}>
          SİSTEM HAZIR
        </span>
        <div style={{ flex: 1, height: "1px", background: `linear-gradient(270deg,${C.accent}33,transparent)` }} />
      </div>

      <p style={{
        margin: "0 0 6px",
        fontSize: "15px", color: C.textPrim,
        lineHeight: 1.6,
        fontFamily: "system-ui,sans-serif",
      }}>
        İlk görev önerisi
      </p>
      <p style={{
        margin: "0 0 14px",
        fontSize: "12px", color: C.textSec,
        fontFamily: "system-ui,sans-serif",
        lineHeight: 1.5,
      }}>
        Sistem CORE.md'den türetti. Düzenleyebilir veya direkt onaylayabilirsin.
      </p>

      {/* Textarea */}
      <div style={{
        display: "flex", alignItems: "flex-start", gap: "8px",
        background: C.surface,
        border: `1px solid ${focused ? C.accent : C.border}`,
        borderRadius: "6px", padding: "12px 14px",
        transition: "border-color 0.2s ease",
      }}>
        <span style={{
          color: C.accent,
          fontFamily: "monospace", fontSize: "13px",
          paddingTop: "1px", userSelect: "none",
        }}>
          &gt;_
        </span>
        <textarea
          ref={ref}
          value={value}
          onChange={e => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={e => {
            if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); }
          }}
          rows={2}
          style={{
            flex: 1, background: "transparent",
            border: "none", outline: "none",
            color: C.textPrim, fontSize: "13px",
            fontFamily: "'JetBrains Mono','Fira Code',monospace",
            resize: "none", lineHeight: 1.6,
            caretColor: C.accent,
          }}
        />
      </div>

      {/* Onayla butonu */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "10px" }}>
        <button
          onClick={submit}
          disabled={!isReady}
          style={{
            background: isReady
              ? `linear-gradient(135deg,${C.accent},${C.purple})`
              : C.border,
            color: isReady ? "#060d18" : C.textMuted,
            border: "none", borderRadius: "6px",
            padding: "9px 22px", fontSize: "13px",
            fontWeight: 700, cursor: isReady ? "pointer" : "not-allowed",
            fontFamily: "system-ui,sans-serif",
            transition: "all 0.2s ease",
          }}
        >
          {submitted ? "Başlatıldı…" : "Onayla →"}
        </button>
      </div>
    </div>
  );
}

// ── Ana bileşen ───────────────────────────────────────────────────────────
export default function GenerationProgress({ projectId, projectName, onComplete }) {
  const { session }                               = useAuth();
  const [files, setFiles]                         = useState([]);
  const [uiStates, setUiStates]                   = useState({});
  const [activeFile, setActiveFile]               = useState(null);
  const [genStatus, setGenStatus]                 = useState("pending");
  const [suggestion, setSuggestion]               = useState(null);
  const [isDone, setIsDone]                       = useState(false);
  const [error, setError]                         = useState(null);
  const prevFileNamesRef                          = useRef(new Set());
  const prevStatusRef                             = useRef({});
  const pollRef                                   = useRef(null);

  // ── Polling ─────────────────────────────────────────────────────────────
  const poll = useCallback(async () => {
    if (!projectId) return;
    try {
      const token = session?.access_token;
      const res = await fetch(`${API_BASE}/api/project/${projectId}/status`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      // Dosya listesi — endpoint'ten gelen her dosya render edilir (is_extra dahil)
      if (Array.isArray(data.files)) {
        setFiles(data.files);

        // uiState hesapla — yeni tamamlanan dosyalar flash → done geçiş alır
        setUiStates(prev => {
          const next = { ...prev };
          for (const f of data.files) {
            const prevStatus = prevStatusRef.current[f.file_name];
            if (f.status === "completed" && prevStatus !== "completed") {
              next[f.file_name] = "flash";
              setTimeout(() => {
                setUiStates(s => ({ ...s, [f.file_name]: "done" }));
              }, 200);
            } else if (f.status === "failed") {
              next[f.file_name] = "failed";
            } else if (f.status === "pending" && !next[f.file_name]) {
              next[f.file_name] = "waiting";
            }
          }
          // Aktif dosyayı bul — en son "pending" olan
          const activePending = data.files.find(f => f.status === "pending");
          if (activePending) {
            next[activePending.file_name] = "writing";
            setActiveFile(activePending.file_name);
          }
          prevStatusRef.current = Object.fromEntries(data.files.map(f => [f.file_name, f.status]));
          return next;
        });
      }

      setGenStatus(data.gen_status);

      // suggested_first_decision — null → string geçişini yakala
      if (data.suggested_first_decision) {
        setSuggestion(data.suggested_first_decision);
      }

      // Tamamlandı kontrolü
      if (data.gen_status === "completed" || data.gen_status === "failed") {
        setIsDone(true);
        if (pollRef.current) clearInterval(pollRef.current);
      }

    } catch (err) {
      console.error("[GenerationProgress] polling hatası:", err.message);
      setError("Durum alınamadı. Bağlantı kontrol et.");
    }
  }, [projectId, session]);

  useEffect(() => {
    poll(); // ilk çağrı hemen
    pollRef.current = setInterval(poll, POLL_INTERVAL);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [poll]);

  // ── Progress hesabı ──────────────────────────────────────────────────────
  const completed = Object.values(uiStates).filter(s => s === "done" || s === "flash").length;
  const total     = files.length;
  const pct       = total > 0 ? Math.round((completed / total) * 100) : 0;

  // ── Onay handler ─────────────────────────────────────────────────────────
  function handleApprove(firstDecision) {
    onComplete?.(firstDecision);
  }

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div style={{
      minHeight: "100vh",
      background: C.bg,
      display: "flex",
      justifyContent: "center",
      alignItems: "flex-start",
      padding: "clamp(24px,6vw,64px) clamp(16px,5vw,32px)",
      boxSizing: "border-box",
      fontFamily: "system-ui,sans-serif",
    }}>
      {/* Scanlines */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1,
        background: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.03) 2px,rgba(0,0,0,0.03) 4px)",
      }} />

      <style>{`
        @keyframes blink     { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes riseUp    { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes glowPulse { 0%,100%{text-shadow:0 0 8px ${C.accent}44} 50%{text-shadow:0 0 20px ${C.accent}aa} }
        @keyframes barGlow   { 0%,100%{box-shadow:0 0 4px ${C.accent}44} 50%{box-shadow:0 0 12px ${C.accent}88} }
        ::-webkit-scrollbar       { width:4px }
        ::-webkit-scrollbar-track { background:${C.bg} }
        ::-webkit-scrollbar-thumb { background:${C.textDim}; border-radius:2px }
      `}</style>

      <div style={{ width: "100%", maxWidth: "580px", position: "relative", zIndex: 2 }}>

        {/* Header */}
        <div style={{ marginBottom: "24px" }}>
          <p style={{
            margin: "0 0 6px",
            fontFamily: "'JetBrains Mono','Fira Code',monospace",
            fontSize: "11px", color: C.accent, letterSpacing: "0.18em",
            animation: isDone ? "glowPulse 2s ease infinite" : "none",
          }}>
            SOVEREIGN ENGINE —{" "}
            {isDone
              ? genStatus === "completed" ? "tamamlandı" : "kısmen tamamlandı"
              : "üretiliyor"}
          </p>
          <h1 style={{
            margin: 0,
            fontSize: "clamp(20px,5vw,26px)", fontWeight: 800,
            color: C.textPrim, letterSpacing: "-0.03em",
          }}>
            {projectName}
          </h1>
        </div>

        {/* Progress bar */}
        {total > 0 && (
          <div style={{ marginBottom: "20px", animation: "riseUp 0.4s ease both" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "7px" }}>
              <span style={{ fontFamily: "monospace", fontSize: "11px", color: C.textMuted }}>
                {isDone ? "tamamlandı" : "üretiliyor"}
              </span>
              <span style={{
                fontFamily: "monospace", fontSize: "11px",
                color: isDone ? C.accent : C.purple,
              }}>
                {completed}/{total} &nbsp; {pct}%
              </span>
            </div>
            <div style={{
              height: "2px", background: C.border,
              borderRadius: "2px", overflow: "hidden",
            }}>
              <div style={{
                height: "100%", width: `${pct}%`,
                background: isDone
                  ? C.accent
                  : `linear-gradient(90deg,${C.accent},${C.purple})`,
                borderRadius: "2px",
                transition: "width 0.5s cubic-bezier(0.4,0,0.2,1)",
                animation: "barGlow 2s ease infinite",
              }} />
            </div>
          </div>
        )}

        {/* Hata */}
        {error && (
          <div style={{
            padding: "10px 14px", marginBottom: "16px",
            borderRadius: "6px",
            background: `${C.danger}14`,
            border: `1px solid ${C.danger}40`,
            fontSize: "12px", color: C.danger,
            fontFamily: "monospace",
            animation: "riseUp 0.3s ease both",
          }}>
            ⚠ {error}
          </div>
        )}

        {/* Dosya listesi */}
        {files.length > 0 && (
          <div style={{
            background: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: "8px", overflow: "hidden",
            animation: "riseUp 0.5s ease both",
          }}>
            <StatusSummary files={files} uiStates={uiStates} />
            <VirtualList
              files={files}
              uiStates={uiStates}
              activeFileName={activeFile}
            />
          </div>
        )}

        {/* İlk karar input — sadece tamamlandığında ve öneri hazır olduğunda göster */}
        {isDone && genStatus !== "failed" && (
          <FirstDecisionInput
            suggestion={suggestion}
            onSubmit={handleApprove}
          />
        )}

        {/* Generation başarısız */}
        {isDone && genStatus === "failed" && (
          <div style={{
            marginTop: "24px", padding: "16px",
            background: `${C.danger}14`,
            border: `1px solid ${C.danger}40`,
            borderRadius: "8px",
            animation: "riseUp 0.4s ease both",
          }}>
            <p style={{ margin: "0 0 4px", fontSize: "14px", color: C.danger, fontWeight: 700 }}>
              Üretim başarısız
            </p>
            <p style={{ margin: 0, fontSize: "12px", color: C.textSec }}>
              Bazı dosyalar üretilemedi. Chat ekranından devam edebilir veya projeyi silebilirsin.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
