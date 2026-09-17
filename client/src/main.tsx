import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// Bootstrap first — our CSS overrides it
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.js";
// Our custom styles load after Bootstrap so they take precedence
import "./index.css";
import App from "./App.tsx";

// Actively clear any legacy service worker registrations and caches to prevent storage block / MIME type errors
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (const registration of registrations) {
      registration.unregister();
    }
  });
  // Register self-destroying sw.js to clean up clients holding onto old sw
  navigator.serviceWorker.register("/sw.js").catch(() => {});
}

if ("caches" in window) {
  caches.keys().then((names) => {
    for (const name of names) {
      caches.delete(name);
    }
  });
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
