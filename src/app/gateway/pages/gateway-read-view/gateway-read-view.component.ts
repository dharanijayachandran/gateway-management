import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { globalSharedService } from 'src/app/shared/services/global/globalSharedService';
import { Gateway } from '../../model/gateway';
import { Router, ActivatedRoute } from '@angular/router';
import { globalShareServices } from 'src/app/shared/globalShareServices';

@Component({
  selector: 'app-gateway-read-view',
  templateUrl: './gateway-read-view.component.html',
  styleUrls: ['./gateway-read-view.component.css']
})
export class GatewayReadViewComponent implements OnInit {
  //gatewayForm: object;
  gatewayFormId: number;
  gatewayForm: Gateway;

  constructor(private globalService: globalSharedService, private router: Router,
    private route: ActivatedRoute, private globalServiceloc: globalShareServices) { }

  ngOnInit() {
    this.gatewayForm = this.globalService.listOfRow;
    this.gatewayFormId = this.globalService.listOfRow.id;
  }

  // backButton navigate to form view
  @Output() navigateTemplate = new EventEmitter();
  backButton() {
    this.globalService.GettingId(this.gatewayFormId);
    // this.navigateTemplate.emit('gatewayFormView');
    this.router.navigate(['../gateway-form'], { relativeTo: this.route });
    this.globalServiceloc.setGlobalObject(this.gatewayForm);
  }

}
