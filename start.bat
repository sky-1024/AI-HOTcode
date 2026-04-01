@echo off
chcp 65001 >nul 2>&1
setlocal enabledelayedexpansion

echo ========================================
echo   GitHub Monitor Launcher
echo ========================================
echo.

REM Check if port 8000 is in use
netstat -ano | findstr ":8000" >nul
if !errorlevel! equ 0 (
    echo [WARNING] Port 8000 is in use, backend may already be running
) else (
    echo [1/2] Starting backend service...
    start "GitHubMonitor-Backend" cmd /c "cd /d %~dp0backend && uv run uvicorn server:app --host 0.0.0.0 --port 8000"
)

REM Check if port 3000 is in use
netstat -ano | findstr ":3000" >nul
if !errorlevel! equ 0 (
    echo [WARNING] Port 3000 is in use, frontend may already be running
) else (
    echo [2/2] Starting frontend service...
    start "GitHubMonitor-Frontend" cmd /c "cd /d %~dp0frontend && npm run dev"
)

echo.
echo ========================================
echo   Startup Complete!
echo ========================================
echo.
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
echo.
echo Please open http://localhost:3000 in your browser
echo.
echo Press any key to exit (services will continue running)...
pause >nul