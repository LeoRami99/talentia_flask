import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditExamenesComponent } from './edit-examenes.component';

describe('EditExamenesComponent', () => {
  let component: EditExamenesComponent;
  let fixture: ComponentFixture<EditExamenesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditExamenesComponent]
    });
    fixture = TestBed.createComponent(EditExamenesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
