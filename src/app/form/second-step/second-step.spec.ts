import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondStepComponent } from './second-step';

describe('SecondStepComponent', () => {
  let component: SecondStepComponent;
  let fixture: ComponentFixture<SecondStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecondStepComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecondStepComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
