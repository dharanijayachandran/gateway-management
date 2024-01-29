import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadTemplatePreviewComponent } from './download-template-preview.component';

describe('DownloadTemplatePreviewComponent', () => {
  let component: DownloadTemplatePreviewComponent;
  let fixture: ComponentFixture<DownloadTemplatePreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DownloadTemplatePreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadTemplatePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
