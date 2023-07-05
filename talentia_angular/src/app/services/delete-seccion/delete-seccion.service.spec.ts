import { TestBed } from '@angular/core/testing';

import { DeleteSeccionService } from './delete-seccion.service';

describe('DeleteSeccionService', () => {
  let service: DeleteSeccionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeleteSeccionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
