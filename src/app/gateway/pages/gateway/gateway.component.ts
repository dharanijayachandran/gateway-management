import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbTabChangeEvent, NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { globalShareServices } from 'src/app/shared/globalShareServices';

@Component({
  selector: 'app-gateway',
  templateUrl: './gateway.component.html',
  styleUrls: ['./gateway.component.css'],
  encapsulation: ViewEncapsulation.Emulated,
  providers: [
    NgbTabset
  ]
})
export class GatewayComponent implements OnInit {

  constructor(private globalSharedService: globalShareServices, public tabset: NgbTabset) { }


  ngOnInit() {
  }

  ngAfterViewInit() {
    if (this.globalSharedService.name != null) {
      this.tabNameMessage();
      let myTab = document.getElementById(this.globalSharedService.name);
      myTab.click();
    }
  }

  gettingGatewayTemplateDetail = {};

  receiveMessage($event) {
    this.gettingGatewayTemplateDetail = $event
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
    if ($event.nextId === 'IOTag' && !this.isEnableSwitchTab ||
      $event.nextId === 'communication' && !this.isEnableSwitchTab) {
      $event.preventDefault();
    }
  }

}
