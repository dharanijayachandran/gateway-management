import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GatewayModelFormComponent } from './gateway-model-form.component';

describe('GatewayModelFormComponent', () => {
  let component: GatewayModelFormComponent;
  let fixture: ComponentFixture<GatewayModelFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GatewayModelFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GatewayModelFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
