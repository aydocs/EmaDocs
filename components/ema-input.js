/**
 * Adiox Input Component
 *
 * A fully accessible, customizable input field with validation support,
 * icons, and various states (error, success, disabled).
 *
 * @component adi-input
 * @example
 * <adi-input
 *   label="Email"
 *   type="email"
 *   placeholder="Enter your email"
 *   required
 *   error="Invalid email address">
 * </adi-input>
 *
 * @attr {string} label - Input label text
 * @attr {string} type - Input type (text, email, password, number, etc.)
 * @attr {string} placeholder - Placeholder text
 * @attr {string} value - Input value
 * @attr {boolean} required - Whether input is required
 * @attr {boolean} disabled - Whether input is disabled
 * @attr {string} error - Error message to display
 * @attr {string} success - Success message to display
 * @attr {string} helper - Helper text to display
 * @attr {string} icon - Icon to display (left side)
 * @attr {string} icon-right - Icon to display (right side)
 * @attr {string} pattern - Validation pattern (regex)
 * @attr {number} minlength - Minimum length
 * @attr {number} maxlength - Maximum length
 *
 * @fires input - When input value changes
 * @fires change - When input loses focus with changed value
 * @fires focus - When input receives focus
 * @fires blur - When input loses focus
 */
class AdiInput extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: "open" })
    this._value = ""
    this._touched = false
  }

  static get observedAttributes() {
    return [
      "label",
      "type",
      "placeholder",
      "value",
      "required",
      "disabled",
      "error",
      "success",
      "helper",
      "icon",
      "icon-right",
      "pattern",
      "minlength",
      "maxlength",
    ]
  }

  connectedCallback() {
    this.render()
    this.setupEventListeners()
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render()
    }
  }

  setupEventListeners() {
    const input = this.shadowRoot.querySelector("input")
    if (!input) return

    // Input event - real-time value changes
    input.addEventListener("input", (e) => {
      this._value = e.target.value
      this.dispatchEvent(
        new CustomEvent("input", {
          detail: { value: this._value },
          bubbles: true,
          composed: true,
        }),
      )
    })

    // Change event - value changed and lost focus
    input.addEventListener("change", (e) => {
      this.dispatchEvent(
        new CustomEvent("change", {
          detail: { value: this._value },
          bubbles: true,
          composed: true,
        }),
      )
    })

    // Focus events
    input.addEventListener("focus", (e) => {
      this._touched = true
      this.shadowRoot.querySelector(".input-wrapper")?.classList.add("focused")
      this.dispatchEvent(
        new CustomEvent("focus", {
          bubbles: true,
          composed: true,
        }),
      )
    })

    input.addEventListener("blur", (e) => {
      this.shadowRoot.querySelector(".input-wrapper")?.classList.remove("focused")
      this.dispatchEvent(
        new CustomEvent("blur", {
          bubbles: true,
          composed: true,
        }),
      )
    })
  }

  get value() {
    return this._value
  }

  set value(val) {
    this._value = val
    const input = this.shadowRoot.querySelector("input")
    if (input) input.value = val
  }

  focus() {
    this.shadowRoot.querySelector("input")?.focus()
  }

  blur() {
    this.shadowRoot.querySelector("input")?.blur()
  }

  render() {
    const label = this.getAttribute("label") || ""
    const type = this.getAttribute("type") || "text"
    const placeholder = this.getAttribute("placeholder") || ""
    const value = this.getAttribute("value") || this._value
    const required = this.hasAttribute("required")
    const disabled = this.hasAttribute("disabled")
    const error = this.getAttribute("error")
    const success = this.getAttribute("success")
    const helper = this.getAttribute("helper")
    const icon = this.getAttribute("icon")
    const iconRight = this.getAttribute("icon-right")
    const pattern = this.getAttribute("pattern")
    const minlength = this.getAttribute("minlength")
    const maxlength = this.getAttribute("maxlength")

    const hasError = error && this._touched
    const hasSuccess = success && this._touched && !error

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: var(--adi-font-family, system-ui, -apple-system, sans-serif);
        }

        .input-container {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .label {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--adi-text-primary, #1a1a1a);
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .required {
          color: var(--adi-danger, #dc2626);
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          background: var(--adi-bg-primary, #ffffff);
          border: 1px solid var(--adi-border, #e5e7eb);
          border-radius: var(--adi-radius, 0.375rem);
          transition: all 0.2s ease;
        }

        .input-wrapper:hover:not(.disabled) {
          border-color: var(--adi-primary, #3b82f6);
        }

        .input-wrapper.focused {
          border-color: var(--adi-primary, #3b82f6);
          box-shadow: 0 0 0 3px var(--adi-primary-alpha, rgba(59, 130, 246, 0.1));
        }

        .input-wrapper.error {
          border-color: var(--adi-danger, #dc2626);
        }

        .input-wrapper.error.focused {
          box-shadow: 0 0 0 3px var(--adi-danger-alpha, rgba(220, 38, 38, 0.1));
        }

        .input-wrapper.success {
          border-color: var(--adi-success, #16a34a);
        }

        .input-wrapper.success.focused {
          box-shadow: 0 0 0 3px var(--adi-success-alpha, rgba(22, 163, 74, 0.1));
        }

        .input-wrapper.disabled {
          background: var(--adi-bg-secondary, #f9fafb);
          cursor: not-allowed;
          opacity: 0.6;
        }

        .icon {
          padding: 0 0.75rem;
          color: var(--adi-text-secondary, #6b7280);
          font-size: 1rem;
          display: flex;
          align-items: center;
        }

        input {
          flex: 1;
          padding: 0.625rem 0.75rem;
          border: none;
          background: transparent;
          font-size: 0.875rem;
          color: var(--adi-text-primary, #1a1a1a);
          outline: none;
          font-family: inherit;
        }

        input::placeholder {
          color: var(--adi-text-tertiary, #9ca3af);
        }

        input:disabled {
          cursor: not-allowed;
        }

        .message {
          font-size: 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .helper {
          color: var(--adi-text-secondary, #6b7280);
        }

        .error-message {
          color: var(--adi-danger, #dc2626);
        }

        .success-message {
          color: var(--adi-success, #16a34a);
        }

        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
          .label {
            color: var(--adi-text-primary, #f9fafb);
          }

          .input-wrapper {
            background: var(--adi-bg-primary, #1f2937);
            border-color: var(--adi-border, #374151);
          }

          input {
            color: var(--adi-text-primary, #f9fafb);
          }

          .input-wrapper.disabled {
            background: var(--adi-bg-secondary, #111827);
          }
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .input-wrapper {
            transition: none;
          }
        }
      </style>

      <div class="input-container">
        ${
          label
            ? `
          <label class="label">
            ${label}
            ${required ? '<span class="required" aria-label="required">*</span>' : ""}
          </label>
        `
            : ""
        }

        <div class="input-wrapper ${hasError ? "error" : ""} ${hasSuccess ? "success" : ""} ${disabled ? "disabled" : ""}">
          ${icon ? `<span class="icon" aria-hidden="true">${icon}</span>` : ""}
          
          <input
            type="${type}"
            placeholder="${placeholder}"
            value="${value}"
            ${required ? "required" : ""}
            ${disabled ? "disabled" : ""}
            ${pattern ? `pattern="${pattern}"` : ""}
            ${minlength ? `minlength="${minlength}"` : ""}
            ${maxlength ? `maxlength="${maxlength}"` : ""}
            aria-label="${label || placeholder}"
            ${hasError ? 'aria-invalid="true"' : ""}
            ${hasError ? `aria-describedby="error-${this.id || "input"}"` : ""}
          />

          ${iconRight ? `<span class="icon" aria-hidden="true">${iconRight}</span>` : ""}
        </div>

        ${
          hasError
            ? `
          <div class="message error-message" id="error-${this.id || "input"}" role="alert">
            ⚠ ${error}
          </div>
        `
            : hasSuccess
              ? `
          <div class="message success-message" role="status">
            ✓ ${success}
          </div>
        `
              : helper
                ? `
          <div class="message helper">
            ${helper}
          </div>
        `
                : ""
        }
      </div>
    `

    // Re-setup event listeners after render
    if (this.isConnected) {
      this.setupEventListeners()
    }
  }
}

// Register component
if (!customElements.get("adi-input")) {
  customElements.define("adi-input", AdiInput)
}
