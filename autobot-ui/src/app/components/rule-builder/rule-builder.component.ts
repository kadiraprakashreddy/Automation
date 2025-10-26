import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AutomationService } from '../../services/automation.service';

interface AutomationStep {
  stepId: string;
  action: string;
  [key: string]: any;
}

@Component({
  selector: 'app-rule-builder',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="rule-builder">
      <div class="card">
       
        <div class="actions">
          <a routerLink="/dashboard" class="btn back-button">← Back to Dashboard</a>
        </div>
      </div>

      <!-- Tab Navigation -->
      <div class="tab-container">
        <div class="tab-nav">
          <button class="tab-button" 
                  [class.active]="activeTab === 'setup'" 
                  (click)="setActiveTab('setup')">
            📝 Rule Setup
          </button>
          <button class="tab-button" 
                  [class.active]="activeTab === 'workflow'" 
                  (click)="setActiveTab('workflow')">
            🔧 Workflow
          </button>
        </div>

        <!-- Tab Content -->
        <div class="tab-content">
          <!-- Rule Setup Tab -->
          <div class="tab-panel" [class.active]="activeTab === 'setup'">
            <div class="card">
              <div class="card-header">
              </div>
              
              <div class="card-content">
                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">Rule Name</label>
                    <input type="text" class="form-control form-control-small" [(ngModel)]="rule.name" placeholder="Enter rule name">
                  </div>
                  <div class="form-group">
                    <label class="form-label">Author</label>
                    <input type="text" class="form-control form-control-small" [(ngModel)]="rule.author" placeholder="Enter author name">
                  </div>
                </div>
                
                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">Description</label>
                    <textarea class="form-control textarea-small" [(ngModel)]="rule.description" placeholder="Enter rule description"></textarea>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Version</label>
                    <input type="text" class="form-control form-control-small" [(ngModel)]="rule.version" placeholder="1.0.0">
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Workflow Tab -->
          <div class="tab-panel" [class.active]="activeTab === 'workflow'">
            <div class="card">
        <div class="step-actions">
          <button class="btn" (click)="addWaitStep()">⏱️ Add Wait</button>
          <button class="btn" (click)="addClickStep()">👆 Add Click</button>
          <button class="btn" (click)="addFillStep()">✏️ Add Fill</button>
          <button class="btn" (click)="addValidateStep()">✅ Add Validation</button>
        </div>

        <!-- Steps Grid -->
        <div class="steps-grid" *ngIf="rule.steps.length > 0">
          <div class="grid-header">
            <div class="grid-cell">Step ID</div>
            <div class="grid-cell">Action Type</div>
            <div class="grid-cell">Input/Configuration</div>
            <div class="grid-cell">Actions</div>
          </div>
          
          <div *ngFor="let step of rule.steps; let i = index" class="grid-row">
            <!-- Step ID (Auto-assigned sequential integer) -->
            <div class="grid-cell">
              <input type="text" class="form-control" [(ngModel)]="step.stepId" 
                     [value]="i + 1" readonly>
            </div>
            
            <!-- Action Type Dropdown -->
            <div class="grid-cell">
              <select class="form-control" [(ngModel)]="step.action" (change)="onActionChange(step, i)">
                <option value="navigate">Navigate</option>
                <option value="click">Click</option>
                <option value="fill">Fill</option>
                <option value="wait">Wait</option>
                <option value="screenshot">Screenshot</option>
                <option value="validate">Validate</option>
              </select>
            </div>
            
            <!-- Dynamic Input based on Action Type -->
            <div class="grid-cell">
              <!-- Navigate Action -->
              <div *ngIf="step.action === 'navigate'">
                <input type="text" class="form-control" [(ngModel)]="step.url" 
                       placeholder="https://example.com">
              </div>
              
              <!-- Click Action -->
              <div *ngIf="step.action === 'click'">
                <input type="text" class="form-control" [(ngModel)]="step.selector" 
                       placeholder="e.g., #username, button[type='submit']">
              </div>
              
              <!-- Fill Action -->
              <div *ngIf="step.action === 'fill'">
                <input type="text" class="form-control" [(ngModel)]="step.selector" 
                       placeholder="Selector (e.g., #username)" style="margin-bottom: 5px;">
                <input type="text" class="form-control" [(ngModel)]="step.text" 
                       placeholder="Text to fill">
              </div>
              
              <!-- Wait Action -->
              <div *ngIf="step.action === 'wait'">
                <input type="number" class="form-control" [(ngModel)]="step.duration" 
                       placeholder="Duration in milliseconds">
              </div>
              
              <!-- Screenshot Action -->
              <div *ngIf="step.action === 'screenshot'">
                <select class="form-control" [(ngModel)]="step.fullPage">
                  <option [value]="true">Full Page</option>
                  <option [value]="false">Viewport Only</option>
                </select>
              </div>
              
              <!-- Validate Action -->
              <div *ngIf="step.action === 'validate'">
                <select class="form-control" [(ngModel)]="step.validationType" 
                        style="margin-bottom: 5px;">
                  <option value="exists">Element Exists</option>
                  <option value="textContains">Text Contains</option>
                  <option value="textEquals">Text Equals</option>
                  <option value="visible">Element Visible</option>
                </select>
                <input type="text" class="form-control" [(ngModel)]="step.selector" 
                       placeholder="Selector" style="margin-bottom: 5px;">
                <input *ngIf="step.validationType !== 'exists'" type="text" class="form-control" 
                       [(ngModel)]="step.expectedValue" placeholder="Expected value">
              </div>
            </div>
            
            <!-- Actions Column -->
            <div class="grid-cell">
              <button class="btn btn-success btn-sm" (click)="addStepAfter(i)">➕</button>
              <span class="button-spacer"></span>
              <button class="btn btn-danger btn-sm" (click)="removeStep(i)">🗑️</button>
            </div>
          </div>
        </div>

              <!-- Empty State -->
              <div *ngIf="rule.steps.length === 0" class="empty-state">
                <p>No steps added yet. Click "Add Step" to get started!</p>
              </div>
            </div>

            <div class="card" *ngIf="showPreview">
              <h3>📄 JSON Preview</h3>
              <div class="json-preview">{{ jsonPreview }}</div>
              <button class="btn" (click)="showPreview = false">Hide Preview</button>
            </div>

            <!-- Save and Preview Actions -->
            <div class="card">
        <div class="workflow-actions">
          <button class="btn btn-success" (click)="saveRule()">💾 Save Rule</button>
          <button class="btn btn-success" (click)="previewJson()">👁️ Preview JSON</button>
        </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal for JSON Preview -->
    <div class="modal-overlay" *ngIf="showModal" (click)="closeModal()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3>📄 JSON Preview</h3>
          <button class="modal-close" (click)="closeModal()">×</button>
        </div>
        <div class="modal-body">
          <pre class="json-preview">{{ getJsonPreview() }}</pre>
        </div>
        <div class="modal-footer">
          <button class="btn btn-success" (click)="copyToClipboard()">📋 Copy JSON</button>
          <button class="btn" (click)="closeModal()">Close</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .rule-builder {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .card {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      padding: 20px;
    }
    
    .actions {
      display: flex;
      gap: 10px;
      margin-top: 15px;
    }

    .workflow-actions {
      display: flex;
      gap: 10px;
      justify-content: center;
      padding: 15px 0;
    }

    .back-button {
      padding: 4px 8px;
      font-size: 12px;
      height: auto;
      line-height: 1.2;
    }

    /* Modal Styles */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .modal-content {
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
      max-width: 80%;
      max-height: 80%;
      width: 600px;
      display: flex;
      flex-direction: column;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px 20px;
      border-bottom: 1px solid #eee;
      background-color: #f8f9fa;
      border-radius: 8px 8px 0 0;
    }

    .modal-header h3 {
      margin: 0;
      color: #333;
    }

    .modal-close {
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: #666;
      padding: 0;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .modal-close:hover {
      color: #000;
    }

    .modal-body {
      padding: 20px;
      overflow-y: auto;
      flex: 1;
    }

    .json-preview {
      background-color: #f8f9fa;
      border: 1px solid #e9ecef;
      border-radius: 4px;
      padding: 15px;
      font-family: 'Courier New', monospace;
      font-size: 12px;
      line-height: 1.4;
      white-space: pre-wrap;
      word-wrap: break-word;
      max-height: 400px;
      overflow-y: auto;
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      padding: 15px 20px;
      border-top: 1px solid #eee;
      background-color: #f8f9fa;
      border-radius: 0 0 8px 8px;
    }
    
    .step-actions {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
      flex-wrap: wrap;
    }
    
    .step-item {
      border: 1px solid #e9ecef;
      border-radius: 4px;
      margin-bottom: 15px;
      overflow: hidden;
    }
    
    .step-header {
      background: #f8f9fa;
      padding: 10px 15px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .step-number {
      background: #007bff;
      color: white;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: bold;
    }
    
    .step-action {
      font-weight: 500;
      text-transform: capitalize;
    }
    
    .step-details {
      padding: 15px;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 15px;
    }
    
    .steps-container {
      max-height: 600px;
      overflow-y: auto;
    }

    .steps-grid {
      border: 1px solid #e9ecef;
      border-radius: 4px;
      overflow: hidden;
      margin-top: 20px;
    }

    .grid-header {
      display: grid;
      grid-template-columns: 80px 150px 1fr 80px;
      background: #f8f9fa;
      font-weight: 600;
      color: #495057;
    }

    .grid-row {
      display: grid;
      grid-template-columns: 80px 150px 1fr 80px;
      border-bottom: 1px solid #e9ecef;
      align-items: center;
    }

    .grid-row:last-child {
      border-bottom: none;
    }

    .grid-cell {
      padding: 12px;
      border-right: 1px solid #e9ecef;
      display: flex;
      align-items: center;
    }

    .grid-cell:last-child {
      border-right: none;
    }

    .grid-header .grid-cell {
      padding: 15px 12px;
      font-size: 14px;
    }

    .empty-state {
      text-align: center;
      padding: 40px;
      color: #666;
      background: #f8f9fa;
      border-radius: 4px;
      margin-top: 20px;
    }

    .btn {
      padding: 6px 12px;
      font-size: 11px;
      border: 1px solid #007bff;
      background: #007bff;
      color: white;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.3s ease;
      text-decoration: none;
      display: inline-block;
    }

    .btn:hover {
      background: #0056b3;
      border-color: #0056b3;
    }

    .btn-success {
      background: #28a745;
      border-color: #28a745;
    }

    .btn-success:hover {
      background: #1e7e34;
      border-color: #1e7e34;
    }

    .btn-danger {
      background: #dc3545;
      border-color: #dc3545;
    }

    .btn-danger:hover {
      background: #c82333;
      border-color: #c82333;
    }

    .btn-sm {
      padding: 3px 6px;
      font-size: 10px;
    }

    .button-spacer {
      display: inline-block;
      width: 8px;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      padding: 15px 20px;
      background: #f8f9fa;
      border-bottom: 1px solid #e9ecef;
      margin: -20px -20px 0 -20px;
      border-radius: 8px 8px 0 0;
      max-width: 60%;
      margin-left: auto;
      margin-right: auto;
    }

    .card-header:hover {
      background: #e9ecef;
    }

    .toggle-icon {
      font-size: 16px;
      color: #666;
      transition: transform 0.2s;
    }

    .card-content {
      transition: all 0.3s ease;
      overflow: hidden;
    }

    .card-content.collapsed {
      max-height: 0;
      padding: 0 20px;
      margin: 0 -20px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
      margin-bottom: 15px;
    }

    .form-control-small {
      padding: 4px 6px;
      font-size: 12px;
      height: 28px;
    }

    .textarea-small {
      min-height: 50px;
      padding: 4px 6px;
      font-size: 12px;
      resize: vertical;
    }

    /* Tab Styles */
    .tab-container {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      overflow: hidden;
    }

    .tab-nav {
      display: flex;
      background: #f8f9fa;
      border-bottom: 1px solid #e9ecef;
      justify-content: flex-start;
      max-width: 200px;
      margin: 0;
    }

    .tab-button {
      flex: 0 0 50%;
      padding: 6px 8px;
      background: none;
      border: none;
      cursor: pointer;
      font-size: 11px;
      font-weight: 500;
      color: #6c757d;
      transition: all 0.3s ease;
      border-bottom: 2px solid transparent;
      max-width: 100px;
    }

    .tab-button:hover {
      background: #e9ecef;
      color: #495057;
    }

    .tab-button.active {
      background: white;
      color: #007bff;
      border-bottom-color: #007bff;
    }

    .tab-content {
      position: relative;
    }

    .tab-panel {
      display: none;
      padding: 10px;
    }

    .tab-panel.active {
      display: block;
    }
  `]
})
export class RuleBuilderComponent implements OnInit {
  rule: any = {
    name: '',
    description: '',
    author: '',
    version: '1.0.0',
    steps: []
  };
  
  showPreview = false;
  jsonPreview = '';
  activeTab = 'setup';
  showModal = false;

  constructor(private automationService: AutomationService) {}

  ngOnInit() {
    // Initialize with a basic step
    this.addStep();
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  addStep() {
    const stepNumber = this.rule.steps.length + 1;
    this.rule.steps.push({
      stepId: stepNumber.toString(),
      action: 'navigate',
      url: ''
    });
  }

  addWaitStep() {
    const stepNumber = this.rule.steps.length + 1;
    this.rule.steps.push({
      stepId: stepNumber.toString(),
      action: 'wait',
      duration: 3000
    });
  }

  addClickStep() {
    const stepNumber = this.rule.steps.length + 1;
    this.rule.steps.push({
      stepId: stepNumber.toString(),
      action: 'click',
      selector: ''
    });
  }

  addFillStep() {
    const stepNumber = this.rule.steps.length + 1;
    this.rule.steps.push({
      stepId: stepNumber.toString(),
      action: 'fill',
      selector: '',
      text: ''
    });
  }

  addValidateStep() {
    const stepNumber = this.rule.steps.length + 1;
    this.rule.steps.push({
      stepId: stepNumber.toString(),
      action: 'validate',
      validationType: 'exists',
      selector: '',
      expectedValue: '',
      script: ''
    });
  }

  onActionChange(step: any, index: number) {
    // Update step ID to match the new action
    step.stepId = (index + 1).toString();
    
    // Clear previous properties based on action type
    this.clearStepProperties(step);
    
    // Set default properties for the new action
    this.setDefaultProperties(step);
  }

  clearStepProperties(step: any) {
    // Remove all action-specific properties
    delete step.url;
    delete step.selector;
    delete step.text;
    delete step.duration;
    delete step.fullPage;
    delete step.validationType;
    delete step.expectedValue;
    delete step.script;
  }

  setDefaultProperties(step: any) {
    switch (step.action) {
      case 'navigate':
        step.url = '';
        break;
      case 'click':
        step.selector = '';
        break;
      case 'fill':
        step.selector = '';
        step.text = '';
        break;
      case 'wait':
        step.duration = 3000;
        break;
      case 'screenshot':
        step.fullPage = true;
        break;
      case 'validate':
        step.validationType = 'exists';
        step.selector = '';
        step.expectedValue = '';
        step.script = '';
        break;
    }
  }

  removeStep(index: number) {
    this.rule.steps.splice(index, 1);
  }

  addStepAfter(index: number) {
    const stepNumber = this.rule.steps.length + 1;
    const newStep = {
      stepId: stepNumber.toString(),
      action: 'navigate',
      url: '',
      selector: '',
      text: '',
      duration: 3000,
      validationType: 'exists',
      expectedValue: '',
      fullPage: true
    };
    this.rule.steps.splice(index + 1, 0, newStep);
  }

  saveRule() {
    if (!this.rule.name) {
      alert('Please enter a rule name');
      return;
    }

    this.automationService.saveRule(this.rule).subscribe({
      next: (response) => {
        alert('Rule saved successfully!');
        console.log('Rule saved:', response);
      },
      error: (error) => {
        alert('Error saving rule: ' + error.message);
        console.error('Error saving rule:', error);
      }
    });
  }

  previewJson() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  getJsonPreview(): string {
    return JSON.stringify(this.rule, null, 2);
  }

  copyToClipboard() {
    const jsonText = this.getJsonPreview();
    navigator.clipboard.writeText(jsonText).then(() => {
      alert('JSON copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy: ', err);
      alert('Failed to copy to clipboard');
    });
  }
}
