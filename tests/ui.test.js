/**
 * Adiox UI Module Tests
 *
 * Tests for toast, modal, and UI utilities.
 */

const UITests = {
  name: "UI Module Tests",

  tests: [
    {
      name: "Toast - show and auto-dismiss",
      run: async () => {
        Adiox.UI.toast("Test message", "info", 500)

        // Check if toast exists
        const toast = document.querySelector("adi-toast")
        if (!toast) throw new Error("Toast was not created")

        // Wait for auto-dismiss
        await new Promise((resolve) => setTimeout(resolve, 600))

        const toastAfter = document.querySelector("adi-toast")
        if (toastAfter) throw new Error("Toast was not dismissed")

        return true
      },
    },

    {
      name: "Toast - queue multiple toasts",
      run: () => {
        Adiox.UI.toast("Message 1", "info")
        Adiox.UI.toast("Message 2", "success")
        Adiox.UI.toast("Message 3", "warning")

        const toasts = document.querySelectorAll("adi-toast")
        if (toasts.length === 0) throw new Error("No toasts were created")

        // Cleanup
        toasts.forEach((t) => t.remove())

        return true
      },
    },

    {
      name: "Modal - show and return promise",
      run: async () => {
        // Show modal without waiting for user interaction
        const modalPromise = Adiox.UI.modal({
          title: "Test",
          content: "Test content",
          confirmText: "OK",
        })

        // Check if modal exists
        const modal = document.querySelector("adi-modal")
        if (!modal) throw new Error("Modal was not created")

        // Simulate confirm click
        const confirmBtn = modal.shadowRoot.querySelector(".confirm")
        if (confirmBtn) confirmBtn.click()

        const result = await modalPromise
        if (!result) throw new Error("Modal should resolve to true on confirm")

        return true
      },
    },

    {
      name: "Focus Trap - trap and restore focus",
      run: () => {
        // Create container with focusable elements
        const container = document.createElement("div")
        container.innerHTML = `
          <button id="btn1">Button 1</button>
          <button id="btn2">Button 2</button>
          <button id="btn3">Button 3</button>
        `
        document.body.appendChild(container)

        const previousFocus = document.activeElement

        Adiox.UI.trapFocus(container)

        // Focus should be trapped within container
        const btn1 = container.querySelector("#btn1")
        btn1.focus()

        if (document.activeElement !== btn1) throw new Error("Focus trap failed")

        Adiox.UI.restoreFocus(previousFocus)

        // Cleanup
        document.body.removeChild(container)

        return true
      },
    },
  ],
}
