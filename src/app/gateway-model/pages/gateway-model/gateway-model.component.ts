import { Component, OnInit } from '@angular/core';
import { NgbTabset, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { globalShareServices } from 'src/app/shared/globalShareServices';
@Component({
  selector: 'app-gateway-model',
  templateUrl: './gateway-model.component.html',
  styleUrls: ['./gateway-model.component.css'],
  providers: [
    NgbTabset
  ]
})
export class GatewayModelComponent implements OnInit {

  constructor(public tabset: NgbTabset,private globalService: globalShareServices) { }

  gettingTenantDetail = {};

  receiveMessage($event) {
    this.gettingTenantDetail = $event
  }

  ngOnInit() {

  }
  ngAfterViewInit() {
    if (this.globalService.name != null) {
      this.tabNameMessage();
      let myTab = document.getElementById(this.globalService.name);
      myTab.click();
    }
  }


   // To navigate based on click form tab or action place
   isEnableSwitchTab = false;
   tabNameMessage() {
     this.isEnableSwitchTab = true;
     this.isEnableSwitchTabStatus();
   }

   // isEnableSwitch status false after one second
   isEnableSwitchTabStatus() {
     setTimeout(() => {
       this.isEnableSwitchTab = false;
     }, 500);
   }

   public beforeChange($event: NgbTabChangeEvent) {
     if ($event.nextId === 'manageCommStd' && !this.isEnableSwitchTab ||
       $event.nextId === 'managePin' && !this.isEnableSwitchTab ||
       $event.nextId === 'managePort' && !this.isEnableSwitchTab ||
       $event.nextId === 'manageCommStdPinPort' && !this.isEnableSwitchTab) {
       $event.preventDefault();
     }
   }

}
