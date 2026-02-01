import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

// Interfaces
export interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
}

export interface Plan {
  id: string;
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
}

export interface AddOn {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  selected: boolean;
}

export interface FormState {
  personalInfo: PersonalInfo;
  selectedPlan: Plan | null;
  addOns: AddOn[];
  isYearly: boolean;
  currentStep: number;
}

@Injectable({
  providedIn: 'root'
})
export class FormStateService {
  
  // Estado inicial
  private initialState: FormState = {
    personalInfo: {
      name: '',
      email: '',
      phone: ''
    },
    selectedPlan: null,
    addOns: [
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
    ],
    isYearly: false,
    currentStep: 1
  };

  // BehaviorSubjects para estado reactivo
  private formState$ = new BehaviorSubject<FormState>(this.initialState);
  private isYearly$ = new BehaviorSubject<boolean>(false);

  constructor() {}

  // ========== GETTERS ==========
  
  getFormState(): Observable<FormState> {
    return this.formState$.asObservable();
  }

  getCurrentState(): FormState {
    return this.formState$.value;
  }

  getIsYearly(): Observable<boolean> {
    return this.isYearly$.asObservable();
  }

  getIsYearlyValue(): boolean {
    return this.isYearly$.value;
  }

  getPersonalInfo(): PersonalInfo {
    return this.formState$.value.personalInfo;
  }

  getSelectedPlan(): Plan | null {
    return this.formState$.value.selectedPlan;
  }

  getAddOns(): AddOn[] {
    return this.formState$.value.addOns;
  }

  getSelectedAddOns(): AddOn[] {
    return this.formState$.value.addOns.filter(a => a.selected);
  }

  getCurrentStep(): number {
    return this.formState$.value.currentStep;
  }

  // ========== SETTERS ==========

  setPersonalInfo(info: PersonalInfo): void {
    const currentState = this.formState$.value;
    this.formState$.next({
      ...currentState,
      personalInfo: info
    });
  }

  setSelectedPlan(plan: Plan | null): void {
    const currentState = this.formState$.value;
    this.formState$.next({
      ...currentState,
      selectedPlan: plan
    });
  }

  setAddOns(addOns: AddOn[]): void {
    const currentState = this.formState$.value;
    this.formState$.next({
      ...currentState,
      addOns: addOns
    });
  }

  toggleBilling(): void {
    const newValue = !this.isYearly$.value;
    this.isYearly$.next(newValue);
    
    const currentState = this.formState$.value;
    this.formState$.next({
      ...currentState,
      isYearly: newValue
    });
  }

  setCurrentStep(step: number): void {
    const currentState = this.formState$.value;
    this.formState$.next({
      ...currentState,
      currentStep: step
    });
  }

  // ========== VALIDACIONES ==========

  validateStep1(): boolean {
    const info = this.getPersonalInfo();
    
    // Validar que no estén vacíos
    if (!info.name || !info.email || !info.phone) {
      return false;
    }

    // Validar nombre (mínimo 2 caracteres)
    if (info.name.trim().length < 2) {
      return false;
    }

    // Validar email (formato básico)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(info.email)) {
      return false;
    }

    // Validar teléfono (solo números, +, espacios, paréntesis, guiones)
    const phoneRegex = /^[0-9+\s()-]+$/;
    if (!phoneRegex.test(info.phone)) {
      return false;
    }

    return true;
  }

  validateStep2(): boolean {
    return this.getSelectedPlan() !== null;
  }

  validateStep3(): boolean {
    // Step 3 es opcional, siempre es válido
    return true;
  }

  validateStep4(): boolean {
    // Step 4 es solo resumen, siempre es válido
    return true;
  }

  canProceedToNextStep(currentStep: number): boolean {
    switch (currentStep) {
      case 1:
        return this.validateStep1();
      case 2:
        return this.validateStep2();
      case 3:
        return this.validateStep3();
      case 4:
        return this.validateStep4();
      default:
        return false;
    }
  }

  // ========== CÁLCULOS ==========

  getPlanPrice(): number {
    const plan = this.getSelectedPlan();
    if (!plan) return 0;
    return this.isYearly$.value ? plan.yearlyPrice : plan.monthlyPrice;
  }

  getAddOnsTotal(): number {
    const selectedAddOns = this.getSelectedAddOns();
    return selectedAddOns.reduce((total, addOn) => {
      const price = this.isYearly$.value ? addOn.yearlyPrice : addOn.monthlyPrice;
      return total + price;
    }, 0);
  }

  getGrandTotal(): number {
    return this.getPlanPrice() + this.getAddOnsTotal();
  }

  // ========== UTILIDADES ==========

  resetForm(): void {
    this.formState$.next(this.initialState);
    this.isYearly$.next(false);
  }

  isFormComplete(): boolean {
    return this.validateStep1() && this.validateStep2();
  }

  getSummaryData() {
    const state = this.getCurrentState();
    return {
      personalInfo: state.personalInfo,
      plan: state.selectedPlan,
      addOns: this.getSelectedAddOns(),
      billing: state.isYearly ? 'yearly' : 'monthly',
      planPrice: this.getPlanPrice(),
      addOnsTotal: this.getAddOnsTotal(),
      grandTotal: this.getGrandTotal()
    };
  }
}
