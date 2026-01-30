import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FourthStepComponent } from './fourth-step.component';

describe('FourthStepComponent', () => {
  let component: FourthStepComponent;
  let fixture: ComponentFixture<FourthStepComponent>;

  const mockPlan = {
    id: 'arcade',
    name: 'Arcade',
    monthlyPrice: 9,
    yearlyPrice: 90
  };

  const mockAddOns = [
    {
      id: 'online-service',
      name: 'Online service',
      monthlyPrice: 1,
      yearlyPrice: 10
    },
    {
      id: 'larger-storage',
      name: 'Larger storage',
      monthlyPrice: 2,
      yearlyPrice: 20
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FourthStepComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(FourthStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with monthly billing by default', () => {
    expect(component.isYearly).toBe(false);
  });

  it('should initialize with no plan selected', () => {
    expect(component.selectedPlan).toBeNull();
  });

  it('should initialize with empty add-ons array', () => {
    expect(component.selectedAddOns).toEqual([]);
  });

  describe('Plan Price', () => {
    it('should return 0 when no plan is selected', () => {
      expect(component.getPlanPrice()).toBe(0);
    });

    it('should return monthly price when billing is monthly', () => {
      component.selectedPlan = mockPlan;
      component.isYearly = false;
      expect(component.getPlanPrice()).toBe(9);
    });

    it('should return yearly price when billing is yearly', () => {
      component.selectedPlan = mockPlan;
      component.isYearly = true;
      expect(component.getPlanPrice()).toBe(90);
    });
  });

  describe('Add-on Price', () => {
    it('should return monthly price when billing is monthly', () => {
      component.isYearly = false;
      expect(component.getAddOnPrice(mockAddOns[0])).toBe(1);
    });

    it('should return yearly price when billing is yearly', () => {
      component.isYearly = true;
      expect(component.getAddOnPrice(mockAddOns[0])).toBe(10);
    });
  });

  describe('Display Texts', () => {
    it('should return correct price period for monthly', () => {
      component.isYearly = false;
      expect(component.getPricePeriod()).toBe('/mo');
    });

    it('should return correct price period for yearly', () => {
      component.isYearly = true;
      expect(component.getPricePeriod()).toBe('/yr');
    });

    it('should return Monthly as billing type when monthly', () => {
      component.isYearly = false;
      expect(component.getBillingType()).toBe('Monthly');
    });

    it('should return Yearly as billing type when yearly', () => {
      component.isYearly = true;
      expect(component.getBillingType()).toBe('Yearly');
    });

    it('should return correct total label for monthly', () => {
      component.isYearly = false;
      expect(component.getTotalLabel()).toBe('Total (per month)');
    });

    it('should return correct total label for yearly', () => {
      component.isYearly = true;
      expect(component.getTotalLabel()).toBe('Total (per year)');
    });
  });

  describe('Add-ons Total', () => {
    it('should return 0 when no add-ons selected', () => {
      component.selectedAddOns = [];
      expect(component.getAddOnsTotal()).toBe(0);
    });

    it('should calculate total for monthly add-ons', () => {
      component.isYearly = false;
      component.selectedAddOns = mockAddOns;
      expect(component.getAddOnsTotal()).toBe(3); // 1 + 2
    });

    it('should calculate total for yearly add-ons', () => {
      component.isYearly = true;
      component.selectedAddOns = mockAddOns;
      expect(component.getAddOnsTotal()).toBe(30); // 10 + 20
    });

    it('should calculate total for single add-on', () => {
      component.isYearly = false;
      component.selectedAddOns = [mockAddOns[0]];
      expect(component.getAddOnsTotal()).toBe(1);
    });
  });

  describe('Grand Total', () => {
    it('should return 0 when nothing is selected', () => {
      component.selectedPlan = null;
      component.selectedAddOns = [];
      expect(component.getGrandTotal()).toBe(0);
    });

    it('should calculate total with only plan (monthly)', () => {
      component.isYearly = false;
      component.selectedPlan = mockPlan;
      component.selectedAddOns = [];
      expect(component.getGrandTotal()).toBe(9);
    });

    it('should calculate total with only plan (yearly)', () => {
      component.isYearly = true;
      component.selectedPlan = mockPlan;
      component.selectedAddOns = [];
      expect(component.getGrandTotal()).toBe(90);
    });

    it('should calculate total with plan and add-ons (monthly)', () => {
      component.isYearly = false;
      component.selectedPlan = mockPlan;
      component.selectedAddOns = mockAddOns;
      expect(component.getGrandTotal()).toBe(12); // 9 + 1 + 2
    });

    it('should calculate total with plan and add-ons (yearly)', () => {
      component.isYearly = true;
      component.selectedPlan = mockPlan;
      component.selectedAddOns = mockAddOns;
      expect(component.getGrandTotal()).toBe(120); // 90 + 10 + 20
    });

    it('should update grand total when toggling billing', () => {
      component.selectedPlan = mockPlan;
      component.selectedAddOns = mockAddOns;
      
      component.isYearly = false;
      expect(component.getGrandTotal()).toBe(12);
      
      component.isYearly = true;
      expect(component.getGrandTotal()).toBe(120);
    });
  });

  describe('State Checks', () => {
    it('should return false when no plan is selected', () => {
      component.selectedPlan = null;
      expect(component.hasPlan()).toBe(false);
    });

    it('should return true when plan is selected', () => {
      component.selectedPlan = mockPlan;
      expect(component.hasPlan()).toBe(true);
    });

    it('should return false when no add-ons are selected', () => {
      component.selectedAddOns = [];
      expect(component.hasAddOns()).toBe(false);
    });

    it('should return true when add-ons are selected', () => {
      component.selectedAddOns = mockAddOns;
      expect(component.hasAddOns()).toBe(true);
    });
  });

  describe('Change Plan Event', () => {
    it('should emit changePlan event when onChangePlan is called', () => {
      spyOn(component.changePlan, 'emit');
      component.onChangePlan();
      expect(component.changePlan.emit).toHaveBeenCalled();
    });

    it('should emit changePlan event only once per call', () => {
      spyOn(component.changePlan, 'emit');
      component.onChangePlan();
      expect(component.changePlan.emit).toHaveBeenCalledTimes(1);
    });
  });

  describe('Complete Scenarios', () => {
    it('should handle Arcade Monthly with 2 add-ons correctly', () => {
      component.isYearly = false;
      component.selectedPlan = mockPlan;
      component.selectedAddOns = mockAddOns;

      expect(component.getBillingType()).toBe('Monthly');
      expect(component.getPlanPrice()).toBe(9);
      expect(component.getAddOnsTotal()).toBe(3);
      expect(component.getGrandTotal()).toBe(12);
      expect(component.getTotalLabel()).toBe('Total (per month)');
      expect(component.getPricePeriod()).toBe('/mo');
    });

    it('should handle Arcade Yearly with 2 add-ons correctly', () => {
      component.isYearly = true;
      component.selectedPlan = mockPlan;
      component.selectedAddOns = mockAddOns;

      expect(component.getBillingType()).toBe('Yearly');
      expect(component.getPlanPrice()).toBe(90);
      expect(component.getAddOnsTotal()).toBe(30);
      expect(component.getGrandTotal()).toBe(120);
      expect(component.getTotalLabel()).toBe('Total (per year)');
      expect(component.getPricePeriod()).toBe('/yr');
    });
  });
});
