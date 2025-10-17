/**
 * @module Clipboard
 * @description Clipboard utilities for copy/paste operations
 */

window.Adiox = window.Adiox || {}

window.Adiox.Clipboard = {
  /**
   * Copy text to clipboard
   */
  async copy(text) {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text)
        return true
      } else {
        // Fallback for older browsers
        const textarea = document.createElement("textarea")
        textarea.value = text
        textarea.style.position = "fixed"
        textarea.style.opacity = "0"
        document.body.appendChild(textarea)
        textarea.select()
        const success = document.execCommand("copy")
        document.body.removeChild(textarea)
        return success
      }
    } catch (error) {
      console.error("[Adiox Clipboard] Copy failed:", error)
      return false
    }
  },

  /**
   * Read text from clipboard
   */
  async read() {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        return await navigator.clipboard.readText()
      }
      return null
    } catch (error) {
      console.error("[Adiox Clipboard] Read failed:", error)
      return null
    }
  },

  /**
   * Copy element content
   */
  async copyElement(element) {
    if (typeof element === "string") {
      element = document.querySelector(element)
    }

    if (!element) return false

    const text = element.textContent || element.innerText
    return await this.copy(text)
  },

  /**
   * Copy with feedback
   */
  async copyWithFeedback(text, options = {}) {
    const success = await this.copy(text)

    if (success) {
      window.Adiox.UI.toast(options.successMessage || "Copied to clipboard!", "success", { duration: 2000 })
    } else {
      window.Adiox.UI.toast(options.errorMessage || "Failed to copy", "error", { duration: 2000 })
    }

    return success
  },
}
