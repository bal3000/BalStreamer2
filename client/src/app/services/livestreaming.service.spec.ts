import { TestBed } from '@angular/core/testing';

import { LivestreamingService } from './livestreaming.service';

describe('LivestreamingService', () => {
  let service: LivestreamingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LivestreamingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
