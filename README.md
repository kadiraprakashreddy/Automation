# Playwright Automation Engine

A powerful browser automation system with a modern Angular UI, Express.js API, and Node.js rule engine. Create, manage, and execute automation rules through an intuitive web interface.

## 🎯 What This Project Does

- **Visual Rule Builder**: Create automation rules with a modern Angular UI
- **Real-time Execution**: Watch automations run live in the browser
- **Multi-Run Support**: Execute multiple automations simultaneously
- **Live Logging**: Real-time logs with WebSocket streaming
- **No Coding Required**: Point-and-click rule creation

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js** 16.0.0 or higher
- **npm** (comes with Node.js)
- **Angular CLI** (we'll install this)

## 🚀 Quick Setup (3 Steps)

### Step 1: Install Dependencies

```bash
# Install all dependencies for all components
npm run install-all
```

### Step 2: Install Playwright Browsers

```bash
# Install browser binaries for automation
npm run install-browsers
```

### Step 3: Start All Services

```bash
# Start API server, Angular UI, and rule engine
npm run dev
```

**That's it!** 🎉 Your automation system is now running at http://localhost:4200

### 🛑 Quick Fix - Stop Existing Services

If you encounter port conflicts (ports 3000, 4200, or 8081 already in use), use these commands to quickly stop all running services:

```bash
# Windows (recommended)
npm run stop

# PowerShell
npm run stop:ps1
```

**What this does:**
- ✅ Stops all running Node.js processes
- ✅ Stops all Angular CLI processes  
- ✅ Frees up ports 3000, 4200, and 8081
- ✅ Prepares clean environment for restart

**After stopping services:**
```bash
npm run dev  # Start fresh
```

---

## ⚙️ Environment Configuration

The project uses a simple `.env` file for all environment configuration. All components (Angular, API, Rule Engine) read from this single file.

**Edit the `.env` file directly to change any configuration:**

```bash
# Example: Change API port
API_PORT=3001

# Example: Enable production mode
ENVIRONMENT=production
HEADLESS=true
```

**No complex setup needed - just edit `.env` and restart services!**

## 🔧 Manual Setup (If Needed)

If the quick setup doesn't work, follow these manual steps:

### 1. Main Project Setup

```bash
# Navigate to project directory
cd Node_Automation

# Install main dependencies
npm install
```

### 2. API Server Setup

```bash
# Install API dependencies
cd api
npm install

# Start API server (Terminal 1)
npm start
```

**API Server runs on:** http://localhost:3000

### 3. Angular UI Setup

```bash
# Install Angular CLI globally (if not already installed)
npm install -g @angular/cli

# Install Angular dependencies
cd autobot-ui
npm install

# Start Angular UI (Terminal 2)
ng serve
```

**Angular UI runs on:** http://localhost:4200

### 4. Rule Engine Setup

The rule engine is automatically available through the API server. No separate setup required.

---

## 🌐 Access Points

After successful setup, you can access:

| Service | URL | Description |
|---------|-----|-------------|
| **Angular UI** | http://localhost:4200 | Main web interface |
| **API Server** | http://localhost:3000 | Backend API |
| **WebSocket** | ws://localhost:8081 | Real-time communication |

---

## 📱 How to Use

### 1. **Dashboard**
- View all existing automation rules
- Run, edit, or delete rules
- Monitor real-time execution logs

### 2. **Rule Builder**
- Create new automation rules visually
- Add steps with dropdown menus
- Preview generated JSON
- Save rules for execution

### 3. **Running Automations**
- Click "Run" on any rule
- Watch real-time browser actions
- View live logs and status
- Download execution logs

---

## 🛠️ Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start all services (recommended) |
| `npm run stop` | Stop all running services (Windows) |
| `npm run stop:ps1` | Stop all running services (PowerShell) |
| `npm run install-all` | Install all dependencies |
| `npm run install-browsers` | Install Playwright browsers |
| `npm run api` | Start API server only |
| `npm run ui` | Start Angular UI only |
| `npm start rules/rule.json` | Run specific rule file |

---

## 🔍 Troubleshooting

### Common Issues

**❌ "Dependencies not installed"**
```bash
npm run install-all
```

**❌ "Playwright browsers not installed"**
```bash
npm run install-browsers
```

**❌ "Port already in use"**
```bash
# Quick fix - Stop all services
npm run stop

# Or manually check what's using the ports
netstat -ano | findstr :3000
netstat -ano | findstr :4200

# Kill processes if needed
taskkill /PID <process_id> /F
```

**❌ "Angular CLI not found"**
```bash
npm install -g @angular/cli
```

**❌ "API server won't start"**
```bash
# Check if port 3000 is free
netstat -ano | findstr :3000

# Try a different port in api/server.js
```

### Manual Service Startup

If automated startup fails, start services manually:

**Terminal 1 (API Server):**
```bash
cd api
npm start
```

**Terminal 2 (Angular UI):**
```bash
cd autobot-ui
ng serve
```

---

## 📁 Project Structure

```
Node_Automation/
├── src/                    # Rule Engine (Node.js)
│   ├── actions/            # Action handlers
│   ├── engine/             # Core automation engine
│   └── utils/              # Utilities
├── api/                    # API Server (Express.js)
│   ├── server.js           # API server with WebSocket
│   └── package.json        # API dependencies
├── autobot-ui/             # Angular UI
│   ├── src/app/            # Angular components
│   └── package.json        # Angular dependencies
├── rules/                  # Automation rule files
│   ├── practice-login.json # Main login automation
│   └── test1.json          # Simple test automation
├── screenshots/            # Generated screenshots
├── logs/                   # Execution logs
└── package.json            # Main dependencies
```

---

## 🎯 Creating Your First Automation

1. **Open the Angular UI**: http://localhost:4200
2. **Click "Create New Rule"**
3. **Fill in rule information**:
   - Name: "My First Automation"
   - Description: "Test automation"
4. **Add automation steps**:
   - Step 1: Navigate to a website
   - Step 2: Click on elements
   - Step 3: Fill forms
   - Step 4: Take screenshots
5. **Click "Save Rule"**
6. **Go to Dashboard and click "Run"**

---

## 🔧 Configuration

### Environment Variables (Optional)

Create a `.env` file in the root directory:

```env
# Browser Settings
BROWSER_TYPE=chromium
HEADLESS=false
VIEWPORT_WIDTH=1920
VIEWPORT_HEIGHT=1080

# Timeouts (milliseconds)
DEFAULT_TIMEOUT=30000
NAVIGATION_TIMEOUT=60000

# Screenshots
SCREENSHOT_ON_ERROR=true
SCREENSHOT_PATH=./screenshots

# Logging
LOG_LEVEL=info
LOG_PATH=./logs
```

---

## 📊 Performance Notes

- **Startup Time**: ~15-20 seconds total
- **Memory Usage**: ~200-300MB total
- **Supported Browsers**: Chromium, Firefox, WebKit
- **Concurrent Runs**: Multiple automations supported

---

## 🆘 Getting Help

### Documentation
- **Main Guide**: This README
- **Angular UI**: README-ANGULAR.md
- **Run Scripts**: RUN-SCRIPTS.md
- **Quick Start**: QUICKSTART.md

### Support
- Check the troubleshooting section above
- Review the example rule files in `rules/` folder
- Check the logs in `logs/` folder for errors

---

## 🎉 Success!

If everything is working correctly, you should see:

- ✅ Angular UI at http://localhost:4200
- ✅ API Server running on port 3000
- ✅ WebSocket connection established
- ✅ Dashboard showing existing rules
- ✅ Rule Builder ready for new automations

**Happy Automating!** 🚀

---

## 📄 License

MIT License - Feel free to use and modify for your needs.

## 🤝 Contributing

Contributions are welcome! To add new features:

1. Add new action handlers in `src/actions/actionHandler.js`
2. Update the Angular UI components as needed
3. Create example rule files demonstrating new features
4. Update this README with new functionality
