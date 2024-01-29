import { TestBed } from '@angular/core/testing';

import { GatewayTemplateIoTagService } from './gateway-template-io-tag.service';

describe('GatewayTemplateIoTagService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GatewayTemplateIoTagService = TestBed.get(GatewayTemplateIoTagService);
    expect(service).toBeTruthy();
  });
});
