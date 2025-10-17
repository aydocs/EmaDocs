/**
 * EMADOCS - ARRAY MODULE
 */
;((window) => {
  const EmaArray = {
    shuffle(array) {
      const arr = [...array]
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[arr[i], arr[j]] = [arr[j], arr[i]]
      }
      return arr
    },

    unique(array) {
      return [...new Set(array)]
    },

    chunk(array, size) {
      const chunks = []
      for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size))
      }
      return chunks
    },

    groupBy(array, key) {
      return array.reduce((result, item) => {
        const group = item[key]
        result[group] = result[group] || []
        result[group].push(item)
        return result
      }, {})
    },

    sortBy(array, key, order = "asc") {
      return [...array].sort((a, b) => {
        const aVal = a[key]
        const bVal = b[key]
        return order === "asc" ? aVal - bVal : bVal - aVal
      })
    },
  }

  window.EmaArray = EmaArray
})(window)
