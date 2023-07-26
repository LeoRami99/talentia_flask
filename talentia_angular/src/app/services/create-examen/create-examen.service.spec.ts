import { TestBed } from '@angular/core/testing';

import { CreateExamenService } from './create-examen.service';

describe('CreateExamenService', () => {
  let service: CreateExamenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreateExamenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
