import { TestBed } from '@angular/core/testing';

import { ConquestService } from '../conquest.service';

describe('ConquestService', () => {
  let service: ConquestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConquestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
