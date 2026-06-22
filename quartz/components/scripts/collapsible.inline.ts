document.addEventListener("nav", () => {
  const article: HTMLElement | null = document.querySelector(".center article")
  if (!article) return

  const headings = article.querySelectorAll("h1, h2, h3, h4, h5, h6")
  headings.forEach((h) => {
    const existing = h.querySelector(".fold-btn")
    if (existing) return

    const indicator = document.createElement("span")
    indicator.className = "fold-btn"
    indicator.textContent = "\u25bc"
    indicator.setAttribute("aria-label", "\u6298\u53e0/\u5c55\u5f00")
    h.insertBefore(indicator, h.firstChild)

    h.addEventListener("click", (e: Event) => {
      const target = e.target as HTMLElement
      if (target.closest("a")) return
      if (target.closest(".fold-btn") && target !== indicator) return

      const level = parseInt(h.tagName[1])
      let sibling: Element | null = h.nextElementSibling
      const toggled: Element[] = []

      while (sibling) {
        const tag = sibling.tagName
        if (tag.match(/^H[1-6]$/)) {
          const nextLevel = parseInt(tag[1])
          if (nextLevel <= level) break
        }
        toggled.push(sibling)
        sibling = sibling.nextElementSibling
      }

      if (togged.length === 0) return
      const firstEl = toggled[0] as HTMLElement
      const hidden = firstEl.style.display === "none"

      toggled.forEach((el) => {
        (el as HTMLElement).style.display = hidden ? "" : "none"
      })
      indicator.textContent = hidden ? "\u25bc" : "\u25b6"
    })
  })
})