import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadTemplateReadViewComponent } from './download-template-read-view.component';

describe('DownloadTemplateReadViewComponent', () => {
  let component: DownloadTemplateReadViewComponent;
  let fixture: ComponentFixture<DownloadTemplateReadViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DownloadTemplateReadViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadTemplateReadViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
