import { Component, OnInit, ViewContainerRef, ElementRef, ViewChild } from '@angular/core';
import { GatewayModelPin } from '../../model/gateway-model-pin';
import { GatewayModelService } from '../../services/gateway-model.service';
import { Router, ActivatedRoute } from '@angular/router';
import { globalSharedService } from 'src/app/shared/services/global/globalSharedService';
import { UIModalNotificationPage } from 'global';
import { globalShareServices } from 'src/app/shared/globalShareServices';

@Component({
  selector: 'app-gateway-model-pin-preview',
  templateUrl: './gateway-model-pin-preview.component.html',
  styleUrls: ['./gateway-model-pin-preview.component.css']
})
export class GatewayModelPinPreviewComponent implements OnInit {

  // Importing child component to
  @ViewChild(UIModalNotificationPage) modelNotification;

  gatewayModelId = Number(sessionStorage.getItem('gatewayModelId'));
  gatewayModelPin: GatewayModelPin = new GatewayModelPin();
  gatewayModelName: String;
  container: ViewContainerRef;
  request = false;
  data: string;
  editPage = false;
  numberOfPins: number;
  viewPinsDetails: any;
  pinsDetails: any;
  PinsReadMode = true;
  pinsList: any[];
  showLoaderImage: boolean;
  constructor(private elementRef: ElementRef, private gatewayModelService: GatewayModelService, private router: Router, private globalService: globalShareServices,
    private globalSharedService: globalSharedService,
    private route:ActivatedRoute) { }

  ngOnInit() {
    this.getGatewayModelByGatewayModelId(this.gatewayModelId);
    let id = Number(this.globalService.assignId);

    this.numberOfPins = this.globalService.noofpins;
    this.viewPinsDetails = this.globalService.details;
    this.pinsDetails = this.globalService.pindetails;
  }
  getGatewayModelByGatewayModelId(gatewayModelId) {
    this.gatewayModelService.getGatewayModelByGatewayModelId(gatewayModelId)
      .subscribe(
        res => {
          this.gatewayModelName = res.name;
        },
        error => {
          // If the service is not available
          this.modelNotification.alertMessage(this.globalSharedService.messageType_Fail, error);
        });
  }

  savePins() {
    this.showLoaderImage=true;
    this.pinsList = this.globalService.pinsLists;
    if (this.pinsList.length != 0) {
      this.editPage = true;
    }
    if (!this.editPage) {
      this.gatewayModelService.addGatewayModelPins(this.pinsDetails).subscribe((res) => {
        //this.backToGatewayModel();
        this.showLoaderImage=false;
        // Success response
        this.modelNotification.alertMessage(res['messageType'], res['message']);
      },
        (error: any) => {
          this.showLoaderImage=false;
          // If the service is not available
          this.modelNotification.alertMessage(this.globalSharedService.messageType_Fail, error);
        }
      );
      this.globalService.SetPinDetails(null, null);
    } else {
      this.gatewayModelService.updateGatewayModelPins(this.pinsDetails).subscribe((res) => {
        // this.backToGatewayModel();
        this.showLoaderImage=false;
        // Success response
        this.modelNotification.alertMessage(res['messageType'], res['message']);
      },
        (error: any) => {
          this.showLoaderImage=false;
          // If the service is not available
          this.modelNotification.alertMessage(this.globalSharedService.messageType_Fail, error);
        }
      );
    }
  }

  // Redirect to
  redirectTo() {
    this.router.navigate(['../'],{relativeTo:this.route});
    let gatewayModelList = document.getElementById('gatewayModelList');
    gatewayModelList.click();
  }

  backButton() {
    this.router.navigate(['../'],{relativeTo:this.route});
    this.globalService.GettingId(this.gatewayModelId);
    this.globalService.GettingString('managePin');
    this.globalService.SetPinDetails(this.viewPinsDetails, this.pinsDetails);
    this.globalService.SetPins(this.numberOfPins);
    this.globalService.SetRequestFromPreviewBack(true);
  }
}
