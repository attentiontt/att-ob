$GITHUB_USERNAME = "attentiontt"
$REPO_NAME = "att-ob"
$VAULT_PATH = "Z:\test-ob"

Write-Host "=== test-ob Quartz Build & Deploy ===" -ForegroundColor Cyan

$nodeCheck = Get-Command node -ErrorAction SilentlyContinue
if (-not $nodeCheck) {
    Write-Host "Error: Node.js not found, install from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

Write-Host "[1/3] Installing dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) { exit 1 }

Write-Host "[2/3] Syncing notes..." -ForegroundColor Yellow
$contentDir = Join-Path $PSScriptRoot "content"
if (Test-Path $contentDir) {
    Remove-Item "$contentDir\*" -Recurse -Force -Exclude ".trash",".obsidian","index.md" -ErrorAction SilentlyContinue
}
Copy-Item "$VAULT_PATH\*" "$contentDir\" -Recurse -Force -Exclude ".trash",".obsidian"

Write-Host "[3/3] Building site..." -ForegroundColor Yellow
npx quartz build
if ($LASTEXITCODE -ne 0) { exit 1 }
Write-Host "Done! Output in public/" -ForegroundColor Green

Write-Host "--- Push to GitHub ---"
Write-Host "  git add ."
Write-Host '  git commit -m "update"'
Write-Host "  git push"
