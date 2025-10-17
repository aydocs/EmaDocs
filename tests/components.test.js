/**
 * Adiox Components Tests
 *
 * Tests for Web Components (button, card, input, etc.)
 */

const ComponentsTests = {
  name: "Components Tests",

  tests: [
    {
      name: "adi-button - renders correctly",
      run: () => {
        const btn = document.createElement("adi-button")
        btn.textContent = "Click me"
        document.body.appendChild(btn)

        if (!btn.shadowRoot) throw new Error("Shadow root not created")

        const button = btn.shadowRoot.querySelector("button")
        if (!button) throw new Error("Button element not found")

        document.body.removeChild(btn)
        return true
      },
    },

    {
      name: "adi-button - variant attribute",
      run: () => {
        const btn = document.createElement("adi-button")
        btn.setAttribute("variant", "primary")
        document.body.appendChild(btn)

        const button = btn.shadowRoot.querySelector("button")
        if (!button.classList.contains("primary")) {
          throw new Error("Variant class not applied")
        }

        document.body.removeChild(btn)
        return true
      },
    },

    {
      name: "adi-button - click event",
      run: () => {
        const btn = document.createElement("adi-button")
        document.body.appendChild(btn)

        let clicked = false
        btn.addEventListener("click", () => (clicked = true))

        btn.click()

        if (!clicked) throw new Error("Click event not fired")

        document.body.removeChild(btn)
        return true
      },
    },

    {
      name: "adi-card - slots work correctly",
      run: () => {
        const card = document.createElement("adi-card")

        const header = document.createElement("h3")
        header.slot = "header"
        header.textContent = "Header"
        card.appendChild(header)

        const body = document.createElement("p")
        body.textContent = "Body content"
        card.appendChild(body)

        document.body.appendChild(card)

        if (!card.shadowRoot) throw new Error("Shadow root not created")

        document.body.removeChild(card)
        return true
      },
    },

    {
      name: "adi-input - value binding",
      run: () => {
        const input = document.createElement("adi-input")
        input.setAttribute("value", "test")
        document.body.appendChild(input)

        if (input.value !== "test") throw new Error("Initial value not set")

        input.value = "updated"
        if (input.value !== "updated") throw new Error("Value update failed")

        document.body.removeChild(input)
        return true
      },
    },

    {
      name: "adi-input - input event",
      run: () => {
        const input = document.createElement("adi-input")
        document.body.appendChild(input)

        let eventFired = false
        let eventValue = null

        input.addEventListener("input", (e) => {
          eventFired = true
          eventValue = e.detail.value
        })

        const inputEl = input.shadowRoot.querySelector("input")
        inputEl.value = "test"
        inputEl.dispatchEvent(new Event("input"))

        if (!eventFired) throw new Error("Input event not fired")
        if (eventValue !== "test") throw new Error("Event value incorrect")

        document.body.removeChild(input)
        return true
      },
    },

    {
      name: "adi-modal - open and close",
      run: () => {
        const modal = document.createElement("adi-modal")
        modal.setAttribute("title", "Test Modal")
        document.body.appendChild(modal)

        modal.open()

        const dialog = modal.shadowRoot.querySelector(".modal")
        if (!dialog || dialog.style.display === "none") {
          throw new Error("Modal did not open")
        }

        modal.close()

        if (dialog.style.display !== "none") {
          throw new Error("Modal did not close")
        }

        document.body.removeChild(modal)
        return true
      },
    },
  ],
}
