import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GatewayIoTagPreviewComponent } from './gateway-io-tag-preview.component';

describe('GatewayIoTagPreviewComponent', () => {
  let component: GatewayIoTagPreviewComponent;
  let fixture: ComponentFixture<GatewayIoTagPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GatewayIoTagPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GatewayIoTagPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
