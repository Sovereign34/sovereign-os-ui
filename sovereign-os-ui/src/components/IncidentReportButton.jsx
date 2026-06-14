// src/components/IncidentReportButton.jsx
// INCIDENT-01: Sağ-alt köşede sabit "Sorun Bildir" butonu.
// Tıklanınca: son trace_id (varsa), endpoint, kullanıcı notu /api/incident/report'a gönderilir.
// AI Agent bakım sırasında: select * from incident_reports where status = 'open'
//
// Kullanım: App.jsx'in en dış katmanına ekle:
//   import { IncidentReportButton } from "./components/IncidentReportButton";
//   ...
//   <IncidentReportButton />
//
// Son trace_id'yi yakalamak için: global bir window._lastTraceId değişkeni kullanılır.
// Bunu set etmek için fetch wrapper'ına (varsa) şu satırı ekle:
//   window._lastTraceId = response.headers.get('x-request-id');

import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

const ENGINE_URL = import.meta.env.VITE_ENGINE_URL ?? "";

export function IncidentReportButton() {
  const [open, setOpen]         = useState(false);
  const [note, setNote]         = useState("");
  const [sending, setSending]   = useState(false);
  const [sent, setSent]         = useState(false);
  const [error, setError]       = useState("");

  const handleSubmit = async () => {
    setSending(true);
    setError("");

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const authHeader = session?.access_token ? `Bearer ${session.access_token}` : null;

      if (!authHeader) {
        setError("Oturum bulunamadı. Lütfen giriş yapın.");
        setSending(false);
        return;
      }

      const res = await fetch(`${ENGINE_URL}/api/incident/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: authHeader },
        body: JSON.stringify({
          trace_id: window._lastTraceId ?? null,
          endpoint: window.location.pathname,
          error_message: null,
          user_note: note.trim() || null,
        }),
      });

      if (!res.ok) {
        setError("Bildirim gönderilemedi. Tekrar dene.");
        setSending(false);
        return;
      }

      setSent(true);
      setNote("");
      setTimeout(() => { setSent(false); setOpen(false); }, 2000);
    } catch {
      setError("Bağlantı hatası.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 9999 }}>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          style={{
            background: "#1A1A1A", border: "1px solid #2A2A2A",
            borderRadius: 8, color: "#888884", fontSize: 12,
            padding: "8px 14px", cursor: "pointer",
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          ⚠ Sorun Bildir
        </button>
      )}

      {open && (
        <div style={{
          background: "#161616", border: "1px solid #2A2A2A",
          borderRadius: 10, padding: 16, width: 280,
          boxShadow: "0 8px 24px rgba(0,0,0,.4)",
        }}>
          {sent ? (
            <div style={{ color: "#2DD4BF", fontSize: 13, textAlign: "center", padding: "8px 0" }}>
              ✓ Bildirim alındı. İncelenecek.
            </div>
          ) : (
            <>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#EDEDEC", marginBottom: 8 }}>
                Bir sorun mu var?
              </div>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Ne yapmaya çalışıyordun? (opsiyonel)"
                style={{
                  width: "100%", boxSizing: "border-box", minHeight: 60,
                  padding: 8, borderRadius: 6, border: "1px solid #2A2A2A",
                  background: "#0F0F0F", color: "#EDEDEC", fontSize: 12,
                  resize: "vertical", marginBottom: 8, fontFamily: "inherit",
                }}
              />
              {error && <div style={{ fontSize: 11, color: "#EF4444", marginBottom: 8 }}>{error}</div>}
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={handleSubmit}
                  disabled={sending}
                  style={{
                    flex: 1, background: "#7C3AED", border: "none", borderRadius: 6,
                    color: "#fff", fontSize: 12, fontWeight: 700, padding: "8px 0",
                    cursor: sending ? "default" : "pointer", opacity: sending ? .6 : 1,
                  }}
                >{sending ? "Gönderiliyor..." : "Gönder"}</button>
                <button
                  onClick={() => setOpen(false)}
                  style={{
                    background: "transparent", border: "1px solid #2A2A2A",
                    borderRadius: 6, color: "#888884", fontSize: 12,
                    padding: "8px 12px", cursor: "pointer",
                  }}
                >Vazgeç</button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
