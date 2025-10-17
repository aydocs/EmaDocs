/**
 * Adiox Core Module Tests
 *
 * Tests for the core event bus, plugin system, and component loader.
 */

const Adiox = require("./path/to/Adiox") // Assuming Adiox is a module that needs to be imported

const CoreTests = {
  name: "Core Module Tests",

  tests: [
    {
      name: "Event Bus - emit and on",
      run: () => {
        let called = false
        let data = null

        Adiox.on("test:event", (payload) => {
          called = true
          data = payload
        })

        Adiox.emit("test:event", { message: "Hello" })

        if (!called) throw new Error("Event handler was not called")
        if (data.message !== "Hello") throw new Error("Event data was incorrect")

        return true
      },
    },

    {
      name: "Event Bus - off removes listener",
      run: () => {
        let callCount = 0

        const handler = () => {
          callCount++
        }
        Adiox.on("test:off", handler)

        Adiox.emit("test:off")
        if (callCount !== 1) throw new Error("Handler should be called once")

        Adiox.off("test:off", handler)
        Adiox.emit("test:off")

        if (callCount !== 1) throw new Error("Handler should not be called after off()")

        return true
      },
    },

    {
      name: "Event Bus - once only fires once",
      run: () => {
        let callCount = 0

        Adiox.once("test:once", () => {
          callCount++
        })

        Adiox.emit("test:once")
        Adiox.emit("test:once")
        Adiox.emit("test:once")

        if (callCount !== 1) throw new Error(`Handler should be called once, was called ${callCount} times`)

        return true
      },
    },

    {
      name: "Plugin System - register and use plugin",
      run: () => {
        const testPlugin = {
          name: "TestPlugin",
          install(Adiox, options) {
            Adiox.TestPlugin = {
              value: options.value || "default",
            }
          },
        }

        Adiox.use(testPlugin, { value: "custom" })

        if (!Adiox.TestPlugin) throw new Error("Plugin was not installed")
        if (Adiox.TestPlugin.value !== "custom") throw new Error("Plugin options were not passed")

        return true
      },
    },

    {
      name: "Component Loader - defineComponent",
      run: () => {
        const componentDefined = Adiox.Core.defineComponent("test-component", {
          template: "<div>Test</div>",
          props: ["title"],
        })

        if (!componentDefined) throw new Error("Component was not defined")

        return true
      },
    },
  ],
}
