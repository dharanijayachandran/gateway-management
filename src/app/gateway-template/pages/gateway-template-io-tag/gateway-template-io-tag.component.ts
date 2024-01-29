import { Component, OnInit } from '@angular/core';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-gateway-template-io-tag',
  templateUrl: './gateway-template-io-tag.component.html',
  styleUrls: ['./gateway-template-io-tag.component.css']
})
export class GatewayTemplateIoTagComponent implements OnInit {

  constructor(public tabset: NgbTabset) { }

  ngOnInit() {
  }

  gettingGatewayTemplateDetail = {};

  receiveMessage($event) {
    this.gettingGatewayTemplateDetail = $event
  }


}
