'use strict';

const app = require('./app');
const { initWebSocketServer } = require('./services/websocketService');
const { ensureDirectories, dirs } = require('./services/storageService');

const PORT = parseInt(process.env.API_PORT, 10) || 3000;
const WS_PORT = parseInt(process.env.WS_PORT, 10) || 8081;

async function start() {
  try {
    await ensureDirectories();

    initWebSocketServer(WS_PORT);

    app.listen(PORT, () => {
      console.log(`Environment: ${process.env.ENVIRONMENT || 'development'}`);
      console.log(`API server running on http://localhost:${PORT}`);
      console.log(`WebSocket server running on ws://localhost:${WS_PORT}`);
      console.log(`Rules directory: ${dirs.rules}`);
      console.log(`Screenshots directory: ${dirs.screenshots}`);
      console.log(`Logs directory: ${dirs.logs}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();
