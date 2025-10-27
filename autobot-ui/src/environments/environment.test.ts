// Angular Environment Configuration - Test
// This file is generated from centralized environment configuration

export const environment = {
  production: false,
  environment: 'test',
  
  // Project Configuration
  projectName: 'Playwright Automation Engine',
  projectVersion: '1.0.0-test',
  projectDescription: 'Create and manage automation rules with a visual interface',
  
  // API Configuration
  apiUrl: 'http://localhost:3001/api',
  wsUrl: 'ws://localhost:8082',
  
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
  defaultPageSize: 5,
  autoRefreshInterval: 2000,
  logMaxLines: 500,
  maxConcurrentAutomations: 2,
  
  // Development Settings
  showConsoleLogs: true,
  enableHotReload: true,
  enableSourceMaps: true,
  
  // Timeouts (in milliseconds)
  apiTimeout: 15000,
  wsReconnectInterval: 3000,
  wsMaxReconnectAttempts: 2,
  fileUploadTimeout: 30000,
  
  // Error Handling
  logLevel: 'debug',
  
  // Security
  enableCors: true,
  allowedOrigins: [
  "http://localhost:4201",
  "http://localhost:3001"
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
  buildVersion: '1.0.0-test',
  gitCommit: 'test-build',
  
  // Debug Information
  debugInfo: {
    showEnvironment: true,
    showVersion: true,
    showBuildInfo: true,
    enableDevTools: true
  }
};