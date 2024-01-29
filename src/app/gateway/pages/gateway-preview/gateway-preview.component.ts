import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UIModalNotificationPage } from 'global';
import { globalShareServices } from 'src/app/shared/globalShareServices';
import { globalSharedService } from 'src/app/shared/services/global/globalSharedService';
import { Gateway } from '../../model/gateway';
import { GatewayService } from '../../services/gateway/gateway.service';
@Component({
  selector: 'app-gateway-preview',
  templateUrl: './gateway-preview.component.html',
  styleUrls: ['./gateway-preview.component.css']
})
export class GatewayPreviewComponent implements OnInit {
  // Importing child component to
  @ViewChild(UIModalNotificationPage) modelNotification;
  gatewayObj: Gateway = new Gateway();
  gatewayId: any;
  gatewayForm: any;
  showLoaderImage: boolean = false;
  nodeIdentifier: String;
  responseStatus = false;
  constructor(private globalService: globalSharedService,
    private gatewayService: GatewayService,
    private router: Router,
    private route: ActivatedRoute,
    private globalServiceloc: globalShareServices) { }

  ngOnInit() {
    this.gatewayId = this.globalService.listOfRow.id;
    this.gatewayForm = this.globalService.listOfRow;
  }

  // Save gateway
  @Output() navigateTemplate = new EventEmitter();
  createGateway() {
    this.showLoaderImage = true;
    let userId = sessionStorage.getItem('userId');
    let beId = sessionStorage.getItem('beId');
    this.gatewayObj = <Gateway>this.globalService.listOfRow
    this.gatewayObj.created_by = Number(userId);
    this.gatewayObj.businessEntityId = Number(beId);
    if (this.gatewayObj.id == null || this.gatewayObj.id == undefined) {
      let gateways: Gateway[] = [];
      gateways.push(this.gatewayObj);
      this.gatewayService.createGateway(gateways).subscribe(res => {
        this.showLoaderImage = false;
        this.responseStatus = true;
        this.modelNotification.alertMessage(res['messageType'], res['message']);
      },
        (error: any) => {
          this.showLoaderImage = false;
          this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
        }
      );
    }
    else {
      this.gatewayObj.updated_by = +userId;
      this.gatewayService.updateGateway(this.gatewayObj).subscribe(res => {
        this.showLoaderImage = false;
        this.responseStatus = true;
        this.modelNotification.alertMessage(res['messageType'], res['message']);
      });
      (error: any) => {
        this.showLoaderImage = false;
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      }
    }
  }

  // redirectTo
  redirectTo() {
    // this.navigateTemplate.emit('gatewayList');
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  // backButton navigate to form view
  backButton(event) {
    this.globalServiceloc.GettingId(this.gatewayId);
    if (this.gatewayForm.nodeIdentifier == null) {
      this.nodeIdentifier = this.globalServiceloc.nodeIdentifier;
    }
    else {
      this.nodeIdentifier = this.gatewayForm.nodeIdentifier;
    }
    this.removeGatewayIdentifier(this.gatewayForm.nodeIdentifier);
    this.globalServiceloc.setGlobalObject(this.gatewayForm);
    this.router.navigate(['../gateway-form'], { relativeTo: this.route });

  }

  // confirmDelete
  removeGatewayIdentifier(gatewayIdentifier) {
    this.gatewayService.clearGatewayIdentifier(gatewayIdentifier).subscribe(res => {
    },
      (error: any) => {
      }
    );
  }

  ngOnDestroy() {
    if (!this.responseStatus && sessionStorage.getItem("nodeIdentifierCleared") == "false") {
      this.removeGatewayIdentifier(this.gatewayForm.nodeIdentifier);
    }
  }
}
