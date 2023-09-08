import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditOfertaComponent } from './edit-oferta.component';

describe('EditOfertaComponent', () => {
  let component: EditOfertaComponent;
  let fixture: ComponentFixture<EditOfertaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditOfertaComponent]
    });
    fixture = TestBed.createComponent(EditOfertaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
