import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AutomationService } from '../../services/automation.service';
import { interval } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  rules: any[] = [];
  runningAutomations: any[] = [];
  logs: any[] = [];
  currentRule: any = null;
  private refreshInterval: any;

  constructor(private automationService: AutomationService) {}

  ngOnInit() {
    this.loadRules();
    this.loadRunningAutomations();
    
    // Connect to WebSocket and subscribe to logs once
    this.automationService.connectWebSocket();
    this.automationService.getLogs().subscribe({
      next: (log) => {
        // Show logs from all automations
        this.logs.push(log);
        setTimeout(() => {
          const logContainer = document.querySelector('.log-container');
          if (logContainer) {
            logContainer.scrollTop = logContainer.scrollHeight;
          }
        }, 100);
      }
    });
    
    // Refresh running automations every 5 seconds
    this.refreshInterval = interval(5000).subscribe(() => {
      this.loadRunningAutomations();
    });
  }

  loadRunningAutomations() {
    this.automationService.getRunningRules().subscribe({
      next: (running) => this.runningAutomations = running,
      error: (error) => console.error('Error loading running automations:', error)
    });
  }

  loadRules() {
    this.automationService.getRules().subscribe({
      next: (rules) => this.rules = rules,
      error: (error) => console.error('Error loading rules:', error)
    });
  }

  refreshRules() {
    this.loadRules();
  }

  runRule(rule: any) {
    this.currentRule = rule;
    
    // Ask user if they want to clear existing logs
    if (this.logs.length > 0) {
      const clearLogs = confirm('Clear existing logs before starting new automation?');
      if (clearLogs) {
        this.logs = [];
      }
    }
    
    this.automationService.runRule(rule.fileName).subscribe({
      next: (response) => {
        this.logs.push({
          type: 'info',
          message: `Starting automation: ${rule.name}`,
          timestamp: new Date().toLocaleTimeString(),
          fileName: rule.fileName
        });
        this.loadRunningAutomations();
      },
      error: (error) => {
        this.logs.push({
          type: 'error',
          message: `Error starting automation: ${error.message}`,
          timestamp: new Date().toLocaleTimeString(),
          fileName: rule.fileName
        });
        this.loadRunningAutomations();
      }
    });
  }

  editRule(rule: any) {
    console.log('Edit rule:', rule);
  }

  deleteRule(rule: any) {
    if (confirm(`Are you sure you want to delete "${rule.name}"?`)) {
      this.automationService.deleteRule(rule.fileName).subscribe({
        next: () => {
          this.loadRules();
        },
        error: (error) => console.error('Error deleting rule:', error)
      });
    }
  }

  stopRule(rule: any) {
    this.automationService.stopRule(rule.fileName).subscribe({
      next: () => {
        this.logs.push({
          type: 'info',
          message: `Automation stopped for ${rule.name}`,
          timestamp: new Date().toLocaleTimeString(),
          fileName: rule.fileName
        });
        this.loadRunningAutomations();
      },
      error: (error) => {
        this.logs.push({
          type: 'error',
          message: `Error stopping automation: ${error.message}`,
          timestamp: new Date().toLocaleTimeString(),
          fileName: rule.fileName
        });
      }
    });
  }

  stopAllRules() {
    if (confirm('Are you sure you want to stop all running automations?')) {
      this.automationService.stopAllRules().subscribe({
        next: (response) => {
          this.logs.push({
            type: 'info',
            message: `All automations stopped: ${response.stoppedProcesses.join(', ')}`,
            timestamp: new Date().toLocaleTimeString()
          });
          this.loadRunningAutomations();
        },
        error: (error) => {
          this.logs.push({
            type: 'error',
            message: `Error stopping automations: ${error.message}`,
            timestamp: new Date().toLocaleTimeString()
          });
        }
      });
    }
  }

  isRuleRunning(fileName: string): boolean {
    return this.runningAutomations.some(automation => automation.fileName === fileName);
  }

  ngOnDestroy() {
    this.automationService.disconnectWebSocket();
    if (this.refreshInterval) {
      this.refreshInterval.unsubscribe();
    }
  }

  downloadLogs() {
    if (this.logs.length === 0) {
      alert('No logs to download');
      return;
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `automation-logs-${timestamp}.txt`;
    
    const header = [
      '='.repeat(60),
      'AUTOMATION LOGS',
      '='.repeat(60),
      `Generated: ${new Date().toLocaleString()}`,
      `Rule: ${this.currentRule ? this.currentRule.name : 'Multiple Rules'}`,
      `File: ${this.currentRule ? this.currentRule.fileName : 'Multiple Files'}`,
      `Total Log Entries: ${this.logs.length}`,
      `Running Automations: ${this.runningAutomations.length}`,
      '='.repeat(60),
      ''
    ].join('\n');
    
    const logContent = this.logs.map(log => 
      `${log.timestamp} [${log.type.toUpperCase()}] ${log.message}`
    ).join('\n');
    
    const footer = [
      '',
      '='.repeat(60),
      'END OF LOGS',
      '='.repeat(60)
    ].join('\n');
    
    const fullContent = header + logContent + footer;
    
    const blob = new Blob([fullContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  clearLogs() {
    if (confirm('Are you sure you want to clear all logs?')) {
      this.logs = [];
      this.currentRule = null;
    }
  }
}