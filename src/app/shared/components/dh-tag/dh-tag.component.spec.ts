import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DhTagComponent } from './dh-tag.component';

describe('DhTagComponent', () => {
  let component: DhTagComponent;
  let fixture: ComponentFixture<DhTagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DhTagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DhTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
