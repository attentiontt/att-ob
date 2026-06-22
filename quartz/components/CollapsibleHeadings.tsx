import { QuartzComponent, QuartzComponentConstructor } from "./types"

// @ts-ignore
import script from "./scripts/collapsible.inline"

export default (() => {
  const CollapsibleHeadings: QuartzComponent = () => {
    return null
  }

  CollapsibleHeadings.afterDOMLoaded = script
  return CollapsibleHeadings
}) satisfies QuartzComponentConstructor