const express = require('express');
const cors = require('cors');
const fs = require('fs-extra');
const path = require('path');
const { spawn } = require('child_process');
const WebSocket = require('ws');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const app = express();
const PORT = process.env.API_PORT || 3000;
const WEBSOCKET_PORT = process.env.WS_PORT || 8081;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// WebSocket server for real-time updates
const wss = new WebSocket.Server({ port: WEBSOCKET_PORT });
const clients = new Set();

wss.on('connection', (ws) => {
  clients.add(ws);
  console.log('Client connected');
  
  ws.on('close', () => {
    clients.delete(ws);
    console.log('Client disconnected');
  });
});

// Broadcast to all connected clients
function broadcast(data) {
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

function stripAnsi(str) {
  return String(str).replace(/\u001b\[[0-9;]*m/gi, '');
}

/**
 * Apply one stdout line: broadcast as log + update progress state when applicable.
 * @returns {boolean} true if progress counters changed
 */
function applyStdoutLineForProgress(trimmedLine, progressState) {
  if (!trimmedLine) return false;
  const clean = stripAnsi(trimmedLine);
  const marker = '[AUTOMATION_PROGRESS]';
  const idx = clean.indexOf(marker);
  if (idx !== -1) {
    let jsonPart = clean.slice(idx + marker.length).trim();
    const braceMatch = clean.match(/\[AUTOMATION_PROGRESS\]\s*(\{[\s\S]*\})\s*$/);
    if (braceMatch) {
      jsonPart = braceMatch[1];
    }
    try {
      const p = JSON.parse(jsonPart);
      if (typeof p.completed === 'number' && typeof p.total === 'number') {
        progressState.completedSteps = p.completed;
        progressState.currentStep = p.completed;
        progressState.totalSteps = p.total;
        return true;
      }
    } catch (e) {
      /* incomplete JSON until next chunk — line buffering fixes this */
    }
    return false;
  }
  let changed = false;
  if (/Executing Step .*:/.test(clean)) {
    progressState.currentStep = Math.min(progressState.completedSteps + 1, progressState.totalSteps || 1);
    changed = true;
  } else if (/Step .* completed successfully/.test(clean)) {
    progressState.completedSteps = Math.min(
      progressState.completedSteps + 1,
      progressState.totalSteps || progressState.completedSteps + 1
    );
    progressState.currentStep = Math.min(
      progressState.completedSteps + 1,
      progressState.totalSteps || progressState.completedSteps
    );
    changed = true;
  } else if (/Step .* failed:/.test(clean)) {
    progressState.completedSteps = Math.min(
      progressState.completedSteps + 1,
      progressState.totalSteps || progressState.completedSteps + 1
    );
    progressState.status = 'failed';
    changed = true;
  }
  return changed;
}

function broadcastProgress(processInfo) {
  if (!processInfo) return;
  const total = Number(processInfo.totalSteps || 0);
  const completed = Number(processInfo.completedSteps || 0);
  const current = Number(processInfo.currentStep || 0);
  const percent = total > 0 ? Math.max(0, Math.min(100, Math.round((completed / total) * 100))) : 0;
  broadcast({
    type: 'progress',
    timestamp: new Date().toLocaleTimeString(),
    runId: processInfo.runId,
    fileName: processInfo.fileName,
    currentStep: current,
    completedSteps: completed,
    totalSteps: total,
    percent,
    status: processInfo.status || 'running'
  });
}

// API endpoint to serve environment configuration
app.get('/api/config', (req, res) => {
  try {
    const config = {
      production: process.env.ENVIRONMENT === 'production',
      environment: process.env.ENVIRONMENT || 'development',
      apiUrl: `${process.env.API_BASE_URL || 'http://localhost:3000/api'}`,
      wsUrl: process.env.WS_BASE_URL || 'ws://localhost:8081',
      logLevel: process.env.LOG_LEVEL || 'debug',
      enableDebugMode: process.env.ENABLE_DEBUG_MODE === 'true',
      showConsoleLogs: process.env.SHOW_CONSOLE_LOGS === 'true',
      enableSourceMaps: process.env.ENABLE_SOURCE_MAPS === 'true',
      enableHotReload: process.env.ENABLE_HOT_RELOAD === 'true',
      enableDevTools: process.env.ENABLE_DEV_TOOLS === 'true',
      defaultPageSize: parseInt(process.env.DEFAULT_PAGE_SIZE) || 10,
      autoRefreshInterval: parseInt(process.env.AUTO_REFRESH_INTERVAL) || 5000,
      logMaxLines: parseInt(process.env.LOG_MAX_LINES) || 1000,
      maxConcurrentAutomations: parseInt(process.env.MAX_CONCURRENT_AUTOMATIONS) || 5,
      apiTimeout: parseInt(process.env.API_TIMEOUT) || 30000,
      wsReconnectInterval: parseInt(process.env.WS_RECONNECT_INTERVAL) || 5000,
      wsMaxReconnectAttempts: parseInt(process.env.WS_MAX_RECONNECT_ATTEMPTS) || 5,
      fileUploadTimeout: parseInt(process.env.FILE_UPLOAD_TIMEOUT) || 60000,
      enableCompression: process.env.ENABLE_COMPRESSION === 'true',
      externalApiUrl: process.env.EXTERNAL_API_URL || '',
      externalApiKey: process.env.EXTERNAL_API_KEY || '',
      buildVersion: process.env.APP_VERSION || '1.0.0',
      gitCommit: process.env.GIT_COMMIT || 'unknown'
    };
    
    res.json(config);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load configuration' });
  }
});

// Routes
const rulesDir = path.resolve(process.env.RULES_DIR || path.join(__dirname, '..', 'rules'));
const screenshotsDir = path.resolve(process.env.SCREENSHOTS_DIR || path.join(__dirname, '..', 'screenshots'));
const logsDir = path.resolve(process.env.LOGS_DIR || path.join(__dirname, '..', 'logs'));

// Ensure directories exist
fs.ensureDirSync(rulesDir);
fs.ensureDirSync(screenshotsDir);
fs.ensureDirSync(logsDir);

// Get all rules
app.get('/api/rules', async (req, res) => {
  try {
    const files = await fs.readdir(rulesDir);
    const rules = [];
    
    for (const file of files) {
      if (file.endsWith('.json')) {
        const filePath = path.join(rulesDir, file);
        const content = await fs.readFile(filePath, 'utf8');
        const rule = JSON.parse(content);
        rules.push({
          fileName: file,
          ...rule
        });
      }
    }
    
    res.json(rules);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Save a rule
app.post('/api/rules', async (req, res) => {
  try {
    const rule = req.body;
    const fileName = `${rule.name.toLowerCase().replace(/\s+/g, '-')}.json`;
    const filePath = path.join(rulesDir, fileName);
    
    await fs.writeFile(filePath, JSON.stringify(rule, null, 2));
    
    res.json({ message: 'Rule saved successfully', fileName });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a rule
app.put('/api/rules/:fileName', async (req, res) => {
  try {
    const { fileName } = req.params;
    const rule = req.body;
    const filePath = path.join(rulesDir, fileName);
    
    await fs.writeFile(filePath, JSON.stringify(rule, null, 2));
    
    res.json({ message: 'Rule updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a rule
app.delete('/api/rules/:fileName', async (req, res) => {
  try {
    const { fileName } = req.params;
    const filePath = path.join(rulesDir, fileName);
    
    await fs.remove(filePath);
    
    res.json({ message: 'Rule deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Store running processes
const runningProcesses = new Map();

// Run a rule
app.post('/api/run/:fileName', (req, res) => {
  try {
    const { fileName } = req.params;
    const rulePath = path.join(rulesDir, fileName);
    
    // Check if rule file exists
    if (!fs.existsSync(rulePath)) {
      return res.status(404).json({ error: 'Rule file not found' });
    }
    
    // Check if this rule is already running
    if (runningProcesses.has(fileName)) {
      return res.status(409).json({ error: 'Rule is already running' });
    }
    
    // Read rule to know total steps for progress reporting
    const ruleRaw = fs.readFileSync(rulePath, 'utf8');
    const ruleJson = JSON.parse(ruleRaw);
    const steps = Array.isArray(ruleJson.steps) ? ruleJson.steps : [];
    const totalSteps = steps.filter(step => step?.enabled !== false).length;

    // Spawn the Node.js automation process
    const projectRoot = path.resolve(process.env.PROJECT_ROOT || path.join(__dirname, '..'));
    const automationScript = path.resolve(process.env.AUTOMATION_SCRIPT || path.join(projectRoot, 'src', 'index.js'));
    
    console.log('Project root:', projectRoot);
    console.log('Automation script:', automationScript);
    console.log('Rule path:', rulePath);
    
    const automationProcess = spawn('node', [automationScript, rulePath], {
      cwd: projectRoot,
      stdio: ['pipe', 'pipe', 'pipe']
    });
    
    // Create unique run ID
    const runId = `${fileName}-${Date.now()}`;
    
    const progressState = {
      process: automationProcess,
      runId: runId,
      startTime: new Date(),
      fileName: fileName,
      totalSteps,
      currentStep: 0,
      completedSteps: 0,
      status: 'running'
    };

    // Buffer stdout so lines are not split across chunks (fixes [AUTOMATION_PROGRESS] JSON parse + WS progress)
    let stdoutLineBuffer = '';

    // Handle process output
    automationProcess.stdout.on('data', (data) => {
      stdoutLineBuffer += data.toString();
      const parts = stdoutLineBuffer.split(/\r?\n/);
      stdoutLineBuffer = parts.pop() ?? '';

      let progressChanged = false;
      for (const line of parts) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        const log = {
          type: 'info',
          message: trimmed,
          timestamp: new Date().toLocaleTimeString(),
          runId: runId,
          fileName: fileName
        };
        broadcast(log);

        if (applyStdoutLineForProgress(trimmed, progressState)) {
          progressChanged = true;
        }
      }
      if (progressChanged) {
        broadcastProgress(progressState);
      }
    });
    
    automationProcess.stderr.on('data', (data) => {
      const log = {
        type: 'error',
        message: data.toString().trim(),
        timestamp: new Date().toLocaleTimeString(),
        runId: runId,
        fileName: fileName
      };
      broadcast(log);
    });
    
    automationProcess.on('close', (code) => {
      if (stdoutLineBuffer.trim()) {
        const trimmed = stdoutLineBuffer.trim();
        stdoutLineBuffer = '';
        const log = {
          type: 'info',
          message: trimmed,
          timestamp: new Date().toLocaleTimeString(),
          runId: runId,
          fileName: fileName
        };
        broadcast(log);
        if (applyStdoutLineForProgress(trimmed, progressState)) {
          broadcastProgress(progressState);
        }
      }

      progressState.status = code === 0 ? 'success' : 'failed';
      progressState.currentStep = progressState.totalSteps;
      progressState.completedSteps = progressState.totalSteps;
      broadcastProgress(progressState);

      const log = {
        type: code === 0 ? 'success' : 'error',
        message: `Process exited with code ${code}`,
        timestamp: new Date().toLocaleTimeString(),
        runId: runId,
        fileName: fileName
      };
      broadcast(log);
      
      // Remove from running processes
      runningProcesses.delete(fileName);
    });
    
    // Store process reference
    runningProcesses.set(fileName, progressState);
    broadcastProgress(progressState);
    
    res.json({ 
      message: 'Automation started', 
      pid: automationProcess.pid,
      runId: runId,
      fileName: fileName
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Stop automation
app.post('/api/stop/:fileName', (req, res) => {
  try {
    const { fileName } = req.params;
    const processInfo = runningProcesses.get(fileName);
    
    if (processInfo) {
      processInfo.process.kill();
      runningProcesses.delete(fileName);
      res.json({ message: `Automation stopped for ${fileName}` });
    } else {
      res.json({ message: `No automation running for ${fileName}` });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Stop all automations
app.post('/api/stop-all', (req, res) => {
  try {
    const stoppedProcesses = [];
    
    for (const [fileName, processInfo] of runningProcesses) {
      processInfo.process.kill();
      stoppedProcesses.push(fileName);
    }
    
    runningProcesses.clear();
    res.json({ 
      message: 'All automations stopped', 
      stoppedProcesses: stoppedProcesses 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get running processes
app.get('/api/running', (req, res) => {
  try {
    const running = [];
    for (const [fileName, processInfo] of runningProcesses) {
      running.push({
        fileName: fileName,
        runId: processInfo.runId,
        startTime: processInfo.startTime,
        pid: processInfo.process.pid,
        totalSteps: processInfo.totalSteps || 0,
        currentStep: processInfo.currentStep || 0,
        completedSteps: processInfo.completedSteps || 0,
        percent:
          processInfo.totalSteps > 0
            ? Math.max(0, Math.min(100, Math.round(((processInfo.completedSteps || 0) / processInfo.totalSteps) * 100)))
            : 0,
        status: processInfo.status || 'running'
      });
    }
    res.json(running);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get screenshots
app.get('/api/screenshots/:ruleName', async (req, res) => {
  try {
    const { ruleName } = req.params;
    const screenshots = await fs.readdir(screenshotsDir);
    const ruleScreenshots = screenshots.filter(file => 
      file.includes(ruleName) && file.endsWith('.png')
    );
    
    res.json(ruleScreenshots);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get execution history
app.get('/api/history/:ruleName', async (req, res) => {
  try {
    const { ruleName } = req.params;
    const logFiles = await fs.readdir(logsDir);
    const ruleLogs = logFiles.filter(file => 
      file.includes(ruleName) && file.endsWith('.log')
    );
    
    const history = [];
    for (const logFile of ruleLogs) {
      const logPath = path.join(logsDir, logFile);
      const stats = await fs.stat(logPath);
      const content = await fs.readFile(logPath, 'utf8');
      
      history.push({
        fileName: logFile,
        timestamp: stats.mtime,
        content: content.split('\n').filter(line => line.trim())
      });
    }
    
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Validate rule
app.post('/api/validate', (req, res) => {
  try {
    const rule = req.body;
    const errors = [];
    
    // Basic validation
    if (!rule.name) errors.push('Rule name is required');
    if (!rule.steps || !Array.isArray(rule.steps)) {
      errors.push('Steps array is required');
    } else {
      rule.steps.forEach((step, index) => {
        if (!step.stepId) errors.push(`Step ${index + 1}: stepId is required`);
        if (!step.action) errors.push(`Step ${index + 1}: action is required`);
      });
    }
    
    if (errors.length > 0) {
      res.status(400).json({ errors });
    } else {
      res.json({ message: 'Rule is valid' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get action templates
app.get('/api/templates/actions', (req, res) => {
  const templates = [
    {
      action: 'navigate',
      properties: ['url', 'waitUntil'],
      description: 'Navigate to a URL'
    },
    {
      action: 'click',
      properties: ['selector'],
      description: 'Click an element'
    },
    {
      action: 'fill',
      properties: ['selector', 'text'],
      description: 'Fill text in an input field'
    },
    {
      action: 'wait',
      properties: ['duration'],
      description: 'Wait for a specified duration'
    },
    {
      action: 'screenshot',
      properties: ['fullPage'],
      description: 'Take a screenshot'
    },
    {
      action: 'validate',
      properties: ['validationType', 'selector', 'expectedValue', 'script'],
      description: 'Validate element state or content'
    }
  ];
  
  res.json(templates);
});

// Get common selectors
app.get('/api/templates/selectors', (req, res) => {
  const selectors = [
    { type: 'ID', example: '#username', description: 'Element with ID' },
    { type: 'Class', example: '.btn-primary', description: 'Element with class' },
    { type: 'Attribute', example: '[data-cy="submit-button"]', description: 'Element with data attribute' },
    { type: 'Text', example: 'button:has-text("Login")', description: 'Element containing text' },
    { type: 'CSS', example: 'div.container > input[type="email"]', description: 'CSS selector' }
  ];
  
  res.json(selectors);
});

// Start server
app.listen(PORT, () => {
  console.log(`🌍 Environment: ${process.env.ENVIRONMENT || 'development'}`);
  console.log(`🚀 API server running on port ${PORT}`);
  console.log(`📡 WebSocket server running on port ${WEBSOCKET_PORT}`);
  console.log(`📁 Rules directory: ${rulesDir}`);
  console.log(`📁 Screenshots directory: ${screenshotsDir}`);
  console.log(`📁 Logs directory: ${logsDir}`);
});
