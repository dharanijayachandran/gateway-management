import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { globalShareServices } from 'src/app/shared/globalShareServices';
import { globalSharedService } from 'src/app/shared/services/global/globalSharedService';

@Component({
  selector: 'app-gateway-io-tag-view',
  templateUrl: './gateway-io-tag-view.component.html',
  styleUrls: ['./gateway-io-tag-view.component.css']
})
export class GatewayIoTagViewComponent implements OnInit {

  gatewayIOTagId: any;
  gatewayId: number;
  constructor(private globalService: globalSharedService, private router: Router,
    private route: ActivatedRoute, private globalServiceloc: globalShareServices) { }

  ngOnInit() {
    this.gatewayIOTagId = this.globalServiceloc.assignId;
    this.gatewayId = this.globalService.id;
  }

  backButton(event) {
    this.globalServiceloc.assignId = null;
    this.globalServiceloc.globalObject = null;
    this.globalService.listOfRow = {};
    this.globalServiceloc.GettingId(this.gatewayId);
    this.globalServiceloc.GettingString('IOTag');
    this.router.navigate(['../'], { relativeTo: this.route });
  }

}
