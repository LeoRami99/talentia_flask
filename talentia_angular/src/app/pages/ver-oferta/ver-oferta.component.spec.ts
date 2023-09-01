import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerOfertaComponent } from './ver-oferta.component';

describe('VerOfertaComponent', () => {
  let component: VerOfertaComponent;
  let fixture: ComponentFixture<VerOfertaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VerOfertaComponent]
    });
    fixture = TestBed.createComponent(VerOfertaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
