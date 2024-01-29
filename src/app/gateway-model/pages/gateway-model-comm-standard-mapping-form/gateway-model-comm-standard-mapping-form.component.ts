import { Component, OnInit, ViewChild } from '@angular/core';
import { GatewayModelService } from '../../services/gateway-model.service';
import { ActivatedRoute, Router } from '@angular/router';
import { globalSharedService } from 'src/app/shared/services/global/globalSharedService';
import { globalShareServices } from 'src/app/shared/globalShareServices';
import { CommonUnitService } from 'src/app/shared/common-unit.service';
import { UIModalNotificationPage } from 'global';
@Component({
	selector: 'app-gateway-model-comm-standard-mapping-form',
	templateUrl: './gateway-model-comm-standard-mapping-form.component.html',
	styleUrls: ['./gateway-model-comm-standard-mapping-form.component.css']
})
export class GatewayModelCommStandardMappingFormComponent implements OnInit {

	// Importing child component to
	@ViewChild(UIModalNotificationPage) modelNotification;

	source: any[] = [];
	gatewayModelId = Number(sessionStorage.getItem('gatewayModelId'));
	gatewayModelName: string;
	gatewayModelPinPortViewMode = true;
	prevAssignedPinPort = new Map();
	editForm = false;
	assignedPinPort: any[];
	confirmed: any[] = [];
	assignedData: any[] = [];
	availableData: any[] = [];
	key: string;
	display: any;
	confirmedList: any[] = [];
	editFormData: any[] = [];
	prevAssignedMappedData: Array<number> = [];
	showLoaderImage: boolean;

	constructor(private globalService: globalShareServices, private gatewayModelService: GatewayModelService, private commonUnitService: CommonUnitService,
		private route: ActivatedRoute, private router: Router,
		private globalSharedService: globalSharedService) { }

	ngOnInit() {

		this.source = this.globalService.source;
		this.sourcDeviceName();
		//this.assignedPinPort = this.globalService.assignedPinPort;
		this.getGatewayModelByGatewayModelId(this.gatewayModelId);
		this.prevAssignedMappedData = this.globalService.prevAssignedCommStandard;
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
	private sourcDeviceName() {
		let i;
		this.source.forEach(element => {
			element.available.forEach(availableData => {
				this.availableData.push(availableData);
			});
			element.assigned.forEach(assigndData => {
				//this.editForm = true;
				this.assignedData.push(assigndData);

			});
			this.confirmedList = this.availableData.filter((e) => {
				for (i = 0; i < this.assignedData.length; i++) {
					if (e.gatewayModelPinId == this.assignedData[i].gatewayModelPinId) {
						return e;
					}
				}

			});

		});



	}

	backButton() {
		this.router.navigate(['../'], { relativeTo: this.route });
		this.globalService.GettingId(this.gatewayModelId);
		this.globalService.GettingString('manageCommStdPinPort');
		this.globalService.setSource(this.source);
	}

	saveGatewayModelCommStdMapping(): void {
		this.showLoaderImage = true;
		let userId = +sessionStorage.getItem('userId');
		let confirmedId: Array<number> = [];
		let toBeAddedPinPort = '[';
		this.source.forEach(element => {
			let gatewayModelCommStandardId = element.gatewayModelCommStandardId;
			let terminal = element.terminal;
			let prevAssignedValue = this.prevAssignedPinPort.get(gatewayModelCommStandardId);
			toBeAddedPinPort = toBeAddedPinPort + '{"gatewayModelCommStandardId":' + element.gatewayModelCommStandardId + ',"terminal":"' + terminal;
			let portPinIdsObj = "";
			element.assigned.forEach(element => {
				let key = element.gatewayModelPinId || element.gatewayModelPortId;
				confirmedId.push(key);
				portPinIdsObj = portPinIdsObj + '{"id":' + key + '},';
			});
			if (portPinIdsObj.endsWith(",")) {
				portPinIdsObj = portPinIdsObj.substring(0, (portPinIdsObj.length - 1));
			}
			if (terminal == "Port") {
				toBeAddedPinPort = toBeAddedPinPort + '","ports":[' + portPinIdsObj + '], "status":"A", "createdBy":' + userId + '},';
			} else if (terminal == "PIN") {
				toBeAddedPinPort = toBeAddedPinPort + '","pins":[' + portPinIdsObj + '], "status":"A", "createdBy":' + userId + '},';
			}
		});
		if (toBeAddedPinPort.endsWith(",")) {
			toBeAddedPinPort = toBeAddedPinPort.substring(0, (toBeAddedPinPort.length - 1));
		}
		toBeAddedPinPort = toBeAddedPinPort + ']';
		if (this.prevAssignedMappedData.length != 0) {
			this.editForm = true;


		}

		if (!this.editForm) {
			this.gatewayModelService.addGatewayModelPinPortForCommStd(toBeAddedPinPort).subscribe((res) => {
				this.showLoaderImage = false;
				// Success response
				this.modelNotification.alertMessage(res['messageType'], res['message']);

				/* this.globalService.GettingId(this.gatewayModelId);
				this.globalService.GettingString('manageCommStdPinPort'); */
			},
				(error: any) => {
					this.showLoaderImage = false;
					// If the service is not available
					this.modelNotification.alertMessage(this.globalSharedService.messageType_Fail, error);
				}
			);
		} else {
			this.gatewayModelService.updateGatewayModelPinPortForCommStd(toBeAddedPinPort).subscribe((res) => {
				this.showLoaderImage = false;
				// Success response
				this.modelNotification.alertMessage(res['messageType'], res['message']);
				/* this.globalService.GettingId(this.gatewayModelId);
				this.globalService.GettingString('manageCommStdPinPort'); */
			},
				(error: any) => {
					this.showLoaderImage = false;
					// If the service is not available
					this.modelNotification.alertMessage(this.globalSharedService.messageType_Fail, error);
				}
			);
		}
	}

	redirectTo() {
		this.router.navigate(['../'], { relativeTo: this.route });
	}
}
