# Architecture Overview

This document explains the internal architecture of the Playwright Automation Engine.

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Layer                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ Rule Files   │  │ CLI Commands │  │ Config Files │          │
│  │  (JSON)      │  │              │  │   (.env)     │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                      Application Layer                           │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    index.js (Entry Point)                │   │
│  │  - Parse CLI arguments                                   │   │
│  │  - Initialize RuleEngine                                 │   │
│  │  - Handle errors and exit codes                          │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                        Engine Layer                              │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    RuleEngine                            │   │
│  │  - Load and validate rule files                          │   │
│  │  - Initialize browser (Playwright)                       │   │
│  │  - Execute steps sequentially                            │   │
│  │  - Generate execution summary                            │   │
│  │  - Handle browser lifecycle                              │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                       Action Layer                               │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                  ActionHandler                           │   │
│  │  - Execute individual actions                            │   │
│  │  - Handle action parameters                              │   │
│  │  - Process placeholders                                  │   │
│  │  - Capture error screenshots                             │   │
│  │  - Interact with Playwright API                          │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                      Utility Layer                               │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐                  │
│  │  Logger  │    │DataStore │    │  Config  │                  │
│  │(Winston) │    │(In-memory│    │(.env +   │                  │
│  │          │    │ Map)     │    │defaults) │                  │
│  └──────────┘    └──────────┘    └──────────┘                  │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                    Playwright Layer                              │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              Playwright for Node.js                      │   │
│  │  - Browser control (Chromium, Firefox, WebKit)           │   │
│  │  - Page interactions                                     │   │
│  │  - Element selectors                                     │   │
│  │  - Screenshots                                           │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                       Browser Layer                              │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐                  │
│  │ Chromium │    │ Firefox  │    │  WebKit  │                  │
│  └──────────┘    └──────────┘    └──────────┘                  │
└─────────────────────────────────────────────────────────────────┘
```

## Component Details

### 1. Entry Point (`src/index.js`)

**Responsibilities:**
- Parse command-line arguments
- Initialize the rule engine
- Handle top-level errors
- Manage process exit codes

**Flow:**
1. Validate CLI arguments
2. Create RuleEngine instance
3. Call `engine.run(ruleFilePath)`
4. Handle success/failure
5. Exit with appropriate code

### 2. Rule Engine (`src/engine/ruleEngine.js`)

**Responsibilities:**
- Load and parse JSON rule files
- Validate rule structure
- Manage browser lifecycle
- Execute steps sequentially
- Generate execution summaries

**Key Methods:**
- `loadRules(filePath)` - Parse JSON file
- `validateRules(rules)` - Validate structure
- `initBrowser()` - Launch Playwright browser
- `executeRules(rules)` - Run all steps
- `closeBrowser()` - Clean up resources
- `run(filePath)` - Main orchestration method

**Error Handling:**
- Validates rule structure before execution
- Catches browser initialization errors
- Handles step execution failures
- Always closes browser in finally block

### 3. Action Handler (`src/actions/actionHandler.js`)

**Responsibilities:**
- Execute individual step actions
- Interact with Playwright page API
- Handle action-specific parameters
- Process placeholder substitution
- Capture error screenshots

**Supported Actions:**
- Navigation: `navigate`, `waitForNavigation`
- Interaction: `click`, `hover`, `check`, `uncheck`
- Input: `type`, `fill`, `select`
- Waiting: `wait`, `waitForSelector`
- Extraction: `extractText`, `extractAttribute`
- Other: `screenshot`, `evaluate`

**Key Features:**
- Placeholder replacement: `{{variableName}}`
- Automatic error screenshots
- Configurable timeouts
- Data storage integration

### 4. Utility Modules

#### Logger (`src/utils/logger.js`)

**Technology:** Winston logging library

**Features:**
- Colored console output
- File logging (separate error log)
- Timestamp formatting
- Configurable log levels

**Log Files:**
- `logs/automation.log` - All logs
- `logs/error.log` - Errors only

#### DataStore (`src/utils/dataStore.js`)

**Implementation:** In-memory Map

**Features:**
- Store extracted data
- Retrieve data by key
- Clear between runs
- Export all data

**Use Cases:**
- Store extracted text/attributes
- Pass data between steps
- Include in final summary

#### Config (`src/utils/config.js`)

**Technology:** dotenv

**Configuration:**
- Browser settings
- Timeouts
- Screenshot options
- Logging options

**Environment Variables:**
```
BROWSER_TYPE
HEADLESS
VIEWPORT_WIDTH
VIEWPORT_HEIGHT
DEFAULT_TIMEOUT
NAVIGATION_TIMEOUT
SCREENSHOT_ON_ERROR
SCREENSHOT_PATH
LOG_LEVEL
LOG_PATH
```

## Data Flow

### 1. Execution Flow

```
User runs CLI command
    ↓
index.js parses arguments
    ↓
RuleEngine loads JSON file
    ↓
RuleEngine validates structure
    ↓
RuleEngine launches browser
    ↓
For each enabled step:
    ↓
    ActionHandler executes action
        ↓
        Interacts with Playwright
            ↓
            Browser performs action
        ↓
        Returns result
    ↓
    RuleEngine logs result
    ↓
    Continue to next step
    ↓
RuleEngine generates summary
    ↓
RuleEngine closes browser
    ↓
