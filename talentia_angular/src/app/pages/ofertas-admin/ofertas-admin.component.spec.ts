import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfertasAdminComponent } from './ofertas-admin.component';

describe('OfertasAdminComponent', () => {
  let component: OfertasAdminComponent;
  let fixture: ComponentFixture<OfertasAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OfertasAdminComponent]
    });
    fixture = TestBed.createComponent(OfertasAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
