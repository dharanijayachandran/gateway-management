import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UIModalNotificationPage } from 'global';
import { CommonUnitService } from 'src/app/shared/common-unit.service';
import { globalShareServices } from 'src/app/shared/globalShareServices';
import { globalSharedService } from 'src/app/shared/services/global/globalSharedService';
import { GatewayModelService } from '../../services/gateway-model.service';
@Component({
	selector: 'app-gateway-model-comm-standard',
	templateUrl: './gateway-model-comm-standard.component.html',
	styleUrls: ['./gateway-model-comm-standard.component.css']
})
export class GatewayModelCommStandardComponent implements OnInit {

	// Importing child component to
	@ViewChild(UIModalNotificationPage) modelNotification;


	tab = 1;
	sourceLeft = true;
	userAdd = '';
	keepSorted = true;
	key: string;
	display: any;
	filter = true;
	source: Array<any>;
	confirmed: Array<any>;
	disabled = false;
	// format: any = DualListComponent.DEFAULT_FORMAT;
	format = {
		all: "Select all",
		none: "Deselect all"
	  }
	private sourceRoles: Array<any>;
	private confirmedRoles: Array<any>;
	confirmedList = [];
	availableStandardDataList: Array<any> = [];
	assignedStandardDataList: Array<any> = [];
	prevAssignedCommStandardIds: Array<number> = [];
	idCommStandardIdMap = new Map();
	private availableCommStandards: Array<any> = [];
	private assignedCommStandards: Array<any> = [];
	gatewayModelId = sessionStorage.getItem('gatewayModelId');
	gatewayModelName: String;
	editForm = false;
	warningFlag: string;
	constructor(private gatewayModelService: GatewayModelService, private commonUnitService: CommonUnitService,
		private route: ActivatedRoute,
		private router: Router,
		private globalService: globalShareServices,
		private globalSharedService: globalSharedService) {

	}

	ngOnInit() {
		this.getGatewayModel();
	}

	getGatewayModel() {
		this.getAllCommunicationStandards();
		this.getGatewayModelByGatewayModelId(this.gatewayModelId);
		if (this.globalService.commStandards != null) {
			this.confirmedList = this.globalService.commStandards;
			//this.confirmed = this.globalService.commStandards;
			this.doReset();
		}
		else {
			this.getCommStandardsByGatewayModelId(this.gatewayModelId);
			this.getavailableStandardDataListConfirmed(this.gatewayModelId);
		}
	}

	// Refresh
	refreshTableListFunction() {
		this.getGatewayModel();
	}

