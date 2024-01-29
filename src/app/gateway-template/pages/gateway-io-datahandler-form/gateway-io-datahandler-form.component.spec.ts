import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GatewayIODatahandlerFormComponent } from './gateway-io-datahandler-form.component';

describe('GatewayIODatahandlerFormComponent', () => {
  let component: GatewayIODatahandlerFormComponent;
  let fixture: ComponentFixture<GatewayIODatahandlerFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GatewayIODatahandlerFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GatewayIODatahandlerFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
