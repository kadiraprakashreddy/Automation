# Validation Action - Quick Reference

## Basic Template

```json
{
  "stepId": "X",
  "action": "validate",
  "enabled": true,
  "validationType": "TYPE_HERE",
  "selector": "CSS_SELECTOR",
  "expectedValue": "VALUE",
  "onFailure": "visual",
  "failureMessage": "Custom error message",
  "continueOnFailure": false,
  "description": "What you're validating"
}
```

## Validation Types

| Type | Purpose | Requires expectedValue | Example |
|------|---------|----------------------|---------|
| `textEquals` | Exact text match | Yes | `"expectedValue": "Dashboard"` |
| `textContains` | Partial text match | Yes | `"expectedValue": "Welcome"` |
| `attributeEquals` | Attribute value | Yes + attribute | `"attribute": "class"`, `"expectedValue": "active"` |
| `exists` | Element exists | No | - |
| `notExists` | Element doesn't exist | No | - |
| `visible` | Element is visible | No | - |
| `count` | Number of elements | Yes | `"expectedValue": "5"` |

## Notification Types

| Type | Description |
|------|-------------|
| `console` | Log only (default) |
| `alert` | Browser alert popup |
| `visual` | Animated notification banner ⭐ Recommended |

## Quick Examples

### Check if element exists
```json
{
  "action": "validate",
  "validationType": "exists",
  "selector": ".success-icon",
  "onFailure": "visual"
}
```

### Validate text content
```json
{
  "action": "validate",
  "validationType": "textContains",
  "selector": "h1",
  "expectedValue": "Dashboard",
  "onFailure": "visual"
}
```

### Count elements
```json
{
  "action": "validate",
  "validationType": "count",
  "selector": ".list-item",
  "expectedValue": "10",
  "onFailure": "visual"
}
```

### Optional validation (won't stop execution)
```json
{
  "action": "validate",
  "validationType": "visible",
  "selector": ".optional-element",
  "continueOnFailure": true,
  "onFailure": "visual"
}
```

---

📘 **Full documentation:** See `VALIDATION_GUIDE.md`  
🧪 **Example:** See `rules/example-validation.json`

