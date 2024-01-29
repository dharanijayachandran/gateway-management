import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ScrollbarDirective, UIModalNotificationPage } from 'global';
import { CommonUnitService } from 'src/app/shared/common-unit.service';
import { MatTablePaginatorComponent } from 'src/app/shared/components/mat-table-paginator/mat-table-paginator.component';
import { globalShareServices } from 'src/app/shared/globalShareServices';
import { globalSharedService } from 'src/app/shared/services/global/globalSharedService';
import { GatewayTemplateIOTag } from '../../model/gateway-template-io-tag';
import { GatewayTemplateIoTagService } from '../../services/gatewayTemplateIOTag/gateway-template-io-tag.service';
@Component({
  selector: 'app-gateway-template-io-tag-view',
  templateUrl: './gateway-template-io-tag-view.component.html',
  styleUrls: ['./gateway-template-io-tag-view.component.css']
})
export class GatewayTemplateIoTagViewComponent implements OnInit {

  // Importing child component to
  @ViewChild(UIModalNotificationPage) modelNotification;
  @ViewChild('myPaginatorChildComponent') myPaginatorChildComponent: MatTablePaginatorComponent;
  @ViewChild(ScrollbarDirective) directiveRef?: ScrollbarDirective;

  dataTypes: any[];
  standardIOTags: any[];
  tagTypes: any[];
  engUnits: any[];
  gatewayTemplateId: number;
  gatewayTemplateName: any;
  NoRecordsFound = false;
  gatewayTemplateIOTagListView = true;
  gatewayTemplateIOTagViewMode = false;
  dataSource: any;
  displayedColumns: string[] = ['id', 'name', 'tagType', 'dataType', 'status', 'action'];
  @ViewChild(MatPaginator) paginator: MatPaginator;

  // Mat sorting for if use ngIf condition to show table starts here======================
  // @ViewChild(MatSort) sort: MatSort;
  // Mat sorting for if use ngIf condition to show table ends here======================


  // Mat sorting for if use ngIf condition to show table starts here======================
  sort;
  GatewayTemplateIOTagId: number;
  showLoaderImage: boolean = false;
  @ViewChild(MatSort) set content(content: ElementRef) {
    this.sort = content;
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }
  // Mat sorting for if use ngIf condition to show table ends here======================


  gatewayTemplateIOTagForm: FormGroup;
  gatewayTemplateIOTag: GatewayTemplateIOTag = new GatewayTemplateIOTag();
  editable: boolean = true;
  resetButton: boolean = true;
  disable: boolean = true;
  tagIOModes: any[];
  IoTagForm: FormGroup;
  template: any;
  constructor(private gatewayTemplateIOTagService: GatewayTemplateIoTagService, private globalService: globalShareServices, private commonUnitService: CommonUnitService, private route: ActivatedRoute, private formBuilder: FormBuilder, private router: Router,
    private globalSharedService: globalSharedService) {

  }

  ngOnInit() {
    this.gatewayTemplateName = this.globalService.parenetName;
    this.dataSource = new MatTableDataSource();
    this.dataSource.filterPredicate = function (data, filter: string): boolean {
      return data.name.toLowerCase().includes(filter) || data.tagType.toLowerCase().includes(filter)
        || data.dataTypeName.toLowerCase().includes(filter) || data.status.toLowerCase().includes(filter);
    };
    this.showLoaderImage = true;
    this.gatewayTemplateId = this.globalSharedService.id;
    this.template = this.globalService.isTemplate;
    this.IoTagForm = this.formBuilder.group({
      gatewayTemplateName: [''],
    })
    this.IoTagForm.patchValue({
      gatewayTemplateName: this.globalService.parenetName
    })
    this.getGateWayTemplateIO();
  }

  getGateWayTemplateIO() {
    this.getDataTypes();
    this.getTagTypes();
    this.getStandardIOTag();
    this.getTagIOMode();
    this.getEngineeringUnit();
    this.getGatewayTemplateIOTagByGatewayId(this.gatewayTemplateId);
  }


  // Refresh table
  refreshTableListFunction() {
    this.getGateWayTemplateIO();
  }

  updateGatewayTemplateIOTagFormView(id: number) {
    this.globalService.GettingId(id);
    this.globalService.GettingString('Edit');
    this.globalService.gettingName(this.gatewayTemplateName);
    this.globalService.GettingIdgateway(this.gatewayTemplateId);
  }
  viewGatewayTemplateIOTag(gatewayTemplateId) {
    this.getGatewayTemplateIOTagByTemplateIOTagId(gatewayTemplateId);
    this.gatewayTemplateIOTagListView = false;
    this.gatewayTemplateIOTagViewMode = true;
  }
  cancelIOTagView() {
    this.gatewayTemplateIOTagListView = true;
    this.gatewayTemplateIOTagViewMode = false;
    this.getGatewayTemplateIOTagByGatewayId(this.gatewayTemplateId);
  }

