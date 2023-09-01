import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearEmpresaComponent } from './crear-empresa.component';

describe('CrearEmpresaComponent', () => {
  let component: CrearEmpresaComponent;
  let fixture: ComponentFixture<CrearEmpresaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CrearEmpresaComponent]
    });
    fixture = TestBed.createComponent(CrearEmpresaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
