const fs = require("fs");

function updateFlexOrder() {
  const flexPath = "Z:\\test-ob\\.obsidian\\plugins\\flexplorer\\data.json";
  const layoutPath = "D:\\test-ob-site\\quartz.layout.ts";

  if (!fs.existsSync(flexPath)) {
    console.log("FLEXPLORER data not found at:", flexPath);
    return false;
  }

  const flexData = JSON.parse(fs.readFileSync(flexPath, "utf-8"));
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

  let layout = fs.readFileSync(layoutPath, "utf-8");
  const newJson = JSON.stringify(sortMap);
  const regex = /(?<=const FO = ).*?(?=;)/g;
  // Generate flex-order.js for browser
  const jsPath = "D:\\test-ob-site\\quartz\\static\\flex-order.js";
  const jsContent = "window.__FLEX_ORDER__ = " + newJson + ";";
  fs.writeFileSync(jsPath, jsContent, "utf-8");
  console.log("Updated FLEXPLORER sort data (" + Object.keys(sortMap).length + " folders)");
  console.log("Generated quartz/static/flex-order.js");
  return true;
}

updateFlexOrder();