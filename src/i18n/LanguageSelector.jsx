// src/i18n/LanguageSelector.jsx
// Faz 4 — Standalone dil seçici
// JA + DE eklendi

import { useState } from "react";
import i18n from "./index";
import { T } from "../tokens";

const LANGUAGES = [
  { code: "en", flag: "🇬🇧", label: "EN" },
  { code: "tr", flag: "🇹🇷", label: "TR" },
  { code: "ja", flag: "🇯🇵", label: "JA" },
  { code: "de", flag: "🇩🇪", label: "DE" },
];

export function LanguageSelector() {
  const [current, setCurrent] = useState(
    i18n.language?.slice(0, 2) ?? "en"
  );

  const change = (code) => {
    i18n.changeLanguage(code);
    setCurrent(code);
  };

  return (
    <div style={{
      display: "flex",
      background: T.bgSurface,
      border: `1px solid ${T.border}`,
      borderRadius: 8,
      padding: 3,
      gap: 2,
      width: "fit-content",
    }}>
      {LANGUAGES.map(lang => {
        const isActive = current === lang.code;
        return (
          <button
            key={lang.code}
            onClick={() => change(lang.code)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "7px 16px",
              borderRadius: 6,
              border: "none",
              background: isActive ? T.bgElevated : "transparent",
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: ".04em",
              color: isActive ? T.textPrimary : T.textTertiary,
              fontFamily: "'JetBrains Mono',monospace",
              transition: "all .15s",
              boxShadow: isActive ? `inset 0 0 0 1px ${T.border}` : "none",
            }}
          >
            <span style={{ fontSize: 14, lineHeight: 1 }}>{lang.flag}</span>
            {lang.label}
          </button>
        );
      })}
    </div>
  );
}
