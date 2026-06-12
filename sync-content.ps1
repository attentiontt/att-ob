param([string]$VaultPath = "Z:\test-ob")

$contentDir = Join-Path $PSScriptRoot "content"
Write-Host "Syncing from $VaultPath..." -ForegroundColor Yellow

if (Test-Path $contentDir) {
    Remove-Item "$contentDir\*" -Recurse -Force -Exclude ".trash",".obsidian","index.md" -ErrorAction SilentlyContinue
}
Copy-Item "$VaultPath\*" "$contentDir\" -Recurse -Force -Exclude ".trash",".obsidian"
$mdCount = (Get-ChildItem $contentDir -Recurse -Include "*.md" -Name -Force).Count
Write-Host "Done: $mdCount notes" -ForegroundColor Green

# Update FLEXPLORER sort order
Write-Host "Updating FLEXPLORER sort order..." -ForegroundColor Yellow
$flexNode = "C:\Users\it-tanglizhen\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
& $flexNode "$PSScriptRoot\update-flex-order.js"
Write-Host "Done" -ForegroundColor Green
