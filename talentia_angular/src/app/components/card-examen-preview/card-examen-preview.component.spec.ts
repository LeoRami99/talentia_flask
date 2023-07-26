import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardExamenPreviewComponent } from './card-examen-preview.component';

describe('CardExamenPreviewComponent', () => {
  let component: CardExamenPreviewComponent;
  let fixture: ComponentFixture<CardExamenPreviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CardExamenPreviewComponent]
    });
    fixture = TestBed.createComponent(CardExamenPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
