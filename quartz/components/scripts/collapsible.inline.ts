// Collapsible headings
const setupCollapsible = () => {
  const article = document.querySelector(".center article")
  if (!article) return

  document.querySelectorAll(".fold-btn").forEach((b) => b.remove())

  const headings = article.querySelectorAll("h1, h2, h3, h4, h5, h6")
  headings.forEach((h) => {
    const indicator = document.createElement("span")
    indicator.className = "fold-btn"
    indicator.textContent = "\u25bc"
    indicator.setAttribute("aria-label", "\u6298\u53e0/\u5c55\u5f00")
    h.insertBefore(indicator, h.firstChild)

    let folded = false
    h.addEventListener("click", (e) => {
      const target = e.target
      if (target.closest && target.closest("a")) return

      const level = parseInt(h.tagName[1])
      let sib = h.nextElementSibling
      const items = []
      while (sib) {
        const t = sib.tagName
        if (t && t.match(/^H[1-6]$/)) {
          if (parseInt(t[1]) <= level) break
        }
        items.push(sib)
        sib = sib.nextElementSibling
      }

      folded = !folded
      items.forEach((el) => {
        el.style.display = folded ? "none" : ""
      })
      indicator.textContent = folded ? "\u25b6" : "\u25bc"
    })
  })
}

document.addEventListener("nav", setupCollapsible)
if (document.readyState !== "loading") setTimeout(setupCollapsible, 0)