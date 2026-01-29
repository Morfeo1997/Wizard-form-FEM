import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirstStepComponent } from './first-step/first-step';
import { SecondStepComponent } from './second-step/second-step';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, FirstStepComponent, SecondStepComponent],
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

  constructor() {}

  ngOnInit(): void {}

  goToStep(step: number): void {
    if (step >= 1 && step <= this.totalSteps) {
      this.currentStep = step;
    }
  }

  nextStep(): void {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  isStepActive(stepNumber: number): boolean {
    return this.currentStep === stepNumber;
  }

  isStepCompleted(stepNumber: number): boolean {
    return this.currentStep > stepNumber;
  }
}