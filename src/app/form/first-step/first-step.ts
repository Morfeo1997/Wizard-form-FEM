import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormStateService } from '../../services/form-state';

@Component({
  selector: 'app-first-step',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './first-step.html',
  styleUrls: ['./first-step.css']
})
export class FirstStepComponent implements OnInit {
  personalInfoForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private formStateService: FormStateService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadSavedData(); // Cargar datos si el usuario vuelve atrás
    this.subscribeToChanges(); // Guardar automáticamente
  }

  private loadSavedData(): void {
    const savedInfo = this.formStateService.getPersonalInfo();
    this.personalInfoForm.patchValue(savedInfo);
  }

  private subscribeToChanges(): void {
    this.personalInfoForm.valueChanges.subscribe(value => {
      this.formStateService.setPersonalInfo(value);
    });
  }

  private initForm(): void {
    this.personalInfoForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9+\s()-]+$/)]]
    });
  }

  get name() {
    return this.personalInfoForm.get('name');
  }

  get email() {
    return this.personalInfoForm.get('email');
  }

  get phone() {
    return this.personalInfoForm.get('phone');
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.personalInfoForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFormData() {
    return this.personalInfoForm.value;
  }

  isFormValid(): boolean {
    return this.personalInfoForm.valid;
  }
}