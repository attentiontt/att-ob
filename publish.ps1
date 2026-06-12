cd D:\test-ob-site

Write-Host "=== 一键发布笔记到 Netlify ===" -ForegroundColor Cyan

Write-Host "[1/4] 同步笔记..." -ForegroundColor Yellow
.\sync-content.ps1

Write-Host "[2/4] 更新排序..." -ForegroundColor Yellow
$node = "C:\Users\it-tanglizhen\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
& $node update-flex-order.cjs

Write-Host "[3/4] 提交变更..." -ForegroundColor Yellow
git add .
git commit -m "publish: $(Get-Date -Format 'yyyy-MM-dd HH:mm')"

Write-Host "[4/4] 推送到 GitHub（Netlify 自动构建）..." -ForegroundColor Yellow
git -c http.sslbackend=openssl -c http.proxy="" push

Write-Host ""
Write-Host "已发布！等待 1-2 分钟 Netlify 构建完成" -ForegroundColor Cyan
