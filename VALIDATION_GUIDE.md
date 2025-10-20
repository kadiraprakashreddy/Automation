# Validation Action Guide

The `validate` action allows you to verify elements, data, and states on the page during automation. If validation fails, you can choose to display notifications, stop execution, or continue.

## Basic Structure

```json
{
  "stepId": "10",
  "action": "validate",
  "enabled": true,
  "validationType": "textEquals",
  "selector": ".page-title",
  "expectedValue": "Dashboard",
  "onFailure": "visual",
  "failureMessage": "Page title is incorrect!",
  "continueOnFailure": false,
  "description": "Validate page title"
}
```

## Validation Types

### 1. **textEquals** - Exact text match
Validates that the element's text content exactly matches the expected value.

```json
{
  "stepId": "10",
  "action": "validate",
  "enabled": true,
  "validationType": "textEquals",
  "selector": ".welcome-message",
  "expectedValue": "Welcome, User!",
  "onFailure": "visual",
  "description": "Validate welcome message"
}
```

### 2. **textContains** - Partial text match
Validates that the element's text contains the expected value.

```json
{
  "stepId": "11",
  "action": "validate",
  "enabled": true,
  "validationType": "textContains",
  "selector": ".status",
  "expectedValue": "Success",
  "onFailure": "alert",
  "description": "Check if status contains 'Success'"
}
```

### 3. **attributeEquals** - Attribute value match
Validates that an element's attribute has a specific value.

```json
{
  "stepId": "12",
  "action": "validate",
  "enabled": true,
  "validationType": "attributeEquals",
  "selector": "#submit-button",
  "attribute": "disabled",
  "expectedValue": null,
  "onFailure": "visual",
  "failureMessage": "Submit button is still disabled!",
  "description": "Validate button is enabled"
}
```

### 4. **exists** - Element presence
Validates that an element exists in the DOM.

```json
{
  "stepId": "13",
  "action": "validate",
  "enabled": true,
  "validationType": "exists",
  "selector": ".success-icon",
  "onFailure": "visual",
  "description": "Validate success icon exists"
}
```

### 5. **notExists** - Element absence
Validates that an element does NOT exist in the DOM.

```json
{
  "stepId": "14",
  "action": "validate",
  "enabled": true,
  "validationType": "notExists",
  "selector": ".error-message",
  "onFailure": "alert",
  "description": "Validate no error messages"
}
```

### 6. **visible** - Element visibility
Validates that an element is visible on the page.

```json
{
  "stepId": "15",
  "action": "validate",
  "enabled": true,
  "validationType": "visible",
  "selector": "#modal-dialog",
  "onFailure": "visual",
  "description": "Validate modal is visible"
}
```

### 7. **count** - Element count
Validates the number of matching elements.

```json
{
  "stepId": "16",
  "action": "validate",
  "enabled": true,
  "validationType": "count",
  "selector": ".list-item",
  "expectedValue": "5",
  "onFailure": "visual",
  "failureMessage": "Expected 5 items in the list!",
  "description": "Validate list has 5 items"
}
```

## Notification Types (onFailure)

### 1. **console** (default)
Logs the validation failure to the console only.

```json
"onFailure": "console"
```

### 2. **alert**
Shows a browser alert popup with the error message.

```json
"onFailure": "alert"
```

### 3. **visual**
Displays a beautiful notification banner in the top-right corner of the page (recommended).

```json
"onFailure": "visual"
```

The visual notification:
- ✗ Red banner for failures
- ✓ Green banner for success
- Auto-dismisses after 5 seconds
- Animated slide-in/out effects

## Additional Options

### continueOnFailure
By default, validation failures stop the automation. Set this to `true` to continue even if validation fails.

```json
{
  "stepId": "17",
  "action": "validate",
  "enabled": true,
  "validationType": "textEquals",
  "selector": ".optional-field",
  "expectedValue": "Expected",
  "continueOnFailure": true,
  "description": "Optional validation - won't stop execution"
}
```

### failureMessage
Customize the error message shown when validation fails.

```json
{
  "stepId": "18",
  "action": "validate",
  "enabled": true,
  "validationType": "exists",
  "selector": ".payment-success",
  "failureMessage": "Payment confirmation not found! Transaction may have failed.",
  "onFailure": "visual",
  "description": "Validate payment success"
}
```

### storeAs
Store the validation result (true/false) for later use.

```json
{
  "stepId": "19",
  "action": "validate",
  "enabled": true,
  "validationType": "visible",
  "selector": ".premium-badge",
  "storeAs": "isPremiumUser",
  "continueOnFailure": true,
  "description": "Check if user is premium"
}
```

## Complete Example

Here's a complete workflow with multiple validations:

```json
{
  "name": "Login with Validation",
  "description": "Login and validate success",
  "steps": [
    {
      "stepId": "1",
      "action": "navigate",
      "enabled": true,
      "url": "https://example.com/login",
      "description": "Navigate to login page"
    },
    {
      "stepId": "2",
      "action": "validate",
      "enabled": true,
      "validationType": "textContains",
      "selector": "h1",
      "expectedValue": "Login",
      "onFailure": "visual",
      "description": "Validate we're on login page"
    },
    {
      "stepId": "3",
      "action": "fill",
      "enabled": true,
      "selector": "#username",
      "text": "testuser",
      "description": "Enter username"
    },
    {
      "stepId": "4",
      "action": "fill",
      "enabled": true,
      "selector": "#password",
      "text": "password123",
      "description": "Enter password"
    },
    {
      "stepId": "5",
      "action": "click",
      "enabled": true,
      "selector": "#login-button",
      "description": "Click login"
    },
    {
      "stepId": "6",
      "action": "wait",
      "enabled": true,
      "duration": 2000,
      "description": "Wait for login"
    },
    {
      "stepId": "7",
      "action": "validate",
      "enabled": true,
      "validationType": "notExists",
      "selector": ".error-message",
      "onFailure": "visual",
      "failureMessage": "Login failed! Error message is displayed.",
      "description": "Validate no error message"
    },
    {
      "stepId": "8",
      "action": "validate",
      "enabled": true,
      "validationType": "textContains",
      "selector": ".welcome",
      "expectedValue": "Welcome",
      "onFailure": "visual",
      "description": "Validate welcome message"
    },
    {
      "stepId": "9",
      "action": "validate",
      "enabled": true,
      "validationType": "exists",
      "selector": "#logout-button",
      "onFailure": "visual",
      "description": "Validate logout button exists"
    }
  ]
}
```

## Tips

1. **Use visual notifications** - They're non-intrusive and look professional
2. **Add validations after critical actions** - After login, form submission, navigation, etc.
3. **Use descriptive failureMessage** - Make it clear what went wrong
4. **Set continueOnFailure: true for optional checks** - Don't stop the entire flow for non-critical validations
5. **Combine with screenshots** - Take a screenshot after failed validation for debugging
6. **Use storeAs for conditional logic** - Store validation results to make decisions later

## Troubleshooting

**Validation timing out?**
- Add a `waitForSelector` step before validation
- Increase page load times with `wait` actions

**Element not found?**
- Verify the selector is correct
- Check if element is in an iframe
- Use browser DevTools to test the selector

**False negatives?**
- Check for extra whitespace with `textContains` instead of `textEquals`
- Verify the element is loaded before validation

