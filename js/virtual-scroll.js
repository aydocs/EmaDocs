/**
 * Adiox Virtual Scroll Module
 * High-performance virtual scrolling for large lists
 * Renders only visible items for optimal performance
 *
 * @module VirtualScroll
 * @version 1.0.0
 */

;((Adiox) => {
  class VirtualScroll {
    constructor(container, options = {}) {
      this.container = container
      this.options = {
        itemHeight: options.itemHeight || 50,
        items: options.items || [],
        renderItem: options.renderItem || ((item) => `<div>${item}</div>`),
        buffer: options.buffer || 5,
        onScroll: options.onScroll || null,
        ...options,
      }

      this.scrollTop = 0
      this.visibleStart = 0
      this.visibleEnd = 0
      this.totalHeight = 0

      this.viewport = null
      this.content = null

      this.init()
    }

    init() {
      // Create viewport
      this.viewport = document.createElement("div")
      this.viewport.style.cssText = `
        height: 100%;
        overflow-y: auto;
        position: relative;
      `

      // Create content wrapper
      this.content = document.createElement("div")
      this.content.style.position = "relative"

      this.viewport.appendChild(this.content)
      this.container.appendChild(this.viewport)

      // Calculate total height
      this.totalHeight = this.options.items.length * this.options.itemHeight
      this.content.style.height = `${this.totalHeight}px`

      // Bind scroll handler
      this.viewport.addEventListener("scroll", this.handleScroll.bind(this))

      // Initial render
      this.render()
    }

    handleScroll() {
      this.scrollTop = this.viewport.scrollTop
      this.render()

      if (this.options.onScroll) {
        this.options.onScroll({
          scrollTop: this.scrollTop,
          visibleStart: this.visibleStart,
          visibleEnd: this.visibleEnd,
        })
      }
    }

    render() {
      const viewportHeight = this.viewport.clientHeight
      const itemHeight = this.options.itemHeight
      const buffer = this.options.buffer

      // Calculate visible range
      this.visibleStart = Math.max(0, Math.floor(this.scrollTop / itemHeight) - buffer)
      this.visibleEnd = Math.min(
        this.options.items.length,
        Math.ceil((this.scrollTop + viewportHeight) / itemHeight) + buffer,
      )

      // Clear content
      this.content.innerHTML = ""

      // Render visible items
      for (let i = this.visibleStart; i < this.visibleEnd; i++) {
        const item = this.options.items[i]
        const itemElement = document.createElement("div")
        itemElement.style.cssText = `
          position: absolute;
          top: ${i * itemHeight}px;
          left: 0;
          right: 0;
          height: ${itemHeight}px;
        `
        itemElement.innerHTML = this.options.renderItem(item, i)
        itemElement.dataset.index = i

        this.content.appendChild(itemElement)
      }
    }

    setItems(items) {
      this.options.items = items
      this.totalHeight = items.length * this.options.itemHeight
      this.content.style.height = `${this.totalHeight}px`
      this.render()
    }

    scrollToIndex(index) {
      const scrollTop = index * this.options.itemHeight
      this.viewport.scrollTop = scrollTop
    }

    destroy() {
      this.viewport.removeEventListener("scroll", this.handleScroll)
      this.container.innerHTML = ""
    }
  }

  // Export
  Adiox.VirtualScroll = {
    create: (container, options) => new VirtualScroll(container, options),
    VirtualScroll,
  }
})(window.Adiox)
