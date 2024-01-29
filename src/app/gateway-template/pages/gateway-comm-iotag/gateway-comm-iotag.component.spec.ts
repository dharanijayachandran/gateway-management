import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GatewayCommIOTagComponent } from './gateway-comm-iotag.component';

describe('GatewayCommIOTagComponent', () => {
  let component: GatewayCommIOTagComponent;
  let fixture: ComponentFixture<GatewayCommIOTagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GatewayCommIOTagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GatewayCommIOTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
