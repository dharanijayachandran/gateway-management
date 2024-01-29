import { TestBed } from '@angular/core/testing';

import { GatewayModelService } from './gateway-model.service';

describe('GatewayModelService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GatewayModelService = TestBed.get(GatewayModelService);
    expect(service).toBeTruthy();
  });
});
