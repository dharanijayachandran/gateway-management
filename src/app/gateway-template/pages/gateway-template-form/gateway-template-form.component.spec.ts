import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GatewayTemplateFormComponent } from './gateway-template-form.component';

describe('GatewayTemplateFormComponent', () => {
  let component: GatewayTemplateFormComponent;
  let fixture: ComponentFixture<GatewayTemplateFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GatewayTemplateFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GatewayTemplateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
