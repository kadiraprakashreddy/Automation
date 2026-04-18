'use strict';

const router = require('express').Router();

router.get('/actions', (req, res) => {
  res.json([
    {
      action: 'navigate',
      properties: ['url', 'waitUntil'],
      description: 'Navigate to a URL',
    },
    {
      action: 'click',
      properties: ['selector'],
      description: 'Click an element',
    },
    {
      action: 'fill',
      properties: ['selector', 'text'],
      description: 'Fill text in an input field',
    },
    {
      action: 'wait',
      properties: ['duration'],
      description: 'Wait for a specified duration',
    },
    {
      action: 'screenshot',
      properties: ['fullPage'],
      description: 'Take a screenshot',
    },
    {
      action: 'validate',
      properties: ['validationType', 'selector', 'expectedValue', 'script'],
      description: 'Validate element state or content',
    },
  ]);
});

router.get('/selectors', (req, res) => {
  res.json([
    { type: 'ID', example: '#username', description: 'Element with ID' },
    { type: 'Class', example: '.btn-primary', description: 'Element with class' },
    {
      type: 'Attribute',
      example: '[data-cy="submit-button"]',
      description: 'Element with data attribute',
    },
    {
      type: 'Text',
      example: 'button:has-text("Login")',
      description: 'Element containing text',
    },
    {
      type: 'CSS',
      example: 'div.container > input[type="email"]',
      description: 'CSS selector',
    },
  ]);
});

module.exports = router;