index.js exits with status code
```

### 2. Data Storage Flow

```
Step with extractText/extractAttribute/evaluate
    ↓
ActionHandler extracts data
    ↓
If storeAs is provided:
    ↓
    DataStore.set(key, value)
    ↓
    Logger logs storage
    ↓
Later step uses {{key}} in text
    ↓
ActionHandler calls replacePlaceholders()
    ↓
DataStore.get(key) returns value
    ↓
Text is substituted
    ↓
Action executes with actual value
```

### 3. Error Handling Flow

```
Step execution throws error
    ↓
ActionHandler catches error
    ↓
If SCREENSHOT_ON_ERROR:
    ↓
    Capture error screenshot
    ↓
    Save with timestamp
    ↓
Logger logs error
    ↓
Return failure result
    ↓
RuleEngine checks continueOnError
    ↓
If false: Stop execution
If true: Continue to next step
    ↓
Mark step as failed in summary
```

## Design Patterns

### 1. Strategy Pattern
- **Where:** ActionHandler
- **Purpose:** Different strategies for different actions
- **Benefit:** Easy to add new actions

### 2. Singleton Pattern
- **Where:** DataStore, Logger, Config
- **Purpose:** Single shared instance
- **Benefit:** Consistent state across execution

### 3. Template Method Pattern
- **Where:** RuleEngine.run()
- **Purpose:** Define execution skeleton
- **Benefit:** Consistent flow with flexibility

### 4. Command Pattern
- **Where:** Step objects
- **Purpose:** Encapsulate actions as objects
- **Benefit:** Easy to serialize, validate, replay

## Extension Points

### Adding New Actions

1. Add action name to ActionHandler switch statement
2. Implement action method
3. Add validation in validate-rule.js
4. Document in ACTIONS.md
5. Create example in rules/

### Example:
```javascript
// In src/actions/actionHandler.js
async doubleClick(step) {
  const { selector } = step;
  await this.page.dblclick(selector, {
    timeout: step.timeout || config.timeouts.default
  });
  return { selector };
}

// In execute() switch statement
case 'doubleclick':
  result = await this.doubleClick(step);
  break;
```

### Adding New Configuration

1. Add to .env.example
2. Add to src/utils/config.js
3. Document in README.md
4. Use in appropriate modules

### Adding Conditional Logic (Future)

1. Add condition evaluator in RuleEngine
2. Support if/else/loop in step structure
3. Extend validation
4. Update schema

## Performance Considerations

### Current Optimizations
- Sequential step execution (predictable)
- Reuse single browser instance
- Efficient selector waiting
- Minimal logging overhead

### Potential Improvements
- Parallel execution for independent rules
- Browser context pooling
- Step result caching
- Lazy browser initialization

## Security Considerations

### Current Measures
- No remote code execution
- Sandboxed browser environment
- Local file system only
- Environment variable for secrets

### Recommendations
- Store credentials in .env
- Use secret management for production
- Validate URLs before navigation
- Sanitize extracted data before logging

## Testing Strategy

### Unit Testing (Future)
- Test ActionHandler methods
- Test DataStore operations
- Test placeholder replacement
- Mock Playwright API

### Integration Testing
- Run example rule files
- Validate outputs
- Check logs
- Verify screenshots

### Validation
- JSON schema validation
- Rule structure validation
- Parameter validation per action

## Monitoring & Debugging

### Logs
- Real-time console output
- Persistent file logs
- Error-specific log file
- Timestamped entries

### Screenshots
- Manual screenshots per step
- Automatic error screenshots
- Timestamped filenames
- Full page or viewport

### Execution Summary
- Total/executed/failed/skipped counts
- Execution time
- Step-by-step results
- Extracted data

## Dependencies

### Production Dependencies
- `playwright` - Browser automation
- `winston` - Logging
- `dotenv` - Environment configuration

### Development Dependencies
- None currently (minimal setup)

### Browser Binaries
- Chromium
- Firefox
- WebKit

## File Structure

```
Node_Automation/
├── src/                    # Source code
│   ├── actions/            # Action handlers
│   ├── engine/             # Core engine
│   ├── utils/              # Utilities
│   └── index.js            # Entry point
├── rules/                  # Rule definitions
├── scripts/                # Helper scripts
├── logs/                   # Generated logs
├── screenshots/            # Generated screenshots
├── package.json            # Dependencies
└── README.md               # Documentation
```

## Future Enhancements

### Planned Features
1. Conditional execution (if/else)
2. Loops and iterations
3. Multiple page handling
4. API integration steps
5. Database connectivity
6. Report generation
7. CI/CD integration
8. Visual regression testing

### Architecture Changes for Enhancements

**For Conditional Logic:**
- Add ConditionEvaluator class
- Extend step schema
- Add flow control to RuleEngine

**For Loops:**
- Add LoopHandler class
- Support loop syntax in steps
- Handle iteration context

**For API Integration:**
- Add ApiHandler class
- Support HTTP methods
- Store API responses

**For Database:**
- Add DatabaseHandler class
- Support queries
- Store results

## Conclusion

The architecture is designed to be:
- **Modular:** Clear separation of concerns
- **Extensible:** Easy to add new actions
- **Maintainable:** Simple, clean code
- **Testable:** Mockable dependencies
- **Configurable:** Environment-based settings
- **Robust:** Comprehensive error handling

The rule-driven approach provides flexibility and ease of use, while the underlying architecture ensures reliability and maintainability.

