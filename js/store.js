/**
 * EMADOCS FRAMEWORK - STORE MODULE
 * Reactive state management with persistence and watchers
 * @version 1.0.0
 */

;((window) => {
  const EmaStore = {
    state: {},
    watchers: {},
    bindings: new Map(),
    persistentKeys: new Set(),
    storageType: "local",

    init() {
      this.loadFromStorage()
      window.EmaCore.emit("store:initialized")
    },

    set(key, value, options = {}) {
      const oldValue = this.get(key)

      if (oldValue === value) return

      const keys = key.split(".")
      let target = this.state

      for (let i = 0; i < keys.length - 1; i++) {
        if (!target[keys[i]] || typeof target[keys[i]] !== "object") {
          target[keys[i]] = {}
        }
        target = target[keys[i]]
      }

      const lastKey = keys[keys.length - 1]
      target[lastKey] = value

      if (this.persistentKeys.has(key)) {
        this.saveToStorage(key)
      }

      if (!options.silent) {
        this.triggerWatchers(key, value, oldValue)
      }

      this.updateBindings(key)

      window.EmaCore.emit("store:changed", { key, value, oldValue })
    },

    get(key, defaultValue = undefined) {
      const keys = key.split(".")
      let value = this.state

      for (const k of keys) {
        if (value === undefined || value === null) break
        value = value[k]
      }

      return value !== undefined ? value : defaultValue
    },

    has(key) {
      return this.get(key) !== undefined
    },

    delete(key) {
      const keys = key.split(".")
      let target = this.state

      for (let i = 0; i < keys.length - 1; i++) {
        if (!target[keys[i]]) return
        target = target[keys[i]]
      }

      const lastKey = keys[keys.length - 1]
      const oldValue = target[lastKey]
      delete target[lastKey]

      if (this.persistentKeys.has(key)) {
        this.removeFromStorage(key)
        this.persistentKeys.delete(key)
      }

      this.triggerWatchers(key, undefined, oldValue)

      window.EmaCore.emit("store:deleted", { key, oldValue })
    },

    watch(key, callback) {
      if (!this.watchers[key]) {
        this.watchers[key] = []
      }
      this.watchers[key].push(callback)

      return () => {
        this.watchers[key] = this.watchers[key].filter((cb) => cb !== callback)
      }
    },

    triggerWatchers(key, newValue, oldValue) {
      if (this.watchers[key]) {
        this.watchers[key].forEach((callback) => {
          try {
            callback(newValue, oldValue)
          } catch (error) {
            console.error(`[Emadocs Store] Error in watcher for "${key}":`, error)
          }
        })
      }

      const parts = key.split(".")
      for (let i = parts.length - 1; i > 0; i--) {
        const parentKey = parts.slice(0, i).join(".")
        if (this.watchers[parentKey]) {
          const parentValue = this.get(parentKey)
          this.watchers[parentKey].forEach((callback) => {
            try {
              callback(parentValue, parentValue)
            } catch (error) {
              console.error(`[Emadocs Store] Error in watcher for "${parentKey}":`, error)
            }
          })
        }
      }
    },

    bind(key, target, options = {}) {
      const element = typeof target === "string" ? document.querySelector(target) : target

      if (!element) {
        console.error("[Emadocs Store] Bind target not found")
        return
      }

      const property = options.property || "textContent"
      const transform = options.transform || ((v) => v)

      const binding = { element, property, transform }

      if (!this.bindings.has(key)) {
        this.bindings.set(key, [])
      }
      this.bindings.get(key).push(binding)

      this.updateBinding(key, binding)

      return () => {
        const bindings = this.bindings.get(key)
        if (bindings) {
          const index = bindings.indexOf(binding)
          if (index > -1) {
            bindings.splice(index, 1)
          }
        }
      }
    },

    updateBinding(key, binding) {
      const value = this.get(key)
      const transformedValue = binding.transform(value)

      if (
        binding.property === "value" &&
        (binding.element.tagName === "INPUT" ||
          binding.element.tagName === "TEXTAREA" ||
          binding.element.tagName === "SELECT")
      ) {
        binding.element.value = transformedValue ?? ""
      } else if (binding.property === "checked" && binding.element.tagName === "INPUT") {
        binding.element.checked = !!transformedValue
      } else {
        binding.element[binding.property] = transformedValue ?? ""
      }
    },

    updateBindings(key) {
      const bindings = this.bindings.get(key)
      if (!bindings) return

      bindings.forEach((binding) => {
        this.updateBinding(key, binding)
      })
    },

    persist(key, options = {}) {
      this.storageType = options.storage || "local"
      this.persistentKeys.add(key)
      this.saveToStorage(key)
    },

    saveToStorage(key) {
      const storage = this.storageType === "session" ? sessionStorage : localStorage
      const value = this.get(key)

      try {
        storage.setItem(`emadocs:${key}`, JSON.stringify(value))
      } catch (error) {
        console.error(`[Emadocs Store] Failed to save "${key}" to storage:`, error)
      }
    },

    loadFromStorage() {
      const storage = this.storageType === "session" ? sessionStorage : localStorage

      for (let i = 0; i < storage.length; i++) {
        const storageKey = storage.key(i)
        if (storageKey && storageKey.startsWith("emadocs:")) {
          const key = storageKey.slice(8)
          try {
            const value = JSON.parse(storage.getItem(storageKey))
            this.set(key, value, { silent: true })
            this.persistentKeys.add(key)
          } catch (error) {
            console.error(`[Emadocs Store] Failed to load "${key}" from storage:`, error)
          }
        }
      }
    },

    removeFromStorage(key) {
      const storage = this.storageType === "session" ? sessionStorage : localStorage
      storage.removeItem(`emadocs:${key}`)
    },

    clear(options = {}) {
      this.state = {}
      this.watchers = {}
      this.bindings.clear()

      if (options.clearStorage !== false) {
        const storage = this.storageType === "session" ? sessionStorage : localStorage
        const keys = []

        for (let i = 0; i < storage.length; i++) {
          const key = storage.key(i)
          if (key && key.startsWith("emadocs:")) {
            keys.push(key)
          }
        }

        keys.forEach((key) => storage.removeItem(key))
        this.persistentKeys.clear()
      }

      window.EmaCore.emit("store:cleared")
    },

    getState() {
      return window.EmaCore.clone(this.state)
    },

    setState(newState) {
      this.state = newState

      this.bindings.forEach((bindings, key) => {
        this.updateBindings(key)
      })

      Object.keys(this.watchers).forEach((key) => {
        const value = this.get(key)
        this.triggerWatchers(key, value, value)
      })

      window.EmaCore.emit("store:state-changed", { state: newState })
    },
  }

  EmaStore.init()

  window.EmaStore = EmaStore
})(window)
