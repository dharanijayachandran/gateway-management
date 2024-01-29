import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { GatewayModelService } from '../../services/gateway-model.service';
import { ActivatedRoute, Router, Event } from '@angular/router';
import { globalSharedService } from 'src/app/shared/services/global/globalSharedService';
import { globalShareServices } from 'src/app/shared/globalShareServices';
import { CommonUnitService } from 'src/app/shared/common-unit.service';
import { UIModalNotificationPage } from 'global';
@Component({
	selector: 'app-gateway-model-comm-standard-mapping',
	templateUrl: './gateway-model-comm-standard-mapping.component.html',
	styleUrls: ['./gateway-model-comm-standard-mapping.component.css']
})
export class GatewayModelCommStandardMappingComponent implements OnInit {

	// Importing child component to
	@ViewChild(UIModalNotificationPage) modelNotification;

	tab = 1;
	sourceLeft = true;
	keepSorted = true;
	key: string;
	display: any;
	filter = true;
	source: Array<any>;
	userAdd = '';
	confirmed: Array<any> = [];
	disabled = false;
	// format: any = DualListComponent.DEFAULT_FORMAT;
	format = {
		all: "Select all",
		none: "Deselect all"
	  }
	allCommStandardDataList: Array<any>;
	private sourceRoles: Array<any>;
	private confirmedRoles: Array<any>;
	private availableTerminals: Array<any>;
	prevAssignedPinPort = new Map();
	gatewayModelId = Number(sessionStorage.getItem('gatewayModelId'));
	gatewayModelName: String;
	editForm = false;
	assignedData: any;
	availableData: any;
	editFormData: any[] = [];
	prevAssignedMappedData: Array<number> = [];
	warningFlag: string;
	showLoaderImage: boolean;

	// private prevAssignedValue:Array<any>;
	constructor(private gatewayModelService: GatewayModelService, private commonUnitService: CommonUnitService,
		private route: ActivatedRoute, private router: Router, private globalService: globalShareServices,
		private globalSharedService: globalSharedService) { }

	ngOnInit() {
		this.showLoaderImage = true;
		this.gatewayModalCommStandard();
	}

	gatewayModalCommStandard() {
		if (this.globalService.source != null) {
			this.allCommStandardDataList = this.globalService.source;
			this.showLoaderImage = false;
			this.resetGatewayModelCommStandard();
		} else {
			this.getCommStandardMappingDataByDeviceModelId(this.gatewayModelId);
		}
		this.getGatewayModelByGatewayModelId(this.gatewayModelId);
		/* this.source.forEach(element=>{
			this.editFormData.push(element.assigned);
		}) */
	}

	// Refresh
	refreshTableListFunction() {
		this.gatewayModalCommStandard();
	}

	getGatewayModelByGatewayModelId(gatewayModelId) {
		this.gatewayModelService.getGatewayModelByGatewayModelId(gatewayModelId)
			.subscribe(
				res => {
					this.showLoaderImage = false;
					this.gatewayModelName = res.name;
				},
				error => {
					this.showLoaderImage = false;
					// If the service is not available
					this.modelNotification.alertMessage(this.globalSharedService.messageType_Fail, error);
				});
	}

	getCommStandardMappingDataByDeviceModelId(gatewayModelId: number): void {
		this.gatewayModelService.getCommStandardMappingDataByDeviceModelId(gatewayModelId)
			.subscribe(
				res => {
					this.showLoaderImage = false;
					this.allCommStandardDataList = res as Array<any>;
					this.resetGatewayModelCommStandard();
					this.createMapForPreviousAssignedValue();
				},
				error => {
					this.showLoaderImage = false;
					// If the service is not available
					this.modelNotification.alertMessage(this.globalSharedService.messageType_Fail, error);
				});
	}

