import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GatewayIoDhTagComponent } from './gateway-io-dh-tag.component';

describe('GatewayIoDhTagComponent', () => {
  let component: GatewayIoDhTagComponent;
  let fixture: ComponentFixture<GatewayIoDhTagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GatewayIoDhTagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GatewayIoDhTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
