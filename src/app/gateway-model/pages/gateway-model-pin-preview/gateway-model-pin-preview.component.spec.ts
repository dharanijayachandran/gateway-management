import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GatewayModelPinPreviewComponent } from './gateway-model-pin-preview.component';

describe('GatewayModelPinPreviewComponent', () => {
  let component: GatewayModelPinPreviewComponent;
  let fixture: ComponentFixture<GatewayModelPinPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GatewayModelPinPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GatewayModelPinPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
