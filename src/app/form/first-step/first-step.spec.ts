import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { FirstStepComponent } from './first-step';

describe('FirstStepComponent', () => {
  let component: FirstStepComponent;
  let fixture: ComponentFixture<FirstStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FirstStepComponent, ReactiveFormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(FirstStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.personalInfoForm.get('name')?.value).toBe('');
    expect(component.personalInfoForm.get('email')?.value).toBe('');
    expect(component.personalInfoForm.get('phone')?.value).toBe('');
  });

  describe('Form Validation', () => {
    it('should be invalid when empty', () => {
      expect(component.personalInfoForm.valid).toBeFalsy();
    });

    it('should validate name field as required', () => {
      const name = component.personalInfoForm.get('name');
      expect(name?.valid).toBeFalsy();
      expect(name?.hasError('required')).toBeTruthy();
    });

    it('should validate name minimum length', () => {
      const name = component.personalInfoForm.get('name');
      name?.setValue('A');
      expect(name?.hasError('minlength')).toBeTruthy();
      
      name?.setValue('AB');
      expect(name?.hasError('minlength')).toBeFalsy();
    });

    it('should validate email field as required', () => {
      const email = component.personalInfoForm.get('email');
      expect(email?.valid).toBeFalsy();
      expect(email?.hasError('required')).toBeTruthy();
    });

    it('should validate email format', () => {
      const email = component.personalInfoForm.get('email');
      email?.setValue('invalidemail');
      expect(email?.hasError('email')).toBeTruthy();
      
      email?.setValue('valid@email.com');
      expect(email?.hasError('email')).toBeFalsy();
    });

    it('should validate phone field as required', () => {
      const phone = component.personalInfoForm.get('phone');
      expect(phone?.valid).toBeFalsy();
      expect(phone?.hasError('required')).toBeTruthy();
    });

    it('should validate phone format', () => {
      const phone = component.personalInfoForm.get('phone');
      phone?.setValue('invalid phone');
      expect(phone?.hasError('pattern')).toBeTruthy();
      
      phone?.setValue('+1 234 567 890');
      expect(phone?.hasError('pattern')).toBeFalsy();
    });

    it('should be valid when all fields are correctly filled', () => {
      component.personalInfoForm.patchValue({
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1 234 567 890'
      });
      expect(component.personalInfoForm.valid).toBeTruthy();
    });
  });

  describe('Helper Methods', () => {
    it('should detect invalid fields', () => {
      const name = component.personalInfoForm.get('name');
      name?.markAsTouched();
      expect(component.isFieldInvalid('name')).toBeTruthy();
      
      name?.setValue('John Doe');
      expect(component.isFieldInvalid('name')).toBeFalsy();
    });

    it('should return form data', () => {
      const testData = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        phone: '+1 987 654 321'
      };
      component.personalInfoForm.patchValue(testData);
      expect(component.getFormData()).toEqual(testData);
    });

    it('should check form validity', () => {
      expect(component.isFormValid()).toBeFalsy();
      
      component.personalInfoForm.patchValue({
        name: 'Test User',
        email: 'test@example.com',
        phone: '+1 111 222 333'
      });
      expect(component.isFormValid()).toBeTruthy();
    });
  });
});