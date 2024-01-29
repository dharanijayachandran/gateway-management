import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { DualListComponent } from 'angular-dual-listbox';
import { ScrollbarDirective, UIModalNotificationPage } from 'global';
import { MatTablePaginatorComponent } from 'src/app/shared/components/mat-table-paginator/mat-table-paginator.component';
import { globalShareServices } from 'src/app/shared/globalShareServices';
import { globalSharedService } from 'src/app/shared/services/global/globalSharedService';
import { GatewayModelPort } from '../../model/gateway-model-port';
import { GatewayModelService } from '../../services/gateway-model.service';
@Component({
  selector: 'app-gateway-model-port-view',
  templateUrl: './gateway-model-port-view.component.html',
  styleUrls: ['./gateway-model-port-view.component.css']
})
export class GatewayModelPortViewComponent implements OnInit {

  // Importing child component to
  @ViewChild(UIModalNotificationPage) modelNotification;
  @ViewChild('myPaginatorChildComponent') myPaginatorChildComponent: MatTablePaginatorComponent;
  @ViewChild(ScrollbarDirective) directiveRef?: ScrollbarDirective;

  keepSorted = true;
  key: string;
  display: any;
  filter = true;
  source: Array<any>;
  confirmed: Array<any>;
  disabled = false;
  isMapped = false;
  gatewayModelId = Number(sessionStorage.getItem('gatewayModelId'));
  gatewayModelName: String;
  format: any = DualListComponent.DEFAULT_FORMAT;

  private availablePinsForModel: Array<any> = [];
  private assignedPinsToPort: Array<any> = [];
  availablePinsList: Array<any> = [];
  assignedPinsList: Array<any> = [];
  prevAssignedPinsIds: Array<any> = [];
  dataSource: any;
  displayedColumns: string[] = ['id', 'sNo', 'name', 'description', 'portTypeName', 'internalMap', 'pins', 'status', 'edit'];
  @ViewChild(MatPaginator) paginator: MatPaginator;

  // Mat sorting for if use ngIf condition to show table starts here======================
  sort;
  deleteGatewayModel: number;
  showLoaderImage: boolean;
  @ViewChild(MatSort) set content(content: ElementRef) {
    this.sort = content;
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }
  // Mat sorting for if use ngIf condition to show table ends here======================

 // pageSettings = pageSettings;
  portTypes: any[];
  gatewayModelPortForm: FormGroup;
  private gatewayModelPort: GatewayModelPort = new GatewayModelPort();
  editable: boolean = true;
  disable: boolean = true;
  gatewayModelPortViewDiv = true;
  gatewayModelPortFormDiv = false;
  resetButton = false;
  NoRecordsFound = false;
  gatewayModelPortTableView: boolean;
  gatewayModelPortId: number = 0;
  prevAssignedPinsname: any;
  constructor(private gatewayModelService: GatewayModelService, private formBuilder: FormBuilder,
    private route: ActivatedRoute, private router: Router, private globalService: globalShareServices,
    private globalSharedService: globalSharedService) {

  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource();
    this.dataSource.filterPredicate = function (data, filter: string): boolean {
      return data.portTypeName.toLowerCase().includes(filter)
        || data.name.toLowerCase().includes(filter)
        || data.description.toLowerCase().includes(filter)
        || data.internalMap.toLowerCase().includes(filter)
        || data.status.toLowerCase().includes(filter)
        || data.pinNames.toString().toLowerCase().includes(filter);
    };
    this.NoRecordsFound = false;
    this.getGateWayModel();
  }

  getGateWayModel() {
    this.showLoaderImage = true;
    this.getGatewayModelPortList(this.gatewayModelId);
    this.getAllPinsForGatewayModel(this.gatewayModelId);
    this.getPortTypes();
    this.getGatewayModelByGatewayModelId(this.gatewayModelId);
  }

  // Refresh table
  refreshTableListFunction() {
    this.getGateWayModel();
  }


  getGatewayModelByGatewayModelId(gatewayModelId: number) {
    this.gatewayModelService.getGatewayModelByGatewayModelId(gatewayModelId)
      .subscribe(
        res => {
          this.gatewayModelName = res.name;
        },
        error => {
          this.modelNotification.alertMessage(this.globalSharedService.messageType_Fail, error);
        });
  }


  getGatewayModelPortList(gatewayModeId) {
    this.gatewayModelService.getGatewayModelPortByGatewayModelId(gatewayModeId)
      .subscribe(
        res => {
          this.showLoaderImage = false;
          res.forEach(gatewayModelPort => {
            let pinNames = []
            if (gatewayModelPort.status === 'A') {
              gatewayModelPort.status = 'Active'
            }
            else if (gatewayModelPort.status === 'D') {
              gatewayModelPort.status = 'In-Active'
            }
            if (!gatewayModelPort.description) {
              gatewayModelPort.description = ''
            }
            if (gatewayModelPort.pins) {
              gatewayModelPort.pins.forEach(pin => {
                pinNames.push(pin.name)
              })
            }
            gatewayModelPort.pinNames = pinNames;
          })
          res = res.sort((a, b) => b.id - a.id);
          if (Array.isArray(res) && res.length) {
            this.gatewayModelPortTableView = true;
            this.dataSource = new MatTableDataSource();
            this.dataSource.data = res;

            // To get paginator events from child mat-table-paginator to access its properties
            this.myPaginator = this.myPaginatorChildComponent.getDatasource();
            this.matTablePaginator(this.myPaginator);

            this.dataSource.paginator = this.myPaginator;
            this.dataSource.sort = this.sort;
          } else {
            this.NoRecordsFound = true;
            this.gatewayModelPortTableView = false;
          }

        },
        error => {
          this.showLoaderImage = false;
          // this.NoRecordsFound = true;
          // this.gatewayModelPortTableView = false;
          this.modelNotification.alertMessage(this.globalSharedService.messageType_Fail, error);
        });
  }

