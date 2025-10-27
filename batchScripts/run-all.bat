@echo off
REM Batch Script to Start All Services
REM Run this script from the project root directory

echo.
echo 🚀 Playwright Automation Engine - Starting All Services
echo ============================================================

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ package.json not found. Make sure you're in the project root directory.
    pause
    exit /b 1
)

if not exist "api\package.json" (
    echo ❌ API server not found. Make sure the api directory exists.
    pause
    exit /b 1
)

if not exist "autobot-ui\package.json" (
    echo ❌ Angular UI not found. Make sure the autobot-ui directory exists.
    pause
    exit /b 1
)

echo ✅ Project structure verified

REM Check dependencies
echo.
echo 📦 Checking dependencies...

if not exist "node_modules" (
    echo ⚠️  Main project dependencies not installed
    echo    Run: npm install
) else (
    echo ✅ Main project dependencies installed
)

if not exist "api\node_modules" (
    echo ⚠️  API server dependencies not installed
    echo    Run: cd api ^&^& npm install
) else (
    echo ✅ API server dependencies installed
)

if not exist "autobot-ui\node_modules" (
    echo ⚠️  Angular UI dependencies not installed
    echo    Run: cd autobot-ui ^&^& npm install
) else (
    echo ✅ Angular UI dependencies installed
)

echo.
echo 🎯 Starting Services...
echo ========================================

REM Start API Server in a new window
echo 🚀 Starting API Server (Port 3000)...
start "API Server" cmd /k "cd api && npm start"

REM Wait a moment for API to start
timeout /t 3 /nobreak >nul

REM Start Angular UI in a new window
echo 🎨 Starting Angular UI (Port 4200)...
start "Angular UI" cmd /k "cd autobot-ui && ng serve"

REM Wait for Angular to start
timeout /t 10 /nobreak >nul

echo.
echo 🎉 All Services Started Successfully!
echo ==================================================
echo.
echo 📱 Angular UI: http://localhost:4200
echo 🔌 API Server: http://localhost:3000
echo 📡 WebSocket: ws://localhost:8081
echo.
echo 📋 Available Commands:
echo • Create automation rules: Use the Rule Builder in Angular UI
echo • Run existing rules: Click "Run" in the Dashboard
echo • View logs: Real-time logs in the Dashboard
echo • Download logs: Click "Download Logs" button
echo.
echo 🛑 To stop all services: Close the command windows or press Ctrl+C
echo.
echo Press any key to exit this script (services will continue running)...
pause >nul
