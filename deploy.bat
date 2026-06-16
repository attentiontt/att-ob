@echo off
cd /d "%~dp0"
echo ======================================
echo    test-ob One-Click Deploy
echo ======================================
echo.
powershell.exe -ExecutionPolicy Bypass -NoProfile -File "%~dp0deploy.ps1"
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Deployment failed
    pause
) else (
    echo.
    echo Deployment complete!
    pause > nul
)