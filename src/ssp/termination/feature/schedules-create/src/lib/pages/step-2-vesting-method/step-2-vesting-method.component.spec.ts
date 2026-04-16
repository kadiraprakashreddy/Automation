import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Step2VestingMethodComponent } from './step-2-vesting-method.component';

describe('Step2VestingMethodComponent', () => {
  let component: Step2VestingMethodComponent;
  let fixture: ComponentFixture<Step2VestingMethodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Step2VestingMethodComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Step2VestingMethodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
