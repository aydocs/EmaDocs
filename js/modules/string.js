/**
 * EMADOCS - STRING MODULE
 */
;((window) => {
  const EmaString = {
    capitalize(str) {
      return str.charAt(0).toUpperCase() + str.slice(1)
    },

    camelCase(str) {
      return str.replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ""))
    },

    kebabCase(str) {
      return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()
    },

    snakeCase(str) {
      return str.replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase()
    },

    truncate(str, length, suffix = "...") {
      return str.length > length ? str.substring(0, length) + suffix : str
    },

    slugify(str) {
      return str
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "")
    },
  }

  window.EmaString = EmaString
})(window)
