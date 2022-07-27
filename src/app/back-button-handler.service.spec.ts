import { TestBed } from '@angular/core/testing';

import { BackButtonHandlerService } from './back-button-handler.service';

describe('BackButtonHandlerService', () => {
  let service: BackButtonHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BackButtonHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
