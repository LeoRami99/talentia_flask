import { TestBed } from '@angular/core/testing';

import { UpdateCursoService } from './update-curso.service';

describe('UpdateCursoService', () => {
  let service: UpdateCursoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpdateCursoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
