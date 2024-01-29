import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GatewayIoDhTagPreviewComponent } from './gateway-io-dh-tag-preview.component';

describe('GatewayIoDhTagPreviewComponent', () => {
  let component: GatewayIoDhTagPreviewComponent;
  let fixture: ComponentFixture<GatewayIoDhTagPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GatewayIoDhTagPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GatewayIoDhTagPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
