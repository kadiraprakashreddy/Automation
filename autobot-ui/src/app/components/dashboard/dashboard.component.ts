import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AutomationService } from '../../services/automation.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard">
      <div class="card">
        <h2>📊 Automation Dashboard</h2>
        <p>Monitor and manage your automation rules</p>
        
        <div class="actions">
          <a routerLink="/builder" class="btn btn-success">➕ Create New Rule</a>
          <button class="btn" (click)="refreshRules()">🔄 Refresh</button>
        </div>
      </div>

      <div class="card">
        <h3>📋 Existing Rules</h3>
        <div *ngIf="rules.length === 0" class="no-rules">
          <p>No rules found. Create your first automation rule!</p>
        </div>
        
        <div *ngFor="let rule of rules" class="rule-item">
          <div class="rule-info">
            <h4>{{ rule.name }}</h4>
            <p>{{ rule.description || 'No description' }}</p>
            <small>Version: {{ rule.version }} | Author: {{ rule.author }}</small>
          </div>
          <div class="rule-actions">
            <button class="btn" (click)="runRule(rule)">▶️ Run</button>
            <button class="btn" (click)="editRule(rule)">✏️ Edit</button>
            <button class="btn btn-danger" (click)="deleteRule(rule)">🗑️ Delete</button>
          </div>
        </div>
      </div>

      <div class="card" *ngIf="isRunning">
        <h3>🔄 Running Automation</h3>
        <div class="log-container">
          <div *ngFor="let log of logs" [class]="'log-' + log.type">
            {{ log.timestamp }} - {{ log.message }}
          </div>
        </div>
        <button class="btn btn-danger" (click)="stopAutomation()">⏹️ Stop</button>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    
    .actions {
      display: flex;
      gap: 10px;
      margin-top: 15px;
    }
    
    .no-rules {
      text-align: center;
      padding: 40px;
      color: #666;
    }
    
    .rule-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px;
      border: 1px solid #e9ecef;
      border-radius: 4px;
      margin-bottom: 10px;
    }
    
    .rule-info h4 {
      margin: 0 0 5px 0;
      color: #333;
    }
    
    .rule-info p {
      margin: 0 0 5px 0;
      color: #666;
    }
    
    .rule-info small {
      color: #999;
    }
    
    .rule-actions {
      display: flex;
      gap: 5px;
    }
    
    .rule-actions .btn {
      padding: 5px 10px;
      font-size: 12px;
    }
    
    .log-container {
      max-height: 300px;
      overflow-y: auto;
      background-color: #f8f9fa;
      border: 1px solid #e9ecef;
      border-radius: 4px;
      padding: 10px;
      margin: 10px 0;
      font-family: 'Courier New', monospace;
      font-size: 12px;
    }
    
    .log-info {
      color: #333;
    }
    
    .log-error {
      color: #dc3545;
      font-weight: bold;
    }
    
    .log-success {
      color: #28a745;
      font-weight: bold;
    }
  `]
})
export class DashboardComponent implements OnInit, OnDestroy {
  rules: any[] = [];
  isRunning = false;
  logs: any[] = [];

  constructor(private automationService: AutomationService) {}

  ngOnInit() {
    this.loadRules();
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
    this.isRunning = true;
    this.logs = [];
    
    // Connect to WebSocket for real-time logs
    this.automationService.connectWebSocket();
    
    // Subscribe to real-time logs via WebSocket
    this.automationService.getLogs().subscribe({
      next: (log) => {
        this.logs.push(log);
        // Auto-scroll to bottom
        setTimeout(() => {
          const logContainer = document.querySelector('.log-container');
          if (logContainer) {
            logContainer.scrollTop = logContainer.scrollHeight;
          }
        }, 100);
      }
    });
    
    // Start the automation process
    this.automationService.runRule(rule.fileName).subscribe({
      next: (response) => {
        console.log('Rule started:', response);
        this.logs.push({
          type: 'info',
          message: `Starting automation: ${rule.name}`,
          timestamp: new Date().toLocaleTimeString()
        });
      },
      error: (error) => {
        console.error('Error starting rule:', error);
        this.logs.push({
          type: 'error',
          message: `Error starting automation: ${error.message}`,
          timestamp: new Date().toLocaleTimeString()
        });
        this.isRunning = false;
      }
    });
  }

  editRule(rule: any) {
    // Navigate to rule builder with rule data
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

  stopAutomation() {
    this.automationService.stopAutomation().subscribe({
      next: () => {
        this.isRunning = false;
        this.logs.push({
          type: 'info',
          message: 'Automation stopped by user',
          timestamp: new Date().toLocaleTimeString()
        });
        // Disconnect WebSocket
        this.automationService.disconnectWebSocket();
      }
    });
  }

  ngOnDestroy() {
    // Clean up WebSocket connection when component is destroyed
    this.automationService.disconnectWebSocket();
  }
}