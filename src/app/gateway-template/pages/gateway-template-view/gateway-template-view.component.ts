import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
//import { environment } from 'src/environments/environment';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { ScrollbarDirective, TimeZone, UIModalNotificationPage } from 'global';
import { MatTablePaginatorComponent } from 'src/app/shared/components/mat-table-paginator/mat-table-paginator.component';
import { GlobalGatewayService } from 'src/app/shared/globalGatewayService/global-gateway-service.service';
import { globalShareServices } from 'src/app/shared/globalShareServices';
import { globalSharedService } from 'src/app/shared/services/global/globalSharedService';
import { TimezoneService } from 'src/app/shared/services/timezone/timezone.service';
import { GatewayModel } from '../../../gateway-model/model/gateway-model';
import { DataProtocol } from '../../model/dataProtocol';
import { GatewayCommProtocol } from '../../model/gatewayCommProtocol';
import { GatewayType } from '../../model/gatewayType';
import { GatewayTemplateService } from '../../services/gatewayTemplate/gateway-template.service';
@Component({
  selector: 'app-gateway-template-view',
  templateUrl: './gateway-template-view.component.html',
  styleUrls: ['./gateway-template-view.component.css'],
  providers: [
    NgbTabset
  ]
})
export class GatewayTemplateViewComponent implements OnInit {


  // Importing child component to
  @ViewChild(UIModalNotificationPage) modelNotification;
  @ViewChild('myPaginatorChildComponent') myPaginatorChildComponent: MatTablePaginatorComponent;
  @ViewChild(ScrollbarDirective) directiveRef?: ScrollbarDirective;

