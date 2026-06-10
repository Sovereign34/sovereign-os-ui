// src/junior/hooks/useGithubBridge.js
// Amaç:    GitHub commit + dosya okuma + manifest SHA güncelleme
// Bağlı:   ENGINE_URL/github/commit, /github/file, /api/project/:id/manifest
// Karar:   Karar #62 (github_manifest JSONB), Karar #63 (token body'de)
// Dokunma: TB-23 (ChatScreen push butonu), TB-24 (contextInjector fetchFile)

const ENGINE_URL = import.meta.env.VITE_ENGINE_URL

export function useGithubBridge() {
  const getCredentials = () => ({
    token: localStorage.getItem('github_token'),
    repo:  localStorage.getItem('github_repo'),
  })

  // ── Manifest güncelle ──────────────────────────────────────
  // commitFile() sonrası SHA'yı Supabase'e yazar.
  // Mevcut manifest null ise boş yapıyla başlatır, sonra merge eder.
  // Edge case 1: manifest PUT başarısız → hata fırlatır (sessiz fail yok)
  // Edge case 2: projectId yoksa → hata fırlatır
  // Edge case 3: mevcut manifest null → boş files objesinden başlar
  const updateManifest = async ({ projectId, authToken, path, sha }) => {
    if (!projectId) {
      throw new Error('updateManifest: projectId eksik — manifest güncellenemiyor.')
    }
    if (!authToken) {
      throw new Error('updateManifest: authToken eksik — manifest endpoint erişilemiyor.')
    }

    // Adım 1: Mevcut manifestı oku
    const getRes = await fetch(`${ENGINE_URL}/api/project/${projectId}/manifest`, {
      headers: { Authorization: `Bearer ${authToken}` },
    })

    if (!getRes.ok) {
      const err = await getRes.json().catch(() => ({}))
      throw new Error(err.error || 'Manifest okunamadı')
    }

    const { github_manifest } = await getRes.json()

    const { repo: manifestRepo } = localStorage
    const repo   = localStorage.getItem('github_repo')   || ''
    const branch = localStorage.getItem('github_branch') || 'main'
    const basePath = localStorage.getItem('github_base_path') || ''

    // Adım 2: files alanını SHA ile güncelle (merge — diğer dosyalar korunur)
    const existingFiles = github_manifest?.files ?? {}
    const updatedManifest = {
      repo:      github_manifest?.repo      ?? repo,
      branch:    github_manifest?.branch    ?? branch,
      base_path: github_manifest?.base_path ?? basePath,
      files: {
        ...existingFiles,
        [path]: sha,
      },
    }

    // Adım 3: Güncellenmiş manifestı yaz
    const putRes = await fetch(`${ENGINE_URL}/api/project/${projectId}/manifest`, {
      method:  'PUT',
      headers: {
        'Content-Type':  'application/json',
        Authorization:   `Bearer ${authToken}`,
      },
      body: JSON.stringify(updatedManifest),
    })

    if (!putRes.ok) {
      const err = await putRes.json().catch(() => ({}))
      throw new Error(err.error || 'Manifest güncellenemedi')
    }

    return await putRes.json() // { project_id, github_manifest, message }
  }

  // ── Dosya commit et ───────────────────────────────────────
  // commitFile() sonrası SHA'yı manifest'e yazar.
  // projectId + authToken verilmezse manifest güncellenmez (opsiyonel).
  const commitFile = async ({ path, content, message, projectId, authToken }) => {
    const { token, repo } = getCredentials()
    if (!token || !repo) {
      throw new Error('GitHub token veya repo eksik. Ayarlar > Bağlan ekranını kontrol et.')
    }

    const res = await fetch(`${ENGINE_URL}/github/commit`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ token, repo, path, content, message }),
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.error || 'Commit başarısız')
    }

    const result = await res.json() // { success, sha, url }

    // TB-22: Commit başarılıysa SHA'yı manifest'e yaz
    // projectId veya authToken yoksa manifest güncellenmez — sessiz geçmez, uyarı loglanır
    if (projectId && authToken) {
      await updateManifest({ projectId, authToken, path, sha: result.sha })
    } else {
      console.warn('[useGithubBridge] commitFile: projectId veya authToken eksik — manifest güncellenmedi.')
    }

    return result // { success, sha, url }
  }

  // ── Dosya çek ─────────────────────────────────────────────
  // Token body'de — Railway loglarında görünmez (Karar #63)
  const fetchFile = async (path) => {
    const { token, repo } = getCredentials()
    if (!token || !repo) {
      throw new Error('GitHub token veya repo eksik.')
    }

    const res = await fetch(`${ENGINE_URL}/github/file`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ token, repo, path }),
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.error || 'Dosya çekilemedi')
    }

    return await res.json() // { content, sha, path }
  }

  return { commitFile, fetchFile, updateManifest }
}
