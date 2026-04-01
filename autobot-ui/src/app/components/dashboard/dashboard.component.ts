import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AutomationService } from '../../services/automation.service';
import { RuleEditService } from '../../services/rule-edit.service';
import { environment } from '../../../environments/environment';
import { interval } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  rules: any[] = [];
  runningAutomations: any[] = [];
  logs: any[] = [];
  currentRule: any = null;
  private refreshInterval: any;
  searchTerm: string = '';
  loadingRules = true;
  rulesLoadError: string | null = null;
  sidebarOpen = true;
  /** Narrow viewport: drawer sidebar + backdrop */
  isNarrowLayout = false;
  env = environment;

  /** Session run outcomes from WebSocket exit lines */
  stats = { pass: 0, fail: 0, flaky: 0 };

  constructor(
    private automationService: AutomationService,
    private router: Router,
    private ruleEditService: RuleEditService
  ) {}

  ngOnInit() {
    this.updateLayoutMode();
    if (this.isNarrowLayout) {
      this.sidebarOpen = false;
    }
    this.loadRules();
    this.loadRunningAutomations();
    
    // Connect to WebSocket and subscribe to logs once
    this.automationService.connectWebSocket();
    this.automationService.getLogs().subscribe({
      next: (log) => {
        this.logs.push(log);
        this.ingestLogForStats(log);
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
    this.loadingRules = true;
    this.rulesLoadError = null;
    this.automationService.getRules().subscribe({
      next: (rules) => {
        this.rules = rules;
        this.loadingRules = false;
      },
      error: (error) => {
        console.error('Error loading rules:', error);
        this.loadingRules = false;
        this.rulesLoadError = 'Could not load rules. Is the API running?';
      }
    });
  }

  get filteredRules(): any[] {
    const q = (this.searchTerm || '').trim().toLowerCase();
    if (!q) return this.rules;
    return this.rules.filter(
      (r) =>
        (r.name || '').toLowerCase().includes(q) ||
        (r.project || r.version || '').toString().toLowerCase().includes(q) ||
        (r.fileName || '').toLowerCase().includes(q)
    );
  }

  /** Disabled steps across all loaded rules (shown as “ignored” KPI). */
  get ignoredStepsCount(): number {
    return this.rules.reduce((n, r) => {
      const steps = r.steps;
      if (!Array.isArray(steps)) return n;
      return n + steps.filter((s: { enabled?: boolean }) => s.enabled === false).length;
    }, 0);
  }

  get totalRuns(): number {
    return this.stats.pass + this.stats.fail;
  }

  /** Success rate of completed runs this session (0–100). */
  get progressPercent(): number {
    const t = this.totalRuns;
    if (t === 0) return 0;
    return Math.round((this.stats.pass / t) * 100);
  }

  /** Conic gradient for the summary ring (pass / fail / neutral). */
  get ringBackground(): string {
    const p = this.stats.pass;
    const f = this.stats.fail;
    const t = p + f;
    if (t === 0) {
      return 'conic-gradient(#e5e7eb 0% 100%)';
    }
    const pPct = (p / t) * 100;
    const pf = pPct + (f / t) * 100;
    return `conic-gradient(#3b82f6 0% ${pPct}%, #ef4444 ${pPct}% ${pf}%, #e5e7eb ${pf}% 100%)`;
  }

  get browserBadge(): string {
    return 'Chromium';
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  @HostListener('window:resize')
  onResize(): void {
    this.updateLayoutMode();
    if (!this.isNarrowLayout) {
      this.sidebarOpen = true;
    }
  }

  private updateLayoutMode(): void {
    this.isNarrowLayout = typeof window !== 'undefined' && window.innerWidth < 900;
  }

  stepCount(rule: any): number {
    return Array.isArray(rule?.steps) ? rule.steps.length : 0;
  }

  private ingestLogForStats(log: { message?: string; fileName?: string }): void {
    const msg = (log.message || '').toString();
    if (!msg.includes('Process exited with code')) return;
    const m = msg.match(/Process exited with code (\d+)/);
    if (!m) return;
    const code = parseInt(m[1], 10);
    if (code === 0) this.stats.pass++;
    else this.stats.fail++;
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
    this.ruleEditService.setRuleToEdit(rule);
    this.router.navigate(['/builder']);
  }

  createNewRule() {
    this.ruleEditService.clearEditState();
    this.router.navigate(['/builder']);
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