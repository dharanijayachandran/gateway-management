import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GatewayModelPortViewComponent } from './gateway-model-port-view.component';

describe('GatewayModelPortViewComponent', () => {
  let component: GatewayModelPortViewComponent;
  let fixture: ComponentFixture<GatewayModelPortViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GatewayModelPortViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GatewayModelPortViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
