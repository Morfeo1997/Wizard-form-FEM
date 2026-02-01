import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormStateService } from '../../services/form-state';

interface Plan {
  id: string;
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
}

interface AddOn {
  id: string;
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
}

@Component({
  selector: 'app-fourth-step',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './fourth-step.html',
  styleUrls: ['./fourth-step.css']
})
export class FourthStepComponent implements OnInit {
  /*@Input() isYearly: boolean = false;
  @Input() selectedPlan: Plan | null = null;
  @Input() selectedAddOns: AddOn[] = [];
  @Output() changePlan = new EventEmitter<void>();*/
  selectedPlan: Plan | null = null;
  selectedAddOns: AddOn[] = [];
  isYearly: boolean = false;
  @Output() changePlan = new EventEmitter<void>();

  constructor(private formStateService: FormStateService) {}

  ngOnInit(): void {
    // Cargar todos los datos del servicio
    this.selectedPlan = this.formStateService.getSelectedPlan();
    this.selectedAddOns = this.formStateService.getSelectedAddOns();
    
    this.formStateService.getIsYearly().subscribe(isYearly => {
      this.isYearly = isYearly;
    });
  }

  getPlanPrice(): number {
    if (!this.selectedPlan) return 0;
    return this.isYearly ? this.selectedPlan.yearlyPrice : this.selectedPlan.monthlyPrice;
  }

  getAddOnPrice(addOn: AddOn): number {
    return this.isYearly ? addOn.yearlyPrice : addOn.monthlyPrice;
  }

  getPricePeriod(): string {
    return this.isYearly ? '/yr' : '/mo';
  }

  getBillingType(): string {
    return this.isYearly ? 'Yearly' : 'Monthly';
  }

  getTotalLabel(): string {
    return this.isYearly ? 'Total (per year)' : 'Total (per month)';
  }

  getAddOnsTotal(): number {
    return this.selectedAddOns.reduce((total, addOn) => {
      return total + this.getAddOnPrice(addOn);
    }, 0);
  }

  getGrandTotal(): number {
    return this.getPlanPrice() + this.getAddOnsTotal();
  }

  onChangePlan(): void {
    // Emitir evento para que main-form vaya al step 2
    this.changePlan.emit();
  }

  hasPlan(): boolean {
    return this.selectedPlan !== null;
  }

  hasAddOns(): boolean {
    return this.selectedAddOns.length > 0;
  }
}
