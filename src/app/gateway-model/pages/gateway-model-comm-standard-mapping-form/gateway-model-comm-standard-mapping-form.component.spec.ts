import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GatewayModelCommStandardMappingFormComponent } from './gateway-model-comm-standard-mapping-form.component';

describe('GatewayModelCommStandardMappingFormComponent', () => {
  let component: GatewayModelCommStandardMappingFormComponent;
  let fixture: ComponentFixture<GatewayModelCommStandardMappingFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GatewayModelCommStandardMappingFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GatewayModelCommStandardMappingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
