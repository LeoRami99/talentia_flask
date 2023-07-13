import { TestBed } from '@angular/core/testing';

import { ProgresoCursoService } from './progreso-curso.service';

describe('ProgresoCursoService', () => {
  let service: ProgresoCursoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProgresoCursoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
