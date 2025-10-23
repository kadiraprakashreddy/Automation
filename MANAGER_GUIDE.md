# 🎯 Automation Configuration Guide for Managers & Product Owners

## 📋 Overview
This guide shows you how to configure automation workflows without technical knowledge.

## 🚀 Three Simple Approaches

### 1. **Natural Language** (Easiest)
```json
{
  "instructions": [
    "Navigate to the learning website",
    "Enter the username 'your-username'",
    "Enter the password 'your-password'",
    "Click the login button"
  ]
}
```

### 2. **Template-Based** (Recommended)
```json
{
  "template": "login-and-search",
  "config": {
    "website": "https://your-website.com",
    "login": {
      "username": "your-username",
      "password": "your-password"
    }
  }
}
```

### 3. **Step-by-Step** (Most Control)
```json
{
  "steps": [
    {
      "step": "Go to website",
      "action": "navigate",
      "url": "https://your-website.com"
    },
    {
      "step": "Enter username",
      "action": "fill",
      "value": "your-username"
    }
  ]
}
```

## 🛠️ Common Actions (No Technical Knowledge Required)

### **Navigation**
- `"Go to website"` - Navigate to a URL
- `"Wait for page to load"` - Wait for page to be ready

### **Login**
- `"Enter username"` - Fill username field
- `"Enter password"` - Fill password field  
- `"Click login button"` - Submit login form

### **Search & Navigation**
- `"Search for 'term'"` - Search for text
- `"Click on 'item'"` - Click on elements
- `"Wait for results"` - Wait for content to load

### **Validation**
- `"Check that 'text' appears"` - Verify text exists
- `"Count items"` - Verify number of elements
- `"Take screenshot"` - Capture current state

## 📝 Quick Start Examples

### **Simple Login**
```json
{
  "name": "User Login",
  "instructions": [
    "Go to https://example.com",
    "Enter username 'john@company.com'",
    "Enter password 'secure123'",
    "Click login button",
    "Wait for dashboard to load"
  ]
}
```

### **E-commerce Checkout**
```json
{
  "name": "Product Purchase",
  "template": "ecommerce-checkout",
  "config": {
    "product": "Laptop",
    "quantity": "2",
    "payment": "Credit Card"
  }
}
```

### **Form Submission**
```json
{
  "name": "Contact Form",
  "steps": [
    {
      "step": "Fill contact form",
      "fields": {
        "name": "John Doe",
        "email": "john@example.com",
        "message": "Hello, I need help with..."
      }
    },
    {
      "step": "Submit form",
      "action": "click submit button"
    }
  ]
}
```

## ⚙️ Settings You Can Change

### **Timing**
- `"wait": "2 seconds"` - Wait 2 seconds
- `"wait": "5 minutes"` - Wait 5 minutes
- `"wait": "page loads"` - Wait for page to finish loading

### **Screenshots**
- `"screenshots": true` - Take screenshots automatically
- `"filename": "my-screenshot.png"` - Custom screenshot name

### **Error Handling**
- `"continueOnError": true` - Keep running if something fails
- `"retry": 3` - Try failed steps 3 times

## 🎨 Visual Elements (No Selectors Needed)

Instead of technical selectors, use descriptive names:
- ❌ `"selector": "#Username"` 
- ✅ `"element": "username field"`

- ❌ `"selector": "button[type='submit']"`
- ✅ `"element": "login button"`

## 📊 Validation Made Simple

### **Check Text**
```json
{
  "step": "Verify welcome message",
  "action": "validate",
  "type": "textContains",
  "expected": "Welcome to Dashboard"
}
```

### **Count Items**
```json
{
  "step": "Check product count",
  "action": "validate", 
  "type": "count",
  "expected": "5"
}
```

### **Check if Element Exists**
```json
{
  "step": "Verify success message",
  "action": "validate",
  "type": "exists"
}
```

## 🔧 Advanced Features (Optional)

### **Data Storage**
```json
{
  "step": "Get current URL",
  "action": "evaluate",
  "storeAs": "currentUrl"
}
```

### **Conditional Logic**
```json
{
  "step": "If login fails",
  "condition": "error message appears",
  "then": "Take screenshot",
  "else": "Continue to dashboard"
}
```

### **Loops**
```json
{
  "step": "Fill multiple forms",
  "action": "repeat",
  "count": 5,
  "steps": [
    "Fill form",
    "Submit form",
    "Wait for next form"
  ]
}
```

## 🚨 Troubleshooting

### **Common Issues**
1. **"Element not found"** - Page might be loading slowly, increase wait time
2. **"Login failed"** - Check username/password are correct
3. **"Timeout error"** - Website might be slow, increase timeout values

### **Quick Fixes**
- Add more wait time: `"wait": "5 seconds"`
- Enable screenshots: `"screenshots": true`
- Continue on error: `"continueOnError": true`

## 📞 Support

For technical issues, contact your development team with:
1. The configuration file you're using
2. Any error messages
3. Screenshots of the issue

---

**Remember**: Start simple and add complexity as needed. The automation engine will handle the technical details for you! 🎉
