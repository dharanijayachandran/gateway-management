import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GatewayIoTagFormComponent } from './gateway-io-tag-form.component';

describe('GatewayIoTagFormComponent', () => {
  let component: GatewayIoTagFormComponent;
  let fixture: ComponentFixture<GatewayIoTagFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GatewayIoTagFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GatewayIoTagFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
