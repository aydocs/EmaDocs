/**
 * EMADOCS FRAMEWORK - MAIN MODULE
 * Combines all modules into unified API
 * @version 1.0.0
 */

;((window) => {
  const Emadocs = {
    Core: window.EmaCore,
    Router: window.EmaRouter,
    Store: window.EmaStore,
    UI: window.EmaUI,
    Animations: window.EmaAnimations,
    Theme: window.EmaTheme,
    Utils: window.EmaUtils,
    I18n: window.EmaI18n,

    version: "1.0.0",

    use(plugin) {
      this.Core.use(plugin)
    },

    init(options = {}) {
      console.log(`%c🚀 Emadocs Framework v${this.version}`, "color: #8b5cf6; font-size: 16px; font-weight: bold;")

      if (options.router) {
        this.Router.init(options.router)
      }

      if (options.i18n) {
        this.I18n.init(options.i18n)
      }

      this.Core.emit("emadocs:initialized", { version: this.version })
    },

    setTheme(theme) {
      if (this.Theme) {
        this.Theme.set(theme)
      }
    },

    toggleTheme() {
      if (this.Theme) {
        this.Theme.toggle()
      }
    },

    getTheme() {
      return this.Theme ? this.Theme.get() : "light"
    },
  }

  window.Emadocs = Emadocs
})(window)
