import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { GatewayTemplateIOTag } from '../../../gateway-template/model/gateway-template-io-tag';
import { GatewayTemplateIoTagService } from '../../../gateway-template/services/gatewayTemplateIOTag/gateway-template-io-tag.service';
import { globalSharedService } from 'src/app/shared/services/global/globalSharedService';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ScrollbarDirective, UIModalNotificationPage } from 'global';
import { MatTablePaginatorComponent } from 'src/app/shared/components/mat-table-paginator/mat-table-paginator.component';
import { globalShareServices } from 'src/app/shared/globalShareServices';
import { CommonUnitService } from 'src/app/shared/common-unit.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-gateway-io-tag-list',
  templateUrl: './gateway-io-tag-list.component.html',
  styleUrls: ['./gateway-io-tag-list.component.css']
})
export class GatewayIoTagListComponent implements OnInit {

  // Importing child component to
  @ViewChild(UIModalNotificationPage) modelNotification;
  @ViewChild('myPaginatorChildComponent') myPaginatorChildComponent: MatTablePaginatorComponent;
  @ViewChild(ScrollbarDirective) directiveRef?: ScrollbarDirective;

  dataTypes: any[];
  standardIOTags: any[];
  tagTypes: any[];
  engUnits: any[];
  gatewayId: number;
  NoRecordsFound = false;
  gatewayTemplateIOTagListView = true;
  gatewayTemplateIOTagViewMode = false;
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['id', 'name', 'tagType', 'dataType', 'status', 'action'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  template: any;

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
  private gatewayIOTag: GatewayTemplateIOTag = new GatewayTemplateIOTag();
  editable: boolean = true;
  resetButton: boolean = true;
  disable: boolean = true;
  tagIOModes: any[];
  gatewayIoTagForm: FormGroup;

  constructor(private gatewayTemplateIOTagService: GatewayTemplateIoTagService, private globalService: globalShareServices, private commonUnitService: CommonUnitService, private route: ActivatedRoute, private formBuilder: FormBuilder, private router: Router,
    private globalSharedService: globalSharedService) {

  }

  receiveMessage($event) {

  }
  ngOnInit() {
    this.dataSource = new MatTableDataSource();
    this.dataSource.filterPredicate = function (data, filter: string): boolean {
      return data.name.toLowerCase().includes(filter)
        || data.tagType.toLowerCase().includes(filter)
        || data.dataTypeName.toLowerCase().includes(filter)
        || data.status.toLowerCase().includes(filter);
    };
    this.showLoaderImage = true;
    this.gatewayId = this.globalSharedService.id;
    this.template = this.globalService.isTemplate;
    this.gatewayIoTagForm = this.formBuilder.group({
      gatewayTemplateName: [''],
    })
    this.gatewayIoTagForm.patchValue({
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
    this.getGatewayIOTagByGatewayId(this.gatewayId);
  }


  // Refresh table
  refreshTableListFunction() {

    this.getGateWayTemplateIO();
  }

  //View Gateway
  viewGatewayIOTag(gatewayIoTag) {
    this.globalService.GettingId(gatewayIoTag.id);
    let tag = gatewayIoTag
    if(+gatewayIoTag.tagIOMode === 1){
      tag.tagIOMode = 'I'
    }else{
      tag.tagIOMode = 'O'
    }
    if(gatewayIoTag.tagType === 'Analog'){
      tag.tagType = 'A'
    }else{
      tag.tagType = 'D'
    }
    this.globalService.setGlobalObject(tag);
  }
  //Update Gateway Io Tag
  updateGatewayIOTagFormView(gatewayIoTag) {
    let tag = gatewayIoTag
    if(gatewayIoTag.tagType === 'Analog'){
      tag.tagType = 1
    }else{
      tag.tagType = 2
    }
    this.globalService.GettingId(gatewayIoTag.id);
    this.globalService.GettingString('Edit');
    this.globalService.setGlobalObject(tag);
  }

  getDataTypes(): void {
    //
    this.commonUnitService.getDataTypes()
      .subscribe(
        res => {
          this.dataTypes = res as any[];
          this.globalService.setDataTypes(this.dataTypes);
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
          this.globalService.setTagTypes(this.tagTypes);
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
          this.globalService.setTagIOModes(this.tagIOModes);
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
          this.standardIOTags= this.globalService.addSelectIntoList(this.standardIOTags);
          this.globalService.setStandardIOTags(this.standardIOTags);
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
          this.engUnits= this.globalService.addSelectIntoList(this.engUnits);
          this.globalService.setEngUnits(this.engUnits);
        },
        error => {
          this.modelNotification.alertMessage(this.globalSharedService.messageType_Fail, error);
        });
  }

  getGatewayIOTagByGatewayId(gatewayTemplateId: number) {
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
            if (gatewayTemplateIOTag.tagIOMode === "I") {
              gatewayTemplateIOTag.tagIOMode = 1;
            }
            else if (gatewayTemplateIOTag.tagIOMode === "O") {
              gatewayTemplateIOTag.tagIOMode = 2;
            }
          })

          let getDataSource = res;
          if (Array.isArray(res) && res.length) {
            getDataSource = getDataSource.sort((a, b) => b.id - a.id);
            this.dataSource.data = getDataSource;

            // To get paginator events from child mat-table-paginator to access its properties
            this.myPaginator = this.myPaginatorChildComponent.getDatasource();
            this.matTablePaginator(this.myPaginator);
            this.dataSource.paginator = this.myPaginator;
            this.dataSource.sort = this.sort;
          } else {
            this.dataSource = new MatTableDataSource();
            this.dataSource.data = res;
            this.dataSource.paginator = this.myPaginator;
            this.dataSource.sort = this.sort;
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
        this.gatewayIOTag = data;
        if (data.status === 'A') {
          this.gatewayIOTag.status = 'Active';
        }
      });;
  }

  deleteGatewayIOTag(id: number) {
    this.GatewayTemplateIOTagId = id;
    // Trigger sweet alert danger alert
    this.modelNotification.alertMessage(this.globalSharedService.messageType_Error, 'You will not be able to recover this Gateway I/O Tag!');
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

  /* setNodeId() {
    this.globalService.GettingId(this.gatewayId);
  } */

  parseInt(id) {
    return parseInt(id);
  }
  backToGateway() {
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
