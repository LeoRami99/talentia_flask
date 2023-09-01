import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfertaEditCardComponent } from './oferta-edit-card.component';

describe('OfertaEditCardComponent', () => {
  let component: OfertaEditCardComponent;
  let fixture: ComponentFixture<OfertaEditCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OfertaEditCardComponent]
    });
    fixture = TestBed.createComponent(OfertaEditCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
