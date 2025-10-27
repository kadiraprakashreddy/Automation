// Angular Environment Configuration - Staging
// This file is generated from centralized environment configuration

export const environment = {
  production: false,
  environment: 'staging',
  
  // Project Configuration
  projectName: 'Playwright Automation Engine',
  projectVersion: '1.0.0-staging',
  projectDescription: 'Create and manage automation rules with a visual interface',
  
  // API Configuration
  apiUrl: 'https://staging-api.automation.com/api',
  wsUrl: 'wss://staging-api.automation.com',
  
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
  defaultPageSize: 20,
  autoRefreshInterval: 10000,
  logMaxLines: 2000,
  maxConcurrentAutomations: 10,
  
  // Development Settings
  showConsoleLogs: false,
  enableHotReload: false,
  enableSourceMaps: false,
  
  // Timeouts (in milliseconds)
  apiTimeout: 45000,
  wsReconnectInterval: 10000,
  wsMaxReconnectAttempts: 3,
  fileUploadTimeout: 90000,
  
  // Error Handling
  logLevel: 'warn',
  
  // Security
  enableCors: true,
  allowedOrigins: [
  "https://staging.automation.com",
  "https://staging-api.automation.com"
],
  
  // Performance
  enableLazyLoading: true,
  enableTreeShaking: true,
  enableCompression: true,
  
  // External Services
  externalApiUrl: 'https://staging-external-api.com',
  externalApiKey: 'staging-api-key',
  
  // Build Information
  buildTimestamp: new Date().toISOString(),
  buildVersion: '1.0.0-staging',
  gitCommit: 'staging-build',
  
  // Debug Information
  debugInfo: {
    showEnvironment: false,
    showVersion: false,
    showBuildInfo: false,
    enableDevTools: false
  }
};