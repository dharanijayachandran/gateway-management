import { Component, EventEmitter, HostListener, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { EmitType } from '@syncfusion/ej2-base';
import { Query } from '@syncfusion/ej2-data';
import { FilteringEventArgs } from '@syncfusion/ej2-dropdowns';
import { UIModalNotificationPage } from 'global';
import { Observable } from 'rxjs';
import { globalShareServices } from 'src/app/shared/globalShareServices';
import { DialogService } from 'src/app/shared/services/dialog/dialog.service';
import { globalSharedService } from 'src/app/shared/services/global/globalSharedService';
import { GatewayModelPin } from '../../model/gateway-model-pin';
import { GatewayModelPort } from '../../model/gateway-model-port';
import { GatewayModelService } from '../../services/gateway-model.service';
@Component({
  selector: 'app-gateway-model-port-form',
  templateUrl: './gateway-model-port-form.component.html',
  styleUrls: ['./gateway-model-port-form.component.css']
})
export class GatewayModelPortFormComponent implements OnInit {
  showLoaderImage: boolean;

  // It help to if there are no pending changes, just allow deactivation; else confirm first code starts here
  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    if (this.hasOwnProperty('gatewayModelPortForm')) {
      if (this.gatewayModelPortForm.dirty) {
        this.dialogService.alertMessage(this.globalShareService.messageType_Warning, 'You will not be able to recover the changes!');
        // returning false will show a confirm dialog before navigating away
      } else {
        return true; // returning true will navigate without confirmation
      }
      return this.dialogService.navigateAwaySelection$;
    } else return true;
  }
  // It help to if there are no pending changes, just allow deactivation; else confirm first code ends here


  // Importing child component to
  @ViewChild(UIModalNotificationPage) modelNotification;

  keepSorted = true;
  key: string;
  display: any;
  filter = true;
  source: Array<any>;
  gatewayModelPort: GatewayModelPort = new GatewayModelPort();
  gatewayModelPortForm: FormGroup;
  confirmed: Array<any>;
  gatewayModelId = Number(sessionStorage.getItem('gatewayModelId'));
  gatewayModelName: String;
  // format: any = DualListComponent.DEFAULT_FORMAT;
  format = {
    all: "Select all",
    none: "Deselect all"
  }

  isMapped = false;
  private availablePinsForModel: Array<any> = [];
  private assignedPinsToPort: Array<any> = [];
  availablePinsList: Array<any> = [];
  assignedPinsList: Array<any> = [];
  prevAssignedPinsIds: Array<any> = [];
  portTypes: any[];
  dataSource: any;
  gatewayModelPortId: number = 0;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  gatewayModelPortFormDiv = true;
  gatewayModelPortReadModeView = false;
  gatewayModelPortViewMode = false;
  prevAssignedPins: any[];
  confirmedList: any[];
  MappedOverPin: any;
  successFlag: string;
  warningFlag: string;

  public portTypeFields: Object = {
    text: 'name',
    value: 'id'
  };
  // filtering event handler to filter a Menu Icon Name
  //pass the filter data source, filter query to updateData method.
  public onFilteringPortType: EmitType<FilteringEventArgs> = (e: FilteringEventArgs) => {
    let query: Query = new Query();
    //frame the query based on search string with filter type.
    query = (e.text !== '') ? query.where('name', 'contains', e.text, true) : query;
    e.updateData(this.portTypes, query);

  }
  public sortDropDown:string ='Ascending';
  portTypeId:any;
  // set the placeholder to DropDownList input element
  public portTypeWaterMark: string = 'Select Port Type';
  public filterPlaceholder: string = 'Search';
  // set the height of the popup element
  public height: string = '200px';
  public locale: string;

  constructor(private gatewayModelService: GatewayModelService, private formBuilder: FormBuilder,
    private route: ActivatedRoute, private router: Router, private globalService: globalShareServices, private globalShareService: globalSharedService,
    private dialogService: DialogService) { }

  ngOnInit() {
    this.getGatewayModelPortList(this.gatewayModelId);
    this.getGatewayModelByGatewayModelId(this.gatewayModelId);
    this.getPortTypes();
    this.getAllPinsForGatewayModel(this.gatewayModelId);

    let id = Number(this.globalService.assignId);
    let operation = this.globalService.name;
    if (id != 0 && operation === 'View') {
      this.confirmed = this.globalService.gatewayModelPorts;
      this.getGatewayModelPortByGatewayModelPortIdForView(id);
      // this.getPinsByGatewayModelPortId(id);
      this.gatewayModelPortId = id;
      this.gatewayModelPortFormDiv = false;
      this.gatewayModelPortReadModeView = false;
      this.gatewayModelPortViewMode = true;
    }
    else if (id != 0 && operation === 'Edit') {
      this.gatewayModelPortId = id;
      //this.isMapped=true;
      this.confirmed = this.globalService.gatewayModelPorts;
      this.gatewayModelPinFormValidation();
      this.getGatewayModelPortByGatewayModelPortIdForEdit(id);
      this.gatewayModelPortFormDiv = true;
      this.gatewayModelPortReadModeView = false;
      this.gatewayModelPortViewMode = false;
    }
    else {
      this.gatewayModelPinFormValidation();
      this.gatewayModelPortFormDiv = true;
      this.gatewayModelPortReadModeView = false;
      this.gatewayModelPortViewMode = false;
    }
  }

  // Refresh
  refreshTableListFunction() {
    this.getGatewayModelPortList(this.gatewayModelId);
    this.getGatewayModelByGatewayModelId(this.gatewayModelId);
    this.getPortTypes();
    this.getAllPinsForGatewayModel(this.gatewayModelId);
  }

  parseInt(id) {
    return parseInt(id);
  }
  gatewayModelPinFormValidation() {
    this.gatewayModelPortForm = this.formBuilder.group({
      id: [null],
      portTypeId: ['', Validators.required],
      name: ['', [Validators.required, Validators.pattern(this.globalShareService.getNamePattern())]],
      description: [],
      internalMap: ['', Validators.required],
      isMappedOverPin: [],
      status: []
    });
  }
  getPortTypes(): void {
    this.gatewayModelService.getPortTypes()
      .subscribe(
        res => {
          this.portTypes = res as any[];
          this.portTypes= this.globalService.addSelectIntoList(this.portTypes);
        },
        error => {
          // If the service is not available
          this.modelNotification.alertMessage(this.globalShareService.messageType_Fail, error);
        });
  }
  getGatewayModelPortByGatewayModelPortIdForView(gatewayModelPortId) {
    this.getPinsByGatewayModelPortId(gatewayModelPortId);
    this.gatewayModelService.getGatewayModelPortByGatewayModelPortId(gatewayModelPortId)
      .subscribe(data => {
        this.MappedOverPin = this.isMappedOverPin(data)
        this.gatewayModelPort = data;
        if (data.status === 'A') {
          this.gatewayModelPort.status = 'Active';
        }
      },
        (error: any) => {
          // If the service is not available
          this.modelNotification.alertMessage(this.globalShareService.messageType_Fail, error);
        }
      );
  }
  getGatewayModelPortByGatewayModelPortIdForEdit(gatewayModelPortId) {
    this.getPinsByGatewayModelPortId(gatewayModelPortId);
    this.gatewayModelService.getGatewayModelPortByGatewayModelPortId(gatewayModelPortId)
      .subscribe(
        res => {
          this.gatewayModelPortForm.patchValue({
            id: res.id,
            name: res.name,
            description: this.getDescription(res),
            status: res.status,
            portTypeId: res.portTypeId,
            internalMap: res.internalMap,
            //isMappedOverPin: this.isMapped
            isMappedOverPin: this.isMappedOverPin(res)
          });
        },
        error => {
          // If the service is not available
          this.modelNotification.alertMessage(this.globalShareService.messageType_Fail, error);
        });
  }
  cancelGatewayModelPortlView(event: Event) {
    this.router.navigate(['../'], { relativeTo: this.route });
    this.globalService.GettingId(this.gatewayModelId);
    this.globalService.GettingString('managePort');
  }
  getPinsByGatewayModelPortId(gatewayModelPortId: number): void {
    this.gatewayModelService.getGatewayModelPinsByGatewayModelPortId(gatewayModelPortId)
      .subscribe(
        res => {
          if (res.length > 0) {
            this.isMapped = true;
          }
          this.assignedPinsList = res as Array<any>;
          this.assignedPinsList.forEach(element => {
            this.prevAssignedPinsIds.push(element.id);

          });
          this.resetPinsDetail();
        },
        error => {
          // If the service is not available
          this.modelNotification.alertMessage(this.globalShareService.messageType_Fail, error);
        });
  }
  getDescription(res: GatewayModelPort) {
    if ((res.description) != null) {
      return res.description;
    }
    else {
      return '';
    }
  }

  isMappedOverPin(res: GatewayModelPort) {

    if ((res.pins) != null && (res.pins.length) > 0 && (res.pins.length) != undefined) {
      this.isMapped = true;
      return true;
    } else {
      this.isMapped = false;
      return false;
    }
  }
  createOrUpdateGatewayModelPort(): void {

    this.gatewayModelPort = <GatewayModelPort>this.gatewayModelPortForm.value;
    if (this.gatewayModelPort.isMappedOverPin) {
      if (!(this.confirmed.length > 0)) {
        // alert("Either select atleast one pin or un check IsMappedOverPin");
        this.modelNotification.alertMessage(this.globalShareService.messageType_Info, 'Either select atleast one pin or un check IsMappedOverPin');
      } else {
        this.createOrUpdateGatewayModelPortServiceCall();
        this.confirmed.splice(0, this.confirmed.length);
      }
    }
    else {
      this.confirmed.splice(0, this.confirmed.length);
      this.createOrUpdateGatewayModelPortServiceCall();
    }
  }

  createOrUpdateGatewayModelPortServiceCall(): void {
    this.showLoaderImage = true;
    let userId = +sessionStorage.getItem('userId');
    this.gatewayModelPort.gatewayModelId = this.gatewayModelId;
    let gatewayModelPinList: Array<GatewayModelPin> = [];
    if (this.assignedPinsToPort.length > 0) {
      this.assignedPinsToPort.forEach(obj => {
        let gatewayModelPin = new GatewayModelPin();
        gatewayModelPin.id = obj.id;
        gatewayModelPin.status = "A";
        gatewayModelPinList.push(gatewayModelPin);
      });
    }
    this.gatewayModelPort.pins = gatewayModelPinList;
    if (this.gatewayModelPort.id === null) {
      this.gatewayModelPort.createdBy = userId;
      this.gatewayModelPort.status = "A";
      this.gatewayModelService.addGatewayModelPort(this.gatewayModelPort).subscribe((res) => {
        this.showLoaderImage = false;
        // Success response
        this.successFlag = "create";
        this.modelNotification.alertMessage(res['messageType'], res['message']);
        this.gatewayModelPinFormValidation();
      },
        (error: any) => {
          this.showLoaderImage = false;
          // If the service is not available
          this.modelNotification.alertMessage(this.globalShareService.messageType_Fail, error);
        }
      );
    } else {
      this.gatewayModelPort.updatedBy = userId;
      this.gatewayModelService.updateGatewayModelPort(this.gatewayModelPort).subscribe((res) => {
        this.showLoaderImage = false;
        // Success response
        this.successFlag = "update";
        this.modelNotification.alertMessage(res['messageType'], res['message']);
        this.gatewayModelPinFormValidation();
      },
        (error: any) => {
          this.showLoaderImage = false;
          // If the service is not available
          this.modelNotification.alertMessage(this.globalShareService.messageType_Fail, error);
        }
      );
    }
  }

  redirectTo() {
    if (this.successFlag == "create") {
      this.gatewayModalCreate();
    } else if (this.successFlag == "update") {
      this.gateWayModalUpdate();
    }
    this.successFlag = "";
  }


  // Gateway modal create
  gatewayModalCreate() {
    this.getGatewayModelPortList(this.gatewayModelId);
    this.getWayModalCommoncreateUpdate();
  }

  // Gateway modal Update
  gateWayModalUpdate() {
    this.updatePinsForPort();
    this.getGatewayModelPortList(this.gatewayModelId);
    this.getWayModalCommoncreateUpdate();
  }

  // Method for create and update
  getWayModalCommoncreateUpdate() {
    this.router.navigate(['../'], { relativeTo: this.route });
    this.globalService.GettingId(this.gatewayModelId);
    this.globalService.GettingString('managePort');
  }

  updatePinsForPort(): void {
    let gatewayModelPortId = this.gatewayModelPortId;
    let userId = +sessionStorage.getItem('userId');
    let confirmedId: Array<number> = [];
    for (let o of this.confirmed) {
      confirmedId.push(o.id);
      if (!this.prevAssignedPinsIds.includes(o.commStandardId)) {
        let toBeAddedCommStandard = '{"gatewayModelPortId":' + this.gatewayModelPortId + ',"gatewayModelPinId":' + o.id + ',"status":' + o.status + '}'
        this.gatewayModelService.addGatewayModelPortPinMapping(toBeAddedCommStandard).subscribe((any) => {
        },
          (error: any) => {
            this.modelNotification.alertMessage(this.globalShareService.messageType_Fail, error);
          }
        );
      }
    }
    for (let i = 0; i < this.prevAssignedPinsIds.length; i++) {
      if (!confirmedId.includes(this.prevAssignedPinsIds[i])) {
        this.gatewayModelService.deleteGatewayModelPortPinMapping(this.prevAssignedPinsIds[i], userId).subscribe((any) => {
        },
          (error: any) => {
            this.modelNotification.alertMessage(this.globalShareService.messageType_Fail, error);
          }
        );
      }
    }
  }

  getGatewayModelPortList(gatewayModeId) {
    this.gatewayModelService.getGatewayModelPortByGatewayModelId(gatewayModeId)
      .subscribe(
        res => {
          this.dataSource = new MatTableDataSource();
          this.dataSource.data = res;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error => {
          this.modelNotification.alertMessage(this.globalShareService.messageType_Fail, error);
        });
  }

  getGatewayModelByGatewayModelId(gatewayModelId: number) {
    this.gatewayModelService.getGatewayModelByGatewayModelId(gatewayModelId)
      .subscribe(
        res => {
          this.gatewayModelName = res.name;
        },
        error => {
          this.modelNotification.alertMessage(this.globalShareService.messageType_Fail, error);
        });
  }
  createGatewayModelPort() {
    this.gatewayModelPortFormDiv = false;
    this.gatewayModelPortReadModeView = true;
    // this.gatewayViewMode=false;
    this.gatewayModelPort = <GatewayModelPort>this.gatewayModelPortForm.value;
    // this.gatewayModelPort.nodeModelPinId = +this.confirmed;
    let i;
    this.confirmedList = this.source.filter((e) => {
      for (i = 0; i < this.confirmed.length; i++) {
        if (e.id == this.confirmed[i].id) {
          return e;
        }
      }
    });


  }
  backButton(elementId) {

    this.gatewayModelPortFormDiv = true;
    this.gatewayModelPortReadModeView = false;
    //this.gatewayViewMode=false;
    window.scrollTo(0, 0);
    setTimeout(() => {
      if (elementId) {
        let item = document.getElementById(elementId);
        window.scrollBy({ top: item.offsetTop, behavior: 'smooth' })
      }
    });
  }
  resetGatewayModelPortForm() {
    if (this.gatewayModelPortForm.dirty) {
      this.warningFlag = "reset";
      this.modelNotification.alertMessage(this.globalShareService.messageType_Warning, 'You will not be able to recover the changes!');
    }
  }

  // Form reset  confirm
  formResetConfirm() {
    this.gatewayModelPort = <GatewayModelPort>this.gatewayModelPortForm.value;
    if (this.gatewayModelPort.id === null) {
      this.gatewayModelPinFormValidation();
      this.getAllPinsForGatewayModel(this.gatewayModelId);
      if (this.isMapped = false) {
        this.isMapped = !this.isMapped;
      }
    }
    else {
      this.gatewayModelPinFormValidation();
      this.getAllPinsForGatewayModel(this.gatewayModelId);
      this.getGatewayModelPortByGatewayModelPortIdForEdit(this.gatewayModelPort.id);
    }
  }

  displayListBox(): void {
    this.isMapped = !this.isMapped;
  }
  private displayLabel(item: any) {
    return item.name;
  }
  private setProperties() {
    this.key = 'id';
    this.display = this.displayLabel;
    this.keepSorted = true;
    this.source = this.availablePinsForModel;
    this.confirmed = this.assignedPinsToPort;
  }

  resetPinsDetail() {
    this.availablePinsForModel = JSON.parse(JSON.stringify(this.availablePinsList));
    this.assignedPinsToPort = JSON.parse(JSON.stringify(this.assignedPinsList));
    this.setProperties();
  }

  getAllPinsForGatewayModel(gatewayModelId: number): void {
    this.gatewayModelService.getGatewayModelPinsByGatewayModelId(gatewayModelId)
      .subscribe(
        res => {
          this.availablePinsList = res as Array<any>;
          if (this.gatewayModelPortId > 0) {
            this.getPinsByGatewayModelPortId(this.gatewayModelPortId);
          } else {
            this.resetPinsDetail();
          }
        },
        error => {
          this.modelNotification.alertMessage(this.globalShareService.messageType_Fail, error);
        });
  }
  cancelGatewayModelPortView() {
    this.formCancelConfirm();
  }

  @Output() tabName = new EventEmitter<string>();

  // Confirm redirect to
  formCancelConfirm() {
    // this.tabName.emit('managePort');
    this.globalService.GettingId(this.gatewayModelId);
    this.globalService.GettingString('managePort');
    this.router.navigate(['../'], { relativeTo: this.route })
  }
  onKey(event: any) {
    let isDH = this.globalShareService.doubleHyphen(event);
    if (isDH) {
      this.gatewayModelPortForm.get('name').setErrors({
        pattern: true
      });
    }
  }
  portTypeOnChange($event){
    if ($event.value) {
      this.gatewayModelPortForm.controls['portTypeId'].setValue($event.itemData.id);
    }else{
      this.gatewayModelPortForm.controls['portTypeId'].setValue(null);
    }
  }

}
