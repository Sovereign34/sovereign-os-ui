// src/utils/ensureProject.js
// Task A.3b — project_id UUID fix
// projects tablosu mevcut olmalı (Task A.3 tamamlanmış olmalı)

/**
 * Proje adına göre UUID döner.
 * Yoksa oluşturur, varsa mevcut ID'yi döner.
 * Sonucu localStorage'a yazar.
 */
export async function ensureProject(supabase, projectName = "my-saas") {
  // Önce localStorage'da var mı kontrol et
  const cached = localStorage.getItem("current_project_id");
  if (cached) return cached;

  const { data, error } = await supabase
    .from("projects")
    .upsert({ name: projectName }, { onConflict: "name" })
    .select("id")
    .single();

  if (error) throw error;

  localStorage.setItem("current_project_id", data.id);
  return data.id;
}

// Kullanım — ProjHafizasi.jsx:
//
// import { ensureProject } from "../../utils/ensureProject.js";
// import { supabase } from "../../lib/supabase.js";
//
// useEffect(() => {
//   ensureProject(supabase, "my-saas")
//     .then(setProjectId)
//     .catch(console.error);
// }, []);
