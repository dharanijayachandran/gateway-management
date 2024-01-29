import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GatewayIoTagReadViewComponent } from './gateway-io-tag-read-view.component';

describe('GatewayIoTagReadViewComponent', () => {
  let component: GatewayIoTagReadViewComponent;
  let fixture: ComponentFixture<GatewayIoTagReadViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GatewayIoTagReadViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GatewayIoTagReadViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
