# Run Scripts Documentation

This document explains how to use the various run scripts to start all components of the Playwright Automation Engine.

## 🚀 Quick Start

### Option 1: Node.js Script (Cross-platform)
```bash
npm run dev
```

### Option 2: PowerShell Script (Windows)
```powershell
npm run dev:ps1
```

### Option 3: Batch File (Windows)
```cmd
npm run dev:bat
```

## 📋 Available Run Scripts

| Script | Platform | Command | Description |
|--------|----------|---------|-------------|
| **Node.js** | All | `npm run dev` | Cross-platform script with colored output |
| **PowerShell** | Windows | `npm run dev:ps1` | Windows PowerShell with job management |
| **Batch** | Windows | `npm run dev:bat` | Simple Windows batch file |
| **Direct** | All | `node run-all.js` | Run the Node.js script directly |

## 🔧 What Each Script Does

### 1. **Pre-flight Checks**
- ✅ Verifies project structure (main, api, autobot-ui directories)
- ✅ Checks if package.json files exist
- ✅ Validates node_modules directories
- ✅ Checks Playwright browser installation

### 2. **Sequential Startup**
- 🚀 **API Server** (Port 3000) - Express.js server with WebSocket
- 🎨 **Angular UI** (Port 4200) - Modern web interface
- ⏱️ **Timing** - Waits for each service to start properly

### 3. **Status Monitoring**
- 📊 Real-time status updates
- 🔍 Service health monitoring
- 📝 Output from both services
- 🛑 Graceful shutdown on Ctrl+C

## 🌐 Service URLs

After successful startup, you can access:

- **Angular UI**: http://localhost:4200
- **API Server**: http://localhost:3000
- **WebSocket**: ws://localhost:8081

## 📱 Usage Instructions

### Using the Angular UI

1. **Dashboard**: View all existing automation rules
2. **Rule Builder**: Create new automation rules visually
3. **Real-time Execution**: Run automations and watch them execute live
4. **Log Management**: View, download, and clear execution logs

### Available Commands

- **Create automation rules**: Use the Rule Builder in Angular UI
- **Run existing rules**: Click "Run" in the Dashboard
- **View logs**: Real-time logs in the Dashboard
- **Download logs**: Click "Download Logs" button

## 🛠️ Troubleshooting

### Common Issues

**Issue**: "Dependencies not installed"
```bash
# Solution: Install all dependencies
npm run install-all
```

**Issue**: "Playwright browsers not installed"
```bash
# Solution: Install Playwright browsers
npm run install-browsers
```

**Issue**: "Port already in use"
```bash
# Solution: Check what's using the ports
netstat -ano | findstr :3000
netstat -ano | findstr :4200
```

**Issue**: "Angular CLI not found"
```bash
# Solution: Install Angular CLI globally
npm install -g @angular/cli
```

### Manual Startup

If the scripts don't work, you can start services manually:

**Terminal 1 (API Server):**
```bash
cd api
npm install
npm start
```

**Terminal 2 (Angular UI):**
```bash
cd autobot-ui
npm install
ng serve
```

## 🔄 Script Features

### Node.js Script (`run-all.js`)
- ✅ Cross-platform compatibility
- ✅ Colored console output
- ✅ Process management
- ✅ Error handling
- ✅ Graceful shutdown

### PowerShell Script (`run-all.ps1`)
- ✅ Windows-native job management
- ✅ PowerShell-specific features
- ✅ Background job monitoring
- ✅ Automatic cleanup

### Batch Script (`run-all.bat`)
- ✅ Simple Windows batch file
- ✅ Separate command windows
- ✅ Easy to understand
- ✅ No PowerShell required

## 📊 Performance Notes

- **Startup Time**: ~15-20 seconds total
- **API Server**: ~3 seconds to start
- **Angular UI**: ~10-15 seconds to compile and start
- **Memory Usage**: ~200-300MB total

## 🔒 Security Notes

- All services run on localhost only
- No external network access required
- WebSocket connection is local only
- No authentication required for development

## 📝 Development Notes

### Adding New Services

To add a new service to the startup sequence:

1. **Update Node.js script**: Add new spawn process
2. **Update PowerShell script**: Add new Start-Job
3. **Update Batch script**: Add new start command
4. **Update package.json**: Add new npm script

### Customizing Startup Order

The current startup order is:
1. API Server (required for Angular UI)
2. Angular UI (depends on API Server)

This order ensures the Angular UI can connect to the API server immediately.

## 🎯 Best Practices

1. **Always run from project root**: Scripts expect to be in the main directory
2. **Check dependencies first**: Run `npm run install-all` if needed
3. **Use Ctrl+C to stop**: Graceful shutdown of all services
4. **Check logs**: Monitor console output for any errors
5. **Verify ports**: Ensure ports 3000 and 4200 are available

---

**Happy Automating! 🎉**

For more information, see the main [README.md](README.md).
