import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GatewayIoDhResponseTagComponent } from './gateway-io-dh-response-tag.component';

describe('GatewayIoDhResponseTagComponent', () => {
  let component: GatewayIoDhResponseTagComponent;
  let fixture: ComponentFixture<GatewayIoDhResponseTagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GatewayIoDhResponseTagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GatewayIoDhResponseTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
