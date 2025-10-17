/**
 * ADIOX FRAMEWORK - CARD COMPONENT
 * Card component with header, body, and footer slots
 * @version 1.0.0
 */

;((window) => {
  window.AdiCore.defineElement("adi-card", {
    attributes: ["variant", "hoverable"],

    styles: `
      :host {
        display: block;
      }

      .card {
        background-color: var(--adi-surface);
        border: 1px solid var(--adi-border);
        border-radius: var(--adi-radius-lg);
        box-shadow: var(--adi-shadow-sm);
        overflow: hidden;
        transition: all var(--adi-transition);
      }

      .card.hoverable:hover {
        box-shadow: var(--adi-shadow-md);
        transform: translateY(-2px);
      }

      .card-header {
        padding: var(--adi-spacing-4);
        border-bottom: 1px solid var(--adi-border);
        font-weight: 600;
        color: var(--adi-text);
      }

      .card-header:empty {
        display: none;
      }

      .card-body {
        padding: var(--adi-spacing-4);
        color: var(--adi-text-secondary);
      }

      .card-footer {
        padding: var(--adi-spacing-4);
        border-top: 1px solid var(--adi-border);
        background-color: var(--adi-surface-secondary);
      }

      .card-footer:empty {
        display: none;
      }

      /* Variants */
      .card.primary {
        border-color: var(--adi-primary);
      }

      .card.success {
        border-color: var(--adi-success);
      }

      .card.danger {
        border-color: var(--adi-danger);
      }

      .card.warning {
        border-color: var(--adi-warning);
      }
    `,

    template(element) {
      const variant = element.getAttribute("variant") || ""
      const hoverable = element.hasAttribute("hoverable")

      return `
        <div class="card ${variant} ${hoverable ? "hoverable" : ""}">
          <div class="card-header">
            <slot name="header"></slot>
          </div>
          <div class="card-body">
            <slot name="body"></slot>
            <slot></slot>
          </div>
          <div class="card-footer">
            <slot name="footer"></slot>
          </div>
        </div>
      `
    },
  })
})(window)
