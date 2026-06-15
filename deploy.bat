@echo off
cd /d "%~dp0"

echo ====================================
echo   test-ob Deploy Tool
echo ====================================
echo.
echo Current folder: %CD%
echo.
echo [1/4] Starting deployment script...
echo.

powershell.exe -ExecutionPolicy Bypass -NoProfile -File "%~dp0deploy.ps1"

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Deployment failed with code %ERRORLEVEL%
    echo Check the error messages above.
) else (
    echo.
    echo [DONE] Deployment completed successfully!
    echo.
    echo GitHub Actions: https://github.com/attentiontt/att-ob/actions
    echo Pages Site: https://attentiontt.github.io/att-ob/
)

echo.
echo Press any key to exit...
pause > nul
