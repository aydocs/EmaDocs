/**
 * Adiox Drag & Drop Module
 * Complete drag and drop system with sortable lists
 * Rivals React DnD, SortableJS, Dragula
 *
 * @module DragDrop
 * @version 1.0.0
 */

;((Adiox) => {
  let draggedElement = null
  let placeholder = null
  let sourceContainer = null

  /**
   * Draggable class
   */
  class Draggable {
    constructor(element, options = {}) {
      this.element = element
      this.options = {
        handle: options.handle || null,
        ghost: options.ghost !== false,
        ghostClass: options.ghostClass || "adi-dragging",
        dragClass: options.dragClass || "adi-drag-source",
        dropEffect: options.dropEffect || "move",
        data: options.data || null,
        onStart: options.onStart || null,
        onEnd: options.onEnd || null,
        onDrag: options.onDrag || null,
        ...options,
      }

      this.isDragging = false
      this.init()
    }

    init() {
      this.element.setAttribute("draggable", "true")
      this.element.addEventListener("dragstart", this.handleDragStart.bind(this))
      this.element.addEventListener("drag", this.handleDrag.bind(this))
      this.element.addEventListener("dragend", this.handleDragEnd.bind(this))

      if (this.options.handle) {
        const handle = this.element.querySelector(this.options.handle)
        if (handle) {
          handle.style.cursor = "grab"
        }
      } else {
        this.element.style.cursor = "grab"
      }
    }

    handleDragStart(e) {
      if (this.options.handle) {
        const handle = this.element.querySelector(this.options.handle)
        if (!handle || !handle.contains(e.target)) {
          e.preventDefault()
          return
        }
      }

      this.isDragging = true
      draggedElement = this.element
      sourceContainer = this.element.parentElement

      this.element.classList.add(this.options.dragClass)

      if (this.options.ghost) {
        e.dataTransfer.effectAllowed = this.options.dropEffect

        // Create ghost image
        const ghost = this.element.cloneNode(true)
        ghost.style.opacity = "0.5"
        ghost.style.position = "absolute"
        ghost.style.top = "-9999px"
        document.body.appendChild(ghost)
        e.dataTransfer.setDragImage(ghost, 0, 0)
        setTimeout(() => ghost.remove(), 0)
      }

      // Set data
      const data = this.options.data || { id: this.element.id }
      e.dataTransfer.setData("application/json", JSON.stringify(data))

      if (this.options.onStart) {
        this.options.onStart({ element: this.element, data, event: e })
      }

      Adiox.Core.emit("drag:start", { element: this.element, data })
    }

    handleDrag(e) {
      if (this.options.onDrag) {
        this.options.onDrag({ element: this.element, event: e })
      }
    }

    handleDragEnd(e) {
      this.isDragging = false
      this.element.classList.remove(this.options.dragClass)

      if (placeholder && placeholder.parentElement) {
        placeholder.remove()
      }

      if (this.options.onEnd) {
        this.options.onEnd({ element: this.element, event: e })
      }

      Adiox.Core.emit("drag:end", { element: this.element })

      draggedElement = null
      sourceContainer = null
    }

    destroy() {
      this.element.removeAttribute("draggable")
      this.element.removeEventListener("dragstart", this.handleDragStart)
      this.element.removeEventListener("drag", this.handleDrag)
      this.element.removeEventListener("dragend", this.handleDragEnd)
      this.element.style.cursor = ""
    }
  }

  /**
   * Droppable class
   */
  class Droppable {
    constructor(element, options = {}) {
      this.element = element
      this.options = {
        accept: options.accept || "*",
        hoverClass: options.hoverClass || "adi-drop-hover",
        onDrop: options.onDrop || null,
        onEnter: options.onEnter || null,
        onLeave: options.onLeave || null,
        onOver: options.onOver || null,
        ...options,
      }

      this.init()
    }

    init() {
      this.element.addEventListener("dragenter", this.handleDragEnter.bind(this))
      this.element.addEventListener("dragover", this.handleDragOver.bind(this))
      this.element.addEventListener("dragleave", this.handleDragLeave.bind(this))
      this.element.addEventListener("drop", this.handleDrop.bind(this))
    }

    handleDragEnter(e) {
      e.preventDefault()

      if (!this.acceptsDrop(e)) return

      this.element.classList.add(this.options.hoverClass)

      if (this.options.onEnter) {
        this.options.onEnter({ element: this.element, event: e })
      }

      Adiox.Core.emit("drop:enter", { element: this.element })
    }

    handleDragOver(e) {
      e.preventDefault()

      if (!this.acceptsDrop(e)) return

      e.dataTransfer.dropEffect = "move"

      if (this.options.onOver) {
        this.options.onOver({ element: this.element, event: e })
      }
    }

    handleDragLeave(e) {
      if (e.target !== this.element) return

      this.element.classList.remove(this.options.hoverClass)

      if (this.options.onLeave) {
        this.options.onLeave({ element: this.element, event: e })
      }

      Adiox.Core.emit("drop:leave", { element: this.element })
    }

    handleDrop(e) {
      e.preventDefault()
      e.stopPropagation()

      this.element.classList.remove(this.options.hoverClass)

      if (!this.acceptsDrop(e)) return

      let data
      try {
        data = JSON.parse(e.dataTransfer.getData("application/json"))
      } catch {
        data = {}
      }

      if (this.options.onDrop) {
        this.options.onDrop({
          element: this.element,
          draggedElement,
          data,
          event: e,
        })
      }

      Adiox.Core.emit("drop:drop", {
        element: this.element,
        draggedElement,
        data,
      })
    }

    acceptsDrop(e) {
      if (this.options.accept === "*") return true

      // Check if dragged element matches accept selector
      if (draggedElement && typeof this.options.accept === "string") {
        return draggedElement.matches(this.options.accept)
      }

      return false
    }

    destroy() {
      this.element.removeEventListener("dragenter", this.handleDragEnter)
      this.element.removeEventListener("dragover", this.handleDragOver)
      this.element.removeEventListener("dragleave", this.handleDragLeave)
      this.element.removeEventListener("drop", this.handleDrop)
    }
  }

  /**
   * Sortable class for sortable lists
   */
  class Sortable {
    constructor(element, options = {}) {
      this.element = element
      this.options = {
        handle: options.handle || null,
        animation: options.animation !== false,
        animationDuration: options.animationDuration || 150,
        ghostClass: options.ghostClass || "adi-sortable-ghost",
        chosenClass: options.chosenClass || "adi-sortable-chosen",
        dragClass: options.dragClass || "adi-sortable-drag",
        onSort: options.onSort || null,
        onAdd: options.onAdd || null,
        onRemove: options.onRemove || null,
        ...options,
      }

      this.items = []
      this.init()
    }

    init() {
      this.updateItems()

      this.items.forEach((item) => {
        new Draggable(item, {
          handle: this.options.handle,
          dragClass: this.options.dragClass,
          onStart: () => {
            item.classList.add(this.options.chosenClass)
            this.createPlaceholder(item)
          },
          onEnd: () => {
            item.classList.remove(this.options.chosenClass)
          },
        })
      })

      new Droppable(this.element, {
        hoverClass: "adi-sortable-hover",
        onOver: (e) => this.handleSortOver(e.event),
        onDrop: (e) => this.handleSortDrop(e),
      })
    }

    updateItems() {
      this.items = Array.from(this.element.children)
    }

    createPlaceholder(item) {
      placeholder = item.cloneNode(true)
      placeholder.classList.add(this.options.ghostClass)
      placeholder.style.opacity = "0.4"
      placeholder.style.pointerEvents = "none"
    }

    handleSortOver(e) {
      if (!draggedElement || !placeholder) return

      const afterElement = this.getDragAfterElement(e.clientY)

      if (afterElement == null) {
        this.element.appendChild(placeholder)
      } else {
        this.element.insertBefore(placeholder, afterElement)
      }
    }

    handleSortDrop({ draggedElement: dragged, data }) {
      if (!dragged || !placeholder) return

      const oldIndex = this.items.indexOf(dragged)
      const newIndex = Array.from(this.element.children).indexOf(placeholder)

      if (this.options.animation) {
        const rect1 = dragged.getBoundingClientRect()
        placeholder.replaceWith(dragged)
        const rect2 = dragged.getBoundingClientRect()

        const deltaY = rect1.top - rect2.top

        dragged.style.transform = `translateY(${deltaY}px)`
        dragged.style.transition = "none"

        requestAnimationFrame(() => {
          dragged.style.transform = ""
          dragged.style.transition = `transform ${this.options.animationDuration}ms`
        })
      } else {
        placeholder.replaceWith(dragged)
      }

      this.updateItems()

      if (sourceContainer === this.element) {
        if (this.options.onSort) {
          this.options.onSort({ oldIndex, newIndex, item: dragged, data })
        }
        Adiox.Core.emit("sortable:sort", { oldIndex, newIndex, item: dragged })
      } else {
        if (this.options.onAdd) {
          this.options.onAdd({ newIndex, item: dragged, data, from: sourceContainer })
        }
        Adiox.Core.emit("sortable:add", { newIndex, item: dragged, from: sourceContainer })
      }
    }

    getDragAfterElement(y) {
      const draggableElements = [...this.element.querySelectorAll(":scope > *:not(.adi-sortable-ghost)")]

      return draggableElements.reduce(
        (closest, child) => {
          const box = child.getBoundingClientRect()
          const offset = y - box.top - box.height / 2

          if (offset < 0 && offset > closest.offset) {
            return { offset, element: child }
          } else {
            return closest
          }
        },
        { offset: Number.NEGATIVE_INFINITY },
      ).element
    }

    destroy() {
      this.items.forEach((item) => {
        item.removeAttribute("draggable")
      })
    }
  }

  // Export
  Adiox.DragDrop = {
    Draggable,
    Droppable,
    Sortable,
    createDraggable: (el, opts) => new Draggable(el, opts),
    createDroppable: (el, opts) => new Droppable(el, opts),
    createSortable: (el, opts) => new Sortable(el, opts),
  }
})(window.Adiox)
