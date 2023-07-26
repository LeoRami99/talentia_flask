import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardExamenEditComponent } from './card-examen-edit.component';

describe('CardExamenEditComponent', () => {
  let component: CardExamenEditComponent;
  let fixture: ComponentFixture<CardExamenEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CardExamenEditComponent]
    });
    fixture = TestBed.createComponent(CardExamenEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
