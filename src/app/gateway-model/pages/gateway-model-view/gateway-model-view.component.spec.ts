import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GatewayModelViewComponent } from './gateway-model-view.component';

describe('GatewayModelViewComponent', () => {
  let component: GatewayModelViewComponent;
  let fixture: ComponentFixture<GatewayModelViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GatewayModelViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GatewayModelViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
