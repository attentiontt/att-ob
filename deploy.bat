@echo off
cd /d "%~dp0"
echo ======================================
echo    test-ob One-Click Deploy
echo ======================================
echo.
powershell.exe -ExecutionPolicy Bypass -NoProfile -File "%~dp0deploy.ps1"
set "deployExitCode=%ERRORLEVEL%"
if not "%deployExitCode%"=="0" (
    echo.
    echo [ERROR] Deployment failed ^(exit code %deployExitCode%^)
    pause
    exit /b %deployExitCode%
) else (
    echo.
    echo Deployment complete!
    pause > nul
    exit /b 0
)
