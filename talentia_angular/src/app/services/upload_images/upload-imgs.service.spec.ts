import { TestBed } from '@angular/core/testing';

import { UploadImgsService } from './upload-imgs.service';

describe('UploadImgsService', () => {
  let service: UploadImgsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UploadImgsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
