import { useState, useEffect } from "react";
import { T } from "../tokens";

export function StatusBar({ engineError, pendingCount, autoCount, loadingCards, onRefresh, lang }) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    setElapsed(0);
    const t = setInterval(() => setElapsed(s => s + 1), 1000);
    return () => clearInterval(t);
  }, [loadingCards]);

  const connected = !engineError;

  return (
    <div style={{
      height: 28,
      borderTop: `1px solid ${T.border}`,
      background: T.bgPrimary,
      display: "flex",
      alignItems: "center",
      paddingInline: 16,
      flexShrink: 0,
      userSelect: "none",
    }}>

      <StatusChunk>
        <span style={{
          width: 6, height: 6, borderRadius: "50%", flexShrink: 0,
          background: connected ? T.success : T.danger,
          boxShadow: connected ? `0 0 6px ${T.success}88` : `0 0 6px ${T.danger}88`,
        }} />
        <Mono color={connected ? T.success : T.danger}>
          {connected ? "ENGINE" : "OFFLINE"}
        </Mono>
      </StatusChunk>

      <Divider />

      <StatusChunk>
        <Mono color={T.textTertiary}>sovereign.os</Mono>
      </StatusChunk>

      <Divider />

      <StatusChunk>
        <span style={{ fontSize: 8, color: pendingCount > 0 ? T.warning : T.textTertiary }}>
          {pendingCount > 0 ? "⬡" : "○"}
        </span>
        <Mono color={pendingCount > 0 ? T.warning : T.textTertiary}>
          {pendingCount} {lang === "tr" ? "bekliyor" : "pending"}
        </Mono>
      </StatusChunk>

      <Divider />

      <StatusChunk>
        <Mono color={T.textTertiary}>{autoCount} auto</Mono>
      </StatusChunk>

      <div style={{ flex: 1 }} />

      <StatusChunk>
        <Mono color={T.textTertiary}>
          {loadingCards ? "syncing…" : `↻ ${elapsed}s`}
        </Mono>
        <button
          onClick={onRefresh}
          disabled={loadingCards}
          style={{
            background: "transparent", border: "none",
            color: loadingCards ? T.textTertiary : T.accent,
            cursor: loadingCards ? "not-allowed" : "pointer",
            fontSize: 10, padding: "0 4px", lineHeight: 1,
            opacity: loadingCards ? 0.4 : 1,
          }}
        >⟳</button>
      </StatusChunk>

    </div>
  );
}

function StatusChunk({ children }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "0 10px" }}>
      {children}
    </div>
  );
}

function Divider() {
  return (
    <div style={{ width: 1, height: 12, background: T.border, flexShrink: 0 }} />
  );
}

function Mono({ children, color }) {
  return (
    <span style={{
      fontSize: 9,
      fontFamily: "'JetBrains Mono', monospace",
      letterSpacing: ".06em",
      color: color || T.textTertiary,
      lineHeight: 1,
    }}>
      {children}
    </span>
  );
}
