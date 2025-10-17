/**
 * EMADOCS - TEMPLATE MODULE
 */
;((window) => {
  const EmaTemplate = {
    compile(template, data) {
      return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
        return data[key] !== undefined ? data[key] : match
      })
    },

    render(templateId, data, targetId) {
      const template = document.getElementById(templateId)
      const target = document.getElementById(targetId)

      if (!template || !target) return

      const html = this.compile(template.innerHTML, data)
      target.innerHTML = html
    },

    loop(template, items) {
      return items.map((item) => this.compile(template, item)).join("")
    },
  }

  window.EmaTemplate = EmaTemplate
})(window)
