import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Step1RuleLevelComponent } from './step-1-rule-level.component';

describe('Step1RuleLevelComponent', () => {
  let component: Step1RuleLevelComponent;
  let fixture: ComponentFixture<Step1RuleLevelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Step1RuleLevelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Step1RuleLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
