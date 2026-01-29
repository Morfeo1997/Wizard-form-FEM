import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { SecondStepComponent } from './second-step';

describe('SecondStepComponent', () => {
  let component: SecondStepComponent;
  let fixture: ComponentFixture<SecondStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecondStepComponent, FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(SecondStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with monthly billing', () => {
    expect(component.isYearly).toBe(false);
  });

  it('should initialize with no plan selected', () => {
    expect(component.selectedPlanId).toBe('');
  });

  it('should have 3 plans available', () => {
    expect(component.plans.length).toBe(3);
  });

  describe('Plans Data', () => {
    it('should have arcade plan with correct data', () => {
      const arcade = component.plans.find(p => p.id === 'arcade');
      expect(arcade).toBeDefined();
      expect(arcade?.name).toBe('Arcade');
      expect(arcade?.monthlyPrice).toBe(9);
      expect(arcade?.yearlyPrice).toBe(90);
    });

    it('should have advanced plan with correct data', () => {
      const advanced = component.plans.find(p => p.id === 'advanced');
      expect(advanced).toBeDefined();
      expect(advanced?.name).toBe('Advanced');
      expect(advanced?.monthlyPrice).toBe(12);
      expect(advanced?.yearlyPrice).toBe(120);
    });

    it('should have pro plan with correct data', () => {
      const pro = component.plans.find(p => p.id === 'pro');
      expect(pro).toBeDefined();
      expect(pro?.name).toBe('Pro');
      expect(pro?.monthlyPrice).toBe(15);
      expect(pro?.yearlyPrice).toBe(150);
    });
  });

  describe('Billing Toggle', () => {
    it('should toggle from monthly to yearly', () => {
      expect(component.isYearly).toBe(false);
      component.toggleBilling();
      expect(component.isYearly).toBe(true);
    });

    it('should toggle from yearly to monthly', () => {
      component.isYearly = true;
      component.toggleBilling();
      expect(component.isYearly).toBe(false);
    });

    it('should toggle multiple times correctly', () => {
      expect(component.isYearly).toBe(false);
      component.toggleBilling();
      expect(component.isYearly).toBe(true);
      component.toggleBilling();
      expect(component.isYearly).toBe(false);
      component.toggleBilling();
      expect(component.isYearly).toBe(true);
    });
  });

  describe('Plan Selection', () => {
    it('should select a plan', () => {
      component.selectPlan('arcade');
      expect(component.selectedPlanId).toBe('arcade');
    });

    it('should change selected plan', () => {
      component.selectPlan('arcade');
      expect(component.selectedPlanId).toBe('arcade');
      
      component.selectPlan('pro');
      expect(component.selectedPlanId).toBe('pro');
    });

    it('should identify selected plan correctly', () => {
      component.selectPlan('advanced');
      expect(component.isPlanSelected('advanced')).toBe(true);
      expect(component.isPlanSelected('arcade')).toBe(false);
      expect(component.isPlanSelected('pro')).toBe(false);
    });
  });

  describe('Price Calculations', () => {
    const arcadePlan = {
      id: 'arcade',
      name: 'Arcade',
      icon: 'assets/images/icon-arcade.svg',
      monthlyPrice: 9,
      yearlyPrice: 90
    };

    it('should return monthly price when billing is monthly', () => {
      component.isYearly = false;
      expect(component.getPlanPrice(arcadePlan)).toBe(9);
    });

    it('should return yearly price when billing is yearly', () => {
      component.isYearly = true;
      expect(component.getPlanPrice(arcadePlan)).toBe(90);
    });

    it('should return correct price period for monthly', () => {
      component.isYearly = false;
      expect(component.getPricePeriod()).toBe('/mo');
    });

    it('should return correct price period for yearly', () => {
      component.isYearly = true;
      expect(component.getPricePeriod()).toBe('/yr');
    });
  });

  describe('Form Validation', () => {
    it('should be invalid when no plan is selected', () => {
      expect(component.isFormValid()).toBe(false);
    });

    it('should be valid when a plan is selected', () => {
      component.selectPlan('arcade');
      expect(component.isFormValid()).toBe(true);
    });
  });

  describe('Get Selected Plan Data', () => {
    it('should return null when no plan is selected', () => {
      expect(component.getSelectedPlanData()).toBeNull();
    });

    it('should return correct data for selected monthly plan', () => {
      component.isYearly = false;
      component.selectPlan('arcade');
      
      const data = component.getSelectedPlanData();
      expect(data).toBeDefined();
      expect(data?.plan.name).toBe('Arcade');
      expect(data?.billing).toBe('monthly');
      expect(data?.price).toBe(9);
    });

    it('should return correct data for selected yearly plan', () => {
      component.isYearly = true;
      component.selectPlan('pro');
      
      const data = component.getSelectedPlanData();
      expect(data).toBeDefined();
      expect(data?.plan.name).toBe('Pro');
      expect(data?.billing).toBe('yearly');
      expect(data?.price).toBe(150);
    });

    it('should update price when toggling billing after selection', () => {
      component.selectPlan('advanced');
      component.isYearly = false;
      
      let data = component.getSelectedPlanData();
      expect(data?.price).toBe(12);
      
      component.isYearly = true;
      data = component.getSelectedPlanData();
      expect(data?.price).toBe(120);
    });
  });
});