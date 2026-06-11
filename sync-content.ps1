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
