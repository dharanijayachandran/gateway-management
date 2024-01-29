import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GatewayReadViewComponent } from './gateway-read-view.component';

describe('GatewayReadViewComponent', () => {
  let component: GatewayReadViewComponent;
  let fixture: ComponentFixture<GatewayReadViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GatewayReadViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GatewayReadViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
