import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
      icon: 'assets/images/icon-arcade.svg',
      monthlyPrice: 9,
      yearlyPrice: 90
    },
    {
      id: 'advanced',
      name: 'Advanced',
      icon: 'assets/images/icon-advanced.svg',
      monthlyPrice: 12,
      yearlyPrice: 120
    },
    {
      id: 'pro',
      name: 'Pro',
      icon: 'assets/images/icon-pro.svg',
      monthlyPrice: 15,
      yearlyPrice: 150
    }
  ];

  constructor() {}

  ngOnInit(): void {}

  toggleBilling(): void {
    this.isYearly = !this.isYearly;
  }

  selectPlan(planId: string): void {
    this.selectedPlanId = planId;
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