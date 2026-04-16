import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StepSummaryCardComponent } from './step-summary-card.component';

describe('StepSummaryCardComponent', () => {
  let component: StepSummaryCardComponent;
  let fixture: ComponentFixture<StepSummaryCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepSummaryCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StepSummaryCardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
