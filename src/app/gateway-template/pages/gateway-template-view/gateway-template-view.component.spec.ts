import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GatewayTemplateViewComponent } from './gateway-template-view.component';

describe('GatewayTemplateViewComponent', () => {
  let component: GatewayTemplateViewComponent;
  let fixture: ComponentFixture<GatewayTemplateViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GatewayTemplateViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GatewayTemplateViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