  NoRecordsFound = false;
  gatewayTemplateListView = true;
  gatewayTemplateTableView = false;
  dataSource: any;
  displayedColumns: string[] = ['id', 'name', 'gatewayTypeName', 'gatewayModelName', 'action'];
  displayTableHeader = ['S.No.', 'Name', 'Gateway Type', 'Gateway Model'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  // Mat sorting for if use ngIf condition to show table starts here======================
  sort;
  gatewayTemplate: number;
  showLoaderImage: boolean = false;
  timeZoneList: TimeZone[];
  @ViewChild(MatSort) set content(content: ElementRef) {
    this.sort = content;
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }
  // Mat sorting for if use ngIf condition to show table ends here======================
  commProtocols: GatewayCommProtocol[];
  selectedCommProtocols: GatewayCommProtocol[] = [];;
  dataProtocols: DataProtocol[];
  gatewayTypes: GatewayType[];
  gatewayModels: GatewayModel[];
  selectedValue: any;
  gatewayModelByGatewayTypeId = new Map<number, GatewayModel[]>();
  constructor(private gatewayTemplateService: GatewayTemplateService, public tabset: NgbTabset, private http: HttpClient, private router: Router, private route: ActivatedRoute, private globalService: globalShareServices,
    private globalSharedService: globalSharedService, private timezoneService: TimezoneService, private globalGatewayService: GlobalGatewayService,) { }

  ngOnInit() {
    this.getGatewayTypes();
    this.dataSource = new MatTableDataSource();
    this.dataSource.filterPredicate = function (data, filter: string): boolean {
      return data.name.toLowerCase().includes(filter) || data.gatewayTypeName.toLowerCase().includes(filter)
        || data.gatewayModelName.toLowerCase().includes(filter);
    };
    this.showLoaderImage = true;
    this.getGatewayTemplates();
  }
  // Refresh table
  refreshTableListFunction() {
    this.showLoaderImage=true;
    this.getGatewayTemplates();
  }

  viewGatewayTemplate(id) {
    this.globalService.GettingId(id);
    this.globalService.GettingString('View');
  }

  updateGatewayTemplateFormView(id: number) {
    this.globalService.GettingId(id);
    this.globalService.GettingString('Edit');
  }

  getGatewayTemplates() {

    let beId = sessionStorage.getItem('beId');
    this.gatewayTemplateService.getGatewayTemplatesList(beId)
      .subscribe(
        res => {
          this.showLoaderImage = false;
          var gatewayTemplates = res;
          for (let gatewayTemplate of gatewayTemplates) {
            if (gatewayTemplate.gatewayModel === null) {
              gatewayTemplate.gatewayModel = new GatewayModel();
            }
          }
          gatewayTemplates = gatewayTemplates.sort((a, b) => b.id - a.id);
          if (Array.isArray(gatewayTemplates) && gatewayTemplates.length) {
            this.dataSource = new MatTableDataSource();
            this.dataSource.data = gatewayTemplates;

            // To get paginator events from child mat-table-paginator to access its properties
            this.myPaginator = this.myPaginatorChildComponent.getDatasource();
            this.matTablePaginator(this.myPaginator);

            this.dataSource.paginator = this.myPaginator;
            this.dataSource.sort = this.sort;
            this.gatewayTemplateTableView = true;
          }
          else {
            this.gatewayTemplateTableView = false;
            this.NoRecordsFound = true;
          }
        },
        error => {
          // If the service is not available
          this.showLoaderImage = false;
          this.modelNotification.alertMessage(this.globalSharedService.messageType_Fail, error);
        });
  }

  deleteGatewayTemplate(id: number) {
    this.gatewayTemplate = id;
    // Trigger sweet alert danger alert
    this.modelNotification.alertMessage(this.globalSharedService.messageType_Error, 'You will not be able to recover this Gateway Template!');
  }

  // confirmDelete
  confirmDelete() {
    this.showLoaderImage=true;
    let userId = sessionStorage.getItem('userId');
    this.gatewayTemplateService.deleteGatewayTemplate(this.gatewayTemplate, Number(userId)).subscribe(res => {
      // response handling
      this.showLoaderImage=false;
      this.modelNotification.alertMessage(res['messageType'], res['message']);
    },
      (error: any) => {
        // If the service is not available
        this.showLoaderImage=false;
        this.modelNotification.alertMessage(this.globalSharedService.messageType_Fail, error);
      }
    );
  }

  //redirectTo
  redirectTo() {
    this.dataSource.data = [];
    this.getGatewayTemplates();
  }

  @Output() tabName = new EventEmitter<string>();

  navigateToIOTagList(element) {
    let gatewayId = element.id;
    let isTemplate = element.isTemplate;
    this.globalService.gettingTemplate(isTemplate);
    this.tabName.emit('IOTag');
    this.globalSharedService.setId(gatewayId);
    let gatewayTemplateName = element.name;
    this.globalService.gettingName(gatewayTemplateName);
    let myTab = document.getElementById('IOTag');
    myTab.click();
  }

  navigateToCommunication(element) {
    this.globalService.isGatewayTemplate = true;
    this.globalService.isGateway = false;
    this.globalService.gatewayTemplateNameInGatewayTemplatePage = element.name;
    let gatewayId = element.id;
    this.tabName.emit('communication');
    this.globalSharedService.setId(gatewayId);
    let isTemplate = element.isTemplate;
    this.globalService.gettingTemplate(isTemplate);
    let gatewayTemplateName = element.name;
    this.globalService.gettingName(gatewayTemplateName);
    let myTab = document.getElementById('communication');
    myTab.click();
  }


  /*
  Download as Excel, PDF, CSV starts here=================================
*/

  // Getting search filter details
  searchFilterObject = {};
  searchFieldsContainer;
  searchFilterKeysValues
  searchCriteriaText = "Search Criteria";
  exportedFileTitleName = "Gateway Template List";
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
    title: 'Gateway Template List',
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
    this.fileName = this.globalSharedService.getExportingFileName("Gateway Template");

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
  getGatewayTypes() {
    this.globalGatewayService.getGatewayTypes().subscribe(
      res => {
        this.gatewayTypes = res;
        this.gatewayTypes.forEach(gatewayType => {
          this.getGatewayModelsByGatewayTypeId(Number(gatewayType.id));
        })
        this.globalService.setGatewayModelByTypeId(this.gatewayModelByGatewayTypeId);
      },
      (error: any) => {
        this.modelNotification.alertMessage(this.globalSharedService.messageType_Fail, error);
      }
    );
  }
  getGatewayModelsByGatewayTypeId(gatewayTypeId) {
    this.globalGatewayService.getGatewayModelsByGatewayTypeId(gatewayTypeId).subscribe(
      res => {
        this.gatewayModels = res;
        this.gatewayModels= this.globalService.addSelectIntoList(this.gatewayModels);
        if (this.gatewayModels) {
          if (!this.gatewayModelByGatewayTypeId.has(gatewayTypeId)) {
            this.gatewayModelByGatewayTypeId.set(gatewayTypeId, this.gatewayModels);
          }
        }
      },
      (error: any) => {
        this.modelNotification.alertMessage(this.globalSharedService.messageType_Fail, error);
      }
    );
  }
}
