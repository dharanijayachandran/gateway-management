import { Component, OnInit, ViewChild } from '@angular/core';
import { GatewayIODHResponseTag } from '../../model/gatewayIODhResponseTag';
import { Router, ActivatedRoute } from '@angular/router';
import { GatewayIODataHandler } from '../../model/gatewayIODataHandler';
import { FormBuilder } from '@angular/forms';
import { CommunicationService } from '../../services/communication/communication.service';
import { GatewayIoDhResponseTagService } from '../../services/gatewayIODhResponseTag/gateway-io-dh-response-tag.service';
import { globalSharedService } from 'src/app/shared/services/global/globalSharedService';
import { UIModalNotificationPage } from 'global';
import { globalShareServices } from 'src/app/shared/globalShareServices';
@Component({
  selector: 'app-gateway-io-dh-response-tag-preview',
  templateUrl: './gateway-io-dh-response-tag-preview.component.html',
  styleUrls: ['./gateway-io-dh-response-tag-preview.component.css']
})
export class GatewayIoDhResponseTagPreviewComponent implements OnInit {
  // Importing child component to
  @ViewChild(UIModalNotificationPage) modelNotification;
  showLoaderImage: boolean;
  constructor(private globalSharedService: globalShareServices,
    private router: Router, private formBuilder: FormBuilder,
    private commService: CommunicationService, private service: GatewayIoDhResponseTagService,
    private globalService:globalSharedService,
    private route:ActivatedRoute) { }

  saveGatewayIODH: GatewayIODataHandler;
  saveGatewayIODHResponseTags: GatewayIODHResponseTag[];
  saveSuccess = false;
  updateSucess = false;
  serviceMessage: string;
  ngOnInit() {
    this.loadFormData();
  }
  loadFormData() {
    this.saveGatewayIODH = this.globalSharedService.globalObject;
    this.saveGatewayIODHResponseTags = this.saveGatewayIODH.nodeIoDhResponseTags;
  }

  onClickSaveGatewayIODH() {
    this.showLoaderImage=true;
    this.service.saveGatewayIODH(this.saveGatewayIODH).subscribe(res => {
      this.showLoaderImage=false;
      this.saveSuccess = true;
      this.updateSucess = false;
     // response handling
     this.modelNotification.alertMessage(res['messageType'], res['message']);
    }, error => {
      this.showLoaderImage=false;
      this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
    })
  }

  // redirectTo
  redirectTo() {
    this.globalSharedService.GettingId(this.saveGatewayIODH.gatewayId);
    this.globalSharedService.GettingString('communication');
    this.router.navigate(['../'],{relativeTo:this.route});
  }

  backButton(){

  }
}
