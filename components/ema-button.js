/**
 * ADIOX BUTTON COMPONENT
 * Accessible button with multiple variants
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
        border: 1px solid transparent;
        border-radius: var(--adi-radius, 0.375rem);
        cursor: pointer;
        transition: all 0.2s ease;
        white-space: nowrap;
        user-select: none;
      }

      button:focus-visible {
        outline: 2px solid var(--adi-primary, #3b82f6);
        outline-offset: 2px;
      }

      /* Variants */
      button.primary {
        background: var(--adi-primary, #3b82f6);
        color: white;
      }

      button.primary:hover:not(:disabled) {
        background: var(--adi-primary-hover, #2563eb);
      }

      button.secondary {
        background: var(--adi-secondary, #6b7280);
        color: white;
      }

      button.secondary:hover:not(:disabled) {
        background: var(--adi-secondary-hover, #4b5563);
      }

      button.outline {
        background: transparent;
        border-color: var(--adi-border, #d1d5db);
        color: var(--adi-text, #1f2937);
      }

      button.outline:hover:not(:disabled) {
        background: var(--adi-surface, #f3f4f6);
      }

      button.ghost {
        background: transparent;
        color: var(--adi-text, #1f2937);
      }

      button.ghost:hover:not(:disabled) {
        background: var(--adi-surface, #f3f4f6);
      }

      button.danger {
        background: var(--adi-danger, #ef4444);
        color: white;
      }

      button.danger:hover:not(:disabled) {
        background: var(--adi-danger-hover, #dc2626);
      }

      button.success {
        background: var(--adi-success, #10b981);
        color: white;
      }

      button.success:hover:not(:disabled) {
        background: var(--adi-success-hover, #059669);
      }

      /* Sizes */
      button.small {
        padding: 0.25rem 0.75rem;
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
          type="button"
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
          this.dispatchEvent(
            new CustomEvent("click", {
              bubbles: true,
              composed: true,
            }),
          )
        }
      })

      // Sync disabled state
      this.updateDisabled()
    },

    attributeChanged(name, oldValue, newValue) {
      if (name === "disabled") {
        this.updateDisabled()
      } else if (name === "loading") {
        this.updateLoading()
      } else if (name === "variant" || name === "size") {
        this.updateClasses()
      }
    },

    updateDisabled() {
      const button = this.shadowRoot?.querySelector("button")
      if (button) {
        button.disabled = this.hasAttribute("disabled")
      }
    },

    updateLoading() {
      const button = this.shadowRoot?.querySelector("button")
      if (button) {
        const loading = this.hasAttribute("loading")
        button.classList.toggle("loading", loading)

        if (loading && !button.querySelector(".spinner")) {
          const spinner = document.createElement("span")
          spinner.className = "spinner"
          button.insertBefore(spinner, button.firstChild)
        } else if (!loading) {
          const spinner = button.querySelector(".spinner")
          if (spinner) spinner.remove()
        }
      }
    },

    updateClasses() {
      const button = this.shadowRoot?.querySelector("button")
      if (button) {
        const variant = this.getAttribute("variant") || "primary"
        const size = this.getAttribute("size") || "medium"
        button.className = `${variant} ${size}`
      }
    },
  })

  // Add method extensions to the prototype
  Object.assign(window.AdiCore.defineElement.prototype, {
    updateDisabled() {},
    updateLoading() {},
    updateClasses() {},
  })
})(window)
