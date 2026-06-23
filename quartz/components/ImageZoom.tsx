import { QuartzComponent, QuartzComponentConstructor } from "./types"

// @ts-ignore
import script from "./scripts/image-zoom.inline"

const css = `
.image-zoom-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.25s ease;
  padding: 2rem;
}

.image-zoom-overlay.active {
  opacity: 1;
  pointer-events: auto;
}

.image-zoom-overlay .image-zoom-img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 4px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.5);
  transform: scale(0.92);
  transition: transform 0.25s ease;
}

.image-zoom-overlay.active .image-zoom-img {
  transform: scale(1);
}

.image-zoom-overlay .image-zoom-close {
  position: absolute;
  top: 1rem;
  right: 1.5rem;
  background: none;
  border: none;
  color: #fff;
  font-size: 2rem;
  cursor: pointer;
  line-height: 1;
  opacity: 0.7;
  transition: opacity 0.15s;
  z-index: 1;
}

.image-zoom-overlay .image-zoom-close:hover {
  opacity: 1;
}
`

export default (() => {
  const ImageZoom: QuartzComponent = () => {
    return null
  }

  ImageZoom.css = css
  ImageZoom.afterDOMLoaded = script
  return ImageZoom
}) satisfies QuartzComponentConstructor
