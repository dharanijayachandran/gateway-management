import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GatewayTemplateIoTagViewComponent } from './gateway-template-io-tag-view.component';

describe('GatewayTemplateIoTagViewComponent', () => {
  let component: GatewayTemplateIoTagViewComponent;
  let fixture: ComponentFixture<GatewayTemplateIoTagViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GatewayTemplateIoTagViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GatewayTemplateIoTagViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
