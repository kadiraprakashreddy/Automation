// Angular Environment Configuration - Production
// This file is generated from centralized environment configuration

export const environment = {
  production: true,
  environment: 'production',
  
  // Project Configuration
  projectName: 'Playwright Automation Engine',
  projectVersion: '1.0.0',
  projectDescription: 'Create and manage automation rules with a visual interface',
  
  // API Configuration
  apiUrl: 'https://api.automation.com/api',
  wsUrl: 'wss://api.automation.com',
  
  // Feature Flags
  enableLogging: true,
  enableScreenshots: true,
  enableWebSocket: true,
  enableDebugMode: false,
  enablePerformanceMonitoring: true,
  enableErrorReporting: true,
  enableCrashReporting: true,
  enableAnalytics: true,
  enableUserTracking: true,
  enableExternalIntegrations: true,
  
  // UI Configuration
  defaultPageSize: 25,
  autoRefreshInterval: 15000,
  logMaxLines: 5000,
  maxConcurrentAutomations: 20,
  
  // Development Settings
  showConsoleLogs: false,
  enableHotReload: false,
  enableSourceMaps: false,
  
  // Timeouts (in milliseconds)
  apiTimeout: 60000,
  wsReconnectInterval: 15000,
  wsMaxReconnectAttempts: 5,
  fileUploadTimeout: 120000,
  
  // Error Handling
  logLevel: 'error',
  
  // Security
  enableCors: true,
  allowedOrigins: [
  "https://automation.com",
  "https://api.automation.com"
],
  
  // Performance
  enableLazyLoading: true,
  enableTreeShaking: true,
  enableCompression: true,
  
  // External Services
  externalApiUrl: 'https://external-api.com',
  externalApiKey: 'prod-api-key',
  
  // Build Information
  buildTimestamp: new Date().toISOString(),
  buildVersion: '1.0.0',
  gitCommit: 'prod-build',
  
  // Debug Information
  debugInfo: {
    showEnvironment: false,
    showVersion: false,
    showBuildInfo: false,
    enableDevTools: false
  }
};