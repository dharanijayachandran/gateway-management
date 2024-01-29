import { Component, OnInit, ViewChild, Output, EventEmitter, ElementRef, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { GatewayService } from '../../services/gateway/gateway.service';
import { GatewayModel } from '../../../gateway-model/model/gateway-model';
import { GatewayType } from '../../../gateway-template/model/gatewayType';
import { globalSharedService } from 'src/app/shared/services/global/globalSharedService';
import { ScrollbarDirective, UIModalNotificationPage } from 'global';
import { MatTablePaginatorComponent } from 'src/app/shared/components/mat-table-paginator/mat-table-paginator.component';
import { globalShareServices } from 'src/app/shared/globalShareServices';
import { GlobalGatewayService } from 'src/app/shared/globalGatewayService/global-gateway-service.service';
import { GatewayTemplate } from 'src/app/gateway-template/model/gatewayTemplate';
import { FormGroup, FormBuilder} from '@angular/forms';
import { FilteringEventArgs } from '@syncfusion/ej2-dropdowns';
import { EmitType } from '@syncfusion/ej2-base';
import { Query } from '@syncfusion/ej2-data';

@Component({
  selector: 'app-gateway-list',
  templateUrl: './gateway-list.component.html',
  styleUrls: ['./gateway-list.component.css'],
  encapsulation: ViewEncapsulation.Emulated
})
export class GatewayListComponent implements OnInit {
  // Importing child component to
  @ViewChild(UIModalNotificationPage) modelNotification;
  @ViewChild('myPaginatorChildComponent') myPaginatorChildComponent: MatTablePaginatorComponent;
  @ViewChild(ScrollbarDirective) directiveRef?: ScrollbarDirective;

  NoRecordsFound = false;
  gatewayById: number;
  showLoaderImage: boolean = false;
  gatewayTypeList: GatewayType[];
  gatewayModelList: GatewayModel[];
  gatewayModelByGatewayTypeId = new Map<number, GatewayModel[]>();
  gatewayTemplateByGatewayTypeId = new Map<number, GatewayTemplate[]>();
  nodeTemplateList: GatewayTemplate[];
  totalNoOfRecords = 0;
  myPaginator;
  pageIndex: number;
  pageSize: number;
  length: number;

  public filterPlaceholder: string = 'Search';
  public height: string = '220px';
  nodeTemplateId: any;
  gatewayTemplates: GatewayTemplate[];
  public gatewayTemplateWaterMark: string = 'Select Gateway Template';
  enableViewButton: boolean = true;
  expand: any = false;
  toggleFilterSearch: boolean = true;
  gatewayFilterForm: FormGroup;
  filterExpandCollapse = "Click to Hide Filter";
  public gatewayTypeWaterMark: string = 'Select Gateway Type';
  gatewayTypeId: any;
  public sortDropDown: string = 'Ascending';
  public locale: string;
  clearTheSearch: boolean = true;

  public gatewayTypeFields: Object = {
    text: 'name',
    value: 'id'
  };
  public gatewayTemplateFields: Object = {
    text: 'name',
    value: 'id'
  };
  public onFilteringGatewayType: EmitType<FilteringEventArgs> = (e: FilteringEventArgs) => {
    this.filterData(e, this.gatewayTypeList);
  }
  public onFilteringGatewayTemplates: EmitType<FilteringEventArgs> = (e: FilteringEventArgs) => {
    this.filterData(e, this.gatewayTemplates);
  }
  showLoaderImageOnDelete: boolean;

  filterData(e: FilteringEventArgs, filterData) {
    let query: Query = new Query();
    //frame the query based on search string with filter type.
    query = (e.text !== '') ? query.where('name', 'contains', e.text, true) : query;
    e.updateData(filterData, query);
  }

  constructor(private gatewayService: GatewayService,
    private formBuilder: FormBuilder,
    private globalService: globalShareServices,
    private globalSharedService: globalSharedService,
    private globalGatewayService: GlobalGatewayService,
    private globalServices: globalSharedService,) { }

  ngOnInit() {
    this.gatewayTemplates = [];
    this.showLoaderImage = true;
    this.gatewayTypes();
    this.loadPaginator();
    this.gatewayLoadForm();
  }

  // filterSearchBox
  filterSearchBox() {
    this.toggleFilterSearch = !this.toggleFilterSearch;
    if (this.toggleFilterSearch) {
      this.filterExpandCollapse = "Click to Hide Filter";
    } else {
      this.filterExpandCollapse = "Click to Show Filter";
    }
  }

  gatewayLoadForm() {
    this.gatewayFilterForm = this.formBuilder.group({
      names: [''],
      nodeIdentifier: [''],
      authToken: [''],
      gatewayTypeId: [],
      nodeTemplateId: []
    });
  }

  commaSeparator(val: string): string[] {
    return val.split(',');
  }

  filterForm() {
    let gatewayFilterObj = {
      names: this.commaSeparator(this.gatewayFilterForm.value.names),
      gatewayIdentifiers: this.commaSeparator(this.gatewayFilterForm.value.nodeIdentifier),
      authTokens: this.commaSeparator(this.gatewayFilterForm.value.authToken),
      gatewayTemplateId: this.gatewayFilterForm.value.nodeTemplateId
    }
    let organizationId = sessionStorage.getItem('beId');
    this.gatewayService.getGatewayFilterByData(organizationId, gatewayFilterObj).subscribe(res => {
      this.showLoaderImage=true;
      this.dataSource.data = res.object;
      this.totalNoOfRecords = this.dataSource.data.length;
      this.showLoaderImage=false;

    })
  }

  resetForm() {
    this.gatewayFilterForm.get('names').setValue('');
    this.gatewayFilterForm.get('nodeIdentifier').setValue('');
    this.gatewayFilterForm.get('authToken').setValue('');
    this.gatewayFilterForm.get('gatewayTypeId').setValue(null);
    this.gatewayFilterForm.get('nodeTemplateId').setValue(null);
    this.refreshTableListFunction();
  }


  loadPaginator() {
    if (this.myPaginatorChildComponent) {
      this.myPaginator = this.myPaginatorChildComponent.getDatasource();
      this.matTablePaginator(this.myPaginator);
    }
    else {
      this.pageIndex = 0;
      this.pageSize = 100;
    }
    this.getGateWayList();
  }

  // Refresh table
  refreshTableListFunction() {
    this.showLoaderImage = true;
    if (this.dataSource) {
      this.dataSource.data = [];
    }
    this.getGateWayList();
  }

  displayedColumns: string[] = ['id', 'name', 'authToken', 'gatewayTypeName', 'gatewayModelName', 'gatewayTemplateName', 'nodeIdentifier', 'action'];
  displayTableHeader = ['S.No.', 'Name', 'Auth Token', 'Type', 'Model', 'Template', 'Node Identifier'];
  @ViewChild(MatPaginator) paginator: MatPaginator;

  // Mat sorting for if use ngIf condition to show table starts here======================
  sort;
  @ViewChild(MatSort) set content(content: ElementRef) {
    this.sort = content;
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }
  // Mat sorting for if use ngIf condition to show table ends here======================

  dataSource: any;

  // To get all the records for Gateway list
  getGateWayList() {
    let organizationId = sessionStorage.getItem('beId');
    this.gatewayService.getGateWayList(organizationId, this.pageIndex, this.pageSize).subscribe(
      res => {
        this.showLoaderImage = false;
        if (res.object != null && (Array.isArray(res.object) && res.object.length)) {
          this.totalNoOfRecords = res.totalNoOfRecords;
          let getDataSource = res.object;
          getDataSource = getDataSource.sort((a, b) => b.id - a.id);
          this.dataSource = new MatTableDataSource();
          this.dataSource.data = getDataSource;
          this.myPaginator = this.myPaginatorChildComponent.getDatasource();
          this.pageIndex = this.myPaginator.pageIndex + 1;
          this.pageSize = this.myPaginator.pageSize;
          this.length = this.totalNoOfRecords;
          this.dataSource.sort = this.sort;
        } else {
          this.dataSource = new MatTableDataSource();
          this.dataSource.data = [];
          this.NoRecordsFound = true;
        }
      },
      error => {
        this.showLoaderImage = false;
        this.modelNotification.alertMessage(this.globalSharedService.messageType_Fail, error);
      });
    this.showLoaderImage = true;
  }

  //View Gateway
  clickToView(gateway) {
    this.globalService.GettingId(gateway.id);
    this.globalService.setGlobalObject(gateway);
  }
  //Update Gateway
  updateGateway(gateway) {
    this.globalService.GettingId(gateway.id);
    this.globalService.setGlobalObject(gateway);
  }

  @Output() tabName = new EventEmitter<string>();

  // Click to manageCommunication
  manageCommunication(obj) {
    this.globalService.isGateway = true;
    this.globalService.isGatewayTemplate = false;
    this.globalService.gatewayTemplateName = obj.gatewayTemplateName;
    let gatewayId = obj.id
    let gatewayName = obj.name;
    this.globalService.gettingName(gatewayName);
    let isTemplate = obj.isTemplate;
    this.globalService.gettingTemplate(isTemplate);
    this.tabName.emit('communication');
    this.globalSharedService.setId(gatewayId);
    let myTab = document.getElementById('communication');
    myTab.click();
  }

  manageIOTags(obj) {
    let gatewayId = obj.id
    let gatewayName = obj.name;
    let isTemplate = obj.isTemplate;
    this.globalService.gettingTemplate(isTemplate);
    this.tabName.emit('IOTag');
    this.globalService.gettingName(gatewayName);
    this.globalSharedService.setId(gatewayId);
    let myTab = document.getElementById('IOTag');
    myTab.click();
  }
  //Delete Gateway
  deleteGateway(id: number) {
    this.gatewayById = id;
    // Trigger sweet alert danger alert
    this.modelNotification.alertMessage(this.globalSharedService.messageType_Error, 'You will not be able to recover this Gateway!');
  }

  // confirmDelete
  confirmDelete() {
    this.showLoaderImageOnDelete = true;
    let userId = sessionStorage.getItem('userId');
    this.gatewayService.deleteGateway(this.gatewayById, Number(userId)).subscribe(res => {
      // response handling
      this.modelNotification.alertMessage(res['messageType'], res['message']);
      this.showLoaderImageOnDelete = false;
    },
      (error: any) => {
        this.modelNotification.alertMessage(this.globalSharedService.messageType_Fail, error);
      }
    );
  }

  /*
    Download as Excel, PDF, CSV starts here=================================
  */

  // Getting search filter details
  searchFilterObject = {};
  searchFieldsContainer;
  searchFilterKeysValues
  searchCriteriaText = "Search Criteria";
  exportedFileTitleName = "Gateways List";
  tableBodyDataList;
  fileName: string;

  xlsxOptions = {
    headers: this.displayTableHeader
  }

  csvOptions = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    showLabels: true,
    showTitle: true,
    title: 'Gateways List',
    useBom: true,
    noDownload: false,
    headers: this.displayTableHeader
  };

  downloadFile(fileType) {

    // Search filter details
    this.searchFilterKeysValues = Object.entries(this.searchFilterObject);

    this.searchFieldsContainer = {
      "searchFilterKeysValues": this.searchFilterKeysValues,
      "searchCriteriaText": this.searchCriteriaText
    }

    // Make new set of re-create object
    this.tableBodyDataList = this.globalSharedService.reCreateNewObject(this.dataSource.data, this.displayedColumns);

    // S.No.
    this.tableBodyDataList = this.globalSharedService.serialNumberGenerate(this.tableBodyDataList);

    // Make Array object into Arrays
    this.tableBodyDataList = this.tableBodyDataList.map(object => {
      return this.globalSharedService.removeLastIndexAtArray(object);
    });

    // CSV/PDF/Excel file name
    this.fileName = this.globalSharedService.getExportingFileName("Gateways");

    let exportFile = {
      "fileName": this.fileName,
      "excelWorkSheetName": this.exportedFileTitleName,
      "title": this.exportedFileTitleName,
      "tableHeaderNames": this.xlsxOptions.headers,
      'tableBodyData': this.tableBodyDataList
    }

    // Final download
    this.globalSharedService.downloadFile(fileType, exportFile, this.searchFieldsContainer,
      this.tableBodyDataList, this.fileName, this.csvOptions);
  }

  /*
  Download as Excel, PDF, CSV ends here=================================
  */

  /*
    Material table paginator code starts here
  */

  /*
      Material pagination getting pageIndex, pageSize, length through
      events(On change page, Next,Prev, Last, first) */
  matTablePaginator(myPaginator) {
    this.pageIndex = myPaginator.pageIndex + 1;
    this.pageSize = myPaginator.pageSize;
    this.length = this.totalNoOfRecords;
    this.getGateWayList();
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

  gatewayTypes() {
    this.globalGatewayService.getGatewayTypes().subscribe(res => {
      this.gatewayTypeList = res;
      this.gatewayTypeList.forEach(gatewayType => {
        this.getGatewayModelsByGatewayTypeId(gatewayType.id);
      })
      this.globalService.setGatewayModelByTypeId(this.gatewayModelByGatewayTypeId);
      this.globalService.setGatewayTemplateByTypeId(this.gatewayTemplateByGatewayTypeId);
    },
      (error: any) => {
        // If the service is not available
        this.modelNotification.alertMessage(this.globalServices.messageType_Fail, error);
      }
    );
  }

  gatewayTypeChange($event: any) {
    this.gatewayTemplates = [];
    this.gatewayTemplatesByGatewayTypeIdFilter($event.itemData.id);
  }

  getGatewayModelsByGatewayTypeId(gatewayTypeId) {
    this.globalGatewayService.getGatewayModelsByGatewayTypeId(gatewayTypeId).subscribe((res) => {
      this.gatewayModelList = res;
      this.gatewayModelList = this.globalService.addSelectIntoList(this.gatewayModelList);
      if (!this.gatewayModelByGatewayTypeId.has(gatewayTypeId)) {
        this.gatewayModelByGatewayTypeId.set(gatewayTypeId, this.gatewayModelList);
      }
      this.gatewayTemplatesByGatewayTypeId(gatewayTypeId);
    },
      (error: any) => {
        // If the service is not available
        this.modelNotification.alertMessage(this.globalServices.messageType_Fail, error);
      }
    );
  }


  gatewayTemplatesByGatewayTypeIdFilter(gatewayTypeId) {
    let organizationId = sessionStorage.getItem('beId');
    this.gatewayService.getGatewayTemplatesByTypeIdAndBEId(gatewayTypeId, organizationId).subscribe((res) => {
      res.forEach(template => {
        this.gatewayTemplates.push(template);
      })
    },
      (error: any) => {
        // If the service is not available
        this.modelNotification.alertMessage(this.globalServices.messageType_Fail, error);
      }
    );
  }

  gatewayTemplatesByGatewayTypeId(gatewayTypeId) {
    let organizationId = sessionStorage.getItem('beId');
    this.gatewayService.getGatewayTemplatesByTypeIdAndBEId(gatewayTypeId, organizationId).subscribe((res) => {
      res.forEach(template => {
        if (template.gatewayModel === null) {
          template.gatewayModel = new GatewayModel();
        }
      })
      this.nodeTemplateList = res;
      if (!this.gatewayTemplateByGatewayTypeId.has(gatewayTypeId)) {
        this.gatewayTemplateByGatewayTypeId.set(gatewayTypeId, this.nodeTemplateList);
      }
    },
      (error: any) => {
        // If the service is not available
        this.modelNotification.alertMessage(this.globalServices.messageType_Fail, error);
      }
    );
  }
  nodeTemplateChange($event) {
    this.gatewayFilterForm.controls['nodeTemplateName'].setValue($event.itemData.name);
    this.gatewayFilterForm.controls['nodeTemplateId'].setValue($event.itemData.id);
  }
}
