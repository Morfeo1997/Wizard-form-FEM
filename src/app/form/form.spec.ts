import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Form } from './form';

describe('Form', () => {
  let component: Form;
  let fixture: ComponentFixture<Form>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Form]
    }).compileComponents();

    fixture = TestBed.createComponent(Form);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with step 1', () => {
    expect(component.currentStep).toBe(1);
  });

  it('should have 4 total steps', () => {
    expect(component.totalSteps).toBe(4);
    expect(component.steps.length).toBe(4);
  });

  describe('Navigation', () => {
    it('should move to next step', () => {
      component.nextStep();
      expect(component.currentStep).toBe(2);
    });

    it('should move to previous step', () => {
      component.currentStep = 3;
      component.previousStep();
      expect(component.currentStep).toBe(2);
    });

    it('should not go beyond last step', () => {
      component.currentStep = 4;
      component.nextStep();
      expect(component.currentStep).toBe(4);
    });

    it('should not go before first step', () => {
      component.currentStep = 1;
      component.previousStep();
      expect(component.currentStep).toBe(1);
    });

    it('should go to specific step', () => {
      component.goToStep(3);
      expect(component.currentStep).toBe(3);
    });

    it('should not go to invalid step', () => {
      component.currentStep = 2;
      component.goToStep(5);
      expect(component.currentStep).toBe(2);
    });
  });

  describe('Step Status', () => {
    it('should identify active step', () => {
      component.currentStep = 2;
      expect(component.isStepActive(2)).toBe(true);
      expect(component.isStepActive(1)).toBe(false);
    });

    it('should identify completed steps', () => {
      component.currentStep = 3;
      expect(component.isStepCompleted(1)).toBe(true);
      expect(component.isStepCompleted(2)).toBe(true);
      expect(component.isStepCompleted(3)).toBe(false);
    });
  });
});