import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GatewayModelCommStandardMappingComponent } from './gateway-model-comm-standard-mapping.component';

describe('GatewayModelCommStandardMappingComponent', () => {
  let component: GatewayModelCommStandardMappingComponent;
  let fixture: ComponentFixture<GatewayModelCommStandardMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GatewayModelCommStandardMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GatewayModelCommStandardMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
