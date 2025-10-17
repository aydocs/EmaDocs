/**
 * EMADOCS FRAMEWORK - UI MODULE
 * Toast, Modal, Alert, Tooltip, and Dropdown systems
 * @version 1.0.0
 */

;((window) => {
  const EmaUI = {
    toastQueue: [],
    activeToasts: [],
    maxToasts: 5,
    toastContainer: null,
    modalStack: [],

    init() {
      this.createToastContainer()
      this.setupKeyboardHandlers()
      window.EmaCore.emit("ui:initialized")
    },

    createToastContainer() {
      if (this.toastContainer) return

      this.toastContainer = document.createElement("div")
      this.toastContainer.id = "ema-toast-container"
      this.toastContainer.className = "ema-toast-container"
      this.toastContainer.setAttribute("role", "region")
      this.toastContainer.setAttribute("aria-label", "Notifications")
      document.body.appendChild(this.toastContainer)
    },

    toast(message, options = {}) {
      const config = {
        type: options.type || "info",
        duration: options.duration !== undefined ? options.duration : 3000,
        position: options.position || "top-right",
        pauseOnHover: options.pauseOnHover !== false,
        closable: options.closable !== false,
        onClose: options.onClose,
      }

      if (this.activeToasts.length >= this.maxToasts) {
        this.toastQueue.push({ message, config })
        return { close: () => {} }
      }

      return this.showToast(message, config)
    },

    showToast(message, config) {
      const toast = document.createElement("ema-toast")
      toast.setAttribute("message", message)
      toast.setAttribute("type", config.type)

      if (!config.closable) {
        toast.setAttribute("no-close", "")
      }

      this.toastContainer.appendChild(toast)
      this.activeToasts.push(toast)

      let timeoutId = null
      let isPaused = false

      if (config.duration > 0) {
        const startTimeout = () => {
          timeoutId = setTimeout(() => {
            this.closeToast(toast, config)
          }, config.duration)
        }

        startTimeout()

        if (config.pauseOnHover) {
          toast.addEventListener("mouseenter", () => {
            if (timeoutId) {
              clearTimeout(timeoutId)
              isPaused = true
            }
          })

          toast.addEventListener("mouseleave", () => {
            if (isPaused) {
              startTimeout()
              isPaused = false
            }
          })
        }
      }

      toast.addEventListener("close", () => {
        if (timeoutId) clearTimeout(timeoutId)
        this.closeToast(toast, config)
      })

      toast.setAttribute("role", "status")
      toast.setAttribute("aria-live", config.type === "error" ? "assertive" : "polite")

      return {
        close: () => {
          if (timeoutId) clearTimeout(timeoutId)
          this.closeToast(toast, config)
        },
      }
    },

    closeToast(toast, config) {
      const index = this.activeToasts.indexOf(toast)
      if (index > -1) {
        this.activeToasts.splice(index, 1)
      }

      toast.classList.add("ema-toast-closing")

      setTimeout(() => {
        if (toast.parentNode) {
          this.toastContainer.removeChild(toast)
        }

        if (config.onClose) {
          config.onClose()
        }

        if (this.toastQueue.length > 0) {
          const next = this.toastQueue.shift()
          this.showToast(next.message, next.config)
        }
      }, 300)
    },

    modal(options = {}) {
      return new Promise((resolve) => {
        const config = {
          title: options.title || "",
          html: options.html || "",
          primaryText: options.primaryText || "OK",
          secondaryText: options.secondaryText || "Cancel",
          onPrimary: options.onPrimary,
          onSecondary: options.onSecondary,
          onClose: options.onClose,
          showSecondary: options.showSecondary !== false,
          closeOnBackdrop: options.closeOnBackdrop !== false,
          closeOnEscape: options.closeOnEscape !== false,
          size: options.size || "medium",
        }

        const overlay = document.createElement("div")
        overlay.className = "ema-modal-overlay"
        overlay.setAttribute("role", "dialog")
        overlay.setAttribute("aria-modal", "true")
        overlay.setAttribute("aria-labelledby", "ema-modal-title")

        const modal = document.createElement("ema-modal")
        modal.setAttribute("title", config.title)
        modal.setAttribute("primary-text", config.primaryText)
        modal.setAttribute("size", config.size)

        if (config.showSecondary) {
          modal.setAttribute("secondary-text", config.secondaryText)
        }

        overlay.appendChild(modal)

        const previousFocus = document.activeElement

        this.modalStack.push({ overlay, modal, previousFocus, config })

        document.body.appendChild(overlay)

        setTimeout(() => {
          const contentSlot = modal.shadowRoot?.querySelector('slot[name="content"]')
          if (contentSlot) {
            const content = document.createElement("div")
            content.slot = "content"
            content.innerHTML = config.html
            modal.appendChild(content)
          }

          this.trapFocus(modal)
        }, 0)

        const handlePrimary = async () => {
          if (config.onPrimary) {
            await config.onPrimary()
          }
          this.closeModal(overlay)
          resolve("primary")
        }

        const handleSecondary = async () => {
          if (config.onSecondary) {
            await config.onSecondary()
          }
          this.closeModal(overlay)
          resolve("secondary")
        }

        const handleClose = async () => {
          if (config.onClose) {
            await config.onClose()
          }
          this.closeModal(overlay)
          resolve("close")
        }

        modal.addEventListener("primary-click", handlePrimary)
        modal.addEventListener("secondary-click", handleSecondary)
        modal.addEventListener("close", handleClose)

        if (config.closeOnBackdrop) {
          overlay.addEventListener("click", (e) => {
            if (e.target === overlay) {
              handleClose()
            }
          })
        }

        if (config.closeOnEscape) {
          const escapeHandler = (e) => {
            if (e.key === "Escape") {
              handleClose()
              document.removeEventListener("keydown", escapeHandler)
            }
          }
          document.addEventListener("keydown", escapeHandler)
        }
      })
    },

    closeModal(overlay) {
      const modalData = overlay
        ? this.modalStack.find((m) => m.overlay === overlay)
        : this.modalStack[this.modalStack.length - 1]

      if (!modalData) return

      const { overlay: modalOverlay, previousFocus } = modalData

      const index = this.modalStack.indexOf(modalData)
      if (index > -1) {
        this.modalStack.splice(index, 1)
      }

      modalOverlay.classList.add("ema-modal-closing")

      setTimeout(() => {
        if (modalOverlay.parentNode) {
          document.body.removeChild(modalOverlay)
        }

        if (previousFocus && typeof previousFocus.focus === "function") {
          previousFocus.focus()
        }
      }, 200)
    },

    alert(message, options = {}) {
      const type = options.type || "info"
      const title = options.title || type.charAt(0).toUpperCase() + type.slice(1)

      return this.modal({
        title,
        html: `<p>${message}</p>`,
        primaryText: "OK",
        showSecondary: false,
        size: "small",
      })
    },

    confirm(message, options = {}) {
      return this.modal({
        title: options.title || "Confirm",
        html: `<p>${message}</p>`,
        primaryText: options.confirmText || "Confirm",
        secondaryText: options.cancelText || "Cancel",
        showSecondary: true,
        size: "small",
      }).then((result) => result === "primary")
    },

    prompt(message, options = {}) {
      const defaultValue = options.defaultValue || ""
      const placeholder = options.placeholder || ""
      const inputId = "ema-prompt-input-" + Date.now()

      return this.modal({
        title: options.title || "Input",
        html: `
          <p>${message}</p>
          <input 
            type="text" 
            id="${inputId}"
            class="ema-input" 
            value="${defaultValue}" 
            placeholder="${placeholder}"
            style="width: 100%; margin-top: 1rem; padding: 0.5rem; border: 1px solid var(--ema-border, #ddd); border-radius: 4px;"
          />
        `,
        primaryText: options.confirmText || "OK",
        secondaryText: options.cancelText || "Cancel",
        showSecondary: true,
        size: "small",
      }).then((result) => {
        if (result === "primary") {
          const input = document.getElementById(inputId)
          return input ? input.value : null
        }
        return null
      })
    },

    trapFocus(element) {
      const focusableElements = element.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      )

      if (focusableElements.length === 0) return

      const firstFocusable = focusableElements[0]
      const lastFocusable = focusableElements[focusableElements.length - 1]

      firstFocusable.focus()

      element.addEventListener("keydown", (e) => {
        if (e.key !== "Tab") return

        if (e.shiftKey) {
          if (document.activeElement === firstFocusable) {
            e.preventDefault()
            lastFocusable.focus()
          }
        } else {
          if (document.activeElement === lastFocusable) {
            e.preventDefault()
            firstFocusable.focus()
          }
        }
      })
    },

    setupKeyboardHandlers() {
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && this.modalStack.length > 0) {
          const topModal = this.modalStack[this.modalStack.length - 1]
          if (topModal.config.closeOnEscape) {
            this.closeModal(topModal.overlay)
          }
        }
      })
    },
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => EmaUI.init())
  } else {
    EmaUI.init()
  }

  window.EmaUI = EmaUI
})(window)
