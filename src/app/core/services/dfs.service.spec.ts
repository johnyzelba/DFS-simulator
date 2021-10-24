import { TestBed } from '@angular/core/testing';

import { DFSService } from './dfs.service';

describe('DFSService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DFSService = TestBed.get(DFSService);
    expect(service).toBeTruthy();
  });
});
