import { QuartzPluginData } from "../plugins/vfile"
import { isFolderPath } from "./path"

export type FlexOrderMap = Readonly<Record<string, readonly string[]>>
export type FlexOrderSort = (left: QuartzPluginData, right: QuartzPluginData) => number

const naturalNameCollator = new Intl.Collator(undefined, {
  numeric: true,
  sensitivity: "base",
})

function itemName(item: QuartzPluginData): string {
  if (isFolderPath(item.slug ?? "")) {
    return item.frontmatter?.title ?? ""
  }

  const filePath = item.relativePath ?? item.filePath
  if (filePath) {
    const fileName = filePath.split("/").at(-1) ?? ""
    return fileName.replace(/\.(md|html)$/i, "")
  }

  return item.frontmatter?.title ?? ""
}

function parentPath(item: QuartzPluginData): string {
  let slug = item.slug ?? ""
  if (slug.endsWith("/index")) slug = slug.slice(0, -6)
  const separatorIndex = slug.lastIndexOf("/")
  return separatorIndex >= 0 ? slug.slice(0, separatorIndex) : "/"
}

export function byFlexOrder(flexOrder: FlexOrderMap): FlexOrderSort {
  return (left, right) => {
    const leftName = itemName(left)
    const rightName = itemName(right)
    const customOrder = flexOrder[parentPath(left)]

    if (customOrder) {
      const leftIndex = customOrder.indexOf(leftName)
      const rightIndex = customOrder.indexOf(rightName)
      if (leftIndex >= 0 && rightIndex >= 0) return leftIndex - rightIndex

      // Match FLEXPLORER: an incomplete custom order falls back to name sorting
      // for the comparison instead of forcing known items ahead of new items.
      return naturalNameCollator.compare(leftName, rightName)
    }

    const leftIsFolder = isFolderPath(left.slug ?? "")
    const rightIsFolder = isFolderPath(right.slug ?? "")
    if (leftIsFolder !== rightIsFolder) return leftIsFolder ? -1 : 1

    return naturalNameCollator.compare(leftName, rightName)
  }
}
