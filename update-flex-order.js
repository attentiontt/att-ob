import { readFileSync, writeFileSync, existsSync } from "fs");
import { join } from "path");

// ═══ CONFIG ═══
// Change this path if Obsidian vault drive differs
const flexPath = "Z:\.obsidian\plugins\flexplorer\data.json";
const layoutPath = "D:\test-ob-site\quartz.layout.ts";
// ═══════════════

if (!existsSync(flexPath)) {
  console.log("FLEXPLORER data not found at:", flexPath);
} else {
  const flexData = JSON.parse(readFileSync(flexPath, "utf-8"));
  const sortMap = {};
  for (const [path, data] of Object.entries(flexData.items)) {
    if (data.sortOrder === "custom" && data.customOrder && data.customOrder.length > 0) {
      const slugPath = path.replace(/ /g, "-").replace(/&/g, "-and-");
      sortMap[slugPath] = data.customOrder.map((name) => {
        if (name.endsWith(".md")) return name.slice(0, -3);
        if (name.endsWith(".png")) return name.slice(0, -4);
        return name;
      });
    }
  }

  let layout = readFileSync(layoutPath, "utf-8");
  const newJson = JSON.stringify(sortMap);
  layout = layout.replace(/(?<=const FO = ).*?(?=;)/g, newJson);
  writeFileSync(layoutPath, layout, "utf-8");
  const jsPath = "D:\test-ob-site\quartz\static\flex-order.js";
  writeFileSync(jsPath, "window.__FLEX_ORDER__ = " + newJson + ";", "utf-8");
  console.log("Updated FLEXPLORER sort data (" + Object.keys(sortMap).length + " folders)");
}