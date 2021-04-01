import { TestBed } from '@angular/core/testing';

import { ChromecastService } from './chromecast.service';

describe('ChromecastService', () => {
  let service: ChromecastService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChromecastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
