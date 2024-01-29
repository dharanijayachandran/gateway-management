import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GatewayModelPortComponent } from './gateway-model-port.component';

describe('GatewayModelPortComponent', () => {
  let component: GatewayModelPortComponent;
  let fixture: ComponentFixture<GatewayModelPortComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GatewayModelPortComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GatewayModelPortComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
