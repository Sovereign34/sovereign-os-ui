import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, HashRouter } from "react-router-dom";
import AppRouter from "./AppRouter";
import { initAuthListener } from "./stores/authStore";
import { registerSession }  from "./junior/hooks/useAuth";
import { checkForUpdates } from "./lib/updater";
import "./i18n";  // ← EKLE

initAuthListener(registerSession);

const isTauri = typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;
const Router = isTauri ? HashRouter : BrowserRouter;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <AppRouter />
    </Router>
  </React.StrictMode>
);

checkForUpdates();
setInterval(() => checkForUpdates(), 4 * 60 * 60 * 1000);
