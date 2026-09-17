import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// Bootstrap first — our CSS overrides it
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.js";
// Our custom styles load after Bootstrap so they take precedence
import "./index.css";
import App from "./App.tsx";

// Auto-recover if old cached assets fail to load after a fresh deployment
window.addEventListener("error", (event) => {
  const isChunkError =
    event.message?.includes("Failed to load module script") ||
    event.message?.includes("Loading chunk") ||
    event.message?.includes("dynamically imported module");

  if (isChunkError) {
    const key = "imgixy_sw_auto_reload";
    if (!sessionStorage.getItem(key)) {
      sessionStorage.setItem(key, "true");
      // Unregister stale service worker and reload automatically
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          for (const reg of registrations) reg.unregister();
          window.location.reload();
        });
      } else {
        window.location.reload();
      }
    }
  }
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        registration.onupdatefound = () => {
          const installingWorker = registration.installing;
          if (installingWorker) {
            installingWorker.onstatechange = () => {
              if (
                installingWorker.state === "installed" &&
                navigator.serviceWorker.controller
              ) {
                // Reload page to activate the new version immediately
                window.location.reload();
              }
            };
          }
        };
      })
      .catch((err) => {
        console.error("ServiceWorker registration failed: ", err);
      });
  });
}


