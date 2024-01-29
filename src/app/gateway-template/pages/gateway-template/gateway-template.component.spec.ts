import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GatewayTemplateComponent } from './gateway-template.component';

describe('GatewayTemplateComponent', () => {
  let component: GatewayTemplateComponent;
  let fixture: ComponentFixture<GatewayTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GatewayTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GatewayTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
