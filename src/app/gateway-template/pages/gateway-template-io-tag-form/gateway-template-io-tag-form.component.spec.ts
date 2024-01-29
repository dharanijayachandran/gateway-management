import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GatewayTemplateIoTagFormComponent } from './gateway-template-io-tag-form.component';

describe('GatewayTemplateIoTagFormComponent', () => {
  let component: GatewayTemplateIoTagFormComponent;
  let fixture: ComponentFixture<GatewayTemplateIoTagFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GatewayTemplateIoTagFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GatewayTemplateIoTagFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
