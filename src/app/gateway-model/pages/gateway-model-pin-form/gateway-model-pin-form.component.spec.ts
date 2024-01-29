import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GatewayModelPinFormComponent } from './gateway-model-pin-form.component';

describe('GatewayModelPinFormComponent', () => {
  let component: GatewayModelPinFormComponent;
  let fixture: ComponentFixture<GatewayModelPinFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GatewayModelPinFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GatewayModelPinFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
