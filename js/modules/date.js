/**
 * EMADOCS - DATE MODULE
 */
;((window) => {
  const EmaDate = {
    format(date, format = "YYYY-MM-DD") {
      const d = new Date(date)
      const map = {
        YYYY: d.getFullYear(),
        MM: String(d.getMonth() + 1).padStart(2, "0"),
        DD: String(d.getDate()).padStart(2, "0"),
        HH: String(d.getHours()).padStart(2, "0"),
        mm: String(d.getMinutes()).padStart(2, "0"),
        ss: String(d.getSeconds()).padStart(2, "0"),
      }

      return format.replace(/YYYY|MM|DD|HH|mm|ss/g, (match) => map[match])
    },

    addDays(date, days) {
      const result = new Date(date)
      result.setDate(result.getDate() + days)
      return result
    },

    diffDays(date1, date2) {
      const diff = Math.abs(new Date(date1) - new Date(date2))
      return Math.floor(diff / (1000 * 60 * 60 * 24))
    },

    isToday(date) {
      const today = new Date()
      const d = new Date(date)
      return d.toDateString() === today.toDateString()
    },
  }

  window.EmaDate = EmaDate
})(window)
