/**
 * Adiox Store Module Tests
 *
 * Tests for reactive state management and data binding.
 */

const Adiox = require("adiox") // Assuming Adiox is imported from a module

const StoreTests = {
  name: "Store Module Tests",

  tests: [
    {
      name: "Store - create and get state",
      run: () => {
        const store = Adiox.Store.create({
          count: 0,
          user: { name: "John" },
        })

        if (store.get("count") !== 0) throw new Error("Initial count value incorrect")
        if (store.get("user.name") !== "John") throw new Error("Nested value incorrect")

        return true
      },
    },

    {
      name: "Store - set and update state",
      run: () => {
        const store = Adiox.Store.create({ count: 0 })

        store.set("count", 5)
        if (store.get("count") !== 5) throw new Error("Set value incorrect")

        store.set("count", (val) => val + 1)
        if (store.get("count") !== 6) throw new Error("Function update incorrect")

        return true
      },
    },

    {
      name: "Store - watch for changes",
      run: () => {
        const store = Adiox.Store.create({ count: 0 })
        let watchCalled = false
        let newValue = null

        store.watch("count", (value) => {
          watchCalled = true
          newValue = value
        })

        store.set("count", 10)

        if (!watchCalled) throw new Error("Watch callback was not called")
        if (newValue !== 10) throw new Error("Watch callback received wrong value")

        return true
      },
    },

    {
      name: "Store - persistence to localStorage",
      run: () => {
        const store = Adiox.Store.create({ theme: "dark" }, { persist: true, key: "test-store" })

        store.set("theme", "light")

        // Check localStorage
        const saved = localStorage.getItem("test-store")
        if (!saved) throw new Error("State was not persisted")

        const parsed = JSON.parse(saved)
        if (parsed.theme !== "light") throw new Error("Persisted value incorrect")

        // Cleanup
        localStorage.removeItem("test-store")

        return true
      },
    },

    {
      name: "Store - bind to DOM element",
      run: () => {
        const store = Adiox.Store.create({ message: "Hello" })

        // Create test element
        const el = document.createElement("div")
        el.setAttribute("data-bind", "message")
        document.body.appendChild(el)

        store.bind(el)

        if (el.textContent !== "Hello") throw new Error("Initial bind failed")

        store.set("message", "World")

        if (el.textContent !== "World") throw new Error("Reactive bind failed")

        // Cleanup
        document.body.removeChild(el)

        return true
      },
    },
  ],
}
