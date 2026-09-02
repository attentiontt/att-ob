import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import { FileTrieNode } from "./quartz/util/fileTrie"

const flexplorerSort = (a: FileTrieNode, b: FileTrieNode) => {
  const flexOrder = window.__FLEX_ORDER__ ?? {}
  const aFilePath = a.isFolder ? undefined : a.data?.filePath
  const bFilePath = b.isFolder ? undefined : b.data?.filePath
  const aFileName = aFilePath?.split("/").at(-1)
  const bFileName = bFilePath?.split("/").at(-1)
  const aName = (aFileName ?? a.displayName).replace(/\.(md|html)$/i, "")
  const bName = (bFileName ?? b.displayName).replace(/\.(md|html)$/i, "")

  let slug: string = a.slug
  if (slug.endsWith("/index")) slug = slug.slice(0, -6)
  const separatorIndex = slug.lastIndexOf("/")
  const parentPath = separatorIndex >= 0 ? slug.slice(0, separatorIndex) : "/"
  const customOrder = flexOrder[parentPath]

  if (customOrder) {
    const aIndex = customOrder.indexOf(aName)
    const bIndex = customOrder.indexOf(bName)
    if (aIndex >= 0 && bIndex >= 0) return aIndex - bIndex

    // FLEXPLORER falls back to natural name sorting if either item is not yet
    // present in a custom order (for example, before its data file is synced).
    return aName.localeCompare(bName, undefined, { numeric: true, sensitivity: "base" })
  }

  // FLEXPLORER's default non-custom order is folders first, followed by a
  // case-insensitive natural file-name sort.
  if (a.isFolder !== b.isFolder) return a.isFolder ? -1 : 1
  return aName.localeCompare(bName, undefined, { numeric: true, sensitivity: "base" })
}

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [Component.CollapsibleHeadings(), Component.ImageZoom()],
  footer: Component.Footer({
    links: {
      GitHub: "https://github.com/jackyzha0/quartz",
      "Discord Community": "https://discord.gg/cRFFHYye7t",
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.Breadcrumbs(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
        { Component: Component.ReaderMode() },
      ],
    }),
    Component.Explorer({
      sortFn: flexplorerSort,
    }),
  ],
  right: [Component.TableOfContents({ layout: "legacy" })],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
        { Component: Component.ReaderMode() },
      ],
    }),
    Component.Explorer({
      sortFn: flexplorerSort,
    }),
  ],
  right: [Component.TableOfContents({ layout: "legacy" })],
}
