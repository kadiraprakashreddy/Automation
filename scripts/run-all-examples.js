#!/usr/bin/env node

/**
 * Script to run all example rule files
 * Useful for testing and demonstration
 */

import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rulesDir = path.join(__dirname, '../rules');
const mainScript = path.join(__dirname, '../src/index.js');

// Get all JSON files in rules directory
const ruleFiles = fs.readdirSync(rulesDir)
  .filter(file => file.endsWith('.json') && file !== 'schema.json')
  .map(file => path.join(rulesDir, file));

console.log('╔════════════════════════════════════════════════════════════════╗');
console.log('║           RUNNING ALL EXAMPLE AUTOMATION RULES                ║');
console.log('╚════════════════════════════════════════════════════════════════╝');
console.log('');
console.log(`Found ${ruleFiles.length} rule file(s):`);
ruleFiles.forEach((file, index) => {
  console.log(`  ${index + 1}. ${path.basename(file)}`);
});
console.log('');

let currentIndex = 0;
let successCount = 0;
let failureCount = 0;

function runNextRule() {
  if (currentIndex >= ruleFiles.length) {
    console.log('');
    console.log('═'.repeat(68));
    console.log('FINAL SUMMARY');
    console.log('═'.repeat(68));
    console.log(`Total Rules: ${ruleFiles.length}`);
    console.log(`Successful: ${successCount}`);
    console.log(`Failed: ${failureCount}`);
    console.log('═'.repeat(68));
    process.exit(failureCount > 0 ? 1 : 0);
    return;
  }

  const ruleFile = ruleFiles[currentIndex];
  const ruleName = path.basename(ruleFile);

  console.log('─'.repeat(68));
  console.log(`[${currentIndex + 1}/${ruleFiles.length}] Running: ${ruleName}`);
  console.log('─'.repeat(68));

  const child = spawn('node', [mainScript, ruleFile], {
    stdio: 'inherit',
    shell: true
  });

  child.on('close', (code) => {
    if (code === 0) {
      console.log(`✓ ${ruleName} completed successfully`);
      successCount++;
    } else {
      console.log(`✗ ${ruleName} failed with exit code ${code}`);
      failureCount++;
    }
    console.log('');
    
    currentIndex++;
    // Add a small delay between runs
    setTimeout(runNextRule, 2000);
  });

  child.on('error', (err) => {
    console.error(`Error running ${ruleName}:`, err.message);
    failureCount++;
    currentIndex++;
    setTimeout(runNextRule, 2000);
  });
}

// Start running rules
runNextRule();

