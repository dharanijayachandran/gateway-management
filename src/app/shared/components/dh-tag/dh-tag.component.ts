import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-dh-tag',
  templateUrl: './dh-tag.component.html',
  styleUrls: ['./dh-tag.component.css']
})
export class DhTagComponent implements OnInit {


  @Input() IOTagItem;
  requiredPath: any;
  gatewayIODHTag: boolean;
  requiredPatDataProtocol: any;
  requiredGateway: any;

  constructor() { }

  ngOnInit(): void {
    this.requiredPath = document.location.href.split("gateway-config/gateway-template/");
    this.requiredPatDataProtocol = document.location.href.split("data-protocol/");
    this.requiredGateway = document.location.href.split("gateway/");
    if (this.requiredPath[1]==="gateway-io-dh-tag" || this.requiredPatDataProtocol[1]==="data-sub-protocol-dh-tag" || this.requiredGateway[1]==="gateway-io-dh-tag") {
      this.gatewayIODHTag = true
    }
  }

}
