import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ScrollbarDirective, UIModalNotificationPage } from 'global';
import { MatTablePaginatorComponent } from 'src/app/shared/components/mat-table-paginator/mat-table-paginator.component';
import { globalShareServices } from 'src/app/shared/globalShareServices';
import { globalSharedService } from 'src/app/shared/services/global/globalSharedService';
import { GatewayModel } from '../../model/gateway-model';
import { GatewayModelService } from '../../services/gateway-model.service';
@Component({
  selector: 'app-gateway-model-view',
  templateUrl: './gateway-model-view.component.html',
  styleUrls: ['./gateway-model-view.component.css']
})
export class GatewayModelViewComponent implements OnInit {

  // Importing child component to
  @ViewChild(UIModalNotificationPage) modelNotification;
  @ViewChild('myPaginatorChildComponent') myPaginatorChildComponent: MatTablePaginatorComponent;
  @ViewChild(ScrollbarDirective) directiveRef?: ScrollbarDirective;

  gatewayModelViewDiv = true;
  gatewayModelSection = false;
  gatewayViewMode = false;
  resetButton = false;
  gatewayModelFormDiv = false;
  gatewayModelReadModeView = false;

  gatewayModelTableView: boolean;
  NoRecordsFound = false;

  gatewayTypes: any[];
  dataSource: any;
  displayedColumns: string[] = ['id', 'sNo', 'name', 'description', 'type', 'isGeneric', 'status', 'edit'];
  @ViewChild(MatPaginator) paginator: MatPaginator;

  // Mat sorting for if use ngIf condition to show table starts here======================
  sort;
  deleteGateWayModelId: any;
  showLoaderImage: boolean = false;
  businessEntityId: string;
  @ViewChild(MatSort) set content(content: ElementRef) {
    this.sort = content;
  }
  // Mat sorting for if use ngIf condition to show table ends here======================

  gatewayModelForm: FormGroup;
  private gatewayModel: GatewayModel = new GatewayModel();
  editable: boolean = true;
  disable: boolean = true;
  constructor(private globalService: globalShareServices,
    private gatewayModelService: GatewayModelService,
    private formBuilder: FormBuilder, private router: Router,
    private globalSharedService: globalSharedService,
    private route: ActivatedRoute) {

  }

  ngOnInit() {

    this.businessEntityId = sessionStorage.getItem('beId');
    this.showLoaderImage = true;
    this.getGatewayModelList();
    this.getGatewayTypes();
    this.NoRecordsFound = false;
  }

  // Refresh table
  refreshTableListFunction() {
    this.showLoaderImage=true;
    this.getGatewayModelList();
    this.getGatewayTypes();
  }

  UpdateGatewayModel(id: number) {
    this.globalService.GettingId(id);
    this.globalService.GettingString('Edit');
    this.router.navigate(['../gateway-model/gateway-model-form'], { relativeTo: this.route });
  }
  viewGatewayModel(id) {
    this.globalService.GettingId(id);
    this.globalService.GettingString('View');
    this.router.navigate(['../gateway-model/gateway-model-form'], { relativeTo: this.route });
  }

  getGatewayModelList() {
     //this.showLoaderImage=true;
    let organizationId = sessionStorage.getItem('beId');

    this.gatewayModelService.getGatewayModelList(organizationId)
      .subscribe(
        res => {
          this.showLoaderImage = false;
          res.forEach(gatewayModel => {
            if (gatewayModel.status === 'A') {
              gatewayModel.status = 'Active'
            }
            else if (gatewayModel.status === 'D') {
              gatewayModel.status = 'In-Active'
            }
            if (gatewayModel.isGeneric) {
              gatewayModel.isAvailable = 'Yes'
            } else {
              gatewayModel.isAvailable = 'No'
            }
            if (!gatewayModel.description) {
              gatewayModel.description = ''
            }
          })
          res = res.sort((a, b) => b.id - a.id);
          if (Array.isArray(res) && res.length) {
            this.gatewayModelTableView = true;
            // this.dataSource = new MatTableDataSource();
            this.dataSource = new MatTableDataSource();
            this.dataSource.filterPredicate = function (data, filter: string): boolean {
              return data.name.toLowerCase().includes(filter)
                || data.description.toLowerCase().includes(filter)
                || data.gatewayTypeName.toLowerCase().includes(filter)
                || data.isAvailable.toLowerCase().includes(filter)
                || data.status.toLowerCase().includes(filter);
            };
            this.dataSource.data = res;
            // To get paginator events from child mat-table-paginator to access its properties
            this.myPaginator = this.myPaginatorChildComponent.getDatasource();
            this.matTablePaginator(this.myPaginator);
            this.dataSource.paginator = this.myPaginator;
            this.dataSource.sort = this.sort;
            //
          }
          else {
            // this.dataSource = new MatTableDataSource();
            this.gatewayModelTableView = false;
            this.NoRecordsFound = true;
          }
          // this.gatewayModelReadModeView=false;
        },
        error => {
          this.showLoaderImage = false;
          this.gatewayModelTableView = false;
          this.NoRecordsFound = true;
          //
          this.modelNotification.alertMessage(this.globalSharedService.messageType_Fail, error);
        });
  }

