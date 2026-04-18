'use strict';

const WebSocket = require('ws');

let wss = null;
const clients = new Set();

function initWebSocketServer(port) {
  wss = new WebSocket.Server({ port });

  wss.on('connection', (ws) => {
    clients.add(ws);
    console.log(`[WS] Client connected (total: ${clients.size})`);

    ws.on('close', () => {
      clients.delete(ws);
      console.log(`[WS] Client disconnected (total: ${clients.size})`);
    });

    ws.on('error', (err) => {
      console.error('[WS] Socket error:', err.message);
      clients.delete(ws);
    });
  });

  return wss;
}

function broadcast(data) {
  const payload = JSON.stringify(data);
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  });
}

module.exports = { initWebSocketServer, broadcast };
