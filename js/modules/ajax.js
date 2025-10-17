/**
 * EMADOCS - AJAX MODULE
 */
;((window) => {
  const EmaAjax = {
    async request(url, options = {}) {
      const response = await fetch(url, options)
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      return response.json()
    },

    get(url, params = {}) {
      const query = new URLSearchParams(params).toString()
      const fullUrl = query ? `${url}?${query}` : url
      return this.request(fullUrl)
    },

    post(url, data) {
      return this.request(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
    },

    put(url, data) {
      return this.request(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
    },

    delete(url) {
      return this.request(url, { method: "DELETE" })
    },
  }

  window.EmaAjax = EmaAjax
})(window)
