// KararKarti.jsx içinde bu değişikliği yap:

import { useGithubBridge } from "../hooks/useGithubBridge";

// component içinde:
const { commitFile } = useGithubBridge();
const [commitStatus, setCommitStatus] = useState(null); // null | "loading" | "done" | "error"

const handleApprove = async () => {
  onApprove(decision.id); // mevcut onay lojiği

  if (decision.filePath && decision.fileContent) {
    setCommitStatus("loading");
    try {
      await commitFile({
        path: decision.filePath,
        content: decision.fileContent,
        message: `sovereign: ${decision.filePath} onaylandı`,
      });
      setCommitStatus("done");
    } catch (err) {
      console.error("Commit hatası:", err.message);
      setCommitStatus("error");
    }
  }
};

// Buton yanına küçük durum göstergesi:
// commitStatus === "loading" → "⏳ Commit ediliyor..."
// commitStatus === "done"    → "✅ GitHub'a yazıldı"
// commitStatus === "error"   → "⚠️ Commit başarısız"
