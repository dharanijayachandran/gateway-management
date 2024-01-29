import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GatewayIoDhResponseTagPreviewComponent } from './gateway-io-dh-response-tag-preview.component';

describe('GatewayIoDhResponseTagPreviewComponent', () => {
  let component: GatewayIoDhResponseTagPreviewComponent;
  let fixture: ComponentFixture<GatewayIoDhResponseTagPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GatewayIoDhResponseTagPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GatewayIoDhResponseTagPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
