param([string]$CommitMessage = "publish: $(Get-Date -Format 'yyyy-MM-dd HH:mm')")

# ===== Configuration =====
# Vault path on the shared drive:
$vaultShare = "\\192.168.100.253\10技术部\临时"
$vaultPath = "\test-ob"   # subfolder within the mapped drive

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "   test-ob One-Click Deploy" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# ---- CHECK DEPENDENCIES ----
$nodePath = Get-Command node -ErrorAction SilentlyContinue
if (-not $nodePath) {
  $fb = "C:\Users\it-tanglizhen\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
  if (Test-Path $fb) { $env:PATH = "$(Split-Path $fb -Parent);$env:PATH"; Write-Host "  [OK] Node" -ForegroundColor Gray }
  else { Write-Host "  [ERROR] Node.js not found" -ForegroundColor Red; exit 1 }
} else { Write-Host "  [OK] Node" -ForegroundColor Gray }

$git = Get-Command git -ErrorAction SilentlyContinue
if (-not $git) { Write-Host "  [ERROR] Git not found" -ForegroundColor Red; exit 1 }
Write-Host "  [OK] Git" -ForegroundColor Gray

# ---- MOUNT Z: DRIVE ----
Write-Host "  [INFO] Mounting Z: to vault..." -ForegroundColor Gray
net use Z: /delete 2>$null
net use Z: $vaultShare 2>$null
if ($LASTEXITCODE -ne 0) {
  Write-Host "  [ERROR] Cannot mount Z: to $vaultShare" -ForegroundColor Red
  Write-Host "  [ERROR] Run 'net use Z: $vaultShare' manually then retry" -ForegroundColor Red
  exit 1
}
Write-Host "  [OK] Z: mapped to vault" -ForegroundColor Gray

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root

# ---- STEP 1: SYNC ----
Write-Host "Step 1/4: Syncing notes to content/..." -ForegroundColor Yellow
$cd = Join-Path $root "content"
if (Test-Path $cd) { Remove-Item "$cd\*" -Recurse -Force -Exclude ".trash",".obsidian","index.md" -ErrorAction SilentlyContinue }
Copy-Item "Z:$vaultPath\*" "$cd\" -Recurse -Force -Exclude ".trash",".obsidian"
$mc = (Get-ChildItem $cd -Recurse -Include "*.md" -Name -Force).Count
Write-Host "  Done: $mc notes synced" -ForegroundColor Green

# ---- STEP 2: SORT ----
Write-Host "Step 2/4: Updating sort order..." -ForegroundColor Yellow
node update-flex-order.cjs 2>&1
if ($LASTEXITCODE -eq 0) { Write-Host "  Sort data updated" -ForegroundColor Green }
else { Write-Host "  [ERROR] Sort update failed" -ForegroundColor Red; exit 1 }

# ---- STEP 3: BUILD ----
Write-Host "Step 3/4: Building site..." -ForegroundColor Yellow
$bo = node ./quartz/bootstrap-cli.mjs build 2>&1
$done = $bo | Select-String -Pattern "Done processing"
if ($done) { Write-Host "  $($done.Line.Trim())" -ForegroundColor Gray; Write-Host "  Build OK" -ForegroundColor Green }
else { $bo | ForEach-Object { Write-Host "  $_" }; Write-Host "  [ERROR] Build FAILED" -ForegroundColor Red; exit 1 }

# ---- STEP 4: PUSH ----
Write-Host "Step 4/4: Pushing to GitHub..." -ForegroundColor Yellow
git add .
git commit -m "$CommitMessage"
git -c http.sslbackend=openssl -c http.proxy="" push
Write-Host "  Done! Pushed to GitHub" -ForegroundColor Green

Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "  Done! Site will update in ~2 min" -ForegroundColor Cyan
Write-Host "  Actions: https://github.com/attentiontt/att-ob/actions" -ForegroundColor Cyan
Write-Host "  Site:    https://attentiontt.github.io/att-ob/" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan