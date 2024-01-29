import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GatewayIoTagListComponent } from './gateway-io-tag-list.component';

describe('GatewayIoTagListComponent', () => {
  let component: GatewayIoTagListComponent;
  let fixture: ComponentFixture<GatewayIoTagListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GatewayIoTagListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GatewayIoTagListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
