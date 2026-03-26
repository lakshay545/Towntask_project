@echo off
REM =================================================================
REM TownTask Frontend - Comprehensive Cache Cleanup & Dev Server Start
REM =================================================================
REM This script performs a complete cleanup and starts the dev server
REM with proper cache busting and OneDrive compatibility.
REM =================================================================

echo.
echo ========================================
echo TownTask Frontend Development - Setup
echo ========================================
echo.

REM Get the directory where this script is located
set SCRIPT_DIR=%~dp0
cd /d "%SCRIPT_DIR%"

echo [1/7] Killing any existing processes on ports 5173 and 9999...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5173 ^| findstr LISTENING') do (
    taskkill /PID %%a /F 2>nul
    echo   ✓ Killed PID %%a on port 5173
)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :9999 ^| findstr LISTENING') do (
    taskkill /PID %%a /F 2>nul
    echo   ✓ Killed PID %%a on port 9999
)

echo.
echo [2/7] Removing Vite cache directory...
if exist "node_modules\.vite" (
    rmdir /s /q "node_modules\.vite" 2>nul
    echo   ✓ Removed node_modules\.vite
) else (
    echo   ℹ Vite cache not found (normal if first run)
)

echo.
echo [3/7] Removing dist folder...
if exist "dist" (
    rmdir /s /q "dist" 2>nul
    echo   ✓ Removed dist folder
) else (
    echo   ℹ No dist folder found
)

echo.
echo [4/7] Waiting for file locks to release (2 seconds)...
timeout /t 2 /nobreak

echo.
echo [5/7] Clearing browser cache recommendation...
echo   ℹ After starting the server:
echo     • Open DevTools: F12
echo     • Network tab: Check "Disable cache" checkbox
echo     • Hard refresh: Ctrl+Shift+R (or Cmd+Shift+R on Mac)
echo.

echo [6/7] Clearing npm cache (optional but recommended)...
call npm cache clean --force >nul 2>&1
echo   ✓ npm cache cleared

echo.
echo [7/7] Starting development server with npm run dev...
echo   NEW PORT: 9999 (changed from 5173 to bypass browser history)
echo   Access at: http://localhost:9999
echo.
echo ========================================
echo Server starting... Press Ctrl+C to stop
echo ========================================
echo.

call npm run dev

pause
