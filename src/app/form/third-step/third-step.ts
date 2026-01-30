import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface AddOn {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  selected: boolean;
}

@Component({
  selector: 'app-third-step',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './third-step.component.html',
  styleUrls: ['./third-step.component.css']
})
export class ThirdStepComponent implements OnInit {
  @Input() isYearly: boolean = false;

  addOns: AddOn[] = [
    {
      id: 'online-service',
      name: 'Online service',
      description: 'Access to multiplayer games',
      monthlyPrice: 1,
      yearlyPrice: 10,
      selected: false
    },
    {
      id: 'larger-storage',
      name: 'Larger storage',
      description: 'Extra 1TB of cloud save',
      monthlyPrice: 2,
      yearlyPrice: 20,
      selected: false
    },
    {
      id: 'customizable-profile',
      name: 'Customizable profile',
      description: 'Custom theme on your profile',
      monthlyPrice: 2,
      yearlyPrice: 20,
      selected: false
    }
  ];

  constructor() {}

  ngOnInit(): void {}

  toggleAddOn(addOnId: string): void {
    const addOn = this.addOns.find(a => a.id === addOnId);
    if (addOn) {
      addOn.selected = !addOn.selected;
    }
  }

  isAddOnSelected(addOnId: string): boolean {
    const addOn = this.addOns.find(a => a.id === addOnId);
    return addOn ? addOn.selected : false;
  }

  getAddOnPrice(addOn: AddOn): number {
    return this.isYearly ? addOn.yearlyPrice : addOn.monthlyPrice;
  }

  getPricePeriod(): string {
    return this.isYearly ? '/yr' : '/mo';
  }

  getSelectedAddOns(): AddOn[] {
    return this.addOns.filter(addOn => addOn.selected);
  }

  getSelectedAddOnsData() {
    return this.getSelectedAddOns().map(addOn => ({
      id: addOn.id,
      name: addOn.name,
      price: this.getAddOnPrice(addOn),
      billing: this.isYearly ? 'yearly' : 'monthly'
    }));
  }

  getTotalAddOnsPrice(): number {
    return this.getSelectedAddOns().reduce((total, addOn) => {
      return total + this.getAddOnPrice(addOn);
    }, 0);
  }
}
