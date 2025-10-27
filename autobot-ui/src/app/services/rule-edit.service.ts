import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RuleEditService {
  private ruleToEdit: any = null;
  private isEditMode: boolean = false;

  setRuleToEdit(rule: any) {
    this.ruleToEdit = rule;
    this.isEditMode = true;
  }

  getRuleToEdit(): any {
    return this.ruleToEdit;
  }

  isInEditMode(): boolean {
    return this.isEditMode;
  }

  clearEditState() {
    this.ruleToEdit = null;
    this.isEditMode = false;
  }
}
