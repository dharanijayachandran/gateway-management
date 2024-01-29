import { Component, OnInit, ViewChild } from '@angular/core';
import { globalSharedService } from 'src/app/shared/services/global/globalSharedService';
import { GatewayService } from '../../services/gateway/gateway.service';
import { Router, ActivatedRoute } from '@angular/router';
import { GatewayIOTag } from '../../../gateway-template/model/gatewayIOTag';
import { GatewayTemplateIoTagService } from '../../../gateway-template/services/gatewayTemplateIOTag/gateway-template-io-tag.service';
import { UIModalNotificationPage } from 'global';
import { globalShareServices } from 'src/app/shared/globalShareServices';
@Component({
  selector: 'app-gateway-io-tag-preview',
  templateUrl: './gateway-io-tag-preview.component.html',
  styleUrls: ['./gateway-io-tag-preview.component.css']
})
export class GatewayIoTagPreviewComponent implements OnInit {
  showLoaderImage: boolean;
  gatewayIOTag: any;
  // Importing child component to
  @ViewChild(UIModalNotificationPage) modelNotification;
  gatewayId: number;
  gatewayIoTagId: number;

  constructor(private globalService: globalSharedService,
    private gatewayService: GatewayService,
    private router: Router,
    private route: ActivatedRoute,
    private globalServiceloc: globalShareServices, private gatewayTemplateIOTagService: GatewayTemplateIoTagService,) { }


  ngOnInit(): void {
    this.gatewayId = this.globalService.id;
    this.gatewayIoTagId = this.globalServiceloc.assignId;
  }

  createOrUpdateGatewayIOTag(): void {
    this.showLoaderImage = true;
    this.gatewayIOTag = <GatewayIOTag>this.globalService.listOfRow;
    let userId = +sessionStorage.getItem('userId');
    this.gatewayIOTag.nodeId = this.gatewayId;
    if (this.gatewayIOTag.id === null) {
      this.gatewayIOTag.created_by = userId;
      this.gatewayTemplateIOTagService.addGatewayTemplateIOTag(this.gatewayIOTag).subscribe((res) => {
        this.showLoaderImage = false;
        // response handling
        this.modelNotification.alertMessage(res['messageType'], res['message']);
      },
        (error: any) => {
          this.showLoaderImage = false;
          this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
        }
      );
    }
    else {
      this.gatewayIOTag.updated_by = userId;
      this.gatewayTemplateIOTagService.updateGatewayTemplateIOTag(this.gatewayIOTag).subscribe((res) => {
        this.showLoaderImage = false;
        // response handling
        this.modelNotification.alertMessage(res['messageType'], res['message']);
      },
        (error: any) => {
          this.showLoaderImage = false;
          // If the service is not available
          this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
        }
      );
    }
  }

  // redirectTo
  redirectTo() {
    this.globalServiceloc.globalObject = null;
    this.globalService.setId(this.gatewayId);
    this.globalServiceloc.GettingString('IOTag');
    this.router.navigate(['../'], { relativeTo: this.route });
  }


  // backButton navigate to form view
  backButton(event) {
    this.globalServiceloc.GettingId(this.gatewayIoTagId);
    //this.globalServiceloc.setGlobalObject(this.globalService.listOfRow);
    this.router.navigate(['../gateway-io-tag-form'], { relativeTo: this.route });
  }
}
