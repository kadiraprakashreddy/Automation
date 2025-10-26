import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AutomationService } from '../../services/automation.service';

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
  
  showPreview = false;
  jsonPreview = '';
  activeTab = 'setup';
  showModal = false;

  constructor(private automationService: AutomationService) {}

  ngOnInit() {
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

    this.automationService.saveRule(this.rule).subscribe({
      next: (response) => {
        alert('Rule saved successfully!');
      },
      error: (error) => {
        alert('Error saving rule: ' + error.message);
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
      alert('Failed to copy to clipboard');
    });
  }
}