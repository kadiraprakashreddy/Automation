'use strict';

const router = require('express').Router();

router.get('/', (req, res, next) => {
  try {
    res.json({
      production: process.env.ENVIRONMENT === 'production',
      environment: process.env.ENVIRONMENT || 'development',
      apiUrl: process.env.API_BASE_URL || 'http://localhost:3000/api',
      wsUrl: process.env.WS_BASE_URL || 'ws://localhost:8081',
      logLevel: process.env.LOG_LEVEL || 'debug',
      enableDebugMode: process.env.ENABLE_DEBUG_MODE === 'true',
      showConsoleLogs: process.env.SHOW_CONSOLE_LOGS === 'true',
      enableSourceMaps: process.env.ENABLE_SOURCE_MAPS === 'true',
      enableHotReload: process.env.ENABLE_HOT_RELOAD === 'true',
      enableDevTools: process.env.ENABLE_DEV_TOOLS === 'true',
      defaultPageSize: parseInt(process.env.DEFAULT_PAGE_SIZE, 10) || 10,
      autoRefreshInterval: parseInt(process.env.AUTO_REFRESH_INTERVAL, 10) || 5000,
      logMaxLines: parseInt(process.env.LOG_MAX_LINES, 10) || 1000,
      maxConcurrentAutomations: parseInt(process.env.MAX_CONCURRENT_AUTOMATIONS, 10) || 5,
      apiTimeout: parseInt(process.env.API_TIMEOUT, 10) || 30000,
      wsReconnectInterval: parseInt(process.env.WS_RECONNECT_INTERVAL, 10) || 5000,
      wsMaxReconnectAttempts: parseInt(process.env.WS_MAX_RECONNECT_ATTEMPTS, 10) || 5,
      fileUploadTimeout: parseInt(process.env.FILE_UPLOAD_TIMEOUT, 10) || 60000,
      enableCompression: process.env.ENABLE_COMPRESSION === 'true',
      externalApiUrl: process.env.EXTERNAL_API_URL || '',
      externalApiKey: process.env.EXTERNAL_API_KEY || '',
      buildVersion: process.env.APP_VERSION || '1.0.0',
      gitCommit: process.env.GIT_COMMIT || 'unknown',
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
