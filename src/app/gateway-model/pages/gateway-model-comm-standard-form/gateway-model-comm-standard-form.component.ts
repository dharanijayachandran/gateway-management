import { Component, OnInit, ViewChild } from '@angular/core';
import { GatewayModelService } from '../../services/gateway-model.service';
import { Router, ActivatedRoute } from '@angular/router';
import { globalSharedService } from 'src/app/shared/services/global/globalSharedService';
import { UIModalNotificationPage } from 'global';
import { globalShareServices } from 'src/app/shared/globalShareServices';
@Component({
	selector: 'app-gateway-model-comm-standard-form',
	templateUrl: './gateway-model-comm-standard-form.component.html',
	styleUrls: ['./gateway-model-comm-standard-form.component.css']
})
export class GatewayModelCommStandardFormComponent implements OnInit {

	// Importing child component to
	@ViewChild(UIModalNotificationPage) modelNotification;

	commStandardReadMode = true;
	confirmed: Array<any>;
	editForm = false;
	gatewayModelName: String;
	confirmedList = [];
	availableStandardDataList: Array<any> = [];
	assignedStandardDataList: Array<any> = [];
	prevAssignedCommStandardIds: Array<number> = [];


	gatewayModelId = sessionStorage.getItem('gatewayModelId');
	showLoaderImage: boolean;
	availableStandarList: any[];
	confirmedCommStdList:any[] = [];


	constructor(private gatewayModelService: GatewayModelService, private router: Router, private globalService: globalShareServices,
		private globalSharedService: globalSharedService,
		private route: ActivatedRoute) { }

	ngOnInit() {
		this.getGatewayModelByGatewayModelId(this.gatewayModelId);
		this.availableStandarList=this.globalService.availableStandardDataList;
		this.confirmed = this.globalService.commStandards;
		this.commStandardMapping();
		// this.prevAssignedCommStandardIds = this.globalService.prevAssignedCommStandard;

	}
	commStandardMapping() {
			this.confirmed.forEach(element => {
				this.availableStandarList.forEach(res=>{
				if(element.commStandardId==res.commStandardId){
					this.confirmedCommStdList.push(res.name);
				}
			});
		})
	}

	saveGatewayModelCommStandard(): void {
		this.showLoaderImage = true;
		let gatewayModelId = this.gatewayModelId;
		let toBeAddedCommStandard = "";
		let userId = +sessionStorage.getItem('userId');
		let confirmedId: Array<number> = [];
		toBeAddedCommStandard = '{"gatewayModelId":' + gatewayModelId + ', "commStandards":['
		for (let o of this.confirmed) {
			confirmedId.push(o.commStandardId);
			toBeAddedCommStandard = toBeAddedCommStandard + '{"commStandardId":' + o.commStandardId + '},'
		}
		if (toBeAddedCommStandard.endsWith(",")) {
			toBeAddedCommStandard = toBeAddedCommStandard.substring(0, (toBeAddedCommStandard.length - 1));
		}
		toBeAddedCommStandard = toBeAddedCommStandard + '], "createdBy":' + userId + '}';
		this.gatewayModelService.getCommStandardsByGatewayModelId(gatewayModelId)
			.subscribe(
				res => {
					this.showLoaderImage = false;
					if (res != null && res.length != 0) {
						this.gatewayModelService.updateGatewayModelCommStandard(toBeAddedCommStandard).subscribe((res) => {
							this.showLoaderImage = false;
							// Success response
							this.modelNotification.alertMessage(res['messageType'], res['message']);
						},
							(error: any) => {
								this.showLoaderImage = false;
								// If the service is not available
								this.modelNotification.alertMessage(this.globalSharedService.messageType_Fail, error);
							}
						);
					}
					else {
						this.gatewayModelService.addGatewayModelCommStandard(toBeAddedCommStandard).subscribe((res) => {
							this.showLoaderImage = false;
							// Success response
							this.modelNotification.alertMessage(res['messageType'], res['message']);
						},
							(error: any) => {
								this.showLoaderImage = false;
								// If the service is not available
								this.modelNotification.alertMessage(this.globalSharedService.messageType_Fail, error);
							}
						);
					}
				},
				error => {
					this.showLoaderImage = false;
					// If the service is not available
					this.modelNotification.alertMessage(this.globalSharedService.messageType_Fail, error);
				});

		/* if (this.prevAssignedCommStandardIds.length != 0) {
			this.editForm = true;
		} */

		/* if (!this.editForm) {

		} else {

		} */
	}

	// Redirect to
	redirectTo() {
		this.router.navigate(['../'], { relativeTo: this.route });
		let gatewayModelList = document.getElementById('gatewayModelList');
		gatewayModelList.click();
	}

	getGatewayModelByGatewayModelId(gatewayModelId) {
		this.gatewayModelService.getGatewayModelByGatewayModelId(gatewayModelId)
			.subscribe(
				res => {
					this.gatewayModelName = res.name;

				},
				error => {
					// If the service is not available
					this.modelNotification.alertMessage(this.globalSharedService.messageType_Fail, error);
				});
	}
	backButton() {
		this.router.navigate(['../'], { relativeTo: this.route });
		this.globalService.GettingId(this.gatewayModelId);
		this.globalService.GettingString('manageCommStd');
		this.globalService.setCommStandards(this.confirmed);
	}
}
