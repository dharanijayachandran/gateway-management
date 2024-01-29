import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GatewayModelPinComponent } from './gateway-model-pin.component';

describe('GatewayModelPinComponent', () => {
  let component: GatewayModelPinComponent;
  let fixture: ComponentFixture<GatewayModelPinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GatewayModelPinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GatewayModelPinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
