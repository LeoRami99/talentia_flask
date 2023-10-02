import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackVerifyComponent } from './back-verify.component';

describe('BackVerifyComponent', () => {
  let component: BackVerifyComponent;
  let fixture: ComponentFixture<BackVerifyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BackVerifyComponent]
    });
    fixture = TestBed.createComponent(BackVerifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
