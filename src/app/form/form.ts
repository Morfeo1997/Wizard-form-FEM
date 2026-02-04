import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FirstStepComponent } from './first-step/first-step';
import { SecondStepComponent } from './second-step/second-step';
import { ThirdStepComponent } from './third-step/third-step';
import { FourthStepComponent } from './fourth-step/fourth-step';
import { ThankYouComponent} from './summary/summary'
import { FormStateService } from '../services/form-state';


@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, FirstStepComponent, SecondStepComponent, ThirdStepComponent, FourthStepComponent, ThankYouComponent],
  templateUrl: './form.html',
  styleUrls: ['./form.css']
})
export class Form implements OnInit {
  currentStep: number = 1;
  totalSteps: number = 4;
  isConfirmed: boolean = false;
  isMobile: boolean = false;

  steps = [
    { number: 1, title: 'YOUR INFO', label: 'Step 1' },
    { number: 2, title: 'SELECT PLAN', label: 'Step 2' },
    { number: 3, title: 'ADD-ONS', label: 'Step 3' },
    { number: 4, title: 'SUMMARY', label: 'Step 4' }
  ];

  constructor(private formStateService: FormStateService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    // Suscribirse al estado si lo necesitas
    this.checkIfMobile();
    if (isPlatformBrowser(this.platformId)) {
      window.addEventListener('resize', () => this.checkIfMobile());
    }
    this.formStateService.getFormState().subscribe(state => {
      this.currentStep = state.currentStep;
    });
  }

  private checkIfMobile(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.isMobile = window.innerWidth < 768;
    }
  }

  nextStep(): void {
    // VALIDAR antes de avanzar
    if (!this.formStateService.canProceedToNextStep(this.currentStep)) {
      alert('Por favor completa los campos requeridos');
      return;
    }

    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
      this.formStateService.setCurrentStep(this.currentStep);
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.formStateService.setCurrentStep(this.currentStep);
    }
  }

  isStepActive(stepNumber: number): boolean {
    return this.currentStep === stepNumber;
  }

  isStepCompleted(stepNumber: number): boolean {
    return this.currentStep > stepNumber;
  }

  confirmForm(): void {
    // Validar que el formulario esté completo
    if (!this.formStateService.isFormComplete()) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    // Obtener resumen completo del formulario
    const formData = this.formStateService.getSummaryData();
    
    // Mostrar en consola
    console.log('=== FORMULARIO ENVIADO ===');
    console.log('Personal Info:', formData.personalInfo);
    console.log('Plan:', formData.plan);
    console.log('Add-ons:', formData.addOns);
    console.log('Billing:', formData.billing);
    console.log('Plan Price:', formData.planPrice);
    console.log('Add-ons Total:', formData.addOnsTotal);
    console.log('Grand Total:', formData.grandTotal);
    console.log('=========================');
    
    // Aquí podrías hacer una llamada HTTP a tu backend
    // this.http.post('/api/submit-form', formData).subscribe(...)
    
    // Marcar como confirmado para mostrar pantalla de agradecimiento
    this.isConfirmed = true;
  }
}