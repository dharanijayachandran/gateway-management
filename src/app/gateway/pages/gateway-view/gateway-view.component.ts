import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { globalSharedService } from 'src/app/shared/services/global/globalSharedService';
import { GatewayService } from '../../services/gateway/gateway.service';
import { Gateway } from '../../model/gateway';
import { Router, ActivatedRoute } from '@angular/router';
import { globalShareServices } from 'src/app/shared/globalShareServices';

@Component({
  selector: 'app-gateway-view',
  templateUrl: './gateway-view.component.html',
  styleUrls: ['./gateway-view.component.css']
})
export class GatewayViewComponent implements OnInit {
  gatewayForm: Gateway = new Gateway();
  gatewayId: any;
  constructor(private globalService: globalSharedService, private router: Router,
    private route: ActivatedRoute, private globalServiceloc: globalShareServices,
    private gatewayService: GatewayService) { }

  ngOnInit() {
    this.gatewayId = this.globalServiceloc.assignId;
    this.globalService.listOfRow = this.globalServiceloc.globalObject;
    //this.getGatewayById(this.gatewayId);
  }
  /* getGatewayById(gatewayId) {
    this.gatewayService.getGatewayById(gatewayId)
      .subscribe(data => {
        this.gatewayForm = data;
        this.gatewayForm.gatewayTypeName = data.gatewayType.name;
        if (data.gatewayModel.name != null) {
          this.gatewayForm.gatewayModelName = data.gatewayModel.name;
        }
        this.globalService.listOfRow = this.gatewayForm;
      });

  } */
  @Output() navigateTemplate = new EventEmitter();
  backButton(event) {
    this.globalServiceloc.assignId = null;
    this.globalServiceloc.globalObject = null;
    this.globalService.listOfRow = {};
    //this.navigateTemplate.emit('gatewayList');
    this.router.navigate(['../'], { relativeTo: this.route });
  }

}
