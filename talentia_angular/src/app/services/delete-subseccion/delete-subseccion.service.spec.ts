import { TestBed } from '@angular/core/testing';

import { DeleteSubseccionService } from './delete-subseccion.service';

describe('DeleteSubseccionService', () => {
  let service: DeleteSubseccionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeleteSubseccionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
