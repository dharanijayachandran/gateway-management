import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GatewayTemplateIoTagComponent } from './gateway-template-io-tag.component';

describe('GatewayTemplateIoTagComponent', () => {
  let component: GatewayTemplateIoTagComponent;
  let fixture: ComponentFixture<GatewayTemplateIoTagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GatewayTemplateIoTagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GatewayTemplateIoTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
