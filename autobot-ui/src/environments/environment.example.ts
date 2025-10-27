# Angular UI Environment Configuration
# Copy this file to src/environments/environment.ts and modify as needed

export const environment = {
  production: false,
  
  // API Configuration
  apiUrl: 'http://localhost:3000/api',
  wsUrl: 'ws://localhost:8081',
  
  // Application Settings
  appName: 'Playwright Automation Engine',
  appVersion: '1.0.0',
  
  // Feature Flags
  enableLogging: true,
  enableScreenshots: true,
  enableWebSocket: true,
  
  // UI Configuration
  defaultPageSize: 10,
  autoRefreshInterval: 5000,
  logMaxLines: 1000,
  
  // Development Settings
  enableDebugMode: true,
  showConsoleLogs: true,
  
  // Timeouts
  apiTimeout: 30000,
  wsReconnectInterval: 5000,
  wsMaxReconnectAttempts: 5
};
