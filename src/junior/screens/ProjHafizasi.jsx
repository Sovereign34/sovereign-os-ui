import { useState } from "react";
import { useSovereignMemory } from "../../memory/useSovereignMemory";

export default function ProjHafizasi() {
  const { hotSessions, searchResults, searchSessions, clearSearch, addSession } = useSovereignMemory();

  const [fileName, setFileName]       = useState("");
  const [content, setContent]         = useState("");
  const [query, setQuery]             = useState("");
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState("");

  const handleUpload = async () => {
    if (!fileName || !content) return;
    setLoading(true);
    setError("");
    try {
      const nextSessionNum = (hotSessions[0]?.meta.session_num ?? 0) + 1;
      await addSession(nextSessionNum, "manual_upload", fileName, content);
      setFileName("");
      setContent("");
    } catch (e) {
      setError(e.message ?? "Hafızaya eklenemedi");
    } finally {
      setLoading(false);
    }
  };

  const handleQuery = async () => {
    if (!query) return;
    setLoading(true);
    setError("");
    try {
      await searchSessions(query);
    } catch (e) {
      setError(e.message ?? "Sorgu başarısız");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="screen-hafiza">
      <div className="screen-header">
        <h2 className="screen-title">Proje Hafızası</h2>
      </div>

      {error && (
        <div className="hafiza-error">⚠ {error}</div>
      )}

      <section className="hafiza-section">
        <h3 className="section-title">Doküman Ekle</h3>
        <input
          className="hafiza-input"
          placeholder="Dosya adı (ör: PRD.md)"
          value={fileName}
          onChange={e => setFileName(e.target.value)}
        />
        <textarea
          className="hafiza-textarea"
          placeholder="Doküman içeriği..."
          rows={6}
          value={content}
          onChange={e => setContent(e.target.value)}
        />
        <button
          className="btn-primary"
          onClick={handleUpload}
          disabled={loading || !fileName || !content}
        >
          {loading ? "Yükleniyor..." : "+ Hafızaya Ekle"}
        </button>

        {hotSessions.length > 0 && (
          <div className="upload-list">
            {hotSessions.slice(0, 5).map((s) => (
              <div key={s.meta.id} className="upload-row">
                <span>📄 {s.meta.focus}</span>
                <span className="upload-count">{s.meta.synced ? "senkronize" : "lokal"}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="hafiza-section">
        <h3 className="section-title">Hafızayı Sorgula</h3>
        <div className="query-row">
          <input
            className="hafiza-input"
            placeholder="Ne öğrenmek istiyorsun?"
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              if (!e.target.value) clearSearch();
            }}
            onKeyDown={e => e.key === "Enter" && handleQuery()}
          />
          <button className="btn-primary" onClick={handleQuery} disabled={loading || !query}>
            Sor
          </button>
        </div>

        {searchResults.length > 0 && (
          <div className="query-results">
            {searchResults.map((s) => (
              <div key={s.meta.id} className="query-result-row">
                <div className="result-source">
                  📄 {s.meta.focus}
                </div>
                <p className="result-content">{s.content}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
