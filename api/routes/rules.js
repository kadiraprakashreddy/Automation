'use strict';

const router = require('express').Router();
const fs = require('fs-extra');
const path = require('path');
const { dirs } = require('../services/storageService');

router.get('/', async (req, res, next) => {
  try {
    const files = await fs.readdir(dirs.rules);
    const rules = await Promise.all(
      files
        .filter((f) => f.endsWith('.json'))
        .map(async (fileName) => {
          const content = await fs.readFile(path.join(dirs.rules, fileName), 'utf8');
          return { fileName, ...JSON.parse(content) };
        })
    );
    res.json(rules);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const rule = req.body;
    const fileName = `${rule.name.toLowerCase().replace(/\s+/g, '-')}.json`;
    await fs.writeFile(path.join(dirs.rules, fileName), JSON.stringify(rule, null, 2));
    res.json({ message: 'Rule saved successfully', fileName });
  } catch (err) {
    next(err);
  }
});

router.put('/:fileName', async (req, res, next) => {
  try {
    const { fileName } = req.params;
    await fs.writeFile(path.join(dirs.rules, fileName), JSON.stringify(req.body, null, 2));
    res.json({ message: 'Rule updated successfully' });
  } catch (err) {
    next(err);
  }
});

router.delete('/:fileName', async (req, res, next) => {
  try {
    const { fileName } = req.params;
    await fs.remove(path.join(dirs.rules, fileName));
    res.json({ message: 'Rule deleted successfully' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