	getavailableStandardDataListConfirmed(gatewayModelId) {
		let returnObj = [];
		this.gatewayModelService.getavailableStandardDataListSelected(gatewayModelId).subscribe(res => {
			this.confirmedList = res;
			this.confirmedList.map(function (o) {
				let Obj = {
					"commStandardId": o["commStandardId"],
					"name": o["communicationStandardName"]
				}
				returnObj.push(Obj);
			});
			this.confirmedList = returnObj;
			this.doReset();
		},
			error => {
				// If the service is not available
				this.modelNotification.alertMessage(this.globalSharedService.messageType_Fail, error);
			});
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

	getAllCommunicationStandards(): void {
		this.gatewayModelService.getCommunicationStandardsForDeviceModel()
			.subscribe(
				res => {
					this.availableStandardDataList = res as Array<any>;
					this.globalService.setAllCommunicationStandards(this.availableStandardDataList);
					this.doReset();

				},
				error => {
					// If the service is not available
					this.modelNotification.alertMessage(this.globalSharedService.messageType_Fail, error);
				});
	}

	resetGatewayModelCommStd() {
		this.warningFlag = "reset";
		this.modelNotification.alertMessage(this.globalSharedService.messageType_Warning, 'You will not be able to recover the changes!');
	}

	// Checkbox reset  confirm
	formResetConfirm() {
		this.getCommStandardsByGatewayModelId(this.gatewayModelId);
	}


	alertRedirection() {
		if (this.warningFlag == "reset") {
			this.formResetConfirm();
		} else if (this.warningFlag == "cancel") {
			this.formCancelConfirm();
		}
		this.warningFlag = "";
	}

	getCommStandardsByGatewayModelId(gatewayModelId): void {
		this.gatewayModelService.getCommStandardsByGatewayModelId(gatewayModelId)
			.subscribe(
				res => {
					this.assignedStandardDataList = res as Array<any>;
					this.assignedStandardDataList.forEach(element => {
						this.prevAssignedCommStandardIds.push(element.commStandardId);
					});
					this.resetGatewayModelCommStandard();
				},
				error => {
					// If the service is not available
					this.modelNotification.alertMessage(this.globalSharedService.messageType_Fail, error);
				});
	}

	private displayLabel(item: any) {
		return item.name;
	}

	// Reset of comms standard
	private setProperties() {
		this.key = 'commStandardId';
		this.display = this.displayLabel;
		this.keepSorted = true;
		this.source = this.availableCommStandards;
		this.confirmed = this.assignedCommStandards;
	}
	// Reset of comms standard
	resetGatewayModelCommStandard() {
		if (this.availableStandardDataList.length > 0) {
			this.availableCommStandards = JSON.parse(JSON.stringify(this.availableStandardDataList));
		}
		if (this.assignedStandardDataList.length > 0) {
			this.editForm = true;
			this.assignedCommStandards = JSON.parse(JSON.stringify(this.assignedStandardDataList));
		}
		this.setProperties();
	}

	// Assigning communication standards
	saveGatewayModelCommStandard(): void {
		this.router.navigate(['../gateway-model/gateway-model-comm-standard-form'],{relativeTo:this.route});
		this.globalService.setCommStandards(this.confirmed);
		// this.globalService.setPreviouseCommStandard(this.prevAssignedCommStandardIds);
	}

	// Go to gateway model
	backToGatewayModel() {
		this.warningFlag = "cancel";
		this.modelNotification.alertMessage(this.globalSharedService.messageType_Warning, 'You will not be able to recover the changes!');
	}


	// Confirm redirect to
	formCancelConfirm() {
		// this.router.navigate(['gateway-model']);
		let gatewayModelList = document.getElementById('gatewayModelList');
		gatewayModelList.click();
	}

	private roleLabel(item: any) {
		return item.name;
	}

	private rolesObject() {
		this.key = "commStandardId";
		this.display = this.roleLabel;
		this.keepSorted = true;
		this.source = this.sourceRoles;
		this.confirmed = this.confirmedRoles;
	}


	doReset() {
		this.sourceRoles = JSON.parse(JSON.stringify(this.availableStandardDataList));
		this.confirmedRoles = JSON.parse(JSON.stringify(this.confirmedList));
		this.rolesObject();
	}

	doDelete() {
		if (this.source.length > 0) {
			this.source.splice(0, 1);
		}
	}

	doCreate() {
		if (typeof this.source[0] === 'object') {
			const o = {};
			o[this.key] = this.source.length + 1;
			o[this.display] = this.userAdd;
			this.source.push(o);
		} else {
			this.source.push(this.userAdd);
		}
		this.userAdd = '';
	}

	doAdd() {
		for (let i = 0, len = this.source.length; i < len; i += 1) {
			const o = this.source[i];
			const found = this.confirmed.find((e: any) => e === o);
			if (!found) {
				this.confirmed.push(o);
				break;
			}
		}
	}

	doRemove() {
		if (this.confirmed.length > 0) {
			this.confirmed.splice(0, 1);
		}
	}

	doFilter() {
		this.filter = !this.filter;
	}

	filterBtn() {
		return (this.filter ? 'Hide Filter' : 'Show Filter');
	}

	doDisable() {
		this.disabled = !this.disabled;
	}

	disableBtn() {
		return (this.disabled ? 'Enable' : 'Disabled');
	}

	swapDirection() {
		this.sourceLeft = !this.sourceLeft;
		//this.format.direction = this.sourceLeft ? DualListComponent.LTR : DualListComponent.RTL;
	}

}
