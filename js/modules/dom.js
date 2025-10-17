/**
 * EMADOCS - DOM MODULE
 */
;((window) => {
  const EmaDom = {
    create(tag, attrs = {}, children = []) {
      const el = document.createElement(tag)
      Object.entries(attrs).forEach(([key, value]) => {
        if (key === "class") el.className = value
        else if (key === "style") Object.assign(el.style, value)
        else el.setAttribute(key, value)
      })
      children.forEach((child) => {
        el.appendChild(typeof child === "string" ? document.createTextNode(child) : child)
      })
      return el
    },

    addClass(el, ...classes) {
      el.classList.add(...classes)
    },

    removeClass(el, ...classes) {
      el.classList.remove(...classes)
    },

    toggleClass(el, className) {
      el.classList.toggle(className)
    },

    hasClass(el, className) {
      return el.classList.contains(className)
    },

    on(el, event, handler) {
      el.addEventListener(event, handler)
      return () => el.removeEventListener(event, handler)
    },

    off(el, event, handler) {
      el.removeEventListener(event, handler)
    },
  }

  window.EmaDom = EmaDom
})(window)
