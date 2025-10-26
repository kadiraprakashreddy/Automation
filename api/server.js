const express = require('express');
const cors = require('cors');
const fs = require('fs-extra');
const path = require('path');
const { spawn } = require('child_process');
const WebSocket = require('ws');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// WebSocket server for real-time updates
const wss = new WebSocket.Server({ port: 8081 });
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

// Routes
const rulesDir = path.join(__dirname, '..', 'rules');
const screenshotsDir = path.join(__dirname, '..', 'screenshots');
const logsDir = path.join(__dirname, '..', 'logs');

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

// Run a rule
app.post('/api/run/:fileName', (req, res) => {
  try {
    const { fileName } = req.params;
    const rulePath = path.join(rulesDir, fileName);
    
    // Check if rule file exists
    if (!fs.existsSync(rulePath)) {
      return res.status(404).json({ error: 'Rule file not found' });
    }
    
    // Spawn the Node.js automation process
    const projectRoot = path.join(__dirname, '..');
    const automationScript = path.join(projectRoot, 'src', 'index.js');
    
    console.log('Project root:', projectRoot);
    console.log('Automation script:', automationScript);
    console.log('Rule path:', rulePath);
    
    const automationProcess = spawn('node', [automationScript, rulePath], {
      cwd: projectRoot,
      stdio: ['pipe', 'pipe', 'pipe']
    });
    
    // Handle process output
    automationProcess.stdout.on('data', (data) => {
      const log = {
        type: 'info',
        message: data.toString().trim(),
        timestamp: new Date().toLocaleTimeString()
      };
      broadcast(log);
    });
    
    automationProcess.stderr.on('data', (data) => {
      const log = {
        type: 'error',
        message: data.toString().trim(),
        timestamp: new Date().toLocaleTimeString()
      };
      broadcast(log);
    });
    
    automationProcess.on('close', (code) => {
      const log = {
        type: code === 0 ? 'success' : 'error',
        message: `Process exited with code ${code}`,
        timestamp: new Date().toLocaleTimeString()
      };
      broadcast(log);
    });
    
    // Store process reference for stopping
    app.locals.automationProcess = automationProcess;
    
    res.json({ message: 'Automation started', pid: automationProcess.pid });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Stop automation
app.post('/api/stop', (req, res) => {
  try {
    if (app.locals.automationProcess) {
      app.locals.automationProcess.kill();
      app.locals.automationProcess = null;
      res.json({ message: 'Automation stopped' });
    } else {
      res.json({ message: 'No automation running' });
    }
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
  console.log(`🚀 API server running on port ${PORT}`);
  console.log(`📡 WebSocket server running on port 8081`);
  console.log(`📁 Rules directory: ${rulesDir}`);
});
