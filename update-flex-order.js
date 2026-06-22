import { readFileSync, writeFileSync, existsSync } from "fs";

function updateFlexOrder() {
  const vaultConfig = JSON.parse(fs.readFileSync("./vault-config.json", "utf-8"));
  const flexPath = require("path").join(vaultConfig.vaultDrive, ".obsidian", "plugins", "flexplorer", "data.json");
  const layoutPath = "D:\\test-ob-site\\quartz.layout.ts";
  
  if (!existsSync(flexPath)) {
    console.log("FLEXPLORER data not found at:", flexPath);
    return false;
  }
  
  const flexData = JSON.parse(readFileSync(flexPath, "utf-8"));
  const sortMap = {};
  for (const [path, data] of Object.entries(flexData.items)) {
    if (data.sortOrder === "custom" && data.customOrder && data.customOrder.length > 0) {
      sortMap[path] = data.customOrder.map(function(name) {
        if (name.endsWith(".md")) return name.slice(0, -3);
        if (name.endsWith(".png")) return name.slice(0, -4);
        return name;
      });
    }
  }
  
  let layout = readFileSync(layoutPath, "utf-8");
  const newJson = JSON.stringify(sortMap);
  
  // Replace the FO data in the sortFn
  const regex = /(?<=const FO = ).*?(?=;)/g;
  layout = layout.replace(regex, (_) => newJson);
  writeFileSync(layoutPath, layout, "utf-8");
  
  // Generate flex-order.js for browser
  const jsPath = "D:\\test-ob-site\\quartz\\static\\flex-order.js";
  const jsContent = "window.__FLEX_ORDER__ = " + newJson + ";";
  writeFileSync(jsPath, jsContent, "utf-8");
  
  console.log("Updated FLEXPLORER sort data (" + Object.keys(sortMap).length + " folders)");
  console.log("Generated quartz/static/flex-order.js");
  return true;
}

updateFlexOrder();

