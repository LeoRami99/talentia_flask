import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignUpEmpresaComponent } from './sign-up-empresa.component';

describe('SignUpEmpresaComponent', () => {
  let component: SignUpEmpresaComponent;
  let fixture: ComponentFixture<SignUpEmpresaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SignUpEmpresaComponent]
    });
    fixture = TestBed.createComponent(SignUpEmpresaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
