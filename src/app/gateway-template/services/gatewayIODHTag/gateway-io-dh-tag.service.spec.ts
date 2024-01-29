import { TestBed } from '@angular/core/testing';

import { GatewayIoDhTagService } from './gateway-io-dh-tag.service';

describe('GatewayIoDhTagService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GatewayIoDhTagService = TestBed.get(GatewayIoDhTagService);
    expect(service).toBeTruthy();
  });
});
