import { TestBed } from '@angular/core/testing';

import { GatewayIoDhResponseTagService } from './gateway-io-dh-response-tag.service';

describe('GatewayIoDhResponseTagService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GatewayIoDhResponseTagService = TestBed.get(GatewayIoDhResponseTagService);
    expect(service).toBeTruthy();
  });
});
