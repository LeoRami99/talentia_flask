import { TestBed } from '@angular/core/testing';

import { GetCourseService } from './get-course.service';

describe('GetCourseService', () => {
  let service: GetCourseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetCourseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
