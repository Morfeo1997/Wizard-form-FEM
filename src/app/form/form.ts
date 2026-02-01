import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirstStepComponent } from './first-step/first-step';
import { SecondStepComponent } from './second-step/second-step';
import { ThirdStepComponent } from './third-step/third-step';
import { FourthStepComponent } from './fourth-step/fourth-step';
import { FormStateService } from '../services/form-state';


@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, FirstStepComponent, SecondStepComponent, ThirdStepComponent, FourthStepComponent],
  templateUrl: './form.html',
  styleUrls: ['./form.css']
})
export class Form implements OnInit {
  currentStep: number = 1;
  totalSteps: number = 4;

  steps = [
    { number: 1, title: 'YOUR INFO', label: 'Step 1' },
    { number: 2, title: 'SELECT PLAN', label: 'Step 2' },
    { number: 3, title: 'ADD-ONS', label: 'Step 3' },
    { number: 4, title: 'SUMMARY', label: 'Step 4' }
  ];

  constructor(private formStateService: FormStateService) {}

  ngOnInit(): void {
    // Suscribirse al estado si lo necesitas
    this.formStateService.getFormState().subscribe(state => {
      this.currentStep = state.currentStep;
    });
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
}