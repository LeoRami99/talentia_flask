import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BotonSidebarComponent } from './boton-sidebar.component';

describe('BotonSidebarComponent', () => {
  let component: BotonSidebarComponent;
  let fixture: ComponentFixture<BotonSidebarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BotonSidebarComponent]
    });
    fixture = TestBed.createComponent(BotonSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
