const fs = require("fs")
const path = require("path")

function updateFlexOrder() {
  // Change this path if the Obsidian vault drive differs.
  const flexPath = "Z:\\test-ob\\.obsidian\\plugins\\flexplorer\\data.json"
  const projectRoot = __dirname
  const layoutPath = path.join(projectRoot, "quartz.layout.ts")
  const jsPath = path.join(projectRoot, "quartz", "static", "flex-order.js")

  // Older versions embedded the complete sort map twice in quartz.layout.ts.
  // That duplicated roughly 90 KB into every generated HTML page. Keep only a
  // reference in the layout; the data itself is loaded once from flex-order.js.
  const layout = fs.readFileSync(layoutPath, "utf-8")
  const layoutReference = "const FO = window.__FLEX_ORDER__ ?? {};"
  const migratedLayout = layout.replace(/const FO = .*?;/g, layoutReference)
  if (migratedLayout !== layout) {
    fs.writeFileSync(layoutPath, migratedLayout, "utf-8")
    console.log("Updated quartz.layout.ts to use shared FLEXPLORER sort data")
  }

  if (!fs.existsSync(flexPath)) {
    console.log("FLEXPLORER data not found at:", flexPath)
    return false
  }

  const flexData = JSON.parse(fs.readFileSync(flexPath, "utf-8"))
  const sortMap = {}
  for (const [vaultPath, data] of Object.entries(flexData.items)) {
    if (data.sortOrder === "custom" && data.customOrder && data.customOrder.length > 0) {
      const slugPath = vaultPath.replace(/ /g, "-").replace(/&/g, "-and-")
      sortMap[slugPath] = data.customOrder.map((name) => {
        if (name.endsWith(".md")) return name.slice(0, -3)
        if (name.endsWith(".png")) return name.slice(0, -4)
        return name
      })
    }
  }

  const newJson = JSON.stringify(sortMap)
  const jsContent = `window.__FLEX_ORDER__ = ${newJson};\n`
  const previousJs = fs.existsSync(jsPath) ? fs.readFileSync(jsPath, "utf-8") : ""
  if (previousJs !== jsContent) {
    fs.writeFileSync(jsPath, jsContent, "utf-8")
  }

  console.log(`Updated FLEXPLORER sort data (${Object.keys(sortMap).length} folders)`)
  console.log("Generated quartz/static/flex-order.js")
  return true
}

updateFlexOrder()
