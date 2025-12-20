import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, NavigationExtras } from '@angular/router';
import { AutomationService } from '../../services/automation.service';
import { RuleEditService } from '../../services/rule-edit.service';

@Component({
  selector: 'app-rule-builder',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './rule-builder.component.html',
  styleUrls: ['./rule-builder.component.css']
})
export class RuleBuilderComponent implements OnInit {
  rule: any = {
    name: '',
    description: '',
    author: '',
    version: '1.0.0',
    steps: []
  };
  
  activeTab = 'setup';
  showModal = false;
  isSetupComplete: boolean = false;

  constructor(
    private automationService: AutomationService,
    private router: Router,
    private ruleEditService: RuleEditService
  ) {}

  ngOnInit() {
    if (this.ruleEditService.isInEditMode()) {
      const ruleToEdit = this.ruleEditService.getRuleToEdit();
      if (ruleToEdit) {
        this.loadRuleForEdit(ruleToEdit);
        return;
      }
    }
  }

  loadRuleForEdit(rule: any) {
    // Load the existing rule data
    this.rule = {
      name: rule.name,
      description: rule.description || '',
      author: rule.author || '',
      version: rule.version || '1.0.0',
      created: rule.created || '',
      steps: rule.steps || []
    };
    
    // If no steps, add a default one
    if (this.rule.steps.length === 0) {
      this.addStep();
    }
    
    // Enable Workflow tab when editing existing rule
    this.isSetupComplete = true;
  }


  setActiveTab(tab: string) {
    if (tab === 'workflow' && !this.isSetupComplete) {
      return; // Prevent switching to Workflow if setup is not complete
    }
    this.activeTab = tab;
  }

  isFormValid(): boolean {
    // Check if all required fields are filled
    return !!(this.rule.name && this.rule.name.trim() !== '');
  }

  nextStep() {
    // Validate Rule Setup form
    if (!this.isFormValid()) {
      return;
    }

    // Mark setup as complete and switch to Workflow tab
    this.isSetupComplete = true;
    this.activeTab = 'workflow';
    
    // If no steps exist, add a default one
    if (this.rule.steps.length === 0) {
      this.addStep();
    }
  }

  addStep() {
    const stepNumber = this.rule.steps.length + 1;
    this.rule.steps.push({
      stepId: stepNumber.toString(),
      action: 'navigate',
      url: ''
    });
  }


  onActionChange(step: any, index: number) {
    step.stepId = (index + 1).toString();
    this.clearStepProperties(step);
    this.setDefaultProperties(step);
  }

  clearStepProperties(step: any) {
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

    // Check if we're editing an existing rule
    if (this.ruleEditService.isInEditMode()) {
      const originalRule = this.ruleEditService.getRuleToEdit();
      const fileName = originalRule.fileName;
      
      // Use PUT to update existing rule
      this.automationService.updateRule(fileName, this.rule).subscribe({
        next: (response) => {
          alert('Rule updated successfully!');
          // Clear edit state after saving
          this.ruleEditService.clearEditState();
          // Navigate back to dashboard
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          alert('Error updating rule: ' + error.message);
        }
      });
    } else {
      // Use POST to create new rule
      this.automationService.saveRule(this.rule).subscribe({
        next: (response) => {
          alert('Rule saved successfully!');
          // Navigate back to dashboard
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          alert('Error saving rule: ' + error.message);
        }
      });
    }
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
      alert('Failed to copy to clipboard');
    });
  }
}