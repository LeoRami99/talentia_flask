import { TestBed } from '@angular/core/testing';

import { CreateModuleService } from './create-module.service';

describe('CreateModuleService', () => {
  let service: CreateModuleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreateModuleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
