@echo off
:: ============================================================
::  CivicSense — Install All Dependencies (Windows)
::  Run ONCE after cloning the project
::  Installs npm packages for backend + all 3 frontend panels
:: ============================================================

title CivicSense — Installing All Dependencies

echo.
echo  =============================================
echo   CivicSense — Dependency Installer
echo   This will run "npm install" in all 4 folders
echo  =============================================
echo.

:: Check Node.js is installed
node --version >nul 2>&1
if %errorlevel% NEQ 0 (
    echo  ERROR: Node.js is not installed or not in PATH.
    echo  Download from: https://nodejs.org
    pause
    exit /b 1
)

:: Check Angular CLI is installed globally
ng version >nul 2>&1
if %errorlevel% NEQ 0 (
    echo  Angular CLI not found. Installing globally...
    npm install -g @angular/cli
)

echo  [1/4] Installing Backend dependencies...
echo  ─────────────────────────────────────────
cd /d %~dp0backend
npm install
if %errorlevel% NEQ 0 ( echo  ERROR in backend. & pause & exit /b 1 )
echo  Backend - OK
echo.

echo  [2/4] Installing Citizen Panel dependencies...
echo  ─────────────────────────────────────────
cd /d %~dp0citizen-panel
npm install
if %errorlevel% NEQ 0 ( echo  ERROR in citizen-panel. & pause & exit /b 1 )
echo  Citizen Panel - OK
echo.

echo  [3/4] Installing Authority Panel dependencies...
echo  ─────────────────────────────────────────
cd /d %~dp0authority-panel
npm install
if %errorlevel% NEQ 0 ( echo  ERROR in authority-panel. & pause & exit /b 1 )
echo  Authority Panel - OK
echo.

echo  [4/4] Installing Admin Panel dependencies...
echo  ─────────────────────────────────────────
cd /d %~dp0admin-panel
npm install
if %errorlevel% NEQ 0 ( echo  ERROR in admin-panel. & pause & exit /b 1 )
echo  Admin Panel - OK
echo.

echo  =============================================
echo   All dependencies installed successfully!
echo.
echo   NEXT STEPS:
echo   1. Copy backend\.env.example to backend\.env
echo   2. Fill in your API keys in backend\.env
echo   3. Double-click start-all.bat to run
echo  =============================================
echo.
pause
