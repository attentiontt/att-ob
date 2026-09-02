import assert from "node:assert"
import { describe, test } from "node:test"
import { QuartzPluginData } from "../plugins/vfile"
import { byFlexOrder } from "./flexOrder"
import { FilePath, FullSlug } from "./path"

function item(slug: string, title: string, relativePath?: string): QuartzPluginData {
  return {
    slug: slug as FullSlug,
    ...(relativePath ? { relativePath: relativePath as FilePath } : {}),
    frontmatter: { title, tags: [] },
  }
}

describe("FLEXPLORER order", () => {
  test("uses custom order for files and folders together", () => {
    const sort = byFlexOrder({ section: ["10-file", "folder", "2-file"] })
    const items = [
      item("section/2-file", "2-file", "section/2-file.md"),
      item("section/folder/index", "folder"),
      item("section/10-file", "10-file", "section/10-file.md"),
    ]

    assert.deepStrictEqual(
      items.sort(sort).map((entry) => entry.frontmatter?.title),
      ["10-file", "folder", "2-file"],
    )
  })

  test("matches custom order by file name instead of frontmatter title", () => {
    const sort = byFlexOrder({ section: ["actual-file", "other"] })
    const items = [
      item("section/other", "Other title", "section/other.md"),
      item("section/actual-file", "Custom page title", "section/actual-file.md"),
    ]

    assert.strictEqual(items.sort(sort)[0].frontmatter?.title, "Custom page title")
  })

  test("falls back to folders first and natural name order without custom data", () => {
    const sort = byFlexOrder({})
    const items = [
      item("section/file10", "file10", "section/file10.md"),
      item("section/file2", "file2", "section/file2.md"),
      item("section/folder/index", "folder"),
    ]

    assert.deepStrictEqual(
      items.sort(sort).map((entry) => entry.frontmatter?.title),
      ["folder", "file2", "file10"],
    )
  })

  test("uses natural name order when a custom order is incomplete", () => {
    const sort = byFlexOrder({ section: ["z-known"] })
    const items = [
      item("section/z-known", "z-known", "section/z-known.md"),
      item("section/a-new", "a-new", "section/a-new.md"),
    ]

    assert.deepStrictEqual(
      items.sort(sort).map((entry) => entry.frontmatter?.title),
      ["a-new", "z-known"],
    )
  })
})