  getDataTypes(): void {
    this.commonUnitService.getDataTypes()
      .subscribe(
        res => {
          this.dataTypes = res as any[];
          //
        },
        error => {
          this.modelNotification.alertMessage(this.globalSharedService.messageType_Fail, error);
        });
  }

  getTagTypes(): void {
    this.commonUnitService.getTagTypes()
      .subscribe(
        res => {
          this.tagTypes = res as any[];
        },
        error => {
          this.modelNotification.alertMessage(this.globalSharedService.messageType_Fail, error);
        });
  }
  getTagIOMode(): void {
    this.commonUnitService.getTagIOMode()
      .subscribe(
        res => {
          this.tagIOModes = res as any[];
        },
        error => {
          this.modelNotification.alertMessage(this.globalSharedService.messageType_Fail, error);
        });
  }


  getStandardIOTag(): void {
    this.commonUnitService.getStandardIOTags()
      .subscribe(
        res => {
          this.standardIOTags = res as any[];
        },
        error => {
          this.modelNotification.alertMessage(this.globalSharedService.messageType_Fail, error);
        });
  }
  // To get all Unit Id list for drop down
  getEngineeringUnit(): void {
    this.commonUnitService.getEnggUnits()
      .subscribe(
        res => {
          this.engUnits = res as any[];
        },
        error => {
          this.modelNotification.alertMessage(this.globalSharedService.messageType_Fail, error);
        });
  }

  getGatewayTemplateIOTagByGatewayId(gatewayTemplateId: number) {
    this.showLoaderImage=true;
    this.gatewayTemplateIOTagService.getGatewayTemplateIOTagByGatewayTemplateId(gatewayTemplateId)
      .subscribe(
        res => {
          this.showLoaderImage = false;
          res.forEach(gatewayTemplateIOTag => {
            if (gatewayTemplateIOTag.status === 'A') {
              gatewayTemplateIOTag.status = 'Active'
            }
            else if (gatewayTemplateIOTag.status === 'D') {
              gatewayTemplateIOTag.status = 'In-Active'
            }

          })
          res.forEach(gatewayTemplateIOTag => {
            if (gatewayTemplateIOTag.tagIOMode === "I") {
              gatewayTemplateIOTag.tagIOMode = 'INPUT';
            }
          })
          let getDataSource = res;
          if (Array.isArray(res) && res.length) {
            getDataSource = getDataSource.sort((a, b) => b.id - a.id);
            this.dataSource = new MatTableDataSource();
            this.dataSource.data = getDataSource;

            // To get paginator events from child mat-table-paginator to access its properties
            this.myPaginator = this.myPaginatorChildComponent.getDatasource();
            this.matTablePaginator(this.myPaginator);

            this.dataSource.paginator = this.myPaginator;
            this.dataSource.sort = this.sort;
          } else {
            this.dataSource = new MatTableDataSource();
            this.dataSource.data = res;
          }
        },
        error => {
          this.showLoaderImage = false;
          this.modelNotification.alertMessage(this.globalSharedService.messageType_Fail, error);
        });

  }

  getGatewayTemplateIOTagByTemplateIOTagId(id: number) {

    this.gatewayTemplateIOTagService.getGatewayTemplateIOTagByIOTagId(id)
      .subscribe(data => {
        this.gatewayTemplateIOTag = data;
        if (data.status === 'A') {
          this.gatewayTemplateIOTag.status = 'Active';
        } else {
          this.gatewayTemplateIOTag.status = 'In_Active';
        }
      });
  }



  deleteGatewayTemplateIOTag(id: number) {
    this.GatewayTemplateIOTagId = id;
    // Trigger sweet alert danger alert
    this.modelNotification.alertMessage(this.globalSharedService.messageType_Error, 'You will not be able to recover this Gateway Template I/O Tag!');
  }

  // confirmDelete
  confirmDelete() {
    let userId = sessionStorage.getItem('userId');
    this.gatewayTemplateIOTagService.deleteGatewayTemplateIOTag(this.GatewayTemplateIOTagId, Number(userId)).subscribe(res => {
      // response handling
      this.modelNotification.alertMessage(res['messageType'], res['message']);
    },
      (error: any) => {
        this.modelNotification.alertMessage(this.globalSharedService.messageType_Fail, error);
      }
    );
  }

  // redirectTo
  redirectTo() {
    this.getGatewayTemplateIOTagByGatewayId(this.gatewayTemplateId);
  }
  parseInt(id) {
    return parseInt(id);
  }
  backToTemplate() {
    let myTab = document.getElementById('gatewayList');
    myTab.click();
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
