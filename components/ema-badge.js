/**
 * @fileoverview Adiox Badge Component
 * @description Small status indicators and labels with various styles
 *
 * @example
 * <adi-badge variant="success">Active</adi-badge>
 * <adi-badge variant="danger" dot>3</adi-badge>
 *
 * @attributes
 * - variant: Style variant (default, primary, success, warning, danger, info)
 * - size: Badge size (sm, md, lg)
 * - dot: Show as dot indicator
 * - pill: Rounded pill shape
 */

class AdiBadge extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: "open" })
  }

  connectedCallback() {
    this.render()
  }

  get variant() {
    return this.getAttribute("variant") || "default"
  }

  get size() {
    return this.getAttribute("size") || "md"
  }

  get dot() {
    return this.hasAttribute("dot")
  }

  get pill() {
    return this.hasAttribute("pill")
  }

  render() {
    const { variant, size, dot, pill } = this

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-flex;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-weight: 500;
          line-height: 1;
          white-space: nowrap;
          border-radius: var(--adi-radius-sm, 6px);
          transition: all 0.2s;
        }

        /* Sizes */
        .badge.sm {
          padding: 2px 6px;
          font-size: 0.75rem;
        }

        .badge.md {
          padding: 4px 8px;
          font-size: 0.875rem;
        }

        .badge.lg {
          padding: 6px 12px;
          font-size: 1rem;
        }

        /* Pill shape */
        .badge.pill {
          border-radius: 9999px;
        }

        /* Dot variant */
        .badge.dot {
          padding: 0;
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .badge.dot.md {
          width: 10px;
          height: 10px;
        }

        .badge.dot.lg {
          width: 12px;
          height: 12px;
        }

        /* Variants */
        .badge.default {
          background: var(--adi-bg-secondary, #f3f4f6);
          color: var(--adi-text, #1f2937);
        }

        .badge.primary {
          background: var(--adi-primary, #3b82f6);
          color: white;
        }

        .badge.success {
          background: var(--adi-success, #10b981);
          color: white;
        }

        .badge.warning {
          background: var(--adi-warning, #f59e0b);
          color: white;
        }

        .badge.danger {
          background: var(--adi-danger, #ef4444);
          color: white;
        }

        .badge.info {
          background: var(--adi-info, #06b6d4);
          color: white;
        }
      </style>
      <span class="badge ${variant} ${size} ${dot ? "dot" : ""} ${pill ? "pill" : ""}">
        ${dot ? "" : "<slot></slot>"}
      </span>
    `
  }
}

// Register component
if (!customElements.get("adi-badge")) {
  customElements.define("adi-badge", AdiBadge)
}
