const container = document.createElement("div")
container.className = "image-zoom-overlay"
container.innerHTML = `<button class="image-zoom-close" aria-label="Close">&times;</button><img class="image-zoom-img" alt="">`
document.body.appendChild(container)

const overlayImg = container.querySelector<HTMLImageElement>(".image-zoom-img")!
const closeBtn = container.querySelector<HTMLButtonElement>(".image-zoom-close")!

function openZoom(img: HTMLImageElement) {
  overlayImg.src = img.currentSrc || img.src
  container.classList.add("active")
  document.body.style.overflow = "hidden"
}

function closeZoom() {
  container.classList.remove("active")
  document.body.style.overflow = ""
  overlayImg.src = ""
}

closeBtn.addEventListener("click", closeZoom)
container.addEventListener("click", (e) => {
  if (e.target === container) closeZoom()
})
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && container.classList.contains("active")) closeZoom()
})

function initZoom() {
  const imgs = document.querySelectorAll<HTMLImageElement>(
    ".article img, .popover-hint img, article img",
  )
  for (const img of imgs) {
    if (img.dataset.zoomEnabled) continue
    img.dataset.zoomEnabled = "true"
    img.style.cursor = "zoom-in"
  }
}

// Click delegation: single listener on document catches all image clicks
document.addEventListener("click", (e) => {
  const target = e.target as HTMLElement
  if (target.tagName !== "IMG") return
  // Only zoom images inside article (not UI images like logos)
  if (target.closest("article, .popover-hint")) {
    openZoom(target as HTMLImageElement)
    e.stopPropagation()
    e.preventDefault()
  }
})

// Run on nav event (SPA navigation) and immediately on load
document.addEventListener("nav", initZoom)
if (document.readyState !== "loading") {
  initZoom()
} else {
  document.addEventListener("DOMContentLoaded", initZoom)
}
