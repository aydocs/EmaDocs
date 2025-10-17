/**
 * @component adi-avatar
 * @description User avatar with fallback initials
 */
class AdiAvatar extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: "open" })
  }

  connectedCallback() {
    this.render()
  }

  render() {
    const src = this.getAttribute("src")
    const name = this.getAttribute("name") || ""
    const size = this.getAttribute("size") || "md"
    const shape = this.getAttribute("shape") || "circle"

    const initials = name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)

    const sizes = {
      sm: "32px",
      md: "48px",
      lg: "64px",
      xl: "96px",
    }

    this.shadowRoot.innerHTML = `
      <style>
        .avatar {
          width: ${sizes[size]};
          height: ${sizes[size]};
          border-radius: ${shape === "circle" ? "50%" : "var(--adi-radius, 0.5rem)"};
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: var(--adi-primary, #3b82f6);
          color: white;
          font-weight: 600;
          font-size: calc(${sizes[size]} / 2.5);
          overflow: hidden;
          position: relative;
        }

        .avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .avatar-initials {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      </style>

      <div class="avatar" part="avatar">
        ${src ? `<img src="${src}" alt="${name}" />` : ""}
        ${!src ? `<div class="avatar-initials">${initials}</div>` : ""}
      </div>
    `
  }
}

customElements.define("adi-avatar", AdiAvatar)
