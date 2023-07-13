import { TestBed } from '@angular/core/testing';

import { CrearProgresoService } from './crear-progreso.service';

describe('CrearProgresoService', () => {
  let service: CrearProgresoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CrearProgresoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
