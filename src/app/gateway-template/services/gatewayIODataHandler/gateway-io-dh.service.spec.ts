import { TestBed } from '@angular/core/testing';

import { GatewayIoDhService } from './gateway-io-dh.service';

describe('GatewayIoDhService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GatewayIoDhService = TestBed.get(GatewayIoDhService);
    expect(service).toBeTruthy();
  });
});
