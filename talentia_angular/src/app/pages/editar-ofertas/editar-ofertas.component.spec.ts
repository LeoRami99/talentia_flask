import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarOfertasComponent } from './editar-ofertas.component';

describe('EditarOfertasComponent', () => {
  let component: EditarOfertasComponent;
  let fixture: ComponentFixture<EditarOfertasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditarOfertasComponent]
    });
    fixture = TestBed.createComponent(EditarOfertasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
