import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardHomeExamenComponent } from './card-home-examen.component';

describe('CardHomeExamenComponent', () => {
  let component: CardHomeExamenComponent;
  let fixture: ComponentFixture<CardHomeExamenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CardHomeExamenComponent]
    });
    fixture = TestBed.createComponent(CardHomeExamenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
