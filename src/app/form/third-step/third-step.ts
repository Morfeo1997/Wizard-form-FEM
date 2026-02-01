import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormStateService } from '../../services/form-state';

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
  templateUrl: './third-step.html',
  styleUrls: ['./third-step.css']
})
export class ThirdStepComponent implements OnInit {
  @Input() isYearly: boolean = false;
  addOns: AddOn[] = [];
  /*
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
  */
  constructor(private formStateService: FormStateService) {}

  ngOnInit(): void {
    // Obtener add-ons del servicio
    this.addOns = this.formStateService.getAddOns();
    
    // Suscribirse al estado de billing
    this.formStateService.getIsYearly().subscribe(isYearly => {
      this.isYearly = isYearly;
    });
  }

  toggleAddOn(addOnId: string): void {
    const addOn = this.addOns.find(a => a.id === addOnId);
    if (addOn) {
      addOn.selected = !addOn.selected;
      this.formStateService.setAddOns(this.addOns);
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
