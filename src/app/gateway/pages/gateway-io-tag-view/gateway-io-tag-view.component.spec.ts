import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GatewayIoTagViewComponent } from './gateway-io-tag-view.component';

describe('GatewayIoTagViewComponent', () => {
  let component: GatewayIoTagViewComponent;
  let fixture: ComponentFixture<GatewayIoTagViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GatewayIoTagViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GatewayIoTagViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
