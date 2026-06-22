const fs = require("fs");

function updateFlexOrder() {
  const vaultConfig = JSON.parse(fs.readFileSync(__dirname + "/vault-config.json", "utf-8"));
  const flexPath = require("path").join(vaultConfig.vaultDrive, ".obsidian", "plugins", "flexplorer", "data.json");
  const layoutPath = "D:\\test-ob-site\\quartz.layout.ts";

  if (!fs.existsSync(flexPath)) {
    console.log("FLEXPLORER data not found at:", flexPath);
    return false;
  }

  const flexData = JSON.parse(fs.readFileSync(flexPath, "utf-8"));
  const sortMap = {};
  for (const [path, data] of Object.entries(flexData.items)) {
    if (data.sortOrder === "custom" && data.customOrder && data.customOrder.length > 0) {
      const slugPath = path.replace(/ /g, '-').replace(/&/g, '-and-');
    sortMap[slugPath] = data.customOrder.map(function(name) {
        if (name.endsWith(".md")) return name.slice(0, -3);
        if (name.endsWith(".png")) return name.slice(0, -4);
        return name;
      });
    }
  }

  let layout = fs.readFileSync(layoutPath, "utf-8");
  const newJson = JSON.stringify(sortMap);

  // Replace the FO data in the sortFn (quotes around FO keys use double-quote syntax)
  const regex = /(?<=const FO = ).*?(?=;)/g;
  regex.lastIndex = 0;
  layout = layout.replace(regex, newJson);
  fs.writeFileSync(layoutPath, layout, "utf-8");

  // Generate flex-order.js for browser
  const jsPath = "D:\\test-ob-site\\quartz\\static\\flex-order.js";
  const jsContent = "window.__FLEX_ORDER__ = " + newJson + ";";
  fs.writeFileSync(jsPath, jsContent, "utf-8");

  console.log("Updated FLEXPLORER sort data (" + Object.keys(sortMap).length + " folders)");
  console.log("Generated quartz/static/flex-order.js");
  console.log("Updated quartz.layout.ts with new sort data");
  return true;
}

updateFlexOrder();


