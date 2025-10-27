# Stop Services Scripts Documentation

This document explains how to use the stop services scripts to quickly resolve port conflicts and stop all running automation services.

## 🛑 Quick Stop Commands

### Windows Batch File (Recommended)
```bash
npm run stop
```

### PowerShell Script
```bash
npm run stop:ps1
```

### Direct Execution
```bash
# Windows Batch
stop-services.bat

# PowerShell
powershell -ExecutionPolicy Bypass -File stop-services.ps1
```

## 🔍 What These Scripts Do

### 1. **Process Detection**
- ✅ Scans for running Node.js processes
- ✅ Scans for running Angular CLI processes
- ✅ Identifies processes using ports 3000, 4200, and 8081

### 2. **Process Termination**
- 🛑 Stops all Node.js processes (`node.exe`)
- 🛑 Stops all Angular CLI processes (`ng.exe`)
- 🛑 Kills processes using specific ports

### 3. **Port Verification**
- 🔍 Checks port 3000 (API Server)
- 🔍 Checks port 4200 (Angular UI)
- 🔍 Checks port 8081 (WebSocket)

### 4. **Status Reporting**
- 📊 Shows which processes were found
- ✅ Confirms successful termination
- ❌ Reports any failures
- 🎉 Provides completion summary

## 📋 Expected Output

### Successful Execution
```
🛑 Quick Fix - Stopping Existing Services
==========================================

📋 Checking for running processes...

🔍 Checking for Node.js processes...
⚠️  Found 2 running Node.js process(es)
🛑 Stopping Node.js processes...
✅ Node.js processes stopped successfully

🔍 Checking for Angular CLI processes...
✅ No Angular CLI processes found

🔍 Checking for processes using ports 3000, 4200, and 8081...

Checking port 3000 (API Server)...
✅ Port 3000 is free

Checking port 4200 (Angular UI)...
⚠️  Port 4200 is in use
🛑 Stopping process 1234 using port 4200...
✅ Process 1234 stopped

Checking port 8081 (WebSocket)...
✅ Port 8081 is free

🎉 Cleanup Complete!
===================

✅ All services have been stopped
✅ Ports 3000, 4200, and 8081 are now free

🚀 You can now run: npm run dev
```

## 🚨 When to Use These Scripts

### Common Scenarios
- **Port conflicts** when starting services
- **Stuck processes** that won't stop normally
- **Development restart** between sessions
- **Clean environment** before starting fresh
- **Troubleshooting** service startup issues

### Error Messages That Indicate Need
```
Error: listen EADDRINUSE: address already in use :::3000
Error: listen EADDRINUSE: address already in use :::4200
Error: listen EADDRINUSE: address already in use :::8081
Port 4200 is already in use. Would you like to use a different port?
```

## 🔧 Manual Alternative

If the scripts don't work, you can manually stop services:

### Windows Command Prompt
```cmd
# Stop all Node.js processes
taskkill /F /IM node.exe

# Stop Angular CLI processes
taskkill /F /IM ng.exe

# Check what's using ports
netstat -ano | findstr :3000
netstat -ano | findstr :4200
netstat -ano | findstr :8081

# Kill specific process by PID
taskkill /F /PID <process_id>
```

### PowerShell
```powershell
# Stop all Node.js processes
Stop-Process -Name "node" -Force

# Stop Angular CLI processes
Stop-Process -Name "ng" -Force

# Check port usage
netstat -ano | Select-String ":3000|:4200|:8081"

# Kill specific process by PID
Stop-Process -Id <process_id> -Force
```

## ⚠️ Important Notes

### Safety Considerations
- **Data Loss**: These scripts forcefully terminate processes
- **Unsaved Work**: Any unsaved work in running applications will be lost
- **System Impact**: Only affects Node.js and Angular processes
- **Port Conflicts**: Resolves port conflicts for automation services only

### What Gets Stopped
- ✅ Node.js processes (automation engine, API server)
- ✅ Angular CLI processes (development server)
- ✅ Processes using ports 3000, 4200, 8081
- ❌ Other system processes (safe)

### What Doesn't Get Stopped
- ❌ System services
- ❌ Other applications
- ❌ Browser processes
- ❌ Database services

## 🔄 Typical Workflow

### 1. **Before Starting Services**
```bash
# Clean slate - stop any existing services
npm run stop

# Start fresh
npm run dev
```

### 2. **When Encountering Port Conflicts**
```bash
# Quick fix
npm run stop

# Try again
npm run dev
```

### 3. **End of Development Session**
```bash
# Clean shutdown
npm run stop
```

## 🛠️ Troubleshooting the Scripts

### Script Won't Run
```bash
# Check if you're in the right directory
dir stop-services.bat

# Run with full path
.\stop-services.bat

# PowerShell execution policy
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Script Runs But Doesn't Stop Processes
```bash
# Run as administrator
# Right-click Command Prompt/PowerShell -> "Run as administrator"

# Check if processes are protected
tasklist /FI "IMAGENAME eq node.exe"
```

### Ports Still in Use After Script
```bash
# Check for other processes
netstat -ano | findstr ":3000"

# Manual cleanup
taskkill /F /PID <process_id>

# Restart computer (last resort)
```

## 📊 Performance Impact

- **Execution Time**: ~5-10 seconds
- **System Impact**: Minimal (only affects target processes)
- **Memory Usage**: Negligible
- **CPU Usage**: Low (brief process scanning)

## 🎯 Best Practices

1. **Use Before Starting**: Always run stop script before `npm run dev`
2. **Regular Cleanup**: Run stop script at end of development sessions
3. **Troubleshooting First**: Try stop script before manual process killing
4. **Check Output**: Review script output for any errors
5. **Verify Success**: Confirm ports are free before starting services

---

**Quick Reference:**
- **Windows**: `npm run stop`
- **PowerShell**: `npm run stop:ps1`
- **Manual**: `taskkill /F /IM node.exe`

For more information, see the main [README.md](README.md).
