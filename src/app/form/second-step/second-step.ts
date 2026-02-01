import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormStateService } from '../../services/form-state';

interface Plan {
  id: string;
  name: string;
  icon: string;
  monthlyPrice: number;
  yearlyPrice: number;
}

@Component({
  selector: 'app-second-step',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './second-step.html',
  styleUrls: ['./second-step.css']
})
export class SecondStepComponent implements OnInit {
  isYearly: boolean = false;
  selectedPlanId: string = '';

  plans: Plan[] = [
    {
      id: 'arcade',
      name: 'Arcade',
      icon: 'assets/icons/icon-arcade.svg',
      monthlyPrice: 9,
      yearlyPrice: 90
    },
    {
      id: 'advanced',
      name: 'Advanced',
      icon: 'assets/icons/icon-advanced.svg',
      monthlyPrice: 12,
      yearlyPrice: 120
    },
    {
      id: 'pro',
      name: 'Pro',
      icon: 'assets/icons/icon-pro.svg',
      monthlyPrice: 15,
      yearlyPrice: 150
    }
  ];

  constructor(private formStateService: FormStateService) {}

  ngOnInit(): void {
    // Suscribirse al estado de billing
    this.formStateService.getIsYearly().subscribe(isYearly => {
      this.isYearly = isYearly;
    });

    // Cargar plan seleccionado si existe
    const savedPlan = this.formStateService.getSelectedPlan();
    if (savedPlan) {
      this.selectedPlanId = savedPlan.id;
    }
  }

  toggleBilling(): void {
    //this.isYearly = !this.isYearly;
    this.formStateService.toggleBilling();
  }

  selectPlan(planId: string): void {
    this.selectedPlanId = planId;
    const plan = this.plans.find(p => p.id === planId);
    if (plan) {
      this.formStateService.setSelectedPlan(plan);
    }
  }

  isPlanSelected(planId: string): boolean {
    return this.selectedPlanId === planId;
  }

  getPlanPrice(plan: Plan): number {
    return this.isYearly ? plan.yearlyPrice : plan.monthlyPrice;
  }

  getPricePeriod(): string {
    return this.isYearly ? '/yr' : '/mo';
  }

  getSelectedPlanData() {
    const selected = this.plans.find(p => p.id === this.selectedPlanId);
    if (!selected) return null;

    return {
      plan: selected,
      billing: this.isYearly ? 'yearly' : 'monthly',
      price: this.getPlanPrice(selected)
    };
  }

  isFormValid(): boolean {
    return this.selectedPlanId !== '';
  }
}