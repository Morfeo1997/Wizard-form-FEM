import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ThirdStepComponent } from './third-step.component';

describe('ThirdStepComponent', () => {
  let component: ThirdStepComponent;
  let fixture: ComponentFixture<ThirdStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThirdStepComponent, FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(ThirdStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with monthly billing by default', () => {
    expect(component.isYearly).toBe(false);
  });

  it('should have 3 add-ons available', () => {
    expect(component.addOns.length).toBe(3);
  });

  it('should initialize with no add-ons selected', () => {
    component.addOns.forEach(addOn => {
      expect(addOn.selected).toBe(false);
    });
  });

  describe('Add-ons Data', () => {
    it('should have online service add-on with correct data', () => {
      const onlineService = component.addOns.find(a => a.id === 'online-service');
      expect(onlineService).toBeDefined();
      expect(onlineService?.name).toBe('Online service');
      expect(onlineService?.description).toBe('Access to multiplayer games');
      expect(onlineService?.monthlyPrice).toBe(1);
      expect(onlineService?.yearlyPrice).toBe(10);
    });

    it('should have larger storage add-on with correct data', () => {
      const largerStorage = component.addOns.find(a => a.id === 'larger-storage');
      expect(largerStorage).toBeDefined();
      expect(largerStorage?.name).toBe('Larger storage');
      expect(largerStorage?.description).toBe('Extra 1TB of cloud save');
      expect(largerStorage?.monthlyPrice).toBe(2);
      expect(largerStorage?.yearlyPrice).toBe(20);
    });

    it('should have customizable profile add-on with correct data', () => {
      const customProfile = component.addOns.find(a => a.id === 'customizable-profile');
      expect(customProfile).toBeDefined();
      expect(customProfile?.name).toBe('Customizable profile');
      expect(customProfile?.description).toBe('Custom theme on your profile');
      expect(customProfile?.monthlyPrice).toBe(2);
      expect(customProfile?.yearlyPrice).toBe(20);
    });
  });

  describe('Add-on Selection', () => {
    it('should select an add-on', () => {
      component.toggleAddOn('online-service');
      expect(component.isAddOnSelected('online-service')).toBe(true);
    });

    it('should deselect a selected add-on', () => {
      component.toggleAddOn('larger-storage');
      expect(component.isAddOnSelected('larger-storage')).toBe(true);
      
      component.toggleAddOn('larger-storage');
      expect(component.isAddOnSelected('larger-storage')).toBe(false);
    });

    it('should select multiple add-ons', () => {
      component.toggleAddOn('online-service');
      component.toggleAddOn('customizable-profile');
      
      expect(component.isAddOnSelected('online-service')).toBe(true);
      expect(component.isAddOnSelected('customizable-profile')).toBe(true);
      expect(component.isAddOnSelected('larger-storage')).toBe(false);
    });

    it('should handle invalid add-on id gracefully', () => {
      expect(() => component.toggleAddOn('non-existent')).not.toThrow();
      expect(component.isAddOnSelected('non-existent')).toBe(false);
    });
  });

  describe('Price Calculations', () => {
    const onlineService = {
      id: 'online-service',
      name: 'Online service',
      description: 'Access to multiplayer games',
      monthlyPrice: 1,
      yearlyPrice: 10,
      selected: false
    };

    it('should return monthly price when billing is monthly', () => {
      component.isYearly = false;
      expect(component.getAddOnPrice(onlineService)).toBe(1);
    });

    it('should return yearly price when billing is yearly', () => {
      component.isYearly = true;
      expect(component.getAddOnPrice(onlineService)).toBe(10);
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

  describe('Get Selected Add-ons', () => {
    it('should return empty array when no add-ons selected', () => {
      expect(component.getSelectedAddOns()).toEqual([]);
    });

    it('should return selected add-ons', () => {
      component.toggleAddOn('online-service');
      component.toggleAddOn('larger-storage');
      
      const selected = component.getSelectedAddOns();
      expect(selected.length).toBe(2);
      expect(selected[0].id).toBe('online-service');
      expect(selected[1].id).toBe('larger-storage');
    });

    it('should return all add-ons when all are selected', () => {
      component.toggleAddOn('online-service');
      component.toggleAddOn('larger-storage');
      component.toggleAddOn('customizable-profile');
      
      expect(component.getSelectedAddOns().length).toBe(3);
    });
  });

  describe('Get Selected Add-ons Data', () => {
    it('should return empty array when no add-ons selected', () => {
      expect(component.getSelectedAddOnsData()).toEqual([]);
    });

    it('should return correct data for selected monthly add-ons', () => {
      component.isYearly = false;
      component.toggleAddOn('online-service');
      
      const data = component.getSelectedAddOnsData();
      expect(data.length).toBe(1);
      expect(data[0].id).toBe('online-service');
      expect(data[0].name).toBe('Online service');
      expect(data[0].price).toBe(1);
      expect(data[0].billing).toBe('monthly');
    });

    it('should return correct data for selected yearly add-ons', () => {
      component.isYearly = true;
      component.toggleAddOn('larger-storage');
      
      const data = component.getSelectedAddOnsData();
      expect(data.length).toBe(1);
      expect(data[0].id).toBe('larger-storage');
      expect(data[0].name).toBe('Larger storage');
      expect(data[0].price).toBe(20);
      expect(data[0].billing).toBe('yearly');
    });

    it('should return data for multiple selected add-ons', () => {
      component.isYearly = false;
      component.toggleAddOn('online-service');
      component.toggleAddOn('customizable-profile');
      
      const data = component.getSelectedAddOnsData();
      expect(data.length).toBe(2);
    });
  });

  describe('Total Add-ons Price', () => {
    it('should return 0 when no add-ons selected', () => {
      expect(component.getTotalAddOnsPrice()).toBe(0);
    });

    it('should calculate total for single monthly add-on', () => {
      component.isYearly = false;
      component.toggleAddOn('online-service');
      expect(component.getTotalAddOnsPrice()).toBe(1);
    });

    it('should calculate total for single yearly add-on', () => {
      component.isYearly = true;
      component.toggleAddOn('larger-storage');
      expect(component.getTotalAddOnsPrice()).toBe(20);
    });

    it('should calculate total for multiple monthly add-ons', () => {
      component.isYearly = false;
      component.toggleAddOn('online-service'); // $1
      component.toggleAddOn('larger-storage'); // $2
      expect(component.getTotalAddOnsPrice()).toBe(3);
    });

    it('should calculate total for multiple yearly add-ons', () => {
      component.isYearly = true;
      component.toggleAddOn('larger-storage'); // $20
      component.toggleAddOn('customizable-profile'); // $20
      expect(component.getTotalAddOnsPrice()).toBe(40);
    });

    it('should calculate total for all add-ons monthly', () => {
      component.isYearly = false;
      component.toggleAddOn('online-service'); // $1
      component.toggleAddOn('larger-storage'); // $2
      component.toggleAddOn('customizable-profile'); // $2
      expect(component.getTotalAddOnsPrice()).toBe(5);
    });

    it('should calculate total for all add-ons yearly', () => {
      component.isYearly = true;
      component.toggleAddOn('online-service'); // $10
      component.toggleAddOn('larger-storage'); // $20
      component.toggleAddOn('customizable-profile'); // $20
      expect(component.getTotalAddOnsPrice()).toBe(50);
    });

    it('should update total when toggling billing', () => {
      component.isYearly = false;
      component.toggleAddOn('online-service');
      expect(component.getTotalAddOnsPrice()).toBe(1);
      
      component.isYearly = true;
      expect(component.getTotalAddOnsPrice()).toBe(10);
    });
  });
});
