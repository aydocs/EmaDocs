/**
 * ADIOX FRAMEWORK - TOAST COMPONENT
 * Toast notification component
 * @version 1.0.0
 */

;((window) => {
  window.AdiCore.defineElement("adi-toast", {
    attributes: ["message", "type", "no-close"],

    styles: `
      :host {
        display: block;
        animation: slideIn 0.3s ease;
      }

      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translateX(100%);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }

      :host(.adi-toast-closing) {
        animation: slideOut 0.3s ease;
      }

      @keyframes slideOut {
        from {
          opacity: 1;
          transform: translateX(0);
        }
        to {
          opacity: 0;
          transform: translateX(100%);
        }
      }

      .toast {
        display: flex;
        align-items: center;
        gap: var(--adi-spacing-3);
        min-width: 300px;
        max-width: 500px;
        padding: var(--adi-spacing-3) var(--adi-spacing-4);
        background-color: var(--adi-surface);
        border: 1px solid var(--adi-border);
        border-radius: var(--adi-radius-lg);
        box-shadow: var(--adi-shadow-lg);
        color: var(--adi-text);
      }

      .toast-icon {
        flex-shrink: 0;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: bold;
      }

      .toast.success .toast-icon {
        background-color: var(--adi-success);
        color: white;
      }

      .toast.error .toast-icon {
        background-color: var(--adi-danger);
        color: white;
      }

      .toast.warning .toast-icon {
        background-color: var(--adi-warning);
        color: white;
      }

      .toast.info .toast-icon {
        background-color: var(--adi-info);
        color: white;
      }

      .toast-message {
        flex: 1;
        font-size: var(--adi-text-sm);
        line-height: var(--adi-leading-normal);
      }

      .toast-close {
        flex-shrink: 0;
        width: 20px;
        height: 20px;
        padding: 0;
        background: none;
        border: none;
        color: var(--adi-text-secondary);
        cursor: pointer;
        font-size: 18px;
        line-height: 1;
        transition: color var(--adi-transition);
      }

      .toast-close:hover {
        color: var(--adi-text);
      }

      .toast-close:focus-visible {
        outline: 2px solid var(--adi-primary);
        outline-offset: 2px;
        border-radius: 2px;
      }
    `,

    template(element) {
      const message = element.getAttribute("message") || ""
      const type = element.getAttribute("type") || "info"
      const noClose = element.hasAttribute("no-close")

      const icons = {
        success: "✓",
        error: "✕",
        warning: "!",
        info: "i",
      }

      return `
        <div class="toast ${type}" role="alert">
          <div class="toast-icon">${icons[type] || icons.info}</div>
          <div class="toast-message">${message}</div>
          ${!noClose ? '<button class="toast-close" aria-label="Close">×</button>' : ""}
        </div>
      `
    },

    connected() {
      const closeBtn = this.shadowRoot.querySelector(".toast-close")
      if (closeBtn) {
        closeBtn.addEventListener("click", () => {
          this.dispatchEvent(new CustomEvent("close", { bubbles: true, composed: true }))
        })
      }
    },
  })
})(window)
