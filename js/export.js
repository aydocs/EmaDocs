/**
 * Adiox Export Module
 * Export data to various formats (CSV, Excel, JSON)
 * @module Adiox.Export
 */

;(() => {
  const Export = {
    /**
     * Export data to CSV
     * @param {Array} data - Array of objects
     * @param {string} filename - File name
     * @param {Object} options - Export options
     */
    toCSV(data, filename = "export.csv", options = {}) {
      const { delimiter = ",", headers = null, includeHeaders = true } = options

      if (!data || data.length === 0) {
        console.warn("[Adiox Export] No data to export")
        return
      }

      // Get headers
      const cols = headers || Object.keys(data[0])

      // Build CSV
      let csv = ""

      if (includeHeaders) {
        csv += cols.join(delimiter) + "\n"
      }

      data.forEach((row) => {
        const values = cols.map((col) => {
          let value = row[col] || ""
          // Escape quotes and wrap in quotes if contains delimiter
          if (typeof value === "string") {
            value = value.replace(/"/g, '""')
            if (value.includes(delimiter) || value.includes("\n")) {
              value = `"${value}"`
            }
          }
          return value
        })
        csv += values.join(delimiter) + "\n"
      })

      // Download
      this._download(csv, filename, "text/csv")
    },

    /**
     * Export data to Excel (basic XLSX format)
     * @param {Array} data - Array of objects
     * @param {string} filename - File name
     */
    toExcel(data, filename = "export.xlsx") {
      // This is a simplified implementation
      // For full Excel support, use a library like SheetJS
      // We'll export as CSV with .xlsx extension for basic compatibility
      this.toCSV(data, filename.replace(".xlsx", ".csv"))
    },

    /**
     * Export data to JSON
     * @param {any} data - Data to export
     * @param {string} filename - File name
     * @param {boolean} pretty - Pretty print JSON
     */
    toJSON(data, filename = "export.json", pretty = true) {
      const json = pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data)
      this._download(json, filename, "application/json")
    },

    /**
     * Export table to CSV
     * @param {HTMLTableElement|string} table - Table element or selector
     * @param {string} filename - File name
     */
    tableToCSV(table, filename = "table.csv") {
      const el = typeof table === "string" ? document.querySelector(table) : table
      if (!el || el.tagName !== "TABLE") {
        console.error("[Adiox Export] Invalid table element")
        return
      }

      const rows = Array.from(el.querySelectorAll("tr"))
      const data = rows.map((row) => {
        return Array.from(row.querySelectorAll("th, td")).map((cell) => cell.textContent.trim())
      })

      const csv = data.map((row) => row.join(",")).join("\n")
      this._download(csv, filename, "text/csv")
    },

    /**
     * Internal download helper
     * @private
     */
    _download(content, filename, mimeType) {
      const blob = new Blob([content], { type: mimeType })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = filename
      a.click()
      URL.revokeObjectURL(url)
    },
  }

  // Attach to Adiox
  if (typeof window.Adiox !== "undefined") {
    window.Adiox.Export = Export
  } else {
    console.warn("[Adiox Export] Adiox core not found")
  }
})()
