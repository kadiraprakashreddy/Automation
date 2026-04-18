'use strict';

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs-extra');
const { broadcast } = require('./websocketService');
const { ROOT } = require('./storageService');

const runningProcesses = new Map();

const AUTOMATION_SCRIPT = path.resolve(
  process.env.AUTOMATION_SCRIPT || path.join(ROOT, 'src', 'index.js')
);

function startProcess(fileName, rulePath) {
  if (runningProcesses.has(fileName)) {
    const err = new Error('Rule is already running');
    err.statusCode = 409;
    throw err;
  }

  if (!fs.existsSync(rulePath)) {
    const err = new Error('Rule file not found');
    err.statusCode = 404;
    throw err;
  }

  const runId = `${fileName}-${Date.now()}`;
  const child = spawn('node', [AUTOMATION_SCRIPT, rulePath], {
    cwd: ROOT,
    stdio: ['pipe', 'pipe', 'pipe'],
  });

  const buildLog = (type, message) => ({
    type,
    message,
    timestamp: new Date().toLocaleTimeString(),
    runId,
    fileName,
  });

  child.stdout.on('data', (data) => {
    broadcast(buildLog('info', data.toString().trim()));
  });

  child.stderr.on('data', (data) => {
    broadcast(buildLog('error', data.toString().trim()));
  });

  child.on('close', (code) => {
    broadcast(
      buildLog(code === 0 ? 'success' : 'error', `Process exited with code ${code}`)
    );
    runningProcesses.delete(fileName);
  });

  child.on('error', (err) => {
    broadcast(buildLog('error', `Spawn error: ${err.message}`));
    runningProcesses.delete(fileName);
  });

  runningProcesses.set(fileName, {
    process: child,
    runId,
    startTime: new Date(),
    pid: child.pid,
  });

  return { runId, pid: child.pid };
}

function stopProcess(fileName) {
  const info = runningProcesses.get(fileName);
  if (!info) return false;
  info.process.kill();
  runningProcesses.delete(fileName);
  return true;
}

function stopAll() {
  const stopped = [];
  for (const [fileName, info] of runningProcesses) {
    info.process.kill();
    stopped.push(fileName);
  }
  runningProcesses.clear();
  return stopped;
}

function listRunning() {
  return Array.from(runningProcesses.entries()).map(([fileName, info]) => ({
    fileName,
    runId: info.runId,
    startTime: info.startTime,
    pid: info.pid,
  }));
}

module.exports = { startProcess, stopProcess, stopAll, listRunning };
