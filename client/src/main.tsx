import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// Bootstrap first — our CSS overrides it
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.js";
// Our custom styles load after Bootstrap so they take precedence
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
