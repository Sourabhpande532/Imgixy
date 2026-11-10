import { Modal } from "bootstrap";

if (typeof document !== "undefined") {
  document.addEventListener("hide.bs.modal", () => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  });
}

/**
 * Safely closes a Bootstrap modal by ID and ensures body scrolling & backdrops
 * are completely restored without leaving lingering `overflow: hidden` on `document.body`
 * or triggering `aria-hidden` focus retention warnings in the browser console.
 */
export const closeModal = (modalId: string) => {
  const modalEl = document.getElementById(modalId);
  if (!modalEl) return;

  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }

  const forceCleanup = () => {
    modalEl.classList.remove("show");
    modalEl.style.display = "none";
    modalEl.setAttribute("aria-hidden", "true");
    modalEl.removeAttribute("aria-modal");
    modalEl.removeAttribute("role");

    document.querySelectorAll(".modal-backdrop").forEach((el) => el.remove());
    document.body.classList.remove("modal-open");
    document.body.style.removeProperty("overflow");
    document.body.style.removeProperty("padding-right");
  };

  try {
    const instance = Modal.getInstance(modalEl);
    if (instance) {
      instance.hide();
    } else {
      const dismissBtn = modalEl.querySelector<HTMLElement>(
        '[data-bs-dismiss="modal"]',
      );
      if (dismissBtn) {
        dismissBtn.click();
      }
    }
  } catch {
    // Fallback to direct DOM cleanup below
  }

  setTimeout(forceCleanup, 150);
};
