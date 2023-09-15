import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerPostulantesComponent } from './ver-postulantes.component';

describe('VerPostulantesComponent', () => {
  let component: VerPostulantesComponent;
  let fixture: ComponentFixture<VerPostulantesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VerPostulantesComponent]
    });
    fixture = TestBed.createComponent(VerPostulantesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