	createMapForPreviousAssignedValue() {
		this.prevAssignedPinPort.clear();

		this.allCommStandardDataList.forEach(element => {
			let gatewayModelCommStandardId = element.gatewayModelCommStandardId;
			let terminal = element.terminal;
			let valueArray: Array<any> = [];
			if (terminal == "Port") {
				// prevAssignedPinPort
				element.assigned.forEach(element => {
					valueArray.push(element.gatewayModelPortId || element.gatewayModelPinId);
				});
			} else if (terminal == "PIN") {
				element.assigned.forEach(element => {

					valueArray.push(element.gatewayModelPinId || element.gatewayModelPortId);
				});
			}
			this.prevAssignedPinPort.set(gatewayModelCommStandardId, valueArray);
		});

	}

	resetGatewayModelCommStandard() {
		this.availableTerminals = JSON.parse(JSON.stringify(this.allCommStandardDataList));
		this.sourcDeviceName();
	}

	private sourcDeviceName() {
		this.keepSorted = true;
		this.source = this.availableTerminals;
		this.source.forEach(element => {
			element.available.forEach(element => {
				element.key = element.gatewayModelPinId || element.gatewayModelPortId
			});
			element.assigned.forEach(element => {
				this.editForm = true;
				this.prevAssignedMappedData.push(element.id);
				element.key = element.gatewayModelPinId || element.gatewayModelPortId
			});
		});
		this.key = 'key';
		this.display = 'name';

	}

	backToGatewayModel() {
		this.warningFlag = "cancel";
		this.modelNotification.alertMessage(this.globalSharedService.messageType_Warning, 'You will not be able to recover the changes!');
	}


	@Output() tabName = new EventEmitter<string>();
	// Confirm redirect to
	formCancelConfirm() {
		this.tabName.emit('gatewayModelList');
		let gatewayModelList = document.getElementById('gatewayModelList');
		gatewayModelList.click();
	}

	resetGatewayModelCommStdMapping() {
		this.warningFlag = "reset";
		this.modelNotification.alertMessage(this.globalSharedService.messageType_Warning, 'You will not be able to recover the changes!');

	}


	// Checkbox reset  confirm
	formResetConfirm() {
		this.getCommStandardMappingDataByDeviceModelId(this.gatewayModelId);
	}


	alertRedirection() {
		if (this.warningFlag == "reset") {
			this.formResetConfirm();
		} else if (this.warningFlag == "cancel") {
			this.formCancelConfirm();
		}
		this.warningFlag = "";
	}

	private roleLabel(item: any) {
		return item.name;
	}

	private rolesObject() {
		this.key = "id";
		this.display = this.roleLabel;
		this.keepSorted = true;
		this.source = this.sourceRoles;
		this.confirmed = this.confirmedRoles;
	}


	doReset() {
		this.sourceRoles = JSON.parse(JSON.stringify(this.allCommStandardDataList));
		this.confirmedRoles = JSON.parse(JSON.stringify(this.prevAssignedPinPort));
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

	saveAndReview() {
		let save = true;
		this.source.forEach(element => {
			//this.editFormData.push(element.assigned);
			if (element.assigned.length > 0) {
				save = false;
			}
		})


		if (save) {
			this.modelNotification.alertMessage(this.globalSharedService.messageType_Info, 'Please map atleast one field');
		} else {
			this.router.navigate(['../gateway-model/gateway-model-comm-standard-mapping-form'], { relativeTo: this.route });
			this.globalService.setSource(this.source);
			this.globalService.setCommStandards(this.confirmed);
			this.globalService.setPrevAssignedPinPort(this.allCommStandardDataList);
			this.globalService.setPreviouseCommStandard(this.prevAssignedMappedData);
		}


		/*


        /* let i;
		let dummy =this.source.filter((e)=>{
			for(i=0;i<this.source.assigned){

			}
		}) */

	}

	// redirectTo
	redirectTo() {
		// alert("Please map atleast one field");
		this.router.navigate(['../'], { relativeTo: this.route })
		this.globalService.GettingId(this.gatewayModelId);
		this.globalService.GettingString('manageCommStdPinPort');
	}

	onChange(event) {
	}

}
