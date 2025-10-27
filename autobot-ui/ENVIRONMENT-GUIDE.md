# Angular Environment Configuration Guide

This guide explains how to configure and use different environments in the Angular application.

## 📁 Environment Files Structure

```
autobot-ui/src/environments/
├── environment.ts              # Development (default)
├── environment.staging.ts      # Staging
├── environment.prod.ts         # Production
├── environment.test.ts         # Testing
└── environment.example.ts      # Template
```

## 🚀 Environment Configurations

### **Development Environment** (`environment.ts`)
- **Purpose**: Local development with full debugging
- **API URL**: `http://localhost:3000/api`
- **WebSocket**: `ws://localhost:8081`
- **Features**: Debug mode, console logs, source maps, hot reload
- **Performance**: Optimized for development speed

### **Staging Environment** (`environment.staging.ts`)
- **Purpose**: Pre-production testing environment
- **API URL**: `https://staging-api.automation.com/api`
- **WebSocket**: `wss://staging-api.automation.com/ws`
- **Features**: Production-like with some debugging
- **Performance**: Balanced between development and production

### **Production Environment** (`environment.prod.ts`)
- **Purpose**: Live production environment
- **API URL**: `https://api.automation.com/api`
- **WebSocket**: `wss://api.automation.com/ws`
- **Features**: Optimized, no debugging, analytics enabled
- **Performance**: Fully optimized for production

### **Test Environment** (`environment.test.ts`)
- **Purpose**: Automated testing environment
- **API URL**: `http://localhost:3001/api`
- **WebSocket**: `ws://localhost:8082`
- **Features**: Fast execution, minimal logging
- **Performance**: Optimized for test speed

## 🔧 Configuration Properties

### **Core Settings**
```typescript
{
  production: boolean,           // Production mode flag
  environment: string,          // Environment name
  appName: string,             // Application name
  appVersion: string,          // Application version
  appDescription: string       // Application description
}
```

### **API Configuration**
```typescript
{
  apiUrl: string,              // API server URL
  wsUrl: string,               // WebSocket server URL
  apiTimeout: number,          // API request timeout (ms)
  fileUploadTimeout: number    // File upload timeout (ms)
}
```

### **Feature Flags**
```typescript
{
  enableLogging: boolean,           // Enable logging
  enableScreenshots: boolean,      // Enable screenshots
  enableWebSocket: boolean,        // Enable WebSocket
  enableDebugMode: boolean,        // Enable debug mode
  enablePerformanceMonitoring: boolean, // Enable performance monitoring
  enableErrorReporting: boolean,   // Enable error reporting
  enableCrashReporting: boolean,   // Enable crash reporting
  enableAnalytics: boolean,       // Enable analytics
  enableUserTracking: boolean     // Enable user tracking
}
```

### **UI Configuration**
```typescript
{
  defaultPageSize: number,        // Default pagination size
  autoRefreshInterval: number,     // Auto-refresh interval (ms)
  logMaxLines: number,            // Maximum log lines to display
  maxConcurrentAutomations: number // Max concurrent automations
}
```

### **Development Settings**
```typescript
{
  showConsoleLogs: boolean,       // Show console logs
  enableHotReload: boolean,       // Enable hot reload
  enableSourceMaps: boolean,      // Enable source maps
  logLevel: string               // Log level (debug, info, warn, error)
}
```

### **WebSocket Configuration**
```typescript
{
  wsReconnectInterval: number,    // Reconnect interval (ms)
  wsMaxReconnectAttempts: number  // Max reconnect attempts
}
```

### **Security Settings**
```typescript
{
  enableCors: boolean,            // Enable CORS
  allowedOrigins: string[]        // Allowed origins
}
```

### **Performance Settings**
```typescript
{
  enableLazyLoading: boolean,     // Enable lazy loading
  enableTreeShaking: boolean,     // Enable tree shaking
  enableCompression: boolean      // Enable compression
}
```

### **External Services**
```typescript
{
  enableExternalIntegrations: boolean, // Enable external integrations
  externalApiUrl: string,              // External API URL
  externalApiKey: string               // External API key
}
```

### **Build Information**
```typescript
{
  buildTimestamp: string,         // Build timestamp
  buildVersion: string,           // Build version
  gitCommit: string               // Git commit hash
}
```

### **Debug Information**
```typescript
{
  debugInfo: {
    showEnvironment: boolean,     // Show environment info
    showVersion: boolean,         // Show version info
    showBuildInfo: boolean,       // Show build info
    enableDevTools: boolean       // Enable dev tools
  }
}
```

## 🛠️ Usage Instructions

### **1. Development**
```bash
# Start development server
npm run start:dev
# or
ng serve --configuration development
```

### **2. Staging**
```bash
# Start staging server
npm run start:staging
# or
ng serve --configuration staging
```

### **3. Production**
```bash
# Build for production
npm run build:prod
# or
ng build --configuration production
```

### **4. Testing**
```bash
# Start test server
npm run start:test
# or
ng serve --configuration test
```

## 🔧 Building for Different Environments

### **Development Build**
```bash
npm run build:dev
ng build --configuration development
```

### **Staging Build**
```bash
npm run build:staging
ng build --configuration staging
```

