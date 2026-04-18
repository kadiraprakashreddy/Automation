'use strict';

const fs = require('fs-extra');
const path = require('path');

/** Repo root: api/services → .. → api → .. → project root */
const ROOT = path.resolve(process.env.PROJECT_ROOT || path.join(__dirname, '..', '..'));

const dirs = {
  rules: path.resolve(process.env.RULES_DIR || path.join(ROOT, 'rules')),
  screenshots: path.resolve(process.env.SCREENSHOTS_DIR || path.join(ROOT, 'screenshots')),
  logs: path.resolve(process.env.LOGS_DIR || path.join(ROOT, 'logs')),
};

async function ensureDirectories() {
  await Promise.all(Object.values(dirs).map((d) => fs.ensureDir(d)));
}

module.exports = { dirs, ensureDirectories, ROOT };
