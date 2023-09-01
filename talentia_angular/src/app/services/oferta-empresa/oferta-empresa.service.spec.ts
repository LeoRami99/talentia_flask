import { TestBed } from '@angular/core/testing';

import { OfertaEmpresaService } from './oferta-empresa.service';

describe('OfertaEmpresaService', () => {
  let service: OfertaEmpresaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OfertaEmpresaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
