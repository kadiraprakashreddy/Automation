# Quick Start Guide

Get up and running with the Playwright Automation Engine in 5 minutes!

## Installation Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Install Playwright Browsers

```bash
npm run install-browsers
```

This downloads Chromium, Firefox, and WebKit browsers.

### 3. (Optional) Create Environment Configuration

Create a `.env` file in the root directory:

```env
BROWSER_TYPE=chromium
HEADLESS=false
VIEWPORT_WIDTH=1920
VIEWPORT_HEIGHT=1080
DEFAULT_TIMEOUT=30000
SCREENSHOT_ON_ERROR=true
```

## Your First Automation

### Option 1: Run an Example

Run one of the provided examples:

```bash
node src/index.js rules/example-login.json
```

or

```bash
npm start rules/example-login.json
```

### Option 2: Create Your Own Rule

Create `rules/my-first-automation.json`:

```json
{
  "name": "My First Automation",
  "description": "Navigate to a website and take a screenshot",
  "steps": [
    {
      "stepId": "1",
      "action": "navigate",
      "enabled": true,
      "url": "https://www.google.com",
      "description": "Open Google homepage"
    },
    {
      "stepId": "2",
      "action": "waitForSelector",
      "enabled": true,
      "selector": "input[name='q']",
      "state": "visible",
      "description": "Wait for search box"
    },
    {
      "stepId": "3",
      "action": "screenshot",
      "enabled": true,
      "filename": "google-homepage.png",
      "fullPage": true,
      "description": "Take a screenshot"
    }
  ]
}
```

Run it:

```bash
node src/index.js rules/my-first-automation.json
```

## Understanding the Output

When you run an automation, you'll see:

1. **Real-time Console Logs**: Shows each step as it executes
2. **Execution Summary**: Final statistics at the end
3. **Screenshots**: Saved in `screenshots/` folder
4. **Log Files**: Detailed logs in `logs/` folder

Example console output:

```
╔════════════════════════════════════════════════════════════════╗
║     PLAYWRIGHT AUTOMATION ENGINE - RULE-BASED EXECUTION       ║
╚════════════════════════════════════════════════════════════════╝

2024-01-15 10:30:45 [INFO]: Loaded rules from: rules/my-first-automation.json
2024-01-15 10:30:45 [INFO]: Launching chromium browser...
2024-01-15 10:30:47 [INFO]: Browser initialized successfully
2024-01-15 10:30:47 [INFO]: Starting execution of rule set: My First Automation
2024-01-15 10:30:47 [INFO]: Executing Step 1: navigate
2024-01-15 10:30:49 [INFO]: Step 1 completed successfully
2024-01-15 10:30:49 [INFO]: Executing Step 2: waitForSelector
2024-01-15 10:30:49 [INFO]: Step 2 completed successfully
2024-01-15 10:30:49 [INFO]: Executing Step 3: screenshot
2024-01-15 10:30:50 [INFO]: Screenshot saved: screenshots/google-homepage.png
2024-01-15 10:30:50 [INFO]: Step 3 completed successfully

════════════════════════════════════════════════════════════════
EXECUTION SUMMARY
════════════════════════════════════════════════════════════════
Rule Set: My First Automation
Description: Navigate to a website and take a screenshot
Total Steps: 3
Executed: 3
Skipped: 0
Failed: 0
Execution Time: 3.21s
════════════════════════════════════════════════════════════════

2024-01-15 10:30:50 [INFO]: Browser closed
2024-01-15 10:30:50 [INFO]: Automation completed successfully
```

## Next Steps

1. **Explore Examples**: Check out the example rule files in `rules/` directory
2. **Read the Documentation**: See `README.md` for complete action reference
3. **Build Your Workflows**: Create custom rule files for your use cases

## Common First-Time Issues

### "Cannot find module 'playwright'"

**Solution**: Run `npm install` first

### "Executable doesn't exist"

**Solution**: Run `npm run install-browsers`

### "Rule file not found"

**Solution**: Check the file path is correct relative to the project root

### Browser doesn't open

**Solution**: Set `HEADLESS=false` in `.env` file

## Tips for Beginners

1. Start with `HEADLESS=false` to see what's happening
2. Use simple, reliable websites for testing (like Google)
3. Add `wait` steps if things happen too fast
4. Check `logs/automation.log` if something goes wrong
5. Disable steps you don't need with `"enabled": false`

## Example: Login Automation

Here's a practical example for a login flow:

```json
{
  "name": "Login Test",
  "description": "Test login functionality",
  "steps": [
    {
      "stepId": "1",
      "action": "navigate",
      "enabled": true,
      "url": "https://your-app.com/login"
    },
    {
      "stepId": "2",
      "action": "fill",
      "enabled": true,
      "selector": "#email",
      "text": "test@example.com"
    },
    {
      "stepId": "3",
      "action": "fill",
      "enabled": true,
      "selector": "#password",
      "text": "password123"
    },
    {
      "stepId": "4",
      "action": "click",
      "enabled": true,
      "selector": "button[type='submit']"
    },
    {
      "stepId": "5",
      "action": "waitForSelector",
      "enabled": true,
      "selector": ".dashboard"
    },
    {
      "stepId": "6",
      "action": "screenshot",
      "enabled": true,
      "filename": "logged-in.png"
    }
  ]
}
```

## Need Help?

- Check the `README.md` for detailed documentation
- Look at the example files in `rules/` directory
- Review the logs in `logs/automation.log`
- Check screenshots in `screenshots/` folder

Happy Automating! 🚀

