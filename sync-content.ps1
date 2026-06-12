# sync-content.ps1
param([string]$VaultPath = "Z:\test-ob")

$contentDir = Join-Path $PSScriptRoot "content"
Write-Host "Syncing from $VaultPath..." -ForegroundColor Yellow

if (Test-Path $contentDir) {
    Remove-Item "$contentDir\*" -Recurse -Force -Exclude ".trash",".obsidian","index.md" -ErrorAction SilentlyContinue
}
Copy-Item "$VaultPath\*" "$contentDir\" -Recurse -Force -Exclude ".trash",".obsidian"
$mdCount = (Get-ChildItem $contentDir -Recurse -Include "*.md" -Name -Force).Count
Write-Host "Done: $mdCount notes" -ForegroundColor Green


# Generate FLEXPLORER sort data for Quartz Explorer
Write-Host "Updating FLEXPLORER sort order..." -ForegroundColor Yellow
$flexNode = "C:\Users\it-tanglizhen\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
& $flexNode -e "
  const fs = require(\"fs\");
  const d = JSON.parse(fs.readFileSync(\"Z:\\\\.obsidian\\plugins\\flexplorer\\data.json\", \"utf-8\"));
  const m = {};
  for (const [p, v] of Object.entries(d.items)) {
    if (v.sortOrder === \"custom\" && v.customOrder?.length) m[p] = v.customOrder;
  }
  const json = JSON.stringify(m);
  const layout = fs.readFileSync(\"D:\test-ob-site\quartz.layout.ts\", \"utf-8\");
  const fn = \"const FO = \" + json;
  // Update sortFn with new data
  layout = layout.replace(/(?<=const FO = )\[.*?\](?=;\n)/s, json);
  fs.writeFileSync(\"D:\test-ob-site\quartz.layout.ts\", layout, \"utf-8\");
  console.log(\"Flex order updated: \" + Object.keys(m).length + \" folders\");
  " 2>&1
Write-Host "FLEXPLORER sort order synced" -ForegroundColor Green
