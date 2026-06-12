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
      sortMap[path] = data.customOrder;
    }
  }
  
  let layout = fs.readFileSync(layoutPath, "utf-8");
  const newJson = JSON.stringify(sortMap);
  
  // Replace the FO data in the sortFn
  const regex = /(?<=const FO = ).*?(?=;)/;
  if (regex.test(layout)) {
    layout = layout.replace(regex, newJson);
    fs.writeFileSync(layoutPath, layout, "utf-8");
    console.log("Updated FLEXPLORER sort data (" + Object.keys(sortMap).length + " folders)");
    return true;
  } else {
    console.log("Could not find FO = ... in layout file");
    return false;
  }
}

updateFlexOrder();
