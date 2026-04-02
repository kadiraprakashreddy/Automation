# Automation rules: targets, waits, and timing

This document describes how the Playwright rule engine resolves **what to click or fill**, how it **waits for pages and network**, and how **fixed delays** interact with **load-based waits**. It reflects the implementation in `src/actions/actionHandler.js`, `src/engine/ruleEngine.js`, and the Rule Builder UI.

---

## 1. Rule file shape

A rule is a JSON object with at least:

| Field | Required | Description |
|--------|----------|-------------|
| `name` | Yes | Rule name |
| `steps` | Yes | Array of step objects |

Common optional fields:

| Field | Description |
|--------|-------------|
| `description`, `author`, `project`, `browser` | Metadata |
| `continueOnError` | If `true`, continue after a failed step (when the step does not stop the run) |
| `networkActivity` | If `true`, enables network monitoring in the engine |
| **`delayBetweenSteps`** | Number (ms). After **each** step, pause this long unless overridden (see §5). |
| **`afterEachStepWaitForLoadState`** | One of `none`, `load`, `domcontentloaded`, `networkidle`. After each step, call Playwright `waitForLoadState` (see §4). |

Each **step** must include `stepId` and `action`. Optional: `enabled` (defaults to `true`), `continueOnError`, `timeout`, `delayAfter`, `afterStepWaitForLoadState`.

---

## 2. Target modes (`selectorMode`)

For actions that locate elements (**click**, **fill**, **validate**, etc.), the step uses:

- **`selector`** — Meaning depends on mode (see below).
- **`selectorMode`** — How `selector` is interpreted.

Supported modes (normalized in code; UI may show different labels):

| Mode | `selector` value | Behavior |
|------|------------------|----------|
| **`id`** | The element’s `id` without `#` | Resolves to a CSS selector that matches that id exactly (handles special characters safely). |
| **`testId`** | The `data-testid` attribute value | Uses `page.getByTestId(...)`. |
| **`html`** | A pasted snippet starting with `<tag ...>` | Parses the **opening tag** and matches elements by a **subset of attributes** (tag name + listed attributes). Good when you paste from DevTools. Empty `on*` handler values may be ignored so empty `onclick=""` does not block matching. |
| **`css`** | A CSS selector string | Passed through selector resolution / conversion where applicable. |
| **`auto`** | Legacy / mixed | If the string looks like HTML, attribute-style matching may be used; otherwise CSS-style resolution. |

**Practical notes**

- Prefer **stable** targets: `data-testid`, then `id`, then CSS, then Html paste for one-off cases.
- **Html** mode is **stricter** than a single CSS selector: attributes on the real DOM must match what you pasted (e.g. `type`, `value`).
- For multiple classes, CSS example: `.btn.btn-primary.btn-block` (not the raw `class="..."` attribute alone unless you use Html paste with matching attributes).

---

## 3. Navigate action

| Property | Description |
|----------|-------------|
| `url` | Absolute URL to open |
| **`waitUntil`** | Playwright `page.goto` option. Common values: `domcontentloaded` (default in engine if omitted), `load`, `networkidle`. |

**When to use stronger `waitUntil`**

- **`load`** — Wait for the load event (more than DOM ready).
- **`networkidle`** — Wait until the network is quiet (useful for heavy first loads; can be flaky on sites with long-polling or WebSockets).

The engine logs the effective `waitUntil` for debugging.

---

## 4. Click action and load awareness

Click steps support optional **navigation** and **post-click load** waits. Implementation: `runClickWithLoadWaits` in `actionHandler.js`.

### 4.1 `waitForNavigation` (full page navigation)

| Property | Type | Description |
|----------|------|-------------|
| **`waitForNavigation`** | boolean | If `true`, the engine runs **`Promise.all([ page.waitForNavigation(...), click ])`** so the step completes when the **next navigation** finishes. |
| **`navigationWaitUntil`** | string | Passed to `waitForNavigation`. Default **`load`**. Other common values: `domcontentloaded`, `networkidle`. |
| **`navigationTimeout`** | number (ms) | Optional; caps navigation wait (falls back to navigation timeout from config). |

**Use when:** submitting a form, clicking a link that loads a **new document**, or any click that triggers a **full navigation**.

**Avoid when:** the app is an **SPA** and the URL does not change with a real navigation — `waitForNavigation` may **time out**. Prefer **`waitAfterClick`** instead.

### 4.2 `waitAfterClick` (load state after click)

| Property | Description |
|----------|-------------|
| **`waitAfterClick`** | After the click (and after `waitForNavigation` if used), runs `page.waitForLoadState(...)`. UI/JSON often use `none` to disable. |

Allowed values (when not `none`): `load`, `domcontentloaded`, `networkidle`.

**Use when:** you need the page to reach a given load state after the click, including many **SPA** flows where there is no classic navigation.

### 4.3 Order of operations

1. Perform highlight (if enabled) and click.
2. If **`waitForNavigation`** is true → race navigation wait with click.
3. If **`waitAfterClick`** is set and not `none` → `waitForLoadState`.

---

## 5. Between-step timing (rule engine)

After **each** executed step, the engine may:

1. Wait for a **load state** (optional).
2. Wait for a **fixed delay** (optional).

### 5.1 `afterEachStepWaitForLoadState` (rule) and `afterStepWaitForLoadState` (step)

