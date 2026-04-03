#!/usr/bin/env node

/**
 * Script to validate a rule file against the schema
 * Usage: node scripts/validate-rule.js <rule-file>
 */

import fs from 'fs';
import path from 'path';

const ruleFilePath = process.argv[2];

if (!ruleFilePath) {
  console.error('Usage: node scripts/validate-rule.js <rule-file>');
  console.error('Example: node scripts/validate-rule.js rules/example-login.json');
  process.exit(1);
}

const absolutePath = path.isAbsolute(ruleFilePath) 
  ? ruleFilePath 
  : path.resolve(process.cwd(), ruleFilePath);

console.log('╔════════════════════════════════════════════════════════════════╗');
console.log('║              RULE FILE VALIDATION                             ║');
console.log('╚════════════════════════════════════════════════════════════════╝');
console.log('');
console.log(`Validating: ${path.basename(absolutePath)}`);
console.log('');

// Check if file exists
if (!fs.existsSync(absolutePath)) {
  console.error('✗ Error: File not found');
  process.exit(1);
}

// Read and parse JSON
let rules;
try {
  const fileContent = fs.readFileSync(absolutePath, 'utf-8');
  rules = JSON.parse(fileContent);
  console.log('✓ Valid JSON syntax');
} catch (error) {
  console.error('✗ Invalid JSON:', error.message);
  process.exit(1);
}

// Validate structure
const errors = [];
const warnings = [];

// Check required fields
if (!rules.name) {
  errors.push('Missing required field: "name"');
}

if (!rules.steps || !Array.isArray(rules.steps)) {
  errors.push('Missing or invalid "steps" array');
} else {
  console.log(`✓ Found ${rules.steps.length} step(s)`);
  
  // Validate each step
  const stepIds = new Set();
  rules.steps.forEach((step, index) => {
    const stepPrefix = `Step ${index + 1}`;
    
    if (!step.stepId) {
      errors.push(`${stepPrefix}: Missing "stepId"`);
    } else if (stepIds.has(step.stepId)) {
      errors.push(`${stepPrefix}: Duplicate stepId "${step.stepId}"`);
    } else {
      stepIds.add(step.stepId);
    }
    
    if (!step.action) {
      errors.push(`${stepPrefix}: Missing "action"`);
    } else {
      const validActions = [
        'navigate', 'click', 'type', 'fill', 'wait', 'waitForNavigation',
        'waitForSelector', 'extractText', 'extractAttribute', 'screenshot',
        'select', 'hover', 'check', 'uncheck', 'evaluate'
      ];
      if (!validActions.includes(step.action.toLowerCase())) {
        errors.push(`${stepPrefix}: Unknown action "${step.action}"`);
      }
    }
    
    if (step.enabled === undefined) {
      errors.push(`${stepPrefix}: Missing "enabled" flag`);
    }
    
    if (!step.description) {
      warnings.push(`${stepPrefix}: Missing "description" (recommended)`);
    }
    
    // Action-specific validation
    if (step.action) {
      const action = step.action.toLowerCase();
      
      if (action === 'navigate' && !step.url) {
        errors.push(`${stepPrefix}: "navigate" action requires "url"`);
      }
      
      if (['click', 'hover', 'check', 'uncheck', 'waitForSelector'].includes(action) && !step.selector) {
        errors.push(`${stepPrefix}: "${action}" action requires "selector"`);
      }
      
      if (['type', 'fill'].includes(action)) {
        if (!step.selector) errors.push(`${stepPrefix}: "${action}" action requires "selector"`);
        if (!step.text) errors.push(`${stepPrefix}: "${action}" action requires "text"`);
      }
      
      if (action === 'wait' && !step.duration) {
        errors.push(`${stepPrefix}: "wait" action requires "duration"`);
      }
      
      if (action === 'extractAttribute') {
        if (!step.selector) errors.push(`${stepPrefix}: "extractAttribute" requires "selector"`);
        if (!step.attribute) errors.push(`${stepPrefix}: "extractAttribute" requires "attribute"`);
      }
      
      if (action === 'screenshot' && !step.filename) {
        errors.push(`${stepPrefix}: "screenshot" action requires "filename"`);
      }
      
      if (action === 'select') {
        if (!step.selector) errors.push(`${stepPrefix}: "select" requires "selector"`);
        const hasVal = step.value != null && String(step.value).trim() !== '';
        const hasLab = step.label != null && String(step.label).trim() !== '';
        const hasIdx =
          step.index !== undefined &&
          step.index !== null &&
          step.index !== '' &&
          !(typeof step.index === 'number' && Number.isNaN(step.index));
        if (!hasVal && !hasLab && !hasIdx) {
          errors.push(`${stepPrefix}: "select" requires "value", "label", or "index"`);
        }
      }
      
      if (action === 'evaluate' && !step.script) {
        errors.push(`${stepPrefix}: "evaluate" action requires "script"`);
      }
    }
  });
}

// Print results
console.log('');
console.log('─'.repeat(68));

if (errors.length > 0) {
  console.log('ERRORS:');
  errors.forEach(error => console.log(`  ✗ ${error}`));
  console.log('');
}

if (warnings.length > 0) {
  console.log('WARNINGS:');
  warnings.forEach(warning => console.log(`  ⚠ ${warning}`));
  console.log('');
}

console.log('─'.repeat(68));

if (errors.length === 0) {
  console.log('✓ Validation passed');
  if (warnings.length > 0) {
    console.log(`  ${warnings.length} warning(s) - consider addressing them`);
  }
  console.log('');
  console.log('Rule file is ready to use!');
  process.exit(0);
} else {
  console.log(`✗ Validation failed with ${errors.length} error(s)`);
  console.log('');
  console.log('Please fix the errors before running this rule file.');
  process.exit(1);
}

