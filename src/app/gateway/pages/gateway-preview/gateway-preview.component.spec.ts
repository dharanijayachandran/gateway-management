import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GatewayPreviewComponent } from './gateway-preview.component';

describe('GatewayPreviewComponent', () => {
  let component: GatewayPreviewComponent;
  let fixture: ComponentFixture<GatewayPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GatewayPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GatewayPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
