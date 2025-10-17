/**
 * EMADOCS - COOKIE MODULE
 */
;((window) => {
  const EmaCookie = {
    set(name, value, days = 7) {
      const date = new Date()
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
      document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`
    },

    get(name) {
      const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"))
      return match ? match[2] : null
    },

    remove(name) {
      this.set(name, "", -1)
    },

    getAll() {
      return document.cookie.split(";").reduce((cookies, cookie) => {
        const [name, value] = cookie.split("=").map((c) => c.trim())
        cookies[name] = value
        return cookies
      }, {})
    },
  }

  window.EmaCookie = EmaCookie
})(window)
