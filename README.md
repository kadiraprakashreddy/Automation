# Playwright Automation Engine

A powerful, rule-driven browser automation framework built on Node.js and Playwright. Execute complex browser workflows by defining steps in JSON configuration files — no code required.

## 🎯 Overview

The Playwright Automation Engine transforms browser automation into a **data-driven process**. Instead of writing test scripts in JavaScript or TypeScript, you define automation sequences in structured JSON files. Each rule file contains an ordered list of steps that the engine executes sequentially.

### Key Benefits

- ✅ **No Coding Required** - Define automation in JSON
- ✅ **Easy to Modify** - Change workflows without touching code
- ✅ **Flexible Execution** - Enable/disable steps with a flag
- ✅ **Data Extraction** - Store and reuse data between steps
- ✅ **Error Handling** - Automatic screenshots on failure
- ✅ **Comprehensive Logging** - Track every action
- ✅ **Multi-Browser Support** - Chromium, Firefox, and WebKit

## 📋 Features

### Supported Actions

| Action | Description | Example Use Case |
|--------|-------------|------------------|
| `navigate` | Navigate to a URL | Open login page |
| `click` | Click an element | Submit button |
| `type` | Type text with delay | Simulate human typing |
| `fill` | Fill input quickly | Enter credentials |
| `wait` | Wait for duration | Pause for animation |
| `waitForNavigation` | Wait for page load | After form submit |
| `waitForSelector` | Wait for element | Dropdown appears |
| `extractText` | Extract text content | Get username |
| `extractAttribute` | Extract element attribute | Get image src |
| `select` | Select dropdown option | Choose country |
| `hover` | Hover over element | Reveal tooltip |
| `check` | Check checkbox/radio | Accept terms |
| `uncheck` | Uncheck checkbox | Disable option |
| `screenshot` | Capture screenshot | Document state |
| `evaluate` | Execute JavaScript | Custom logic |

### Advanced Features

- **Data Storage** - Extract and reuse data with `storeAs` parameter
- **Placeholder Substitution** - Use `{{variableName}}` in text fields
- **Conditional Execution** - Enable/disable steps with `enabled` flag
- **Error Screenshots** - Automatic capture on step failure
- **Custom Delays** - Control timing with `delayAfter` parameter
- **Continue on Error** - Optional `continueOnError` flag

## 🚀 Getting Started

### Prerequisites

- Node.js 16.0.0 or higher
- npm or yarn package manager

### Installation

1. **Clone or download this repository**

```bash
cd Node_Automation
```

2. **Install dependencies**

```bash
npm install
```

3. **Install Playwright browsers**

```bash
npm run install-browsers
```

4. **Create environment configuration** (optional)

Create a `.env` file in the root directory:

```env
BROWSER_TYPE=chromium
HEADLESS=false
VIEWPORT_WIDTH=1920
VIEWPORT_HEIGHT=1080
DEFAULT_TIMEOUT=30000
NAVIGATION_TIMEOUT=60000
SCREENSHOT_ON_ERROR=true
SCREENSHOT_PATH=./screenshots
LOG_LEVEL=info
LOG_PATH=./logs
```

### Quick Start

Run an example automation:

```bash
npm start rules/example-login.json
```

Or directly with Node:

```bash
node src/index.js rules/example-login.json
```

## 📖 Usage Guide

### Creating a Rule File

A rule file is a JSON document with the following structure:

```json
{
  "name": "My Automation Flow",
  "description": "Brief description of what this automation does",
  "continueOnError": false,
  "steps": [
    {
      "stepId": "1",
      "action": "navigate",
      "enabled": true,
      "url": "https://example.com",
      "description": "Navigate to website"
    },
    {
      "stepId": "2",
      "action": "click",
      "enabled": true,
      "selector": "#login-button",
      "description": "Click login button"
    }
  ]
}
```

### Rule File Structure

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | ✅ | Name of the automation |
| `description` | string | ❌ | Description of the automation |
| `continueOnError` | boolean | ❌ | Continue execution if a step fails |
| `steps` | array | ✅ | Array of step objects |

### Step Structure

Each step must include:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `stepId` | string | ✅ | Unique identifier for the step |
| `action` | string | ✅ | Action to perform (see Actions below) |
| `enabled` | boolean | ✅ | Whether to execute this step |
| `description` | string | ❌ | Human-readable description |
| `continueOnError` | boolean | ❌ | Continue if this step fails |
| `delayAfter` | number | ❌ | Milliseconds to wait after step |
| `timeout` | number | ❌ | Custom timeout for this step |

## 🔧 Action Reference

### navigate

Navigate to a URL.

```json
{
  "stepId": "1",
  "action": "navigate",
  "enabled": true,
  "url": "https://example.com/login",
  "waitUntil": "domcontentloaded"
}
```

**Parameters:**
- `url` (required): Target URL
- `waitUntil` (optional): `load`, `domcontentloaded`, `networkidle`

### click

Click an element.

