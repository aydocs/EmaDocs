/**
 * ADIOX FRAMEWORK - BUTTON COMPONENT
 * Custom button web component with variants
 * @version 1.0.0
 */

;((window) => {
  window.AdiCore.defineElement("adi-button", {
    attributes: ["variant", "size", "disabled", "loading"],

    styles: `
      :host {
        display: inline-block;
      }

      button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        font-family: inherit;
        font-size: 0.875rem;
        font-weight: 500;
        line-height: 1.5;
        text-align: center;
        white-space: nowrap;
        border: 1px solid transparent;
        border-radius: var(--adi-radius);
        cursor: pointer;
        transition: all var(--adi-transition);
        user-select: none;
      }

      button:focus-visible {
        outline: 2px solid var(--adi-primary);
        outline-offset: 2px;
      }

      /* Variants */
      button.primary {
        background-color: var(--adi-primary);
        color: white;
      }

      button.primary:hover:not(:disabled) {
        background-color: var(--adi-primary-hover);
      }

      button.outline {
        background-color: transparent;
        border-color: var(--adi-border);
        color: var(--adi-text);
      }

      button.outline:hover:not(:disabled) {
        background-color: var(--adi-surface-secondary);
        border-color: var(--adi-border-dark);
      }

      button.danger {
        background-color: var(--adi-danger);
        color: white;
      }

      button.danger:hover:not(:disabled) {
        background-color: var(--adi-danger-hover);
      }

      button.success {
        background-color: var(--adi-success);
        color: white;
      }

      button.success:hover:not(:disabled) {
        background-color: var(--adi-success-hover);
      }

      button.warning {
        background-color: var(--adi-warning);
        color: white;
      }

      button.warning:hover:not(:disabled) {
        background-color: var(--adi-warning-hover);
      }

      /* Sizes */
      button.small {
        padding: 0.375rem 0.75rem;
        font-size: 0.75rem;
      }

      button.large {
        padding: 0.75rem 1.5rem;
        font-size: 1rem;
      }

      /* States */
      button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      button.loading {
        position: relative;
        color: transparent;
      }

      .spinner {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 1rem;
        height: 1rem;
        border: 2px solid currentColor;
        border-top-color: transparent;
        border-radius: 50%;
        animation: spin 0.6s linear infinite;
      }

      @keyframes spin {
        to { transform: translate(-50%, -50%) rotate(360deg); }
      }
    `,

    template(element) {
      const variant = element.getAttribute("variant") || "primary"
      const size = element.getAttribute("size") || "medium"
      const loading = element.hasAttribute("loading")

      return `
        <button 
          class="${variant} ${size} ${loading ? "loading" : ""}"
          ${element.hasAttribute("disabled") ? "disabled" : ""}
        >
          ${loading ? '<span class="spinner"></span>' : ""}
          <slot></slot>
        </button>
      `
    },

    connected() {
      const button = this.shadowRoot.querySelector("button")

      // Forward click events
      button.addEventListener("click", (e) => {
        if (!this.hasAttribute("disabled") && !this.hasAttribute("loading")) {
          this.dispatchEvent(new CustomEvent("click", { bubbles: true, composed: true }))
        }
      })
    },

    attributeChanged(name, oldValue, newValue) {
      if (name === "disabled" || name === "loading") {
        const button = this.shadowRoot.querySelector("button")
        if (button) {
          if (name === "disabled") {
            button.disabled = newValue !== null
          }
          if (name === "loading") {
            button.classList.toggle("loading", newValue !== null)
          }
        }
      }
    },
  })
})(window)
