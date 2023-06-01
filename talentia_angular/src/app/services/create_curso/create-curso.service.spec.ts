import { TestBed } from '@angular/core/testing';

import { CreateCursoService } from './create-curso.service';

describe('CreateCursoService', () => {
  let service: CreateCursoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreateCursoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
