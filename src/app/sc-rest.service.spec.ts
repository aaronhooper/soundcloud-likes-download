import { TestBed } from '@angular/core/testing';

import { ScRestService } from './sc-rest.service';

describe('ScRestService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ScRestService = TestBed.get(ScRestService);
    expect(service).toBeTruthy();
  });
});
