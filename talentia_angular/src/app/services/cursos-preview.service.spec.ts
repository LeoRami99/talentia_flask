import { TestBed } from '@angular/core/testing';

import { CursosPreviewService } from './cursos-preview.service';

describe('CursosPreviewService', () => {
  let service: CursosPreviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CursosPreviewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
