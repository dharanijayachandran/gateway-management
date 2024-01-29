import { Component, OnInit, ElementRef, ViewContainerRef } from '@angular/core';
import { GatewayModelPin } from '../../model/gateway-model-pin';
import { GatewayModelService } from '../../services/gateway-model.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-gateway-model-pin-form',
  templateUrl: './gateway-model-pin-form.component.html',
  styleUrls: ['./gateway-model-pin-form.component.css']
})
export class GatewayModelPinFormComponent implements OnInit {

  reference: any;
  index: number;
  pinId: number;
  pinName: string;
  internalMap: string;
  pinsDetails: any;
  gatewayModelId: number;
  status: string;

  PinsReadMode = false;
  pinsForm = true;

  constructor() {
  }

  removeSkills() {
    this.reference.destroy();
  }

  ngOnInit() {

  }



}