  getGatewayModelPortByGatewayModelPortId(gatewayModelPortId) {
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
          this.modelNotification.alertMessage(this.globalSharedService.messageType_Fail, error);
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

  deleteGatewayModelPort(id: number) {
    this.deleteGatewayModel = id;
    // Trigger sweet alert danger alert
    this.modelNotification.alertMessage(this.globalSharedService.messageType_Error, 'You will not be able to recover this Gateway Model Port!');
  }

  // confirmDelete
  confirmDelete() {
    let userId = +sessionStorage.getItem('userId');
    this.gatewayModelPortId = this.deleteGatewayModel;
    this.gatewayModelService.deleteGatewayModelPort(this.deleteGatewayModel, userId).subscribe(res => {
      // Success response
      this.modelNotification.alertMessage(res['messageType'], res['message']);
    },
      (error: any) => {
        this.modelNotification.alertMessage(this.globalSharedService.messageType_Fail, error);
      }
    );
  }

  getGatewayModelPortListItem() {
    this.dataSource.data = [];
    this.getGatewayModelPortList(this.gatewayModelId);
  }


  cancelGatewayModelPortForm(event: Event) {
    this.gatewayModelPortViewDiv = true;
    this.gatewayModelPortFormDiv = false;
    this.resetButton = false;
    this.isMapped = false;
    this.confirmed.splice(0, this.confirmed.length);
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
          this.modelNotification.alertMessage(this.globalSharedService.messageType_Fail, error);
        });
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
            this.prevAssignedPinsname.push(element.name);

          });
          this.resetPinsDetail();
        },
        error => {
          this.modelNotification.alertMessage(this.globalSharedService.messageType_Fail, error);
        });
  }


  getPortTypes(): void {
    this.gatewayModelService.getPortTypes()
      .subscribe(
        res => {
          this.portTypes = res as any[];
        },
        error => {
          this.modelNotification.alertMessage(this.globalSharedService.messageType_Fail, error);
        });
  }
  displayListBox(): void {
    this.isMapped = !this.isMapped;
  }

  resetGatewayModelPortForm() {
    this.gatewayModelPort = <GatewayModelPort>this.gatewayModelPortForm.value;
    if (this.gatewayModelPort.id == null) {
      this.gatewayModelPortForm.reset();
    } else {
      this.getGatewayModelPortByGatewayModelPortId(this.gatewayModelPort.id);
      this.getPinsByGatewayModelPortId(this.gatewayModelPort.id);
    }
  }

  backToGatewayModel() {
    //this.router.navigate(['gateway-model']);
    let gatewayModelList = document.getElementById('gatewayModelList');
    gatewayModelList.click();
  }
  addPort() {
    this.router.navigate(['../gateway-model/gateway-model-port-form'], { relativeTo: this.route });
    this.globalService.setGatewayModelPort(this.confirmed);
  }
  UpdateGatewayModelPort(event: Event, id: number) {
    this.globalService.GettingId(id);
    this.gatewayModelPortId = id;
    this.globalService.GettingString('Edit');
    this.globalService.setGatewayModelPort(this.confirmed);
    this.router.navigate(['../gateway-model/gateway-model-port-form'], { relativeTo: this.route });

  }
  viewGatewayModelPort(event: Event, id: number) {
    this.globalService.GettingId(id);
    this.gatewayModelPortId = id;
    this.globalService.GettingString('View');
    this.globalService.setGatewayModelPort(this.confirmed);
    this.router.navigate(['../gateway-model/gateway-model-port-form'], { relativeTo: this.route });

    //this.globalService.setPreviousePinsList(this.assignedPinsList)
  }


  /*
    Material table paginator code starts here
  */
  myPaginator;
  pageIndex: number;
  pageSize: number;
  length: number;

  /*
      Material pagination getting pageIndex, pageSize, length through
      events(On change page, Next,Prev, Last, first) */
  matTablePaginator(myPaginator) {
    this.pageIndex = myPaginator.pageIndex;
    this.pageSize = myPaginator.pageSize;
    this.length = myPaginator.length;
  }


  /* Load table data always to the Top of the table
  when change paginator page(Next, Prev, Last, First), Page size  */
  onPaginateViewScrollToTop() {
    this.directiveRef.scrollToTop();
    this.directiveRef.update();
  }

  /*
    Material table paginator code ends here
  */

}
