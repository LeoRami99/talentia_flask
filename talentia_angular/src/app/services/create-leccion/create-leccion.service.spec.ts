import { TestBed } from '@angular/core/testing';

import { CreateLeccionService } from './create-leccion.service';

describe('CreateLeccionService', () => {
  let service: CreateLeccionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreateLeccionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
