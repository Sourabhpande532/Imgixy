import { Modal } from "bootstrap";

/**
 * Safely closes a Bootstrap modal by ID and ensures body scrolling & backdrops
 * are completely restored without leaving lingering `overflow: hidden` on `document.body`.
 */
export const closeModal = (modalId: string) => {
  const modalEl = document.getElementById(modalId);
  if (!modalEl) return;

  const instance = Modal.getInstance(modalEl) || Modal.getOrCreateInstance(modalEl);

  const cleanup = () => {
    modalEl.removeEventListener("hidden.bs.modal", cleanup);
    if (!document.querySelector(".modal.show")) {
      document.body.classList.remove("modal-open");
      document.body.style.removeProperty("overflow");
      document.body.style.removeProperty("padding-right");
      document.querySelectorAll(".modal-backdrop").forEach((el) => el.remove());
    }
  };

  modalEl.addEventListener("hidden.bs.modal", cleanup, { once: true });
  instance.hide();

  // Safety fallback in case transition event is delayed or skipped
  setTimeout(() => {
    cleanup();
  }, 350);
};
