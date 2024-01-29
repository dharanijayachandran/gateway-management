import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GatewayModelCommStandardFormComponent } from './gateway-model-comm-standard-form.component';

describe('GatewayModelCommStandardFormComponent', () => {
  let component: GatewayModelCommStandardFormComponent;
  let fixture: ComponentFixture<GatewayModelCommStandardFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GatewayModelCommStandardFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GatewayModelCommStandardFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
