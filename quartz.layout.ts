import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [],
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
    sortFn: (a, b) => {
      const FO = typeof window !== "undefined" ? window.__FLEX_ORDER__ : {};
      let s = a.slug;
      if (s.endsWith("/index")) s = s.slice(0, -6);
      const i = s.lastIndexOf("/");
      const p = i >= 0 ? s.slice(0, i) : "/";
      const o = FO[p];
      if (o) {
        const ai = o.indexOf(a.slugSegment);
        const bi = o.indexOf(b.slugSegment);
        if (ai >= 0 && bi >= 0) return ai - bi;
        if (ai >= 0) return -1;
        if (bi >= 0) return 1;
      }
      if ((!a.isFolder && !b.isFolder) || (a.isFolder && b.isFolder)) {
        return a.displayName.localeCompare(b.displayName, undefined, {
          numeric: true, sensitivity: "base",
        });
      }
      return a.isFolder ? -1 : 1;
    },
  ),
    Component.Explorer({
    sortFn: (a, b) => {
      const FO = typeof window !== "undefined" ? window.__FLEX_ORDER__ : {};
      let s = a.slug;
      if (s.endsWith("/index")) s = s.slice(0, -6);
      const i = s.lastIndexOf("/");
      const p = i >= 0 ? s.slice(0, i) : "/";
      const o = FO[p];
      if (o) {
        const ai = o.indexOf(a.slugSegment);
        const bi = o.indexOf(b.slugSegment);
        if (ai >= 0 && bi >= 0) return ai - bi;
        if (ai >= 0) return -1;
        if (bi >= 0) return 1;
      }
      if ((!a.isFolder && !b.isFolder) || (a.isFolder && b.isFolder)) {
        return a.displayName.localeCompare(b.displayName, undefined, {
          numeric: true,
          sensitivity: "base",
        });
      }
      return a.isFolder ? -1 : 1;
    },
  }),
  ],
  right: [],
}
