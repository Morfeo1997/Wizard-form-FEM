import { TestBed } from '@angular/core/testing';
import { FormStateService, PersonalInfo, Plan, AddOn } from './form-state';

describe('FormStateService', () => {
  let service: FormStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Initial State', () => {
    it('should initialize with empty personal info', () => {
      const info = service.getPersonalInfo();
      expect(info.name).toBe('');
      expect(info.email).toBe('');
      expect(info.phone).toBe('');
    });

    it('should initialize with no plan selected', () => {
      expect(service.getSelectedPlan()).toBeNull();
    });

    it('should initialize with 3 add-ons', () => {
      expect(service.getAddOns().length).toBe(3);
    });

    it('should initialize with all add-ons unselected', () => {
      const addOns = service.getAddOns();
      addOns.forEach(addOn => {
        expect(addOn.selected).toBe(false);
      });
    });

    it('should initialize with monthly billing', () => {
      expect(service.getIsYearlyValue()).toBe(false);
    });

    it('should initialize at step 1', () => {
      expect(service.getCurrentStep()).toBe(1);
    });
  });

  describe('Personal Info Management', () => {
    it('should set personal info', () => {
      const info: PersonalInfo = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1 234 567 890'
      };

      service.setPersonalInfo(info);
      const retrieved = service.getPersonalInfo();

      expect(retrieved.name).toBe('John Doe');
      expect(retrieved.email).toBe('john@example.com');
      expect(retrieved.phone).toBe('+1 234 567 890');
    });

    it('should update personal info', () => {
      service.setPersonalInfo({
        name: 'Jane',
        email: 'jane@example.com',
        phone: '123'
      });

      service.setPersonalInfo({
        name: 'John',
        email: 'john@example.com',
        phone: '456'
      });

      const info = service.getPersonalInfo();
      expect(info.name).toBe('John');
    });
  });

  describe('Plan Management', () => {
    const mockPlan: Plan = {
      id: 'arcade',
      name: 'Arcade',
      monthlyPrice: 9,
      yearlyPrice: 90
    };

    it('should set selected plan', () => {
      service.setSelectedPlan(mockPlan);
      expect(service.getSelectedPlan()).toEqual(mockPlan);
    });

    it('should allow changing plan', () => {
      service.setSelectedPlan(mockPlan);
      
      const newPlan: Plan = {
        id: 'pro',
        name: 'Pro',
        monthlyPrice: 15,
        yearlyPrice: 150
      };
      
      service.setSelectedPlan(newPlan);
      expect(service.getSelectedPlan()).toEqual(newPlan);
    });

    it('should allow setting plan to null', () => {
      service.setSelectedPlan(mockPlan);
      service.setSelectedPlan(null);
      expect(service.getSelectedPlan()).toBeNull();
    });
  });

  describe('Add-ons Management', () => {
    it('should get all add-ons', () => {
      const addOns = service.getAddOns();
      expect(addOns.length).toBe(3);
    });

    it('should update add-ons', () => {
      const addOns = service.getAddOns();
      addOns[0].selected = true;
      service.setAddOns(addOns);

      const retrieved = service.getAddOns();
      expect(retrieved[0].selected).toBe(true);
    });

    it('should get only selected add-ons', () => {
      const addOns = service.getAddOns();
      addOns[0].selected = true;
      addOns[1].selected = true;
      service.setAddOns(addOns);

      const selected = service.getSelectedAddOns();
      expect(selected.length).toBe(2);
    });

    it('should return empty array when no add-ons selected', () => {
      expect(service.getSelectedAddOns().length).toBe(0);
    });
  });

  describe('Billing Toggle', () => {
    it('should toggle from monthly to yearly', () => {
      expect(service.getIsYearlyValue()).toBe(false);
      service.toggleBilling();
      expect(service.getIsYearlyValue()).toBe(true);
    });

    it('should toggle from yearly to monthly', () => {
      service.toggleBilling(); // to yearly
      service.toggleBilling(); // back to monthly
      expect(service.getIsYearlyValue()).toBe(false);
    });

    it('should update state when toggling', () => {
      service.toggleBilling();
      const state = service.getCurrentState();
      expect(state.isYearly).toBe(true);
    });
  });

  describe('Step Navigation', () => {
    it('should set current step', () => {
      service.setCurrentStep(2);
      expect(service.getCurrentStep()).toBe(2);
    });

    it('should update step in state', () => {
      service.setCurrentStep(3);
      const state = service.getCurrentState();
      expect(state.currentStep).toBe(3);
    });
  });

  describe('Step 1 Validation', () => {
    it('should fail when fields are empty', () => {
      expect(service.validateStep1()).toBe(false);
    });

    it('should fail when name is too short', () => {
      service.setPersonalInfo({
        name: 'A',
        email: 'test@example.com',
        phone: '123456'
      });
      expect(service.validateStep1()).toBe(false);
    });

    it('should fail when email format is invalid', () => {
      service.setPersonalInfo({
        name: 'John Doe',
        email: 'invalid-email',
        phone: '123456'
      });
      expect(service.validateStep1()).toBe(false);
    });

    it('should fail when phone format is invalid', () => {
      service.setPersonalInfo({
        name: 'John Doe',
        email: 'test@example.com',
        phone: 'abc-def'
      });
      expect(service.validateStep1()).toBe(false);
    });

    it('should pass when all fields are valid', () => {
      service.setPersonalInfo({
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1 234 567 890'
      });
      expect(service.validateStep1()).toBe(true);
    });
  });

  describe('Step 2 Validation', () => {
    it('should fail when no plan is selected', () => {
      expect(service.validateStep2()).toBe(false);
    });

    it('should pass when plan is selected', () => {
      service.setSelectedPlan({
        id: 'arcade',
        name: 'Arcade',
        monthlyPrice: 9,
        yearlyPrice: 90
      });
      expect(service.validateStep2()).toBe(true);
    });
  });

  describe('Step 3 Validation', () => {
    it('should always pass (add-ons are optional)', () => {
      expect(service.validateStep3()).toBe(true);
    });
  });

  describe('Step 4 Validation', () => {
    it('should always pass (summary step)', () => {
      expect(service.validateStep4()).toBe(true);
    });
  });

  describe('Can Proceed to Next Step', () => {
    it('should not allow proceeding from step 1 with invalid data', () => {
      expect(service.canProceedToNextStep(1)).toBe(false);
    });

    it('should allow proceeding from step 1 with valid data', () => {
      service.setPersonalInfo({
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1 234 567 890'
      });
      expect(service.canProceedToNextStep(1)).toBe(true);
    });

    it('should not allow proceeding from step 2 without plan', () => {
      expect(service.canProceedToNextStep(2)).toBe(false);
    });

    it('should allow proceeding from step 2 with plan', () => {
      service.setSelectedPlan({
        id: 'arcade',
        name: 'Arcade',
        monthlyPrice: 9,
        yearlyPrice: 90
      });
      expect(service.canProceedToNextStep(2)).toBe(true);
    });

    it('should always allow proceeding from step 3', () => {
      expect(service.canProceedToNextStep(3)).toBe(true);
    });
  });

  describe('Price Calculations', () => {
    const mockPlan: Plan = {
      id: 'arcade',
      name: 'Arcade',
      monthlyPrice: 9,
      yearlyPrice: 90
    };

    it('should return 0 when no plan selected', () => {
      expect(service.getPlanPrice()).toBe(0);
    });

    it('should return monthly price when monthly', () => {
      service.setSelectedPlan(mockPlan);
      expect(service.getPlanPrice()).toBe(9);
    });

    it('should return yearly price when yearly', () => {
      service.setSelectedPlan(mockPlan);
      service.toggleBilling();
      expect(service.getPlanPrice()).toBe(90);
    });

    it('should calculate add-ons total for monthly', () => {
      const addOns = service.getAddOns();
      addOns[0].selected = true; // $1
      addOns[1].selected = true; // $2
      service.setAddOns(addOns);

      expect(service.getAddOnsTotal()).toBe(3);
    });

    it('should calculate add-ons total for yearly', () => {
      service.toggleBilling();
      const addOns = service.getAddOns();
      addOns[0].selected = true; // $10
      addOns[1].selected = true; // $20
      service.setAddOns(addOns);

      expect(service.getAddOnsTotal()).toBe(30);
    });

    it('should calculate grand total', () => {
      service.setSelectedPlan(mockPlan);
      const addOns = service.getAddOns();
      addOns[0].selected = true; // $1
      addOns[1].selected = true; // $2
      service.setAddOns(addOns);

      expect(service.getGrandTotal()).toBe(12); // 9 + 1 + 2
    });
  });

  describe('Form Utilities', () => {
    it('should reset form to initial state', () => {
      service.setPersonalInfo({
        name: 'John',
        email: 'john@example.com',
        phone: '123'
      });
      service.setSelectedPlan({
        id: 'arcade',
        name: 'Arcade',
        monthlyPrice: 9,
        yearlyPrice: 90
      });

      service.resetForm();

      expect(service.getPersonalInfo().name).toBe('');
      expect(service.getSelectedPlan()).toBeNull();
      expect(service.getIsYearlyValue()).toBe(false);
    });

    it('should check if form is complete', () => {
      expect(service.isFormComplete()).toBe(false);

      service.setPersonalInfo({
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1 234 567 890'
      });
      service.setSelectedPlan({
        id: 'arcade',
        name: 'Arcade',
        monthlyPrice: 9,
        yearlyPrice: 90
      });

      expect(service.isFormComplete()).toBe(true);
    });

    it('should get summary data', () => {
      service.setPersonalInfo({
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1 234 567 890'
      });
      service.setSelectedPlan({
        id: 'arcade',
        name: 'Arcade',
        monthlyPrice: 9,
        yearlyPrice: 90
      });

      const summary = service.getSummaryData();

      expect(summary.personalInfo.name).toBe('John Doe');
      expect(summary.plan?.name).toBe('Arcade');
      expect(summary.billing).toBe('monthly');
      expect(summary.grandTotal).toBe(9);
    });
  });
});