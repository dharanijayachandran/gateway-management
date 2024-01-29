import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GatewayFormViewComponent } from './gateway-form-view.component';

describe('GatewayFormViewComponent', () => {
  let component: GatewayFormViewComponent;
  let fixture: ComponentFixture<GatewayFormViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GatewayFormViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GatewayFormViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