| Scope | Property | Description |
|-------|----------|-------------|
| Rule | `afterEachStepWaitForLoadState` | If set to `load`, `domcontentloaded`, or `networkidle` (not `none`), runs `page.waitForLoadState` after every step. |
| Step | `afterStepWaitForLoadState` | If set, overrides the rule-level value for **after that step**. |

Timeout uses the engine’s **navigation** timeout from config.

**Note:** This waits for **document / network idle style** signals. It does **not** guarantee that a specific React/Vue component has mounted; for that, use **`waitForSelector`** or a **validate** step on a stable selector.

### 5.2 Fixed delays: `delayAfter`, `delayBetweenSteps`, `STEP_DELAY`

| Source | Precedence | Description |
|--------|------------|-------------|
| **`step.delayAfter`** | Highest | Milliseconds to wait after **this** step only. |
| **`rules.delayBetweenSteps`** | Next | Rule-level ms after each step (Rule Builder: “Delay between steps”). |
| **`STEP_DELAY` in `.env`** | Default | Machine-wide default ms when the rule does not set `delayBetweenSteps`. Default **0** if unset. |

If the resolved value is `> 0`, the engine calls `page.waitForTimeout(ms)`.

**Precedence summary:** per-step `delayAfter` → rule `delayBetweenSteps` → env `STEP_DELAY`.

---

## 6. Other wait-related actions

| Action | Purpose |
|--------|---------|
| **`wait`** | Sleep for `duration` ms (fixed pause). |
| **`waitForNavigation`** | Waits for load state (implementation uses `waitForLoadState`; see `actionHandler.js`). |
| **`waitForSelector`** | Waits until a CSS selector matches (`state` e.g. `visible`). Best “wait until **this** element exists”. |

Prefer **`waitForSelector`** (or validate/fill on a locator that auto-waits) over long sleeps when the condition is “element X is ready”.

---

## 7. Environment variable reference

| Variable | Role |
|----------|------|
| **`STEP_DELAY`** | Default milliseconds between steps when the rule does not set `delayBetweenSteps`. Integer; unset → **0**. |

Other timeouts (e.g. `DEFAULT_TIMEOUT`, `NAVIGATION_TIMEOUT`) are defined in `src/utils/environmentLoader.js` / `config.js` and apply to Playwright operations globally unless a step sets `timeout`.

---

## 8. Rule Builder UI mapping

| UI label | JSON field |
|----------|------------|
| Delay between steps (ms) | `delayBetweenSteps` |
| Wait for load between steps | `afterEachStepWaitForLoadState` |
| Navigate → Wait until | `waitUntil` |
| Click → Wait for full page navigation | `waitForNavigation` |
| Click → Navigation until | `navigationWaitUntil` |
| Click → After click | `waitAfterClick` |

Advanced fields (e.g. `delayAfter`, `afterStepWaitForLoadState`, `navigationTimeout`) can be set in JSON if not exposed in the UI.

---

## 9. Recommended practices

1. **Prefer readiness over sleep**  
   Use `waitForNavigation` / `waitAfterClick` / `waitUntil` / `afterEachStepWaitForLoadState` / `waitForSelector` before adding large **`wait`** steps.

2. **Full page vs SPA**  
   - Full navigation → **`waitForNavigation`** on the click.  
   - SPA, same URL → **`waitAfterClick`** (`load` or `networkidle`) or **`waitForSelector`** on the next screen.

3. **`networkidle`**  
   Powerful for “APIs finished,” but may **never** settle on sites with sockets or polling. If it times out, try `load` or a **selector** wait.

4. **Office / slow networks**  
   Set **`STEP_DELAY`** or **`delayBetweenSteps`** only as a small safety margin, or use **`waitForSelector`** for the specific control that appears late.

5. **Html paste**  
   Match the **real** DOM (including `type`, `value`, etc.). If the app changes attributes, update the paste or switch to **CSS** / **id** / **testId**.

---

## 10. Example (abbreviated JSON)

```json
{
  "name": "Login then next page",
  "delayBetweenSteps": 0,
  "afterEachStepWaitForLoadState": "none",
  "steps": [
    {
      "stepId": "1",
      "action": "navigate",
      "url": "https://example.com/login",
      "waitUntil": "domcontentloaded"
    },
    {
      "stepId": "2",
      "action": "fill",
      "selector": "username",
      "selectorMode": "id",
      "text": "user"
    },
    {
      "stepId": "3",
      "action": "click",
      "selector": "button[type=\"submit\"]",
      "selectorMode": "css",
      "waitForNavigation": true,
      "navigationWaitUntil": "load"
    },
    {
      "stepId": "4",
      "action": "click",
      "selector": "#next-action",
      "selectorMode": "css",
      "waitAfterClick": "networkidle"
    }
  ]
}
```

---

## 11. Source files

| Area | File |
|------|------|
| Step execution loop, between-step waits | `src/engine/ruleEngine.js` |
| Click/fill/navigate, `runClickWithLoadWaits` | `src/actions/actionHandler.js` |
| `STEP_DELAY` default | `src/utils/environmentLoader.js` |
| Aggregated config | `src/utils/config.js` |
| Rule Builder | `autobot-ui/src/app/components/rule-builder/` |

---

*Last updated to match the rule engine implementation in this repository.*
