# Complete Actions Reference

This document provides a comprehensive reference for all available actions in the Playwright Automation Engine.

## Table of Contents

- [Navigation Actions](#navigation-actions)
- [Interaction Actions](#interaction-actions)
- [Input Actions](#input-actions)
- [Wait Actions](#wait-actions)
- [Data Extraction Actions](#data-extraction-actions)
- [Screenshot Actions](#screenshot-actions)
- [Advanced Actions](#advanced-actions)

---

## Navigation Actions

### navigate

Navigate the browser to a specific URL.

**Syntax:**
```json
{
  "stepId": "1",
  "action": "navigate",
  "enabled": true,
  "url": "https://example.com",
  "waitUntil": "domcontentloaded"
}
```

**Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `url` | string | ✅ | - | The URL to navigate to |
| `waitUntil` | string | ❌ | `domcontentloaded` | Wait condition: `load`, `domcontentloaded`, `networkidle` |

**Examples:**

Wait for full page load:
```json
{
  "stepId": "1",
  "action": "navigate",
  "enabled": true,
  "url": "https://example.com",
  "waitUntil": "load"
}
```

Wait for network to be idle (good for SPAs):
```json
{
  "stepId": "1",
  "action": "navigate",
  "enabled": true,
  "url": "https://app.example.com/dashboard",
  "waitUntil": "networkidle"
}
```

---

## Interaction Actions

### click

Click on an element.

**Syntax:**
```json
{
  "stepId": "2",
  "action": "click",
  "enabled": true,
  "selector": "button.submit"
}
```

**Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `selector` | string | ✅ | - | CSS selector for the element |
| `timeout` | number | ❌ | 30000 | Maximum wait time in ms |

**Examples:**

Click by ID:
```json
{
  "stepId": "2",
  "action": "click",
  "enabled": true,
  "selector": "#submit-button"
}
```

Click by complex selector:
```json
{
  "stepId": "2",
  "action": "click",
  "enabled": true,
  "selector": "button[data-testid='login-submit']"
}
```

### hover

Hover over an element (useful for dropdowns and tooltips).

**Syntax:**
```json
{
  "stepId": "3",
  "action": "hover",
  "enabled": true,
  "selector": ".dropdown-trigger"
}
```

**Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `selector` | string | ✅ | - | CSS selector for the element |

**Examples:**

Reveal dropdown menu:
```json
{
  "stepId": "3",
  "action": "hover",
  "enabled": true,
  "selector": "nav .menu-item"
}
```

### check / uncheck

Check or uncheck a checkbox or radio button.

**Syntax:**
```json
{
  "stepId": "4",
  "action": "check",
  "enabled": true,
  "selector": "#agree-terms"
}
```

**Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `selector` | string | ✅ | - | CSS selector for the checkbox |

**Examples:**

Check a checkbox:
```json
{
  "stepId": "4",
  "action": "check",
  "enabled": true,
  "selector": "input[type='checkbox'][name='newsletter']"
}
```

Uncheck a checkbox:
```json
{
  "stepId": "5",
  "action": "uncheck",
  "enabled": true,
  "selector": "#opt-out"
}
```

---

## Input Actions

### fill

Quickly fill an input field (no typing delay).

**Syntax:**
```json
{
  "stepId": "6",
  "action": "fill",
  "enabled": true,
  "selector": "#email",
  "text": "user@example.com"
}
```

**Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `selector` | string | ✅ | - | CSS selector for the input |
| `text` | string | ✅ | - | Text to fill |

**Examples:**

Fill with placeholder substitution:
```json
{
  "stepId": "6",
  "action": "fill",
  "enabled": true,
  "selector": "#search",
  "text": "Search for {{productName}}"
}
```

### type

Type text with keyboard delay (simulates human typing).

**Syntax:**
```json
{
  "stepId": "7",
  "action": "type",
  "enabled": true,
  "selector": "#message",
  "text": "Hello, World!",
  "delay": 100
}
```

**Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `selector` | string | ✅ | - | CSS selector for the input |
| `text` | string | ✅ | - | Text to type |
| `delay` | number | ❌ | 0 | Delay between keystrokes in ms |

**Examples:**

Realistic human typing:
```json
{
  "stepId": "7",
  "action": "type",
  "enabled": true,
  "selector": "textarea#description",
  "text": "This is a detailed description",
  "delay": 50
}
```

### select

Select an option from a dropdown.

**Syntax:**
```json
{
  "stepId": "8",
  "action": "select",
  "enabled": true,
  "selector": "#country",
  "value": "US"
}
```

**Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `selector` | string | ✅ | - | CSS selector for the `<select>` |
| `value` | string | ❌ | - | Option value attribute |
| `label` | string | ❌ | - | Option label text |
| `index` | number | ❌ | - | Option index (0-based) |

**Note:** Provide one of `value`, `label`, or `index`.

**Examples:**

Select by value:
```json
{
  "stepId": "8",
  "action": "select",
  "enabled": true,
  "selector": "#country",
  "value": "US"
}
```

Select by label:
```json
{
  "stepId": "8",
  "action": "select",
  "enabled": true,
  "selector": "#country",
  "label": "United States"
}
```

Select by index:
```json
{
  "stepId": "8",
  "action": "select",
  "enabled": true,
  "selector": "#country",
  "index": 0
}
```

---

## Wait Actions

### wait

Wait for a fixed duration.

**Syntax:**
```json
{
  "stepId": "9",
  "action": "wait",
  "enabled": true,
  "duration": 2000
}
```

**Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `duration` | number | ✅ | - | Wait time in milliseconds |

**Examples:**

Wait for animation:
```json
{
  "stepId": "9",
  "action": "wait",
  "enabled": true,
  "duration": 1000
}
```

### waitForSelector

Wait for an element to appear or change state.

**Syntax:**
```json
{
  "stepId": "10",
  "action": "waitForSelector",
  "enabled": true,
  "selector": ".loading-spinner",
  "state": "hidden"
}
```

**Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `selector` | string | ✅ | - | CSS selector |
| `state` | string | ❌ | `visible` | Element state: `visible`, `hidden`, `attached`, `detached` |
| `timeout` | number | ❌ | 30000 | Maximum wait time in ms |

**Examples:**

Wait for element to appear:
```json
{
  "stepId": "10",
  "action": "waitForSelector",
  "enabled": true,
  "selector": ".success-message",
  "state": "visible"
}
```

Wait for loading spinner to disappear:
```json
{
  "stepId": "10",
  "action": "waitForSelector",
  "enabled": true,
  "selector": ".spinner",
  "state": "hidden"
}
```

### waitForNavigation

Wait for page navigation to complete.

**Syntax:**
```json
{
  "stepId": "11",
  "action": "waitForNavigation",
  "enabled": true,
  "waitUntil": "networkidle"
}
```

**Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `waitUntil` | string | ❌ | `networkidle` | Wait condition: `load`, `domcontentloaded`, `networkidle` |
| `timeout` | number | ❌ | 60000 | Maximum wait time in ms |

**Examples:**

Wait for DOM to load:
```json
{
  "stepId": "11",
  "action": "waitForNavigation",
  "enabled": true,
  "waitUntil": "domcontentloaded"
}
```

---

## Data Extraction Actions

### extractText

Extract text content from an element.

**Syntax:**
```json
{
  "stepId": "12",
  "action": "extractText",
  "enabled": true,
  "selector": ".product-name",
  "storeAs": "productName"
}
```

**Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `selector` | string | ✅ | - | CSS selector |
| `storeAs` | string | ❌ | - | Variable name to store the text |

**Examples:**

Extract and store for later use:
```json
{
  "stepId": "12",
  "action": "extractText",
  "enabled": true,
  "selector": ".username",
  "storeAs": "currentUser"
}
```

Extract without storing:
```json
{
  "stepId": "12",
  "action": "extractText",
  "enabled": true,
  "selector": ".page-title"
}
```

### extractAttribute

Extract an attribute value from an element.

**Syntax:**
```json
{
  "stepId": "13",
  "action": "extractAttribute",
  "enabled": true,
  "selector": "img.logo",
  "attribute": "src",
  "storeAs": "logoUrl"
}
```

**Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `selector` | string | ✅ | - | CSS selector |
| `attribute` | string | ✅ | - | Attribute name |
| `storeAs` | string | ❌ | - | Variable name to store the value |

**Examples:**

Extract image source:
```json
{
  "stepId": "13",
  "action": "extractAttribute",
  "enabled": true,
  "selector": "img.product-image",
  "attribute": "src",
  "storeAs": "imageUrl"
}
```

Extract link href:
```json
{
  "stepId": "13",
  "action": "extractAttribute",
  "enabled": true,
  "selector": "a.download-link",
  "attribute": "href",
  "storeAs": "downloadUrl"
}
```

Extract data attribute:
```json
{
  "stepId": "13",
  "action": "extractAttribute",
  "enabled": true,
  "selector": "div.product",
  "attribute": "data-product-id",
  "storeAs": "productId"
}
```

---

## Screenshot Actions

### screenshot

Capture a screenshot of the current page.

**Syntax:**
```json
{
  "stepId": "14",
  "action": "screenshot",
  "enabled": true,
  "filename": "dashboard.png",
  "fullPage": true
}
```

**Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `filename` | string | ✅ | - | Output filename |
| `fullPage` | boolean | ❌ | true | Capture full scrollable page |

**Examples:**

Full page screenshot:
```json
{
  "stepId": "14",
  "action": "screenshot",
  "enabled": true,
  "filename": "full-page.png",
  "fullPage": true
}
```

Viewport only screenshot:
```json
{
  "stepId": "14",
  "action": "screenshot",
  "enabled": true,
  "filename": "viewport-only.png",
  "fullPage": false
}
```

---

## Advanced Actions

### evaluate

Execute custom JavaScript code in the browser context.

**Syntax:**
```json
{
  "stepId": "15",
  "action": "evaluate",
  "enabled": true,
  "script": "document.querySelectorAll('.item').length",
  "storeAs": "itemCount"
}
```

**Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `script` | string | ✅ | - | JavaScript code to execute |
| `storeAs` | string | ❌ | - | Variable name to store the result |

**Examples:**

Count elements:
```json
{
  "stepId": "15",
  "action": "evaluate",
  "enabled": true,
  "script": "document.querySelectorAll('.product').length",
  "storeAs": "productCount"
}
```

Get page title:
```json
{
  "stepId": "15",
  "action": "evaluate",
  "enabled": true,
  "script": "document.title",
  "storeAs": "pageTitle"
}
```

Get current URL:
```json
{
  "stepId": "15",
  "action": "evaluate",
  "enabled": true,
  "script": "window.location.href",
  "storeAs": "currentUrl"
}
```

Extract complex data:
```json
{
  "stepId": "15",
  "action": "evaluate",
  "enabled": true,
  "script": "Array.from(document.querySelectorAll('.price')).map(el => el.textContent)",
  "storeAs": "allPrices"
}
```

Scroll to bottom:
```json
{
  "stepId": "15",
  "action": "evaluate",
  "enabled": true,
  "script": "window.scrollTo(0, document.body.scrollHeight)"
}
```

---

## Using Data Between Steps

### Store Data

Use `storeAs` parameter in extraction actions:

```json
{
  "stepId": "1",
  "action": "extractText",
  "enabled": true,
  "selector": "#user-id",
  "storeAs": "userId"
}
```

### Use Stored Data

Reference with `{{variableName}}` syntax:

```json
{
  "stepId": "2",
  "action": "fill",
  "enabled": true,
  "selector": "#search-input",
  "text": "User: {{userId}}"
}
```

### Example: Multi-Step Data Flow

```json
{
  "steps": [
    {
      "stepId": "1",
      "action": "extractText",
      "enabled": true,
      "selector": ".product-name",
      "storeAs": "productName"
    },
    {
      "stepId": "2",
      "action": "extractText",
      "enabled": true,
      "selector": ".product-price",
      "storeAs": "productPrice"
    },
    {
      "stepId": "3",
      "action": "fill",
      "enabled": true,
      "selector": "#search",
      "text": "{{productName}}"
    },
    {
      "stepId": "4",
      "action": "screenshot",
      "enabled": true,
      "filename": "search-{{productName}}.png"
    }
  ]
}
```

---

## Common Patterns

### Login Flow
```json
[
  {"action": "navigate", "url": "https://app.com/login"},
  {"action": "fill", "selector": "#email", "text": "user@example.com"},
  {"action": "fill", "selector": "#password", "text": "password"},
  {"action": "click", "selector": "button[type='submit']"},
  {"action": "waitForSelector", "selector": ".dashboard"}
]
```

### Form Submission
```json
[
  {"action": "fill", "selector": "#name", "text": "John Doe"},
  {"action": "select", "selector": "#country", "value": "US"},
  {"action": "check", "selector": "#terms"},
  {"action": "click", "selector": "button.submit"},
  {"action": "waitForSelector", "selector": ".success"}
]
```

### Data Extraction
```json
[
  {"action": "navigate", "url": "https://site.com/products"},
  {"action": "extractText", "selector": ".product:first .name", "storeAs": "name"},
  {"action": "extractText", "selector": ".product:first .price", "storeAs": "price"},
  {"action": "extractAttribute", "selector": ".product:first img", "attribute": "src", "storeAs": "image"}
]
```

### Dynamic Interaction
```json
[
  {"action": "hover", "selector": ".menu"},
  {"action": "wait", "duration": 500},
  {"action": "click", "selector": ".menu .submenu-item"},
  {"action": "waitForNavigation"}
]
```

---

## Tips & Best Practices

1. **Always wait before interaction**: Use `waitForSelector` before clicking or filling
2. **Use specific selectors**: Prefer IDs and data attributes over classes
3. **Add descriptions**: Makes debugging easier
4. **Store important data**: Use `storeAs` for data you might need later
5. **Take screenshots**: Capture important states for verification
6. **Handle loading states**: Wait for spinners to disappear
7. **Use appropriate waits**: `wait` for animations, `waitForSelector` for elements
8. **Test incrementally**: Enable steps one at a time during development

---

For more information, see the main [README.md](README.md).

