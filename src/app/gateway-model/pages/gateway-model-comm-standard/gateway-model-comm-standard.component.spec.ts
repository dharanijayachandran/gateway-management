import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GatewayModelCommStandardComponent } from './gateway-model-comm-standard.component';

describe('GatewayModelCommStandardComponent', () => {
  let component: GatewayModelCommStandardComponent;
  let fixture: ComponentFixture<GatewayModelCommStandardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GatewayModelCommStandardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GatewayModelCommStandardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
