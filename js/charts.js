/**
 * @module Charts
 * @description Data visualization library with multiple chart types
 */

window.Adiox = window.Adiox || {}

window.Adiox.Charts = {
  /**
   * Create a line chart
   * @param {HTMLCanvasElement} canvas - Canvas element
   * @param {Object} data - Chart data
   * @param {Object} options - Chart options
   */
  line(canvas, data, options = {}) {
    const ctx = canvas.getContext("2d")
    const { labels, datasets } = data
    const {
      width = canvas.width,
      height = canvas.height,
      padding = 40,
      showGrid = true,
      showLegend = true,
      animate = true,
    } = options

    canvas.width = width
    canvas.height = height

    const chartWidth = width - padding * 2
    const chartHeight = height - padding * 2

    // Find min/max values
    const allValues = datasets.flatMap((d) => d.data)
    const minValue = Math.min(...allValues, 0)
    const maxValue = Math.max(...allValues)
    const valueRange = maxValue - minValue

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Draw grid
    if (showGrid) {
      ctx.strokeStyle = "#e5e7eb"
      ctx.lineWidth = 1

      // Horizontal grid lines
      for (let i = 0; i <= 5; i++) {
        const y = padding + (chartHeight / 5) * i
        ctx.beginPath()
        ctx.moveTo(padding, y)
        ctx.lineTo(width - padding, y)
        ctx.stroke()

        // Y-axis labels
        const value = maxValue - (valueRange / 5) * i
        ctx.fillStyle = "#6b7280"
        ctx.font = "12px system-ui"
        ctx.textAlign = "right"
        ctx.fillText(value.toFixed(0), padding - 10, y + 4)
      }

      // Vertical grid lines
      const step = chartWidth / (labels.length - 1)
      labels.forEach((label, i) => {
        const x = padding + step * i
        ctx.beginPath()
        ctx.moveTo(x, padding)
        ctx.lineTo(x, height - padding)
        ctx.stroke()

        // X-axis labels
        ctx.fillStyle = "#6b7280"
        ctx.font = "12px system-ui"
        ctx.textAlign = "center"
        ctx.fillText(label, x, height - padding + 20)
      })
    }

    // Draw datasets
    datasets.forEach((dataset, datasetIndex) => {
      const color = dataset.color || this.getColor(datasetIndex)
      ctx.strokeStyle = color
      ctx.lineWidth = 2
      ctx.lineCap = "round"
      ctx.lineJoin = "round"

      // Draw line
      ctx.beginPath()
      dataset.data.forEach((value, i) => {
        const x = padding + (chartWidth / (labels.length - 1)) * i
        const y = padding + chartHeight - ((value - minValue) / valueRange) * chartHeight

        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })
      ctx.stroke()

      // Draw points
      ctx.fillStyle = color
      dataset.data.forEach((value, i) => {
        const x = padding + (chartWidth / (labels.length - 1)) * i
        const y = padding + chartHeight - ((value - minValue) / valueRange) * chartHeight

        ctx.beginPath()
        ctx.arc(x, y, 4, 0, Math.PI * 2)
        ctx.fill()
      })

      // Fill area under line
      if (dataset.fill) {
        ctx.globalAlpha = 0.1
        ctx.fillStyle = color
        ctx.beginPath()
        dataset.data.forEach((value, i) => {
          const x = padding + (chartWidth / (labels.length - 1)) * i
          const y = padding + chartHeight - ((value - minValue) / valueRange) * chartHeight

          if (i === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        })
        ctx.lineTo(width - padding, height - padding)
        ctx.lineTo(padding, height - padding)
        ctx.closePath()
        ctx.fill()
        ctx.globalAlpha = 1
      }
    })

    // Draw legend
    if (showLegend) {
      const legendY = 20
      let legendX = padding

      datasets.forEach((dataset, i) => {
        const color = dataset.color || this.getColor(i)

        // Legend box
        ctx.fillStyle = color
        ctx.fillRect(legendX, legendY, 12, 12)

        // Legend label
        ctx.fillStyle = "#374151"
        ctx.font = "12px system-ui"
        ctx.textAlign = "left"
        ctx.fillText(dataset.label, legendX + 18, legendY + 10)

        legendX += ctx.measureText(dataset.label).width + 40
      })
    }
  },

  /**
   * Create a bar chart
   * @param {HTMLCanvasElement} canvas - Canvas element
   * @param {Object} data - Chart data
   * @param {Object} options - Chart options
   */
  bar(canvas, data, options = {}) {
    const ctx = canvas.getContext("2d")
    const { labels, datasets } = data
    const { width = canvas.width, height = canvas.height, padding = 40, showGrid = true, horizontal = false } = options

    canvas.width = width
    canvas.height = height

    const chartWidth = width - padding * 2
    const chartHeight = height - padding * 2

    const allValues = datasets.flatMap((d) => d.data)
    const maxValue = Math.max(...allValues)

    ctx.clearRect(0, 0, width, height)

    // Draw grid
    if (showGrid) {
      ctx.strokeStyle = "#e5e7eb"
      ctx.lineWidth = 1

      for (let i = 0; i <= 5; i++) {
        const y = padding + (chartHeight / 5) * i
        ctx.beginPath()
        ctx.moveTo(padding, y)
        ctx.lineTo(width - padding, y)
        ctx.stroke()

        const value = maxValue - (maxValue / 5) * i
        ctx.fillStyle = "#6b7280"
        ctx.font = "12px system-ui"
        ctx.textAlign = "right"
        ctx.fillText(value.toFixed(0), padding - 10, y + 4)
      }
    }

    // Draw bars
    const barWidth = (chartWidth / labels.length) * 0.8
    const barSpacing = (chartWidth / labels.length) * 0.2

    labels.forEach((label, i) => {
      const x = padding + (chartWidth / labels.length) * i + barSpacing / 2

      datasets.forEach((dataset, datasetIndex) => {
        const value = dataset.data[i]
        const barHeight = (value / maxValue) * chartHeight
        const y = padding + chartHeight - barHeight
        const color = dataset.color || this.getColor(datasetIndex)

        ctx.fillStyle = color
        ctx.fillRect(x, y, barWidth, barHeight)
      })

      // X-axis labels
      ctx.fillStyle = "#6b7280"
      ctx.font = "12px system-ui"
      ctx.textAlign = "center"
      ctx.fillText(label, x + barWidth / 2, height - padding + 20)
    })
  },

  /**
   * Create a pie chart
   * @param {HTMLCanvasElement} canvas - Canvas element
   * @param {Object} data - Chart data
   * @param {Object} options - Chart options
   */
  pie(canvas, data, options = {}) {
    const ctx = canvas.getContext("2d")
    const { labels, values } = data
    const { width = canvas.width, height = canvas.height, showLabels = true, showPercentages = true } = options

    canvas.width = width
    canvas.height = height

    const centerX = width / 2
    const centerY = height / 2
    const radius = Math.min(width, height) / 2 - 40

    ctx.clearRect(0, 0, width, height)

    const total = values.reduce((sum, val) => sum + val, 0)
    let currentAngle = -Math.PI / 2

    values.forEach((value, i) => {
      const sliceAngle = (value / total) * Math.PI * 2
      const color = this.getColor(i)

      // Draw slice
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle)
      ctx.closePath()
      ctx.fill()

      // Draw label
      if (showLabels) {
        const labelAngle = currentAngle + sliceAngle / 2
        const labelX = centerX + Math.cos(labelAngle) * (radius * 0.7)
        const labelY = centerY + Math.sin(labelAngle) * (radius * 0.7)

        ctx.fillStyle = "#ffffff"
        ctx.font = "bold 14px system-ui"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"

        if (showPercentages) {
          const percentage = ((value / total) * 100).toFixed(1)
          ctx.fillText(`${percentage}%`, labelX, labelY)
        } else {
          ctx.fillText(labels[i], labelX, labelY)
        }
      }

      currentAngle += sliceAngle
    })

    // Draw legend
    const legendX = width - 120
    let legendY = 40

    labels.forEach((label, i) => {
      const color = this.getColor(i)

      ctx.fillStyle = color
      ctx.fillRect(legendX, legendY, 12, 12)

      ctx.fillStyle = "#374151"
      ctx.font = "12px system-ui"
      ctx.textAlign = "left"
      ctx.fillText(label, legendX + 18, legendY + 10)

      legendY += 25
    })
  },

  /**
   * Get color from palette
   * @private
   */
  getColor(index) {
    const colors = [
      "#3b82f6",
      "#ef4444",
      "#10b981",
      "#f59e0b",
      "#8b5cf6",
      "#ec4899",
      "#14b8a6",
      "#f97316",
      "#6366f1",
      "#84cc16",
    ]
    return colors[index % colors.length]
  },
}
