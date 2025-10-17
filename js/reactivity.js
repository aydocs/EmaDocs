/**
 * Adiox Reactivity System
 * Vue/React-like reactive data binding with virtual DOM
 * @module Reactivity
 */

;((Adiox) => {
  /**
   * Virtual DOM Node
   */
  class VNode {
    constructor(tag, props = {}, children = []) {
      this.tag = tag
      this.props = props
      this.children = children
      this.key = props.key
      this.el = null
    }
  }

  /**
   * Create virtual node (JSX-like syntax support)
   */
  function h(tag, props, ...children) {
    return new VNode(
      tag,
      props || {},
      children.flat().filter((child) => child != null),
    )
  }

  /**
   * Reactive data wrapper with Proxy
   */
  function reactive(target) {
    if (typeof target !== "object" || target === null) {
      return target
    }

    // Already reactive
    if (target.__isReactive) {
      return target
    }

    const handlers = {
      get(target, key, receiver) {
        if (key === "__isReactive") return true

        // Track dependency
        track(target, key)

        const result = Reflect.get(target, key, receiver)

        // Deep reactivity
        if (typeof result === "object" && result !== null) {
          return reactive(result)
        }

        return result
      },

      set(target, key, value, receiver) {
        const oldValue = target[key]
        const result = Reflect.set(target, key, value, receiver)

        // Trigger updates if value changed
        if (oldValue !== value) {
          trigger(target, key)
        }

        return result
      },

      deleteProperty(target, key) {
        const result = Reflect.deleteProperty(target, key)
        trigger(target, key)
        return result
      },
    }

    return new Proxy(target, handlers)
  }

  /**
   * Dependency tracking
   */
  let activeEffect = null
  const targetMap = new WeakMap()

  function track(target, key) {
    if (!activeEffect) return

    let depsMap = targetMap.get(target)
    if (!depsMap) {
      targetMap.set(target, (depsMap = new Map()))
    }

    let dep = depsMap.get(key)
    if (!dep) {
      depsMap.set(key, (dep = new Set()))
    }

    dep.add(activeEffect)
  }

  function trigger(target, key) {
    const depsMap = targetMap.get(target)
    if (!depsMap) return

    const dep = depsMap.get(key)
    if (!dep) return

    dep.forEach((effect) => {
      if (effect.scheduler) {
        effect.scheduler()
      } else {
        effect()
      }
    })
  }

  /**
   * Effect system (like React useEffect)
   */
  function effect(fn, options = {}) {
    const effectFn = () => {
      try {
        activeEffect = effectFn
        return fn()
      } finally {
        activeEffect = null
      }
    }

    effectFn.scheduler = options.scheduler

    if (!options.lazy) {
      effectFn()
    }

    return effectFn
  }

  /**
   * Computed properties (like Vue computed)
   */
  function computed(getter) {
    let value
    let dirty = true

    const effectFn = effect(getter, {
      lazy: true,
      scheduler: () => {
        dirty = true
      },
    })

    return {
      get value() {
        if (dirty) {
          value = effectFn()
          dirty = false
        }
        return value
      },
    }
  }

  /**
   * Watch (like Vue watch)
   */
  function watch(source, callback, options = {}) {
    let getter

    if (typeof source === "function") {
      getter = source
    } else {
      getter = () => source
    }

    let oldValue

    const job = () => {
      const newValue = effectFn()
      if (newValue !== oldValue || options.deep) {
        callback(newValue, oldValue)
        oldValue = newValue
      }
    }

    const effectFn = effect(getter, {
      lazy: true,
      scheduler: () => {
        if (options.flush === "sync") {
          job()
        } else {
          queueJob(job)
        }
      },
    })

    if (options.immediate) {
      job()
    } else {
      oldValue = effectFn()
    }

    return () => {
      // Cleanup
    }
  }

  /**
   * Job queue for batched updates
   */
  const queue = []
  let isFlushing = false

  function queueJob(job) {
    if (!queue.includes(job)) {
      queue.push(job)
    }

    if (!isFlushing) {
      isFlushing = true
      Promise.resolve().then(flushJobs)
    }
  }

  function flushJobs() {
    try {
      for (let i = 0; i < queue.length; i++) {
        queue[i]()
      }
    } finally {
      queue.length = 0
      isFlushing = false
    }
  }

  /**
   * Virtual DOM diffing and patching
   */
  function patch(oldVNode, newVNode, container) {
    if (!oldVNode) {
      // Mount
      mount(newVNode, container)
    } else if (!newVNode) {
      // Unmount
      unmount(oldVNode)
    } else if (oldVNode.tag !== newVNode.tag) {
      // Replace
      const parent = oldVNode.el.parentNode
      unmount(oldVNode)
      mount(newVNode, parent)
    } else {
      // Update
      const el = (newVNode.el = oldVNode.el)

      // Update props
      const oldProps = oldVNode.props || {}
      const newProps = newVNode.props || {}

      // Add/update props
      for (const key in newProps) {
        const oldValue = oldProps[key]
        const newValue = newProps[key]
        if (oldValue !== newValue) {
          patchProp(el, key, oldValue, newValue)
        }
      }

      // Remove old props
      for (const key in oldProps) {
        if (!(key in newProps)) {
          patchProp(el, key, oldProps[key], null)
        }
      }

      // Update children
      patchChildren(oldVNode, newVNode, el)
    }
  }

  function mount(vnode, container) {
    if (typeof vnode === "string" || typeof vnode === "number") {
      const el = document.createTextNode(vnode)
      container.appendChild(el)
      return
    }

    const el = (vnode.el = document.createElement(vnode.tag))

    // Set props
    if (vnode.props) {
      for (const key in vnode.props) {
        patchProp(el, key, null, vnode.props[key])
      }
    }

    // Mount children
    if (vnode.children) {
      vnode.children.forEach((child) => {
        mount(child, el)
      })
    }

    container.appendChild(el)
  }

  function unmount(vnode) {
    if (vnode.el && vnode.el.parentNode) {
      vnode.el.parentNode.removeChild(vnode.el)
    }
  }

  function patchProp(el, key, oldValue, newValue) {
    if (key.startsWith("on")) {
      // Event listener
      const eventName = key.slice(2).toLowerCase()
      if (oldValue) {
        el.removeEventListener(eventName, oldValue)
      }
      if (newValue) {
        el.addEventListener(eventName, newValue)
      }
    } else if (key === "className") {
      el.className = newValue || ""
    } else if (key === "style") {
      if (typeof newValue === "string") {
        el.style.cssText = newValue
      } else if (typeof newValue === "object") {
        for (const styleName in newValue) {
          el.style[styleName] = newValue[styleName]
        }
      }
    } else {
      if (newValue == null) {
        el.removeAttribute(key)
      } else {
        el.setAttribute(key, newValue)
      }
    }
  }

  function patchChildren(oldVNode, newVNode, container) {
    const oldChildren = oldVNode.children || []
    const newChildren = newVNode.children || []

    // Simple diff algorithm (can be optimized with keys)
    const commonLength = Math.min(oldChildren.length, newChildren.length)

    // Patch common children
    for (let i = 0; i < commonLength; i++) {
      patch(oldChildren[i], newChildren[i], container)
    }

    // Add new children
    if (newChildren.length > oldChildren.length) {
      for (let i = commonLength; i < newChildren.length; i++) {
        mount(newChildren[i], container)
      }
    }

    // Remove old children
    if (oldChildren.length > newChildren.length) {
      for (let i = commonLength; i < oldChildren.length; i++) {
        unmount(oldChildren[i])
      }
    }
  }

  /**
   * Component system
   */
  function defineComponent(options) {
    return {
      ...options,
      __isComponent: true,
    }
  }

  /**
   * Create app instance
   */
  function createApp(rootComponent) {
    let isMounted = false
    let oldVNode = null

    const app = {
      mount(selector) {
        if (isMounted) {
          console.warn("[Adiox] App already mounted")
          return
        }

        const container = typeof selector === "string" ? document.querySelector(selector) : selector

        if (!container) {
          console.error("[Adiox] Mount container not found")
          return
        }

        // Setup reactive data
        const data = reactive(
          typeof rootComponent.data === "function" ? rootComponent.data() : rootComponent.data || {},
        )

        // Setup computed properties
        const computedValues = {}
        if (rootComponent.computed) {
          for (const key in rootComponent.computed) {
            computedValues[key] = computed(() => {
              return rootComponent.computed[key].call({ ...data, ...computedValues })
            })
          }
        }

        // Setup watchers
        if (rootComponent.watch) {
          for (const key in rootComponent.watch) {
            watch(() => data[key], rootComponent.watch[key].bind({ ...data, ...computedValues }))
          }
        }

        // Setup methods
        const methods = {}
        if (rootComponent.methods) {
          for (const key in rootComponent.methods) {
            methods[key] = rootComponent.methods[key].bind({ ...data, ...computedValues, ...methods })
          }
        }

        // Lifecycle: beforeMount
        if (rootComponent.beforeMount) {
          rootComponent.beforeMount.call({ ...data, ...computedValues, ...methods })
        }

        // Render function
        const render = () => {
          const newVNode = rootComponent.render.call({
            ...data,
            ...Object.fromEntries(Object.entries(computedValues).map(([k, v]) => [k, v.value])),
            ...methods,
            h,
          })

          patch(oldVNode, newVNode, container)
          oldVNode = newVNode
        }

        // Setup reactive rendering
        effect(render)

        isMounted = true

        // Lifecycle: mounted
        if (rootComponent.mounted) {
          rootComponent.mounted.call({ ...data, ...computedValues, ...methods })
        }

        return app
      },

      unmount() {
        if (!isMounted) return

        // Lifecycle: beforeUnmount
        if (rootComponent.beforeUnmount) {
          rootComponent.beforeUnmount()
        }

        if (oldVNode) {
          unmount(oldVNode)
        }

        isMounted = false

        // Lifecycle: unmounted
        if (rootComponent.unmounted) {
          rootComponent.unmounted()
        }
      },
    }

    return app
  }

  // Export to Adiox namespace
  Adiox.Reactivity = {
    reactive,
    effect,
    computed,
    watch,
    h,
    defineComponent,
    createApp,
    VNode,
  }
})((window.Adiox = window.Adiox || {}))
