'use strict';

const router = require('express').Router();
const fs = require('fs-extra');
const path = require('path');
const { dirs } = require('../services/storageService');
const {
  startProcess,
  stopProcess,
  stopAll,
  listRunning,
} = require('../services/processManager');

router.post('/run/:fileName', (req, res, next) => {
  try {
    const { fileName } = req.params;
    const rulePath = path.join(dirs.rules, fileName);
    const result = startProcess(fileName, rulePath);
    res.json({
      message: 'Automation started',
      pid: result.pid,
      runId: result.runId,
      fileName,
    });
  } catch (err) {
    next(err);
  }
});

router.post('/stop/:fileName', (req, res, next) => {
  try {
    const { fileName } = req.params;
    const stopped = stopProcess(fileName);
    res.json({
      message: stopped
        ? `Automation stopped for ${fileName}`
        : `No automation running for ${fileName}`,
    });
  } catch (err) {
    next(err);
  }
});

router.post('/stop-all', (req, res, next) => {
  try {
    const stoppedProcesses = stopAll();
    res.json({ message: 'All automations stopped', stoppedProcesses });
  } catch (err) {
    next(err);
  }
});

router.get('/running', (req, res, next) => {
  try {
    res.json(listRunning());
  } catch (err) {
    next(err);
  }
});

router.get('/screenshots/:ruleName', async (req, res, next) => {
  try {
    const { ruleName } = req.params;
    const files = await fs.readdir(dirs.screenshots);
    const ruleScreenshots = files.filter(
      (f) => f.includes(ruleName) && f.endsWith('.png')
    );
    res.json(ruleScreenshots);
  } catch (err) {
    next(err);
  }
});

router.get('/history/:ruleName', async (req, res, next) => {
  try {
    const { ruleName } = req.params;
    const logFiles = await fs.readdir(dirs.logs);
    const ruleLogs = logFiles.filter((f) => f.includes(ruleName) && f.endsWith('.log'));

    const history = await Promise.all(
      ruleLogs.map(async (logFile) => {
        const logPath = path.join(dirs.logs, logFile);
        const [stats, content] = await Promise.all([
          fs.stat(logPath),
          fs.readFile(logPath, 'utf8'),
        ]);
        return {
          fileName: logFile,
          timestamp: stats.mtime,
          content: content.split('\n').filter((l) => l.trim()),
        };
      })
    );

    res.json(history);
  } catch (err) {
    next(err);
  }
});

/** POST /api/validate — used by Angular AutomationService.validateRule */
router.post('/validate', (req, res) => {
  const rule = req.body;
  const errors = [];

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
    return res.status(400).json({ errors });
  }
  res.json({ message: 'Rule is valid' });
});

module.exports = router;
