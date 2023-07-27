import { TestBed } from '@angular/core/testing';

import { UpdateEstadoExamenService } from './update-estado-examen.service';

describe('UpdateEstadoExamenService', () => {
  let service: UpdateEstadoExamenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpdateEstadoExamenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