  getGatewayTypes(): void {
    this.gatewayModelService.getGatewayTypes()
      .subscribe(
        res => {
          this.gatewayTypes = res as any[];
        },
        error => {
          //
          this.modelNotification.alertMessage(this.globalSharedService.messageType_Fail, error);
        });
  }



  deleteGatewayModel(id: number) {
    this.deleteGateWayModelId = id;
    this.modelNotification.alertMessage(this.globalSharedService.messageType_Error, 'You will not be able to recover this Gateway Model!');
  }

  // confirmDelete
  confirmDelete() {
    let userId = +sessionStorage.getItem('userId');
    this.gatewayModelService.deleteGatewayModel(this.deleteGateWayModelId, userId).subscribe(res => {
      // response handling
      this.modelNotification.alertMessage(res['messageType'], res['message']);
    },
      (error: any) => {
        this.modelNotification.alertMessage(this.globalSharedService.messageType_Fail, error);
      }
    );
  }

  performFormAction(gatewayModelId: number) {
    let formAction = (<HTMLInputElement>document.getElementById("formAction_" + gatewayModelId)).value;
    //
    if (formAction == 'viewDeviceModel') {
      this.viewGatewayModel(gatewayModelId);
    } else if (formAction == 'editDeviceModel') {
      this.UpdateGatewayModel(gatewayModelId);
    } else if (formAction == 'manageCommStd') {
      this.showManageGatewayModelCommStd(gatewayModelId);
    } else if (formAction == 'managePin') {
      this.showManageGatewayModelPin(gatewayModelId);
    } else if (formAction == 'managePort') {
      this.showManageGatewayModelPort(gatewayModelId);
    } else if (formAction == 'manageCommStdPinPort') {
      this.showManageGateWayModelPinPortCommStd(gatewayModelId);
    } else if (formAction == 'deleteDeviceModel') {
      this.deleteGatewayModel(gatewayModelId);
    }
  }

  // Dynamic click
  @Output() tabName = new EventEmitter<string>();

  showManageGatewayModelCommStd(gatewayModelId: number) {
    //this.router.navigate(['gateway-model/manageGMCommStandard/' + gatewayModelId]);
    this.tabName.emit('manageCommStd');
    let gatewayModelCommStd = document.getElementById('manageCommStd');
    gatewayModelCommStd.click();

    sessionStorage.setItem('gatewayModelId', JSON.stringify(gatewayModelId));
  }

  showManageGatewayModelPort(gatewayModelId: number) {

    // this.router.navigate(['gateway-model/manageGMPort/' + gatewayModelId]);
    this.tabName.emit('managePort');
    let gatewayModelPort = document.getElementById('managePort');
    gatewayModelPort.click();
    sessionStorage.setItem('gatewayModelId', JSON.stringify(gatewayModelId));
  }

  showManageGatewayModelPin(gatewayModelId: number) {
    //this.router.navigate(['gateway-model/manageGMPin/' + gatewayModelId]);
    this.tabName.emit('managePin');
    let gatewayModelPin = document.getElementById('managePin')
    gatewayModelPin.click();
    sessionStorage.setItem('gatewayModelId', JSON.stringify(gatewayModelId));
  }

  showManageGateWayModelPinPortCommStd(gatewayModelId: number) {
    // this.router.navigate(['gateway-model/manageGMCommStdMapping/' + gatewayModelId]);
    this.tabName.emit('manageCommStdPinPort');
    let gatewayModelPin = document.getElementById('manageCommStdPinPort')
    gatewayModelPin.click();
    sessionStorage.setItem('gatewayModelId', JSON.stringify(gatewayModelId));
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