### **Production Build**
```bash
npm run build:prod
ng build --configuration production
```

### **Test Build**
```bash
npm run build:test
ng build --configuration test
```

## 📱 Using Environment Service

### **Import and Inject**
```typescript
import { EnvironmentService } from './services/environment.service';

constructor(private envService: EnvironmentService) {}
```

### **Check Environment**
```typescript
// Check current environment
if (this.envService.isDevelopment()) {
  console.log('Running in development mode');
}

if (this.envService.isProduction()) {
  // Production-specific logic
}
```

### **Get Configuration**
```typescript
// Get API URL
const apiUrl = this.envService.getApiUrl();

// Get feature flags
const isLoggingEnabled = this.envService.isLoggingEnabled();

// Get all environment info
const envInfo = this.envService.getAllEnvironmentInfo();
```

### **Environment-Specific Logic**
```typescript
// Conditional rendering
if (this.envService.shouldShowConsoleLogs()) {
  console.log('Debug information');
}

// Feature toggles
if (this.envService.isAnalyticsEnabled()) {
  // Initialize analytics
}
```

## 🔄 Environment Switching

### **Runtime Environment Detection**
```typescript
// In component
ngOnInit() {
  const environment = this.envService.getEnvironment();
  console.log(`Running in ${environment} environment`);
  
  if (this.envService.isDebugModeEnabled()) {
    this.enableDebugFeatures();
  }
}
```

### **Service Configuration**
```typescript
// In service
constructor(private envService: EnvironmentService) {
  this.apiUrl = this.envService.getApiUrl();
  this.enableLogging = this.envService.isLoggingEnabled();
}
```

## 🚨 Environment-Specific Error Handling

### **Development**
- Full error details
- Stack traces
- Console logging
- Source maps

### **Staging**
- Limited error details
- No stack traces
- File logging
- Performance monitoring

### **Production**
- Minimal error details
- Error reporting
- Analytics tracking
- Performance monitoring

### **Testing**
- Full error details
- Test-specific logging
- Fast execution
- Minimal overhead

## 📊 Environment Monitoring

### **Health Checks**
```typescript
// Check environment health
const healthCheck = {
  environment: this.envService.getEnvironment(),
  apiUrl: this.envService.getApiUrl(),
  wsUrl: this.envService.getWebSocketUrl(),
  features: {
    logging: this.envService.isLoggingEnabled(),
    webSocket: this.envService.isWebSocketEnabled(),
    analytics: this.envService.isAnalyticsEnabled()
  }
};
```

### **Performance Monitoring**
```typescript
// Environment-specific performance settings
if (this.envService.isPerformanceMonitoringEnabled()) {
  // Initialize performance monitoring
  this.initializePerformanceMonitoring();
}
```

## 🔐 Security Considerations

### **API Keys**
- Never commit API keys to version control
- Use environment variables for sensitive data
- Different keys for different environments

### **CORS Configuration**
- Restrict allowed origins per environment
- Use HTTPS in production
- Validate origins in staging/production

### **Error Reporting**
- Enable error reporting in staging/production
- Disable detailed error info in production
- Use secure error reporting services

## 📝 Best Practices

### **1. Environment-Specific Configuration**
- Use different API URLs for each environment
- Configure different timeouts per environment
- Set appropriate log levels

### **2. Feature Flags**
- Use feature flags for environment-specific features
- Enable debugging only in development
- Disable unnecessary features in production

### **3. Performance Optimization**
- Enable compression in production
- Use lazy loading appropriately
- Optimize bundle sizes per environment

### **4. Security**
- Use HTTPS in production
- Restrict CORS origins
- Secure API keys and secrets

### **5. Monitoring**
- Enable analytics in production
- Use performance monitoring
- Track errors and crashes

## 🚀 Deployment

### **Development**
```bash
# Local development
npm run start:dev
```

### **Staging**
```bash
# Deploy to staging
npm run build:staging
# Deploy to staging server
```

### **Production**
```bash
# Deploy to production
npm run build:prod
# Deploy to production server
```

### **Testing**
```bash
# Run tests
npm run test:ci
# Deploy test environment
npm run build:test
```

## 🔧 Troubleshooting

### **Common Issues**

1. **Environment not loading**
   - Check file paths in angular.json
   - Verify environment file exists
   - Check build configuration

2. **API URL not updating**
   - Verify environment file is correct
   - Check build configuration
   - Restart development server

3. **Feature flags not working**
   - Check environment service injection
   - Verify feature flag values
   - Check component logic

4. **Build errors**
   - Check TypeScript compilation
   - Verify environment file syntax
   - Check import statements

### **Debug Environment**
```typescript
// Debug environment configuration
console.log('Environment:', this.envService.getAllEnvironmentInfo());
console.log('API URL:', this.envService.getApiUrl());
console.log('Features:', this.envService.getEnvironmentConfig());
```

## 📚 Additional Resources

- [Angular Environment Configuration](https://angular.io/guide/build#configure-environment-specific-defaults)
- [Angular CLI Build Configuration](https://angular.io/cli/build)
- [Environment Variables in Angular](https://angular.io/guide/build#configure-environment-specific-defaults)
- [Angular Service Injection](https://angular.io/guide/dependency-injection)
