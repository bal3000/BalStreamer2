import { TestBed } from '@angular/core/testing';

import { CastService } from './cast.service';

describe('CastService', () => {
  let service: CastService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
