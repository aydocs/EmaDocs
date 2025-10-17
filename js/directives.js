/**
 * Adiox Directives System
 * Vue-like directives (a-if, a-for, a-model, a-show, etc.)
 * @module Directives
 */

;((Adiox) => {
  const directives = new Map()

  /**
   * Register a custom directive
   */
  function directive(name, definition) {
    directives.set(name, definition)
  }

  /**
   * Process directives on an element
   */
  function processDirectives(el, context) {
    const attrs = Array.from(el.attributes)

    for (const attr of attrs) {
      if (attr.name.startsWith("a-")) {
        const directiveName = attr.name.slice(2)
        const directive = directives.get(directiveName)

        if (directive) {
          directive.bind(el, attr.value, context)
        }
      }
    }
  }

  /**
   * Built-in directives
   */

  // a-if: Conditional rendering
  directive("if", {
    bind(el, expression, context) {
      const comment = document.createComment("a-if")
      const parent = el.parentNode
      const nextSibling = el.nextSibling

      parent.insertBefore(comment, el)
      parent.removeChild(el)

      Adiox.Reactivity.effect(() => {
        const value = evaluateExpression(expression, context)

        if (value) {
          if (!el.parentNode) {
            parent.insertBefore(el, nextSibling)
          }
        } else {
          if (el.parentNode) {
            parent.removeChild(el)
          }
        }
      })
    },
  })

  // a-show: Toggle visibility
  directive("show", {
    bind(el, expression, context) {
      const originalDisplay = el.style.display

      Adiox.Reactivity.effect(() => {
        const value = evaluateExpression(expression, context)
        el.style.display = value ? originalDisplay : "none"
      })
    },
  })

  // a-for: List rendering
  directive("for", {
    bind(el, expression, context) {
      const match = expression.match(/(\w+)\s+in\s+(.+)/)
      if (!match) {
        console.error("[Adiox] Invalid a-for expression:", expression)
        return
      }

      const [, itemName, listExpression] = match
      const template = el.cloneNode(true)
      const parent = el.parentNode
      const comment = document.createComment("a-for")

      parent.insertBefore(comment, el)
      parent.removeChild(el)

      let renderedElements = []

      Adiox.Reactivity.effect(() => {
        const list = evaluateExpression(listExpression, context)

        // Remove old elements
        renderedElements.forEach((elem) => {
          if (elem.parentNode) {
            parent.removeChild(elem)
          }
        })
        renderedElements = []

        // Render new elements
        if (Array.isArray(list)) {
          list.forEach((item, index) => {
            const clone = template.cloneNode(true)
            clone.removeAttribute("a-for")

            const itemContext = {
              ...context,
              [itemName]: item,
              $index: index,
            }

            processElement(clone, itemContext)
            parent.insertBefore(clone, comment.nextSibling)
            renderedElements.push(clone)
          })
        }
      })
    },
  })

  // a-model: Two-way data binding
  directive("model", {
    bind(el, expression, context) {
      const tagName = el.tagName.toLowerCase()

      if (tagName === "input" || tagName === "textarea") {
        const inputType = el.type

        // Set initial value
        Adiox.Reactivity.effect(() => {
          const value = evaluateExpression(expression, context)

          if (inputType === "checkbox") {
            el.checked = value
          } else if (inputType === "radio") {
            el.checked = el.value === value
          } else {
            el.value = value ?? ""
          }
        })

        // Listen for changes
        const eventName = inputType === "checkbox" || inputType === "radio" ? "change" : "input"

        el.addEventListener(eventName, (e) => {
          let value

          if (inputType === "checkbox") {
            value = e.target.checked
          } else if (inputType === "radio") {
            value = e.target.value
          } else if (inputType === "number") {
            value = Number.parseFloat(e.target.value)
          } else {
            value = e.target.value
          }

          setNestedProperty(context, expression, value)
        })
      } else if (tagName === "select") {
        // Set initial value
        Adiox.Reactivity.effect(() => {
          const value = evaluateExpression(expression, context)
          el.value = value ?? ""
        })

        // Listen for changes
        el.addEventListener("change", (e) => {
          setNestedProperty(context, expression, e.target.value)
        })
      }
    },
  })

  // a-bind: Bind attribute (shorthand :)
  directive("bind", {
    bind(el, expression, context) {
      const [attr, expr] = expression.split("=")

      Adiox.Reactivity.effect(() => {
        const value = evaluateExpression(expr, context)

        if (attr === "class") {
          if (typeof value === "string") {
            el.className = value
          } else if (typeof value === "object") {
            el.className = Object.entries(value)
              .filter(([, v]) => v)
              .map(([k]) => k)
              .join(" ")
          }
        } else if (attr === "style") {
          if (typeof value === "string") {
            el.style.cssText = value
          } else if (typeof value === "object") {
            Object.assign(el.style, value)
          }
        } else {
          el.setAttribute(attr, value)
        }
      })
    },
  })

  // a-on: Event listener (shorthand @)
  directive("on", {
    bind(el, expression, context) {
      const [event, handler] = expression.split("=")

      el.addEventListener(event, (e) => {
        const fn = evaluateExpression(handler, context)
        if (typeof fn === "function") {
          fn(e)
        }
      })
    },
  })

  // a-text: Set text content
  directive("text", {
    bind(el, expression, context) {
      Adiox.Reactivity.effect(() => {
        const value = evaluateExpression(expression, context)
        el.textContent = value ?? ""
      })
    },
  })

  // a-html: Set innerHTML (use with caution)
  directive("html", {
    bind(el, expression, context) {
      Adiox.Reactivity.effect(() => {
        const value = evaluateExpression(expression, context)
        el.innerHTML = Adiox.Utils.sanitizeHTML(value ?? "")
      })
    },
  })

  /**
   * Process an element and its children
   */
  function processElement(el, context) {
    processDirectives(el, context)

    // Process text interpolation {{ }}
    if (el.childNodes.length > 0) {
      Array.from(el.childNodes).forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent
          const matches = text.match(/\{\{(.+?)\}\}/g)

          if (matches) {
            Adiox.Reactivity.effect(() => {
              let result = text
              matches.forEach((match) => {
                const expression = match.slice(2, -2).trim()
                const value = evaluateExpression(expression, context)
                result = result.replace(match, value ?? "")
              })
              node.textContent = result
            })
          }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          processElement(node, context)
        }
      })
    }
  }

  /**
   * Evaluate expression in context
   */
  function evaluateExpression(expression, context) {
    try {
      const fn = new Function(...Object.keys(context), `return ${expression}`)
      return fn(...Object.values(context))
    } catch (error) {
      console.error("[Adiox] Error evaluating expression:", expression, error)
      return null
    }
  }

  /**
   * Set nested property
   */
  function setNestedProperty(obj, path, value) {
    const keys = path.split(".")
    const lastKey = keys.pop()
    const target = keys.reduce((o, k) => o[k], obj)
    target[lastKey] = value
  }

  /**
   * Compile template
   */
  function compile(template, context) {
    const container = document.createElement("div")
    container.innerHTML = template

    Array.from(container.children).forEach((el) => {
      processElement(el, context)
    })

    return container
  }

  // Export to Adiox namespace
  Adiox.Directives = {
    directive,
    processDirectives,
    processElement,
    compile,
  }
})((window.Adiox = window.Adiox || {}))
