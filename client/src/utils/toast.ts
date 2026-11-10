type ToastKind = "success" | "error" | "info";

let activeTimer: ReturnType<typeof setTimeout> | null = null;

const getOrCreateContainer = (): HTMLElement => {
  let container = document.getElementById("kx-hot-toast-root");
  if (!container) {
    container = document.createElement("div");
    container.id = "kx-hot-toast-root";
    Object.assign(container.style, {
      position: "fixed",
      top: "18px",
      left: "50%",
      transform: "translateX(-50%)",
      zIndex: "100000",
      pointerEvents: "none",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "8px",
    });
    document.body.appendChild(container);
  }
  return container;
};

const showToast = (message: string, kind: ToastKind) => {
  if (typeof document === "undefined") return;

  const container = getOrCreateContainer();
  if (activeTimer) {
    clearTimeout(activeTimer);
    activeTimer = null;
  }

  // Clear any existing toast immediately so messages never stack or block
  container.innerHTML = "";

  const isLight =
    document.documentElement.getAttribute("data-theme") === "light";

  const pill = document.createElement("div");
  pill.setAttribute("role", "status");
  pill.setAttribute("aria-live", "polite");

  const iconColor =
    kind === "success"
      ? "#10b981"
      : kind === "error"
        ? "#ef4444"
        : "#f59e0b";

  const iconSvg =
    kind === "success"
      ? `<svg width="16" height="16" viewBox="0 0 20 20" fill="none" style="flex-shrink:0"><circle cx="10" cy="10" r="10" fill="${iconColor}"/><path d="M6 10.2L8.6 12.8L14.2 7.2" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`
      : kind === "error"
        ? `<svg width="16" height="16" viewBox="0 0 20 20" fill="none" style="flex-shrink:0"><circle cx="10" cy="10" r="10" fill="${iconColor}"/><path d="M7 7L13 13M13 7L7 13" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>`
        : `<svg width="16" height="16" viewBox="0 0 20 20" fill="none" style="flex-shrink:0"><circle cx="10" cy="10" r="10" fill="${iconColor}"/><path d="M10 6V10.5M10 14H10.01" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>`;

  Object.assign(pill.style, {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 14px",
    borderRadius: "999px",
    background: isLight ? "#ffffff" : "#1e293b",
    color: isLight ? "#0f172a" : "#f8fafc",
    border: isLight
      ? "1px solid rgba(15, 23, 42, 0.1)"
      : "1px solid rgba(255, 255, 255, 0.12)",
    boxShadow: isLight
      ? "0 8px 20px rgba(15, 23, 42, 0.12)"
      : "0 8px 24px rgba(0, 0, 0, 0.45)",
    fontSize: "0.84rem",
    fontWeight: "600",
    fontFamily: "var(--font-sans, system-ui, -apple-system, sans-serif)",
    lineHeight: "1.3",
    pointerEvents: "none",
    opacity: "0",
    transform: "translateY(-6px) scale(0.98)",
    transition: "opacity 0.14s ease, transform 0.14s ease",
    maxWidth: "90vw",
  });

  const textSpan = document.createElement("span");
  textSpan.textContent = message;

  pill.innerHTML = iconSvg;
  pill.appendChild(textSpan);
  container.appendChild(pill);

  requestAnimationFrame(() => {
    pill.style.opacity = "1";
    pill.style.transform = "translateY(0) scale(1)";
  });

  activeTimer = setTimeout(() => {
    pill.style.opacity = "0";
    pill.style.transform = "translateY(-6px) scale(0.98)";
    setTimeout(() => {
      if (pill.parentNode === container) {
        container.removeChild(pill);
      }
    }, 150);
    activeTimer = null;
  }, 1500);
};

export const toast = {
  success: (message: string) => showToast(message, "success"),
  error: (message: string) => showToast(message, "error"),
  info: (message: string) => showToast(message, "info"),
};
