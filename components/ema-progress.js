/**
 * @fileoverview Adiox Progress Component
 * @description Progress bars and circular progress indicators with animations
 *
 * @example
 * <adi-progress value="75" max="100"></adi-progress>
 * <adi-progress type="circle" value="50"></adi-progress>
 *
 * @attributes
 * - value: Current progress value
 * - max: Maximum value (default: 100)
 * - type: Progress type (bar, circle)
 * - variant: Color variant (primary, success, warning, danger)
 * - size: Size (sm, md, lg) - for circle type
 * - show-label: Show percentage label
 * - indeterminate: Show indeterminate/loading state
 */

class AdiProgress extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: "open" })
  }

  static get observedAttributes() {
    return ["value", "max"]
  }

  connectedCallback() {
    this.render()
  }

  attributeChangedCallback() {
    if (this.shadowRoot.innerHTML) {
      this.updateProgress()
    }
  }

  get value() {
    return Number.parseFloat(this.getAttribute("value")) || 0
  }

  get max() {
    return Number.parseFloat(this.getAttribute("max")) || 100
  }

  get type() {
    return this.getAttribute("type") || "bar"
  }

  get variant() {
    return this.getAttribute("variant") || "primary"
  }

  get size() {
    return this.getAttribute("size") || "md"
  }

  get showLabel() {
    return this.hasAttribute("show-label")
  }

  get indeterminate() {
    return this.hasAttribute("indeterminate")
  }

  get percentage() {
    return Math.min(100, Math.max(0, (this.value / this.max) * 100))
  }

  render() {
    if (this.type === "circle") {
      this.renderCircle()
    } else {
      this.renderBar()
    }
  }

  renderBar() {
    const { variant, showLabel, indeterminate, percentage } = this

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
        }

        .progress-container {
          display: flex;
          align-items: center;
          gap: var(--adi-spacing-2, 0.5rem);
        }

        .progress-bar {
          flex: 1;
          height: 8px;
          background: var(--adi-bg-secondary, #e5e7eb);
          border-radius: 9999px;
          overflow: hidden;
          position: relative;
        }

        .progress-fill {
          height: 100%;
          border-radius: 9999px;
          transition: width 0.3s ease;
        }

        .progress-fill.indeterminate {
          width: 30%;
          animation: indeterminate 1.5s ease-in-out infinite;
        }

        @keyframes indeterminate {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(400%);
          }
        }

        .progress-fill.primary {
          background: var(--adi-primary, #3b82f6);
        }

        .progress-fill.success {
          background: var(--adi-success, #10b981);
        }

        .progress-fill.warning {
          background: var(--adi-warning, #f59e0b);
        }

        .progress-fill.danger {
          background: var(--adi-danger, #ef4444);
        }

        .label {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--adi-text-secondary, #6b7280);
          min-width: 3ch;
          text-align: right;
        }
      </style>
      <div class="progress-container" role="progressbar" aria-valuenow="${this.value}" aria-valuemin="0" aria-valuemax="${this.max}">
        <div class="progress-bar">
          <div class="progress-fill ${variant} ${indeterminate ? "indeterminate" : ""}" style="width: ${indeterminate ? "30%" : percentage + "%"}"></div>
        </div>
        ${showLabel ? `<span class="label">${Math.round(percentage)}%</span>` : ""}
      </div>
    `
  }

  renderCircle() {
    const { variant, size, showLabel, indeterminate, percentage } = this

    const sizes = {
      sm: { radius: 40, stroke: 4 },
      md: { radius: 50, stroke: 5 },
      lg: { radius: 60, stroke: 6 },
    }

    const { radius, stroke } = sizes[size]
    const circumference = 2 * Math.PI * radius
    const offset = circumference - (percentage / 100) * circumference

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block;
        }

        .circle-container {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        svg {
          transform: rotate(-90deg);
        }

        .circle-bg {
          fill: none;
          stroke: var(--adi-bg-secondary, #e5e7eb);
        }

        .circle-progress {
          fill: none;
          stroke-linecap: round;
          transition: stroke-dashoffset 0.3s ease;
        }

        .circle-progress.indeterminate {
          animation: rotate 2s linear infinite;
        }

        @keyframes rotate {
          100% {
            transform: rotate(360deg);
          }
        }

        .circle-progress.primary {
          stroke: var(--adi-primary, #3b82f6);
        }

        .circle-progress.success {
          stroke: var(--adi-success, #10b981);
        }

        .circle-progress.warning {
          stroke: var(--adi-warning, #f59e0b);
        }

        .circle-progress.danger {
          stroke: var(--adi-danger, #ef4444);
        }

        .label {
          position: absolute;
          font-size: ${size === "sm" ? "0.875rem" : size === "lg" ? "1.25rem" : "1rem"};
          font-weight: 600;
          color: var(--adi-text, #1f2937);
        }
      </style>
      <div class="circle-container" role="progressbar" aria-valuenow="${this.value}" aria-valuemin="0" aria-valuemax="${this.max}">
        <svg width="${(radius + stroke) * 2}" height="${(radius + stroke) * 2}">
          <circle
            class="circle-bg"
            cx="${radius + stroke}"
            cy="${radius + stroke}"
            r="${radius}"
            stroke-width="${stroke}"
          />
          <circle
            class="circle-progress ${variant} ${indeterminate ? "indeterminate" : ""}"
            cx="${radius + stroke}"
            cy="${radius + stroke}"
            r="${radius}"
            stroke-width="${stroke}"
            stroke-dasharray="${circumference}"
            stroke-dashoffset="${indeterminate ? circumference * 0.75 : offset}"
          />
        </svg>
        ${showLabel && !indeterminate ? `<span class="label">${Math.round(percentage)}%</span>` : ""}
      </div>
    `
  }

  updateProgress() {
    if (this.type === "circle") {
      const circle = this.shadowRoot.querySelector(".circle-progress")
      const label = this.shadowRoot.querySelector(".label")

      if (circle && !this.indeterminate) {
        const radius = Number.parseFloat(circle.getAttribute("r"))
        const circumference = 2 * Math.PI * radius
        const offset = circumference - (this.percentage / 100) * circumference
        circle.style.strokeDashoffset = offset
      }

      if (label) {
        label.textContent = `${Math.round(this.percentage)}%`
      }
    } else {
      const fill = this.shadowRoot.querySelector(".progress-fill")
      const label = this.shadowRoot.querySelector(".label")

      if (fill && !this.indeterminate) {
        fill.style.width = `${this.percentage}%`
      }

      if (label) {
        label.textContent = `${Math.round(this.percentage)}%`
      }
    }
  }
}

// Register component
if (!customElements.get("adi-progress")) {
  customElements.define("adi-progress", AdiProgress)
}
