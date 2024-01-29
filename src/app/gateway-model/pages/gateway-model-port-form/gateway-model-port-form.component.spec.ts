import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GatewayModelPortFormComponent } from './gateway-model-port-form.component';

describe('GatewayModelPortFormComponent', () => {
  let component: GatewayModelPortFormComponent;
  let fixture: ComponentFixture<GatewayModelPortFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GatewayModelPortFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GatewayModelPortFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