```json
{
  "stepId": "2",
  "action": "click",
  "enabled": true,
  "selector": "button[type='submit']"
}
```

**Parameters:**
- `selector` (required): CSS selector for the element

### type

Type text with optional delay (simulates human typing).

```json
{
  "stepId": "3",
  "action": "type",
  "enabled": true,
  "selector": "#username",
  "text": "john@example.com",
  "delay": 50
}
```

**Parameters:**
- `selector` (required): CSS selector for input
- `text` (required): Text to type
- `delay` (optional): Delay in ms between keystrokes

### fill

Fill input field quickly (no typing delay).

```json
{
  "stepId": "4",
  "action": "fill",
  "enabled": true,
  "selector": "#password",
  "text": "SecurePassword123"
}
```

**Parameters:**
- `selector` (required): CSS selector for input
- `text` (required): Text to fill

### wait

Wait for a specific duration.

```json
{
  "stepId": "5",
  "action": "wait",
  "enabled": true,
  "duration": 2000
}
```

**Parameters:**
- `duration` (required): Milliseconds to wait

### waitForNavigation

Wait for page navigation to complete.

```json
{
  "stepId": "6",
  "action": "waitForNavigation",
  "enabled": true,
  "waitUntil": "networkidle",
  "timeout": 30000
}
```

**Parameters:**
- `waitUntil` (optional): `load`, `domcontentloaded`, `networkidle`
- `timeout` (optional): Maximum wait time in ms

### waitForSelector

Wait for an element to appear.

```json
{
  "stepId": "7",
  "action": "waitForSelector",
  "enabled": true,
  "selector": ".user-dashboard",
  "state": "visible"
}
```

**Parameters:**
- `selector` (required): CSS selector
- `state` (optional): `visible`, `hidden`, `attached`, `detached`

### extractText

Extract text content from an element.

```json
{
  "stepId": "8",
  "action": "extractText",
  "enabled": true,
  "selector": ".username",
  "storeAs": "currentUser"
}
```

**Parameters:**
- `selector` (required): CSS selector
- `storeAs` (optional): Variable name to store the text

### extractAttribute

Extract an attribute value from an element.

```json
{
  "stepId": "9",
  "action": "extractAttribute",
  "enabled": true,
  "selector": "img.logo",
  "attribute": "src",
  "storeAs": "logoUrl"
}
```

**Parameters:**
- `selector` (required): CSS selector
- `attribute` (required): Attribute name
- `storeAs` (optional): Variable name to store the value

### select

Select an option from a dropdown.

```json
{
  "stepId": "10",
  "action": "select",
  "enabled": true,
  "selector": "#country",
  "value": "US"
}
```

**Parameters:**
- `selector` (required): CSS selector for `<select>` element
- `value` (optional): Option value to select
- `label` (optional): Option label to select
- `index` (optional): Option index to select

### hover

Hover over an element.

```json
{
  "stepId": "11",
  "action": "hover",
  "enabled": true,
  "selector": ".dropdown-trigger"
}
```

**Parameters:**
- `selector` (required): CSS selector

### check / uncheck

Check or uncheck a checkbox.

```json
{
  "stepId": "12",
  "action": "check",
  "enabled": true,
  "selector": "#agree-terms"
}
```

**Parameters:**
- `selector` (required): CSS selector

### screenshot

Capture a screenshot.

```json
{
  "stepId": "13",
  "action": "screenshot",
  "enabled": true,
  "filename": "dashboard.png",
  "fullPage": true
}
```

**Parameters:**
- `filename` (required): Screenshot filename
- `fullPage` (optional): Capture full page (default: true)

### evaluate

Execute custom JavaScript code.

```json
{
  "stepId": "14",
  "action": "evaluate",
  "enabled": true,
  "script": "document.querySelectorAll('.product').length",
  "storeAs": "productCount"
}
```

**Parameters:**
- `script` (required): JavaScript code to execute
- `storeAs` (optional): Variable name to store the result

## 💾 Data Storage & Reuse

### Storing Data

Use the `storeAs` parameter to save extracted data:

```json
{
  "stepId": "1",
  "action": "extractText",
  "enabled": true,
  "selector": ".user-id",
  "storeAs": "userId"
}
```

### Using Stored Data

Reference stored data using `{{variableName}}` syntax:

```json
{
  "stepId": "2",
  "action": "fill",
  "enabled": true,
  "selector": "#search",
  "text": "User ID: {{userId}}"
}
```

## 📊 Example Workflows

### Example 1: Login Flow

See `rules/example-login.json` for a complete login automation that:
1. Navigates to login page
2. Fills credentials
3. Clicks login button
4. Waits for dashboard
5. Extracts user information

### Example 2: Data Extraction

See `rules/example-data-extraction.json` for web scraping that:
1. Navigates to product listing
2. Extracts product names, prices, and images
3. Clicks for details
4. Stores all data for later use

### Example 3: Form Filling

