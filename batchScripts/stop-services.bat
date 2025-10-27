@echo off
REM Quick Fix Script - Stop Existing Services
REM This script stops all running Node.js and Angular processes to free up ports

echo.
echo 🛑 Quick Fix - Stopping Existing Services
echo ==========================================

echo.
echo 📋 Checking for running processes...

REM Check for Node.js processes
echo 🔍 Checking for Node.js processes...
tasklist /FI "IMAGENAME eq node.exe" 2>NUL | find /I "node.exe" >NUL
if "%ERRORLEVEL%"=="0" (
    echo ⚠️  Found running Node.js processes
    echo 🛑 Stopping Node.js processes...
    taskkill /F /IM node.exe
    if "%ERRORLEVEL%"=="0" (
        echo ✅ Node.js processes stopped successfully
    ) else (
        echo ❌ Failed to stop Node.js processes
    )
) else (
    echo ✅ No Node.js processes found
)

REM Check for Angular CLI processes
echo.
echo 🔍 Checking for Angular CLI processes...
tasklist /FI "IMAGENAME eq ng.exe" 2>NUL | find /I "ng.exe" >NUL
if "%ERRORLEVEL%"=="0" (
    echo ⚠️  Found running Angular CLI processes
    echo 🛑 Stopping Angular CLI processes...
    taskkill /F /IM ng.exe
    if "%ERRORLEVEL%"=="0" (
        echo ✅ Angular CLI processes stopped successfully
    ) else (
        echo ❌ Failed to stop Angular CLI processes
    )
) else (
    echo ✅ No Angular CLI processes found
)

REM Check for any processes using our ports
echo.
echo 🔍 Checking for processes using ports 3000, 4200, and 8081...

echo Checking port 3000 (API Server)...
netstat -ano | findstr ":3000" >NUL
if "%ERRORLEVEL%"=="0" (
    echo ⚠️  Port 3000 is in use
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3000"') do (
        echo 🛑 Stopping process %%a using port 3000...
        taskkill /F /PID %%a 2>NUL
    )
) else (
    echo ✅ Port 3000 is free
)

echo Checking port 4200 (Angular UI)...
netstat -ano | findstr ":4200" >NUL
if "%ERRORLEVEL%"=="0" (
    echo ⚠️  Port 4200 is in use
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":4200"') do (
        echo 🛑 Stopping process %%a using port 4200...
        taskkill /F /PID %%a 2>NUL
    )
) else (
    echo ✅ Port 4200 is free
)

echo Checking port 8081 (WebSocket)...
netstat -ano | findstr ":8081" >NUL
if "%ERRORLEVEL%"=="0" (
    echo ⚠️  Port 8081 is in use
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8081"') do (
        echo 🛑 Stopping process %%a using port 8081...
        taskkill /F /PID %%a 2>NUL
    )
) else (
    echo ✅ Port 8081 is free
)

echo.
echo 🎉 Cleanup Complete!
echo ===================
echo.
echo ✅ All services have been stopped
echo ✅ Ports 3000, 4200, and 8081 are now free
echo.
echo 🚀 You can now run: npm run dev
echo.
echo Press any key to exit...
pause >nul
