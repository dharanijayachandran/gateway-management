import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { globalSharedService } from 'src/app/shared/services/global/globalSharedService';
import { Gateway } from '../../model/gateway';
import { GatewayService } from '../../services/gateway/gateway.service';
import * as fs from 'file-saver';
import { UIModalNotificationPage } from 'global';
import { globalShareServices } from 'src/app/shared/globalShareServices';
@Component({
  selector: 'app-download-template-preview',
  templateUrl: './download-template-preview.component.html',
  styleUrls: ['./download-template-preview.component.css']
})
export class DownloadTemplatePreviewComponent implements OnInit {

  @ViewChild(UIModalNotificationPage) modelNotification;

  gatewayTypeId: any;
  downloadTemplate: any;
  gatewayObj: Gateway = new Gateway();

  constructor(private router: Router, private gatewayService: GatewayService,
    private route: ActivatedRoute,
    private globalServiceloc: globalShareServices,
    private globalService: globalSharedService) { }

  ngOnInit(): void {
    this.downloadTemplate = this.globalService.listOfRow;
  }

  // redirectTo
  redirectTo() {
    // this.navigateTemplate.emit('gatewayList');
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  // backButton navigate to form view
  backButton(event) {
    this.globalServiceloc.setGlobalObject(this.downloadTemplate);
    this.router.navigate(['../download-template'], { relativeTo: this.route });

  }
  saveDownloadTemplate() {
    let userId = sessionStorage.getItem('userId');
    let beId = sessionStorage.getItem('beId');
    this.gatewayObj = <Gateway>this.globalService.listOfRow
    this.gatewayObj.created_by = Number(userId);
    this.gatewayObj.businessEntityId = Number(beId);

    this.gatewayService.downloadTemplateData(this.gatewayObj).subscribe((res) => {

      const blob = new Blob([res.body], { type: 'application/octet-stream' });

      fs.saveAs(blob, 'GatewayTemplate' + '.xls');
      this.router.navigate(['../'], { relativeTo: this.route });
      // this.modelNotification.alertMessage('Success', ' successfull');

    },
      (error: any) => {
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);

      }
    );


  }

}
