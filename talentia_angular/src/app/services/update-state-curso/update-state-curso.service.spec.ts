import { TestBed } from '@angular/core/testing';

import { UpdateStateCursoService } from './update-state-curso.service';

describe('UpdateStateCursoService', () => {
  let service: UpdateStateCursoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpdateStateCursoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
