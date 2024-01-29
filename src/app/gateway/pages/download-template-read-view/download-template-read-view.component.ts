import { Component, OnInit } from '@angular/core';
import { globalSharedService } from 'src/app/shared/services/global/globalSharedService';
import { Gateway } from '../../model/gateway';

@Component({
  selector: 'app-download-template-read-view',
  templateUrl: './download-template-read-view.component.html',
  styleUrls: ['./download-template-read-view.component.css']
})
export class DownloadTemplateReadViewComponent implements OnInit {
  downloadTemplate: Gateway;
  constructor(private globalService: globalSharedService) { }

  ngOnInit(): void {
    this.downloadTemplate = this.globalService.listOfRow;


  }

}
