import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { CommunicationService } from '../../services/communication/communication.service';
import { GatewayIoDhTagService } from '../../services/gatewayIODHTag/gateway-io-dh-tag.service';
import { GatewayIODataHandler } from '../../model/gatewayIODataHandler';
import { GatewayIODHTag } from '../../model/gatewayIODHTag';
import { globalSharedService } from 'src/app/shared/services/global/globalSharedService';
import { UIModalNotificationPage } from 'global';
import { globalShareServices } from 'src/app/shared/globalShareServices';
@Component({
  selector: 'app-gateway-io-dh-tag-preview',
  templateUrl: './gateway-io-dh-tag-preview.component.html',
  styleUrls: ['./gateway-io-dh-tag-preview.component.css']
})
export class GatewayIoDhTagPreviewComponent implements OnInit {

    // Importing child component to
    @ViewChild(UIModalNotificationPage) modelNotification;
  showLoaderImage: boolean;

  constructor(private globalSharedService: globalShareServices,
    private router: Router, private formBuilder: FormBuilder,
    private commService: CommunicationService, private service: GatewayIoDhTagService,
    private globalService:globalSharedService,
    private route:ActivatedRoute) { }

  saveGatewayIODH: GatewayIODataHandler;
  saveGatewayIODHTags: GatewayIODHTag[];
  saveSuccess = false;
  updateSucess = false;
  serviceMessage: string;
  ngOnInit() {
    this.loadFormData();
  }
  loadFormData() {
    this.saveGatewayIODH = this.globalSharedService.globalObject;
    this.saveGatewayIODHTags = this.saveGatewayIODH.nodeIoDhTags;
  }

  onClickSaveGatewayIODH() {
    this.showLoaderImage=true;
    this.service.saveGatewayIODH(this.saveGatewayIODH).subscribe(res => {
      this.showLoaderImage=false;
      this.saveSuccess = true;
      this.updateSucess = false;
      // Success response
      this.modelNotification.alertMessage(res['messageType'], res['message']);
    }, error => {
      this.showLoaderImage=false;
      // this.serviceMessage = "Failed to create Gateway IO DH Tag(s)";
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