See `rules/example-form-filling.json` for form automation that:
1. Navigates to contact form
2. Fills all fields
3. Selects dropdown options
4. Checks checkboxes
5. Takes screenshots

### Example 4: Advanced Features

See `rules/example-advanced.json` for advanced capabilities:
1. Custom JavaScript execution
2. Data extraction and reuse
3. Hover interactions
4. Attribute extraction

## 🎛️ Configuration

### Environment Variables

Create a `.env` file to customize behavior:

```env
# Browser Settings
BROWSER_TYPE=chromium          # chromium, firefox, or webkit
HEADLESS=false                 # true for headless mode
VIEWPORT_WIDTH=1920
VIEWPORT_HEIGHT=1080

# Timeouts (milliseconds)
DEFAULT_TIMEOUT=30000
NAVIGATION_TIMEOUT=60000

# Screenshots
SCREENSHOT_ON_ERROR=true
SCREENSHOT_PATH=./screenshots

# Logging
LOG_LEVEL=info                 # error, warn, info, debug
LOG_PATH=./logs
```

### Browser Selection

Supported browsers:
- **chromium** (default) - Google Chrome/Chromium
- **firefox** - Mozilla Firefox
- **webkit** - Safari (WebKit)

## 📝 Logging

The engine provides comprehensive logging:

- **Console Output**: Real-time execution status with color coding
- **Log Files**: 
  - `logs/automation.log` - All execution logs
  - `logs/error.log` - Error-only logs
- **Screenshots**: Automatic capture on errors (if enabled)

## 🖼️ Screenshots

Screenshots are saved to the `screenshots/` directory:

- **Manual Screenshots**: Defined in rule steps
- **Error Screenshots**: Automatic on step failure (format: `error-step-{stepId}-{timestamp}.png`)

## 🔍 Execution Summary

After each run, you'll see a detailed summary:

```
════════════════════════════════════════════════════════════════
EXECUTION SUMMARY
════════════════════════════════════════════════════════════════
Rule Set: User Login Flow
Description: Automated login flow for a web application
Total Steps: 11
Executed: 10
Skipped: 1
Failed: 0
Execution Time: 8.42s
════════════════════════════════════════════════════════════════
```

## 🛠️ Troubleshooting

### Common Issues

**Issue**: "Element not found"
- **Solution**: Increase timeout or add `waitForSelector` before interaction

**Issue**: "Navigation timeout"
- **Solution**: Increase `NAVIGATION_TIMEOUT` in `.env`

**Issue**: "Browser not installed"
- **Solution**: Run `npm run install-browsers`

**Issue**: "Step fails intermittently"
- **Solution**: Add `wait` step or adjust `delayAfter` parameter

### Debug Mode

Enable detailed logging:

```env
LOG_LEVEL=debug
```

Run with headless mode disabled to see browser actions:

```env
HEADLESS=false
```

## 📁 Project Structure

```
Node_Automation/
├── src/
│   ├── actions/
│   │   └── actionHandler.js       # Action execution logic
│   ├── engine/
│   │   └── ruleEngine.js          # Core automation engine
│   ├── utils/
│   │   ├── config.js              # Configuration management
│   │   ├── dataStore.js           # In-memory data storage
│   │   └── logger.js              # Logging utilities
│   └── index.js                   # Main entry point
├── rules/
│   ├── example-login.json         # Login flow example
│   ├── example-data-extraction.json # Data extraction example
│   ├── example-form-filling.json  # Form filling example
│   └── example-advanced.json      # Advanced features example
├── screenshots/                   # Generated screenshots
├── logs/                          # Execution logs
├── package.json                   # Dependencies
├── .gitignore
└── README.md
```

## 🚦 Best Practices

1. **Use Unique Step IDs**: Makes debugging easier
2. **Add Descriptions**: Document what each step does
3. **Start with `enabled: false`**: Test incrementally
4. **Use `waitForSelector`**: Before interacting with dynamic elements
5. **Capture Screenshots**: Document important states
6. **Store Critical Data**: Use `storeAs` for data you might need later
7. **Add Delays**: For animations or slow networks
8. **Enable `continueOnError`**: For data extraction tasks

## 🔮 Future Enhancements

Potential features for future versions:

- [ ] Conditional logic (if/else statements)
- [ ] Loops and iterations
- [ ] Multiple page handling
- [ ] API integration steps
- [ ] Database connectivity
- [ ] Parallel execution
- [ ] Report generation
- [ ] CI/CD integration
- [ ] Visual regression testing
- [ ] Mobile device emulation

## 📄 License

MIT License - Feel free to use and modify for your needs.

## 🤝 Contributing

Contributions are welcome! To add new actions:

1. Add the action handler in `src/actions/actionHandler.js`
2. Update this README with action documentation
3. Create example rule files demonstrating the new action

## 📧 Support

For issues, questions, or suggestions, please review the example files and documentation first. The examples cover most common use cases.

---

**Happy Automating! 🎉**

Transform your browser workflows into maintainable, reusable automation rules.

