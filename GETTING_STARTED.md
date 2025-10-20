# Getting Started with Playwright Automation Engine

Welcome! This guide will help you get up and running in just a few minutes.

## 📋 Prerequisites

Before you begin, make sure you have:

- ✅ **Node.js 16 or higher** installed ([Download](https://nodejs.org/))
- ✅ **npm** (comes with Node.js)
- ✅ A code editor (VS Code, Sublime, etc.)
- ✅ Basic understanding of JSON format

## 🚀 Installation (5 minutes)

### Step 1: Install Dependencies

Open your terminal in the project directory and run:

```bash
npm install
```

This installs:
- Playwright (browser automation)
- Winston (logging)
- dotenv (configuration)

### Step 2: Install Browsers

Playwright needs to download browser binaries:

```bash
npm run install-browsers
```

This downloads:
- Chromium
- Firefox  
- WebKit

**Note:** This is a one-time setup and may take a few minutes depending on your internet speed.

### Step 3: Verify Installation

Run the demo to verify everything works:

```bash
npm run demo
```

You should see:
1. A browser window open
2. Google homepage loads
3. Search is performed
4. Screenshot is captured
5. Browser closes
6. Execution summary appears

✅ If you see "Automation completed successfully", you're all set!

## 🎯 Your First Automation

### Option A: Modify the Demo

Open `rules/demo-google.json` in your editor and customize it:

```json
{
  "name": "My First Test",
  "description": "Testing my changes",
  "steps": [
    {
      "stepId": "1",
      "action": "navigate",
      "enabled": true,
      "url": "https://www.example.com",
      "description": "Open example website"
    }
  ]
}
```

Save and run:
```bash
node src/index.js rules/demo-google.json
```

### Option B: Create a New Rule File

Create `rules/my-first-test.json`:

```json
{
  "name": "Website Screenshot",
  "description": "Navigate to a site and capture a screenshot",
  "continueOnError": false,
  "steps": [
    {
      "stepId": "1",
      "action": "navigate",
      "enabled": true,
      "url": "https://www.wikipedia.org",
      "description": "Open Wikipedia"
    },
    {
      "stepId": "2",
      "action": "waitForSelector",
      "enabled": true,
      "selector": "#searchInput",
      "state": "visible",
      "description": "Wait for search box"
    },
    {
      "stepId": "3",
      "action": "screenshot",
      "enabled": true,
      "filename": "wikipedia-home.png",
      "fullPage": true,
      "description": "Capture screenshot"
    }
  ]
}
```

Run it:
```bash
node src/index.js rules/my-first-test.json
```

Check `screenshots/wikipedia-home.png` to see the result!

## 📚 Explore Examples

The project includes 5 ready-to-use examples:

### 1. Google Search Demo
```bash
npm run demo
```
**What it does:** Searches Google and extracts results

### 2. Login Flow
```bash
node src/index.js rules/example-login.json
```
**What it does:** Demonstrates a complete login workflow

### 3. Data Extraction
```bash
node src/index.js rules/example-data-extraction.json
```
**What it does:** Shows how to extract data from web pages

### 4. Form Filling
```bash
node src/index.js rules/example-form-filling.json
```
**What it does:** Automates form completion

### 5. Advanced Features
```bash
node src/index.js rules/example-advanced.json
```
**What it does:** Demonstrates advanced capabilities

## 🎨 Understanding Rule Files

Every rule file has this structure:

```json
{
  "name": "Rule name",                    // Required: Name of automation
  "description": "What it does",          // Optional: Description
  "continueOnError": false,               // Optional: Stop or continue on error
  "steps": [                              // Required: Array of steps
    {
      "stepId": "1",                      // Required: Unique ID
      "action": "navigate",               // Required: Action type
      "enabled": true,                    // Required: Execute or skip
      "description": "What this does",    // Optional: Human description
      // ... action-specific parameters
    }
  ]
}
```

### Most Common Actions

#### Navigate to a URL
```json
{
  "stepId": "1",
  "action": "navigate",
  "enabled": true,
  "url": "https://example.com"
}
```

#### Click a Button
```json
{
  "stepId": "2",
  "action": "click",
  "enabled": true,
  "selector": "#submit-button"
}
```

#### Fill an Input Field
```json
{
  "stepId": "3",
  "action": "fill",
  "enabled": true,
  "selector": "#email",
  "text": "user@example.com"
}
```

#### Wait for an Element
```json
{
  "stepId": "4",
  "action": "waitForSelector",
  "enabled": true,
  "selector": ".success-message",
  "state": "visible"
}
```

#### Take a Screenshot
```json
{
  "stepId": "5",
  "action": "screenshot",
  "enabled": true,
  "filename": "result.png",
  "fullPage": true
}
```

## 🔍 Finding Selectors

To interact with elements, you need CSS selectors. Here's how to find them:

### Using Chrome DevTools:
1. Open the website in Chrome
2. Press `F12` or `Ctrl+Shift+I`
3. Click the selector tool (top-left corner)
4. Click on the element you want
5. Right-click on the highlighted code
6. Copy → Copy Selector

### Common Selector Patterns:
```
#id-name              // Element with specific ID
.class-name           // Element with specific class
input[name="email"]   // Input with name attribute
button[type="submit"] // Button with type attribute
.parent .child        // Child element inside parent
```

## ⚙️ Configuration (Optional)

Create a `.env` file in the project root for custom settings:

```env
# Show browser window (recommended for development)
HEADLESS=false

# Browser type (chromium, firefox, or webkit)
BROWSER_TYPE=chromium

# Window size
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

## 📊 Understanding Output

When you run an automation, you'll see:

### Console Output
```
╔════════════════════════════════════════════════════════════════╗
║     PLAYWRIGHT AUTOMATION ENGINE - RULE-BASED EXECUTION       ║
╚════════════════════════════════════════════════════════════════╝

2024-01-15 10:30:45 [INFO]: Launching chromium browser...
2024-01-15 10:30:47 [INFO]: Browser initialized successfully
2024-01-15 10:30:47 [INFO]: Executing Step 1: navigate
2024-01-15 10:30:49 [INFO]: Step 1 completed successfully
...
════════════════════════════════════════════════════════════════
EXECUTION SUMMARY
════════════════════════════════════════════════════════════════
Rule Set: My First Test
Total Steps: 5
Executed: 5
Skipped: 0
Failed: 0
Execution Time: 3.21s
════════════════════════════════════════════════════════════════
```

### Generated Files

**Screenshots:** `screenshots/` folder
- Your captured screenshots
- Automatic error screenshots (if errors occur)

**Logs:** `logs/` folder
- `automation.log` - Complete execution log
- `error.log` - Errors only

## 🛠️ Troubleshooting

### Browser doesn't open
**Problem:** Headless mode is on  
**Solution:** Set `HEADLESS=false` in `.env` file

### "Element not found" error
**Problem:** Selector is wrong or element takes time to load  
**Solutions:**
- Add a `waitForSelector` step before interaction
- Verify selector using browser DevTools
- Increase timeout if page is slow

### "Navigation timeout" error
**Problem:** Page takes too long to load  
**Solution:** Increase `NAVIGATION_TIMEOUT` in `.env` file

### Browsers not installed
**Problem:** Playwright browsers missing  
**Solution:** Run `npm run install-browsers`

## 📖 Next Steps

### Learn More:
1. **[ACTIONS.md](ACTIONS.md)** - Complete reference for all 15 actions
2. **[README.md](README.md)** - Comprehensive documentation
3. **[ARCHITECTURE.md](ARCHITECTURE.md)** - How the system works

### Build Your Automation:
1. Identify the website/workflow to automate
2. Open the site and find element selectors
3. Create a rule file with steps
4. Test incrementally (enable one step at a time)
5. Add error handling and screenshots
6. Save and version control your rules

### Common Use Cases:
- ✅ Test login functionality
- ✅ Automate form submissions
- ✅ Extract data from websites
- ✅ Monitor website changes
- ✅ Validate user workflows
- ✅ Screenshot capture
- ✅ Regression testing

## 🎓 Tips for Success

1. **Start Simple** - Begin with just navigation and screenshot
2. **Test Incrementally** - Enable one new step at a time
3. **Use Descriptions** - Document what each step does
4. **Watch It Run** - Use `HEADLESS=false` during development
5. **Check Logs** - Review `logs/automation.log` for details
6. **Capture Screenshots** - Take screenshots at key points
7. **Validate Selectors** - Test in browser DevTools first
8. **Add Waits** - Don't assume elements are immediately available

## 💡 Quick Reference

### Run Commands
```bash
npm run demo                              # Run Google demo
node src/index.js <rule-file>            # Run specific rule
npm run validate <rule-file>             # Validate rule structure
npm run run-all                          # Run all examples
```

### File Locations
```
rules/              Your automation rule files
screenshots/        Generated screenshots
logs/              Execution logs
src/               Source code (don't modify unless extending)
```

### Common Actions
- `navigate` - Go to URL
- `click` - Click element
- `fill` - Fill input
- `type` - Type with delay
- `wait` - Wait duration
- `waitForSelector` - Wait for element
- `screenshot` - Capture image
- `extractText` - Get text content

### Getting Help
- Check example files in `rules/`
- Read action reference in `ACTIONS.md`
- Review logs in `logs/automation.log`
- See screenshots in `screenshots/` for visual verification

## 🎉 You're Ready!

You now have everything you need to start automating browser workflows!

Start with the demo, explore the examples, and create your first automation. Happy automating! 🚀

---

**Need more details?** See the comprehensive [README.md](README.md)

**Quick reference?** Check [ACTIONS.md](ACTIONS.md) for all actions

**Understanding internals?** Read [ARCHITECTURE.md](ARCHITECTURE.md)

