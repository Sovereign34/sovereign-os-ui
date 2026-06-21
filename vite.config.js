import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: process.env.TAURI_ENV_PLATFORM ? "./" : "/",
  clearScreen: false,
  server: {
    port: 5173,
    strictPort: true,
    watch: {
      ignored: ["**/src-tauri/**"],
    },
  },
  envPrefix: ["VITE_", "TAURI_"],
  build: {
    outDir: "dist",
    target: ["es2021", "chrome105", "safari15"],
    minify: !process.env.TAURI_ENV_DEBUG ? "esbuild" : false,
    sourcemap: !!process.env.TAURI_ENV_DEBUG,
    rollupOptions: {
      // @tauri-apps/plugin-fs gerçek ES module olarak import ediliyor
      // (StorageManager.ts) — bare specifier olarak external bırakılırsa
      // tarayıcı "Failed to resolve module specifier" hatası verir.
      // Bu yüzden plugin-fs bundle'a dahil edilir; diğer @tauri-apps/*
      // paketleri externalleştirme davranışı korunur.
      external: (id) =>
        id.startsWith("@tauri-apps/") && id !== "@tauri-apps/plugin-fs",
    },
  },
});