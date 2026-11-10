import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// Bootstrap first — our CSS overrides it
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
// Our custom styles load after Bootstrap so they take precedence
import "./index.css";
import App from "./App.tsx";

// Unregister any legacy service workers silently
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .getRegistrations()
    .then((registrations) => {
      for (const registration of registrations) {
        registration.unregister().catch(() => {});
      }
    })
    .catch(() => {});
}

if ("caches" in window) {
  caches
    .keys()
    .then((names) => {
      for (const name of names) {
        caches.delete(name).catch(() => {});
      }
    })
    .catch(() => {});
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
