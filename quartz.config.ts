import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"
import flexOrder from "./quartz/static/flex-order.json"
import { byFlexOrder } from "./quartz/util/flexOrder"

const config: QuartzConfig = {
  configuration: {
    pageTitle: "test-ob",
    pageTitleSuffix: "",
    enableSPA: true,
    enablePopovers: true,
    analytics: null,
    locale: "zh-CN",
    baseUrl: "attentiontt.github.io/att-ob",
    ignorePatterns: ["private", "templates", ".obsidian", ".trash"],
    defaultDateType: "modified",
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: { header: "Noto Sans SC", body: "Noto Sans SC", code: "JetBrains Mono" },
      colors: {
        lightMode: {
          light: "#ffffff",
          lightgray: "#f3f4f6",
          gray: "#9ca3af",
          darkgray: "#6b7280",
          dark: "#374151",
          secondary: "#2563eb",
          tertiary: "#e5e7eb",
          highlight: "rgba(0,0,0,0.04)",
          textHighlight: "#fef08a88",
        },
        darkMode: {
          light: "#111827",
          lightgray: "#1f2937",
          gray: "#6b7280",
          darkgray: "#d1d5db",
          dark: "#f3f4f6",
          secondary: "#60a5fa",
          tertiary: "#374151",
          highlight: "rgba(255,255,255,0.04)",
          textHighlight: "#fef08a88",
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({ priority: ["frontmatter", "filesystem"] }),
      Plugin.SyntaxHighlighting({
        theme: { light: "github-light", dark: "github-dark" },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.HardLineBreaks(),
      Plugin.Tabs(),
      Plugin.TableOfContents({ minEntries: 0 }),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage({ sort: byFlexOrder(flexOrder) }),
      Plugin.TagPage(),
      Plugin.ContentIndex({ enableSiteMap: true, enableRSS: true }),
      // Use one shared social image. Generating a unique image for every note made
      // each deploy spend roughly two minutes recreating nearly 1,000 WebP files.
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.Favicon(),
      Plugin.NotFoundPage(),
    ],
  },
}
export default config
