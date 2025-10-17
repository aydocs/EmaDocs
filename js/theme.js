/**
 * EMADOCS FRAMEWORK - THEME MANAGER
 * Dark/Light theme switching with persistence
 * @version 1.0.0
 */

;((window) => {
  const EmaTheme = {
    currentTheme: "light",
    storageKey: "emadocs-theme",

    init() {
      const savedTheme = localStorage.getItem(this.storageKey)
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"

      this.currentTheme = savedTheme || systemTheme
      this.apply(this.currentTheme)

      window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
        if (!localStorage.getItem(this.storageKey)) {
          this.set(e.matches ? "dark" : "light")
        }
      })

      window.EmaCore.emit("theme:initialized", { theme: this.currentTheme })
    },

    set(theme) {
      if (theme !== "light" && theme !== "dark") {
        console.error("[Emadocs Theme] Invalid theme:", theme)
        return
      }

      this.currentTheme = theme
      this.apply(theme)
      localStorage.setItem(this.storageKey, theme)

      window.EmaCore.emit("theme:changed", { theme })
    },

    apply(theme) {
      document.documentElement.setAttribute("data-theme", theme)
    },

    toggle() {
      const newTheme = this.currentTheme === "light" ? "dark" : "light"
      this.set(newTheme)
    },

    get() {
      return this.currentTheme
    },

    isDark() {
      return this.currentTheme === "dark"
    },

    isLight() {
      return this.currentTheme === "light"
    },
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => EmaTheme.init())
  } else {
    EmaTheme.init()
  }

  window.EmaTheme = EmaTheme
})(window)
