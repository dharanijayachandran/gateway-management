import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { globalSharedService } from 'src/app/shared/services/global/globalSharedService';
import { GatewayTemplateIOTag } from '../../../gateway-template/model/gateway-template-io-tag';
import { globalShareServices } from 'src/app/shared/globalShareServices';
@Component({
  selector: 'app-gateway-io-tag-read-view',
  templateUrl: './gateway-io-tag-read-view.component.html',
  styleUrls: ['./gateway-io-tag-read-view.component.css']
})
export class GatewayIoTagReadViewComponent implements OnInit {
  dataTypes: any[];
  standardIOTags: any[];
  tagTypes: any[];
  engUnits: any[];
  tagIOModes: any[];
  gatewayId: any;
  gatewayIOTag: GatewayTemplateIOTag = new GatewayTemplateIOTag();
  constructor(private globalService: globalSharedService, private router: Router,
    private route: ActivatedRoute, private globalServiceloc: globalShareServices) { }

  ngOnInit() {
    this.gatewayId = this.globalService.id;
    this.gatewayIOTag = this.globalServiceloc.globalObject;
    this.dataTypes = this.globalServiceloc.dataTypes;
    this.engUnits = this.globalServiceloc.engUnits;
    this.standardIOTags = this.globalServiceloc.standardIOTags;
    this.tagIOModes = this.globalServiceloc.tagIOModes;
    this.tagTypes = this.globalServiceloc.tagTypes;
  }

  backButton() {
    this.globalService.GettingString('Edit');
    this.globalServiceloc.setGlobalObject(this.gatewayIOTag);
    this.globalServiceloc.GettingId(this.gatewayId);
    this.globalServiceloc.GettingString('Edit');
    this.router.navigate(['../gateway-io-tag-form'], { relativeTo: this.route });

  }

  parseInt(id) {
    return parseInt(id);
  }
}
