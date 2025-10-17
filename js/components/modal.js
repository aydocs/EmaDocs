/**
 * ADIOX FRAMEWORK - MODAL COMPONENT
 * Modal dialog component
 * @version 1.0.0
 */

;((window) => {
  window.AdiCore.defineElement("adi-modal", {
    attributes: ["title", "primary-text", "secondary-text", "size"],

    styles: `
      :host {
        display: block;
        animation: scaleIn 0.2s ease;
      }

      @keyframes scaleIn {
        from {
          opacity: 0;
          transform: scale(0.95);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }

      .modal {
        background-color: var(--adi-surface);
        border-radius: var(--adi-radius-lg);
        box-shadow: var(--adi-shadow-xl);
        max-height: 90vh;
        overflow: hidden;
        display: flex;
        flex-direction: column;
      }

      .modal.small {
        width: 400px;
        max-width: 90vw;
      }

      .modal.medium {
        width: 600px;
        max-width: 90vw;
      }

      .modal.large {
        width: 800px;
        max-width: 90vw;
      }

      .modal-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: var(--adi-spacing-4) var(--adi-spacing-6);
        border-bottom: 1px solid var(--adi-border);
      }

      .modal-title {
        font-size: var(--adi-text-xl);
        font-weight: 600;
        color: var(--adi-text);
        margin: 0;
      }

      .modal-close {
        width: 32px;
        height: 32px;
        padding: 0;
        background: none;
        border: none;
        color: var(--adi-text-secondary);
        cursor: pointer;
        font-size: 24px;
        line-height: 1;
        border-radius: var(--adi-radius);
        transition: all var(--adi-transition);
      }

      .modal-close:hover {
        background-color: var(--adi-surface-secondary);
        color: var(--adi-text);
      }

      .modal-body {
        padding: var(--adi-spacing-6);
        overflow-y: auto;
        flex: 1;
      }

      .modal-footer {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: var(--adi-spacing-3);
        padding: var(--adi-spacing-4) var(--adi-spacing-6);
        border-top: 1px solid var(--adi-border);
        background-color: var(--adi-surface-secondary);
      }

      .modal-button {
        padding: 0.5rem 1rem;
        font-family: inherit;
        font-size: 0.875rem;
        font-weight: 500;
        border: 1px solid transparent;
        border-radius: var(--adi-radius);
        cursor: pointer;
        transition: all var(--adi-transition);
      }

      .modal-button.primary {
        background-color: var(--adi-primary);
        color: white;
      }

      .modal-button.primary:hover {
        background-color: var(--adi-primary-hover);
      }

      .modal-button.secondary {
        background-color: transparent;
        border-color: var(--adi-border);
        color: var(--adi-text);
      }

      .modal-button.secondary:hover {
        background-color: var(--adi-surface-tertiary);
      }
    `,

    template(element) {
      const title = element.getAttribute("title") || ""
      const primaryText = element.getAttribute("primary-text") || "OK"
      const secondaryText = element.getAttribute("secondary-text") || ""
      const size = element.getAttribute("size") || "medium"

      return `
        <div class="modal ${size}">
          <div class="modal-header">
            <h2 class="modal-title" id="adi-modal-title">${title}</h2>
            <button class="modal-close" aria-label="Close">×</button>
          </div>
          <div class="modal-body">
            <slot name="content"></slot>
            <slot></slot>
          </div>
          <div class="modal-footer">
            ${secondaryText ? `<button class="modal-button secondary">${secondaryText}</button>` : ""}
            <button class="modal-button primary">${primaryText}</button>
          </div>
        </div>
      `
    },

    connected() {
      const closeBtn = this.shadowRoot.querySelector(".modal-close")
      const primaryBtn = this.shadowRoot.querySelector(".modal-button.primary")
      const secondaryBtn = this.shadowRoot.querySelector(".modal-button.secondary")

      closeBtn?.addEventListener("click", () => {
        this.dispatchEvent(new CustomEvent("close", { bubbles: true, composed: true }))
      })

      primaryBtn?.addEventListener("click", () => {
        this.dispatchEvent(new CustomEvent("primary-click", { bubbles: true, composed: true }))
      })

      secondaryBtn?.addEventListener("click", () => {
        this.dispatchEvent(new CustomEvent("secondary-click", { bubbles: true, composed: true }))
      })
    },
  })
})(window)
