# 🚀 Automation Rule Builder - Angular Frontend

A powerful Angular application for creating and managing browser automation rules with a visual interface.

## 📁 Project Structure

```
C:\Angular Apps\Node_Automation\
├── src/                          # Node.js automation engine
├── rules/                        # JSON rule files
├── frontend/                     # Angular application
│   ├── src/app/
│   │   ├── components/
│   │   │   ├── dashboard/        # Main dashboard
│   │   │   └── rule-builder/     # Rule creation interface
│   │   └── services/
│   │       └── automation.service.ts
│   └── package.json
├── api/                          # Express API server
│   ├── server.js
│   └── package.json
└── package.json                  # Root package.json
```

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm run install-all
```

### 2. Start Development Servers
```bash
# Start both API and Angular app
npm run dev

# Or start individually:
npm run api      # API server on port 3000
npm run frontend # Angular app on port 4200
```

### 3. Access the Application
- **Angular App**: http://localhost:4200
- **API Server**: http://localhost:3000
- **WebSocket**: ws://localhost:8080

## 🎯 Features

### 📊 Dashboard
- View all existing automation rules
- Run rules with real-time monitoring
- Manage rule files (edit, delete)
- View execution history and screenshots

### 🛠️ Rule Builder
- **Visual Interface**: Create rules step-by-step
- **Step Types**: Navigate, Click, Fill, Wait, Screenshot, Validate
- **Live Preview**: See generated JSON in real-time
- **Validation**: Built-in rule validation
- **Templates**: Pre-built step templates

### 🔧 Rule Management
- **Save/Load**: Persist rules as JSON files
- **Version Control**: Track rule versions
- **Import/Export**: Share rules between projects
- **Validation**: Ensure rule integrity

## 🎨 UI Components

### Dashboard Component
- Rule listing with metadata
- One-click rule execution
- Real-time log monitoring
- Screenshot gallery

### Rule Builder Component
- Form-based step creation
- Drag-and-drop step reordering
- Live JSON preview
- Step validation

## 🔌 API Integration

### Automation Service
```typescript
// Get all rules
getRules(): Observable<Rule[]>

// Save a new rule
saveRule(rule: Rule): Observable<any>

// Run a rule
runRule(fileName: string): Observable<any>

// Get real-time logs
getLogs(): Observable<LogEntry>
```

### API Endpoints
- `GET /api/rules` - List all rules
- `POST /api/rules` - Create new rule
- `PUT /api/rules/:fileName` - Update rule
- `DELETE /api/rules/:fileName` - Delete rule
- `POST /api/run/:fileName` - Execute rule
- `POST /api/stop` - Stop execution

## 🎯 Usage Examples

### Creating a Login Rule
1. Open Rule Builder
2. Set rule name: "User Login"
3. Add steps:
   - Navigate to login page
   - Fill username field
   - Fill password field
   - Click login button
   - Wait for redirect
   - Validate success message
4. Save rule
5. Run from dashboard

### Monitoring Execution
1. Click "Run" on any rule
2. Watch real-time logs
3. View generated screenshots
4. Check execution history

## 🛠️ Development

### Angular Development
```bash
cd frontend
npm install
npm start
```

### API Development
```bash
cd api
npm install
npm run dev
```

### Building for Production
```bash
npm run build
```

## 🔧 Configuration

### API Configuration
- Port: 3000 (configurable via PORT env var)
- WebSocket: 8080
- Rules directory: `../rules/`
- Screenshots: `../screenshots/`

### Angular Configuration
- Port: 4200
- API URL: `http://localhost:3000/api`
- WebSocket URL: `ws://localhost:8080`

## 📝 Rule JSON Structure

```json
{
  "name": "Rule Name",
  "description": "Rule description",
  "author": "Author Name",
  "version": "1.0.0",
  "steps": [
    {
      "stepId": "navigate-login",
      "action": "navigate",
      "url": "https://example.com/login"
    },
    {
      "stepId": "fill-username",
      "action": "fill",
      "selector": "#username",
      "text": "user@example.com"
    }
  ]
}
```

## 🚀 Next Steps

1. **Custom Actions**: Add more action types
2. **Templates**: Create rule templates
3. **Scheduling**: Add cron-based execution
4. **Reporting**: Generate execution reports
5. **Collaboration**: Multi-user rule sharing

## 🐛 Troubleshooting

### Common Issues
- **Port conflicts**: Change ports in configuration
- **CORS errors**: Ensure API server is running
- **WebSocket issues**: Check firewall settings
- **Rule validation**: Use built-in validator

### Debug Mode
```bash
# Enable debug logging
DEBUG=* npm run dev
```

## 📄 License

MIT License - see LICENSE file for details.
