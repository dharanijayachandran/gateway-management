import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteGatewayComponent } from './delete-gateway.component';

describe('DeleteGatewayComponent', () => {
  let component: DeleteGatewayComponent;
  let fixture: ComponentFixture<DeleteGatewayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteGatewayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteGatewayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
