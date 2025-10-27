// Angular Environment Configuration - Development
// This file is generated from centralized environment configuration

export const environment = {
  production: false,
  environment: 'development',
  
  // Project Configuration
  projectName: 'Playwright Automation Engine',
  projectVersion: '1.0.0-dev',
  projectDescription: 'Create and manage automation rules with a visual interface',
  
  // API Configuration
  apiUrl: 'http://localhost:3000/api',
  wsUrl: 'ws://localhost:8081',
  
  // Feature Flags
  enableLogging: true,
  enableScreenshots: true,
  enableWebSocket: true,
  enableDebugMode: true,
  enablePerformanceMonitoring: true,
  enableErrorReporting: false,
  enableCrashReporting: false,
  enableAnalytics: false,
  enableUserTracking: false,
  enableExternalIntegrations: false,
  
  // UI Configuration
  defaultPageSize: 10,
  autoRefreshInterval: 5000,
  logMaxLines: 1000,
  maxConcurrentAutomations: 5,
  
  // Development Settings
  showConsoleLogs: true,
  enableHotReload: true,
  enableSourceMaps: true,
  
  // Timeouts (in milliseconds)
  apiTimeout: 30000,
  wsReconnectInterval: 5000,
  wsMaxReconnectAttempts: 5,
  fileUploadTimeout: 60000,
  
  // Error Handling
  logLevel: 'debug',
  
  // Security
  enableCors: true,
  allowedOrigins: [
  "http://localhost:4200",
  "http://localhost:3000"
],
  
  // Performance
  enableLazyLoading: true,
  enableTreeShaking: true,
  enableCompression: false,
  
  // External Services
  externalApiUrl: '',
  externalApiKey: '',
  
  // Build Information
  buildTimestamp: new Date().toISOString(),
  buildVersion: '1.0.0-dev',
  gitCommit: 'dev-build',
  
  // Debug Information
  debugInfo: {
    showEnvironment: true,
    showVersion: true,
    showBuildInfo: true,
    enableDevTools: true
  }
};