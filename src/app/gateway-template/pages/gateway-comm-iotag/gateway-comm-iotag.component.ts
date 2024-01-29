import { Component, OnInit, ViewChild, HostListener, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GatewayCommIOTagService } from '../../services/gateway-comm-io-tag/gateway-comm-iotag.service';
import { GatewayCommProtocol } from '../../model/communication';
import { CommunicationService } from '../../services/communication/communication.service';
import { GatewayIOTag } from '../../model/gatewayIOTag';
import { GatewayCommProtocolIOTag } from '../../model/gatewayCommIOTags';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { TagLengthUnit } from '../../model/tagLengthUnit';
import { globalSharedService } from 'src/app/shared/services/global/globalSharedService';
import { Observable } from 'rxjs';
import { DialogService } from 'src/app/shared/services/dialog/dialog.service';
import { ScrollbarDirective, UIModalNotificationPage } from 'global';
import { globalShareServices } from 'src/app/shared/globalShareServices';
import { EmitType } from '@syncfusion/ej2-base';
import { FilteringEventArgs } from '@syncfusion/ej2-dropdowns';
import { Query } from '@syncfusion/ej2-data';
@Component({
  selector: 'app-gateway-comm-iotag',
  templateUrl: './gateway-comm-iotag.component.html',
  styleUrls: ['./gateway-comm-iotag.component.css']
})
export class GatewayCommIOTagComponent implements OnInit {
  showLoaderImage: boolean = false;
  gatewayCommIOTagFieldData: any[];
  gatewayIOTagsFieldData: GatewayIOTag[];

  // It help to if there are no pending changes, just allow deactivation; else confirm first code starts here
  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    if (this.hasOwnProperty("commIOTagForm")) {
      if (this.commIOTagForm.dirty) {
        this.dialogService.alertMessage('Warning', 'You will not be able to recover the changes!');
        // returning false will show a confirm dialog before navigating away
      } else {
        return true; // returning true will navigate without confirmation
      }
      return this.dialogService.navigateAwaySelection$;
    } else {
      return true;
    }
  }
  // It help to if there are no pending changes, just allow deactivation; else confirm first code ends here


  // Importing child component to
  @ViewChild(UIModalNotificationPage) modelNotification;
 // @ViewChild('myPaginatorChildComponent') myPaginatorChildComponent: MatTablePaginatorComponent;
  @ViewChild(ScrollbarDirective) directiveRef?: ScrollbarDirective;

  commProtocol: GatewayCommProtocol;
  gatewayIOTags: GatewayIOTag[];
  allGatewayIOTags: GatewayIOTag[];
  commIOTagForm: FormGroup;
  dataFormats: any[];
  commIOTagFormPreview = false;
  commIOTagFormView = false;
  commIOTagsView = false;
  childCommIOTagListView = false;
  gatewaycommIOTagForm = true;
  gatewayCommIOTag: GatewayCommProtocolIOTag = new GatewayCommProtocolIOTag();
  commIOTagView: GatewayCommProtocolIOTag = new GatewayCommProtocolIOTag();
  gatewayCommIOTagDisplayedColumns: string[] = ['id', 'ioTag', 'index', 'length', 'lengthUnit', 'tagKeyName', 'dataFormat', 'parentTag'];
  gatewayCommIOTagDataSource: any;
  @ViewChild(MatPaginator) paginatorForIOTags: MatPaginator;
  @ViewChild(MatPaginator) myPaginator: MatPaginator;
  // Mat sorting for if use ngIf condition to show table starts here======================
  sort;
  @ViewChild(MatSort) set content(content: ElementRef) {
    this.sort = content;
    if (this.sort) {
      this.gatewayCommIOTagDataSource.sort = this.sort;
    }
  }
  // Mat sorting for if use ngIf condition to show table ends here======================
  NoRecordsFound: boolean;
  gatewayCommIOTags: GatewayCommProtocolIOTag[];
  gatewayCommIOTagView = false;
  gatewayCommIOTagChildView = false;
  gatewayCommIOTagChildEdit = false;
  allGatewayCommIOTags: GatewayCommProtocolIOTag[];
  tagId: number;
  viewIOTag: string;
  alertSuccess = false;
  alertDelete = false;
  saveSuccess = false;
  updateSucess = false;
  serviceMessage: string;
  gatewaycommIOTagAdd = true;
  gatewaycommIOTagEdit = false;
  tableView = false;
  tagLengthUnits: any[];
  successFlag: string;
  warningFlag: string;
  parentTagId: any;

  public nodeIoTagFields: Object = {
    text: 'name',
    value: 'id'
  };
  public parentNodeCommProtocolIoTagFields: Object = {
    text: 'tagName',
    value: 'id'
  };
  public tagLengthUnitFields: Object = {
    text: 'value',
    value: 'id'
  };
  public dataFormatFields: Object = {
    text: 'name',
    value: 'id'
  };
  // filtering event handler to filter a Menu Icon Name
  //pass the filter data source, filter query to updateData method.
  public onFilteringParentNodeCommProtocolIoTag: EmitType<FilteringEventArgs> = (e: FilteringEventArgs) => {
    this.filterData(e,this.gatewayCommIOTagFieldData);

  }

  public onFilteringNodeIoTag: EmitType<FilteringEventArgs> = (e: FilteringEventArgs) => {
    this.filterData(e,this.gatewayIOTagsFieldData);
  }
  public onFilteringTagLengthUnits: EmitType<FilteringEventArgs> = (e: FilteringEventArgs) => {
    this.filterData(e,this.tagLengthUnits);

  }

  public onFilteringDataFormat: EmitType<FilteringEventArgs> = (e: FilteringEventArgs) => {
    this.filterData(e,this.dataFormats);
  }
  filterData(e: FilteringEventArgs, filterData) {
    let query: Query = new Query();
    //frame the query based on search string with filter type.
    query = (e.text !== '') ? query.where('name', 'contains', e.text, true) : query;
    e.updateData(filterData, query);
  }
  public sortDropDown:string ='Ascending';
  tagLengthUnit:any;
  dataFormatId:any;
  nodeIoTagId:any;
  parentNodeCommProtocolIoTagId:any;
  // set the placeholder to DropDownList input element
  public parentNodeCommProtocolIoTagWaterMark: string = 'Select Parenet IO Tag';
  public nodeIoTagWaterMark: string = 'Select IO Tag';
  public tagLengthUnitWaterMark: string = 'Select Tag Length Unit';
  public dataFormatsWaterMark: string = 'Select Data Format';
  public filterPlaceholder: string = 'Search';
  // set the height of the popup element
  public height: string = '200px';
  public locale: string;

  ngOnInit() {
    this.loadFormData();
    if (this.parentTagId) {
      this.showLoaderImage = true;
      this.getGatewayCommIOTagByIdForView(this.parentTagId);
    }
  }

  // Refersh
  refreshTableListFunction() {
    this.loadFormData();
  }

  loadFormData() {
    this.NoRecordsFound = false;
    this.commProtocol = this.commService.gatewayCommProtocol;
    this.getGatewayCommIOTagsByGatewayCommProtocolId(this.commProtocol.id);
    this.tagId = this.globalSharedService.assignId;
    this.viewIOTag = this.globalSharedService.name;
    if (this.tagId != null && this.viewIOTag === 'edit') {
      this.gatewaycommIOTagAdd = false;
      this.gatewaycommIOTagEdit = true;
      this.gatewayCommIOTagChildEdit = false;
      this.gatewaycommIOTagForm = true;
      this.gatewayCommIOTagChildView = false;
      this.childCommIOTagListView = false;
      this.gatewayCommIOTagView = false;
      this.commIOTagFormPreview = false;
      this.commIOTagFormView = false;
      this.commIOTagsView = false;
      this.getGatewayCommIOTagById(this.tagId);
      this.validateTheForm();
      this.patchCommProtocolData();
    }
    if (this.tagId != null && this.viewIOTag === 'view') {
      this.gatewaycommIOTagAdd = false;
      this.gatewaycommIOTagEdit = false;
      this.gatewaycommIOTagAdd = false;
      this.gatewayCommIOTagChildEdit = false;
      this.gatewayCommIOTagChildView = false;
      this.gatewaycommIOTagForm = false;
      this.gatewayCommIOTagView = true;
      this.commIOTagFormPreview = false;
      this.commIOTagFormView = false;
      this.commIOTagsView = true;
      this.getGatewayCommIOTagByIdForView(this.tagId);
    }
    if (this.tagId != null && this.viewIOTag === 'childEdit') {
      this.gatewaycommIOTagAdd = false;
      this.gatewaycommIOTagEdit = true;
      this.gatewayCommIOTagChildEdit = true;
      this.gatewayCommIOTagChildView = false;
      this.gatewaycommIOTagForm = false;
      this.childCommIOTagListView = false;
      this.gatewayCommIOTagView = false;
      this.commIOTagFormPreview = false;
      this.commIOTagFormView = false;
      this.commIOTagsView = false;
      this.getGatewayCommIOTagById(this.tagId);
      this.validateTheForm();
      this.patchCommProtocolData();
    }
    if (this.tagId != null && this.viewIOTag === 'childView') {
      this.gatewaycommIOTagAdd = false;
      this.gatewaycommIOTagEdit = false;
      this.gatewayCommIOTagChildEdit = false;
      this.gatewayCommIOTagChildView = true;
      this.gatewaycommIOTagForm = false;
      this.gatewayCommIOTagView = false;
      this.commIOTagFormPreview = false;
      this.commIOTagFormView = false;
      this.commIOTagsView = true;
      this.getGatewayCommIOTagByIdForView(this.tagId);
    }
    if (this.tagId != null && this.viewIOTag === 'addChildIOTag') {
      this.gatewaycommIOTagAdd = true;
      this.gatewaycommIOTagEdit = false;
      this.gatewayCommIOTagChildEdit = false;
      this.gatewaycommIOTagForm = true;
      this.gatewayCommIOTagChildView = false;
      this.childCommIOTagListView = false;
      this.gatewayCommIOTagView = false;
      this.commIOTagFormPreview = false;
      this.commIOTagFormView = false;
      this.commIOTagsView = false;
      this.getParentGatewayCommIOTagById(this.tagId);
      this.validateTheForm();
      this.patchCommProtocolData();
      this.commIOTagForm.get('parentNodeCommProtocolIoTagId').disable();
    }
    if (this.tagId === null || this.tagId === undefined) {
      this.gatewaycommIOTagAdd = true;
      this.commIOTagsView = false;
      this.gatewaycommIOTagEdit = false;
      this.validateTheForm();
      this.patchCommProtocolData();
      this.commIOTagForm.get('parentNodeCommProtocolIoTagId').enable();
    }


    this.getDataFormats();
    this.getTagLengthUnits();
  }

  constructor(private commService: CommunicationService, private globalSharedService: globalShareServices, private router: Router, private formBuilder: FormBuilder, private service: GatewayCommIOTagService,
    private globalService: globalSharedService, private dialogService: DialogService,
    private route: ActivatedRoute) {

  }

  patchCommProtocolData() {
    this.commIOTagForm.patchValue({
      templateName: this.commProtocol.gateway.name,
      communication: this.commProtocol.commProtocol.name,
      dataHandlerFormat: this.commProtocol.dataFormat.name,
      seperator: this.commProtocol.tagSeparator
    })
  }


  validateTheForm() {
    this.commIOTagForm = this.formBuilder.group({
      id: [null],
      templateName: [null],
      communication: [null],
      dataHandlerFormat: [null],
      seperator: [null],
      nodeIoTagId: [null, Validators.required],
      //parentIOTagId: [null],
      tagIndex: [null, [Validators.pattern("[0-9]*")]],
      tagLength: [null, [Validators.pattern("[0-9]*")]],
      tagLengthUnit: [null],
      tagKeyName: [null],
      dataFormatId: [null],
      parentNodeCommProtocolIoTagId: [null],
      hasChildTags: [null],
      tagSeprator: [null],
      dateTimeFormat: [null],
      status: ['Active']
    })
  }

  getGatewayCommIOTagsByGatewayCommProtocolId(gatewayCommProtocolId) {
    this.service.getGatewayCommIOTagsByGatewayCommProtocolId(gatewayCommProtocolId).subscribe(data => {
      this.gatewayCommIOTags = data;
      this.gatewayCommIOTags.forEach(gatewayCommIOTag=>{
        gatewayCommIOTag.tagName=gatewayCommIOTag.gatewayIOTag.name;
      })
      this.gatewayCommIOTagFieldData=this.gatewayCommIOTags;
      this.allGatewayCommIOTags = data;
      this.getGatewayIOTagsByTemplateId();
      this.gatewayCommIOTags = this.gatewayCommIOTags.sort((a, b) => a.gatewayIOTag.name.localeCompare(b.gatewayIOTag.name))
      //this.setgatewayCommIOTagsDataSource(data);
    },
      (error: any) => {
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      }
    )
  }

  getGatewayIOTagsByTemplateId() {
    this.service.getGatewayIOTagsByTemplateId(this.commProtocol.gateway.id).subscribe(data => {
      this.gatewayIOTags = data.filter(gatewayIoTag => gatewayIoTag.tagIOMode === "I");;
      this.gatewayIOTagsFieldData=this.gatewayIOTags;
      this.allGatewayIOTags = data;
      this.removeTheItemsFromIOTagArray();
    },
      (error: any) => {
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      }
    )
  }

  removeTheItemsFromIOTagArray() {
    if (null != this.gatewayCommIOTags) {
      let ids = this.gatewayCommIOTags.map(item => item.nodeIoTagId);
      let filteredData = this.gatewayIOTags.filter(item => ids.indexOf(item.id) === -1);
      this.gatewayIOTags = filteredData;
      this.gatewayIOTags = this.gatewayIOTags.sort((a, b) => a.name.localeCompare(b.name))
    }

  }

  getDataFormats() {
    this.service.getDataFormats().subscribe(data => {
      this.dataFormats = data;
      this.dataFormats= this.globalSharedService.addSelectIntoList(this.dataFormats);
    },
      (error: any) => {
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      }
    )
  }

  setgatewayCommIOTagsDataSource(gatewayCommIOTags: GatewayCommProtocolIOTag[]) {
    if (Array.isArray(gatewayCommIOTags) && gatewayCommIOTags.length) {
      gatewayCommIOTags.sort((a, b) => b.id - a.id);
      this.gatewayCommIOTagDataSource = new MatTableDataSource();
      this.gatewayCommIOTagDataSource.data = gatewayCommIOTags;

      // To get paginator events from child mat-table-paginator to access its properties
      // this.myPaginator = this.myPaginatorChildComponent.getDatasource();
      // this.matTablePaginator(this.myPaginator);

      this.gatewayCommIOTagDataSource.paginator = this.myPaginator;
      this.gatewayCommIOTagDataSource.sort = this.sort;
      this.tableView = true;
      this.NoRecordsFound = false;
    }
    else {
      this.gatewayCommIOTagDataSource = null;
      this.NoRecordsFound = true;
      this.tableView = false;
    }
  }
  createIOTag() {
    this.commIOTagFormPreview = true;
    this.commIOTagFormView = false;
    this.gatewaycommIOTagForm = false;
    this.childCommIOTagListView = false;
    this.gatewayCommIOTagView = false;
    this.gatewaycommIOTagAdd = false;
    this.gatewaycommIOTagEdit = false;
    this.gatewayCommIOTag = <GatewayCommProtocolIOTag>this.commIOTagForm.value;
  }

  saveCommIOTagInfo() {
    this.showLoaderImage = true;
    this.gatewayCommIOTag = <GatewayCommProtocolIOTag>this.commIOTagForm.value;
    let userId = sessionStorage.getItem('userId');
    this.gatewayCommIOTag.nodeCommProtocolId = this.commProtocol.id;
    if (this.gatewayCommIOTag.id === null || (this.gatewayCommIOTag.id === parseInt(this.gatewayCommIOTag.parentNodeCommProtocolIoTagId))) {
      this.gatewayCommIOTag.id = null;
      this.gatewayCommIOTag.created_by = parseInt(userId);
      if (this.tagId != null) {
        this.gatewayCommIOTag.parentNodeCommProtocolIoTagId = this.tagId.toString();
      }
      this.service.saveGatewayCommIOTag(this.gatewayCommIOTag).subscribe(res => {
        this.showLoaderImage = false;
        // response handling
        this.modelNotification.alertMessage(res['messageType'], res['message']);

      }, error => {
        this.showLoaderImage = false;
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      });
    } else {
      this.gatewayCommIOTag.updated_by = parseInt(userId);
      this.service.updateGatewayCommIOTag(this.gatewayCommIOTag).subscribe(res => {
        this.showLoaderImage = false;
        // response handling
        this.modelNotification.alertMessage(res['messageType'], res['message']);
      }, error => {
        this.showLoaderImage = false;
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      });
    }
  }

  // Create GatewayCommIOTag
  GatewayCommIOTag() {
    this.commIOTagFormPreview = false;
    this.commIOTagFormView = false;
    this.gatewaycommIOTagForm = true;
    this.childCommIOTagListView = true;
    this.gatewayCommIOTagView = false;
    this.commIOTagForm.reset();
    this.saveSuccess = true;
    this.updateSucess = false;
    this.closeSavePopup();
  }


  getParentGatewayCommIOTagById(id) {
    this.service.getGatewayCommIOTagById(id).subscribe(data => {
      //this.setgatewayCommIOTagsDataSource(data.gatewayCommProtocolIOTags);
      this.gatewayCommIOTag = data;
      this.commIOTagForm.patchValue({
        //id: data.id,
        parentNodeCommProtocolIoTagId: this.gatewayCommIOTag.id
        //nodeIoTagId: data.nodeIoTagId
      });

    },
      (error: any) => {
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      }
    )

  }

  getGatewayCommIOTagById(id) {
    this.service.getGatewayCommIOTagById(id).subscribe(data => {
      this.setgatewayCommIOTagsDataSource(data.gatewayCommProtocolIOTags);
      this.gatewayCommIOTag = data;
      this.commIOTagView = data;
      // this.service.getGatewayIOTagsByTemplateId(this.commProtocol.gateway.id).subscribe(data => {
      //this.gatewayIOTags =[];
      //this.gatewayIOTags = data;
      this.service.getGatewayIOTagsByTemplateId(this.commProtocol.gateway.id).subscribe(data => {
        this.gatewayIOTags = data
        this.gatewayCommIOTags.forEach(commIOTag => {
          this.gatewayIOTags = this.gatewayIOTags.filter(ioTag => ioTag.id !== commIOTag.nodeIoTagId)
        })
        this.gatewayIOTags.push(this.gatewayCommIOTag.gatewayIOTag)
        //this.gatewayIOTags = data;
        this.gatewayIOTags = this.gatewayIOTags.sort((a, b) => a.name.localeCompare(b.name));
        this.gatewayIOTagsFieldData=this.gatewayIOTags;
        this.gatewayCommIOTags = this.gatewayCommIOTags.filter(commIOTag => commIOTag.id !== this.gatewayCommIOTag.id);
        this.gatewayCommIOTags = this.gatewayCommIOTags.sort((a, b) => a.gatewayIOTag.name.localeCompare(b.gatewayIOTag.name))
        this.removeChildCommIOTagsFromParent(this.gatewayCommIOTags, this.gatewayCommIOTag);

      }, (error: any) => {

      })

      this.commIOTagForm.patchValue({
        id: this.commIOTagView.id,
        parentNodeCommProtocolIoTagId: this.commIOTagView.parentNodeCommProtocolIoTagId,
        tagIndex: this.commIOTagView.tagIndex,
        tagLength: this.commIOTagView.tagLength,
        tagLengthUnit: this.commIOTagView.tagLengthUnit,
        tagKeyName: this.commIOTagView.tagKeyName,
        dataFormatId: this.commIOTagView.dataFormatId,
        tagSeprator: this.commIOTagView.tagSeprator,
        dateTimeFormat: this.commIOTagView.dateTimeFormat,
        status: this.commIOTagView.status,
        nodeIoTagId: this.commIOTagView.nodeIoTagId
      });
      //this.gatewayIOTags = filteredData;
      // },
      //   (error: any) => {
      //     this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      //   }
      // );

    },
      (error: any) => {
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      }
    )
  }

  removeChildCommIOTagsFromParent(commIOTags: GatewayCommProtocolIOTag[], commIOTag: GatewayCommProtocolIOTag) {
    if (commIOTags != null && commIOTags.length != 0) {
      commIOTags.forEach(ioTag => {
        if (ioTag.parentNodeCommProtocolIoTagId === commIOTag.id.toString()) {
          let tempTag = ioTag;
          this.gatewayCommIOTags = commIOTags.filter(tag => tag.parentNodeCommProtocolIoTagId != commIOTag.id.toString());
          this.removeChildCommIOTagsFromParent(this.gatewayCommIOTags, tempTag);
        }
      })
    }
  }

  // back Button
  backButton(elementId) {
    if (this.tagId != null) {
      this.gatewayCommIOTag = this.commIOTagView;
      this.childCommIOTagListView = true;
      this.gatewayCommIOTagView = false;
      this.commIOTagFormPreview = false;
      this.commIOTagFormView = false;
    }
    this.gatewaycommIOTagForm = true;
    this.commIOTagFormPreview = false;

    window.scrollTo(0, 0);
    setTimeout(() => {
      if (elementId) {
        let item = document.getElementById(elementId);
        window.scrollBy({ top: item.offsetTop, behavior: 'smooth' })
      }
    });
  }

  resetCommIOTagForm() {
    if (this.commIOTagForm.dirty) {
      this.warningFlag = "resetcommIOTagForm";
      this.modelNotification.alertMessage(this.globalService.messageType_Warning, 'You will not be able to recover the changes!');
    }
  }

  // Form reset  confirm CommIOTagForm
  formResetConfirmCommIOTagForm() {
    this.gatewayCommIOTag = <GatewayCommProtocolIOTag>this.commIOTagForm.value;
    if (this.gatewayCommIOTag.id == null) {
      this.validateTheForm();
    } else {
      this.validateTheForm();
      this.getGatewayCommIOTagById(this.gatewayCommIOTag.id);
    }
  }


  alertRedirection() {
    if (this.warningFlag == "resetcommIOTagForm") {
      this.formResetConfirmCommIOTagForm();
    } else if (this.warningFlag == "cancelGatewayCommIOTagForm") {
      this.formCancelConfirmGatewayCommIOTagForm();
    } else if (this.warningFlag == 'cancelGatewayCommIOTagChildForm') {
      this.formCancelConfirmGatewayCommIOTagChildForm();
    }
    this.warningFlag = "";
  }

  parseInt(id) {
    if (isNaN(id)) {
      return id;
    }
    return parseInt(id);
  }

  cancelGatewayCommIOTagForm() {
   // this.parentTagId = parentTagId;
    if (this.hasOwnProperty("commIOTagForm")) {
      if (this.commIOTagForm.dirty) {
        this.warningFlag = "cancelGatewayCommIOTagForm";
        this.modelNotification.alertMessage(this.globalService.messageType_Warning, 'You will not be able to recover the changes!');
      } else {
        this.formCancelConfirmGatewayCommIOTagForm();
      }
    } else if (null != this.parentTagId) {
      this.getGatewayCommIOTagByIdForView(this.parentTagId);
      this.gatewayCommIOTagChildView = true;
      this.gatewayCommIOTagView = false;
      this.childCommIOTagListView = true;
    } else {
      this.globalSharedService.GettingId(this.commProtocol.gateway.id);
      this.globalSharedService.GettingString('communication');
      this.router.navigate(['../'], { relativeTo: this.route });
    }
  }

  // Confirm redirect to
  formCancelConfirmGatewayCommIOTagForm() {
    if (this.parentTagId === null || this.parentTagId === undefined) {
      //this.commIOTagForm.reset();
      this.globalSharedService.GettingId(this.commProtocol.gateway.id);
      this.globalSharedService.GettingString('communication');
      this.router.navigate(['../'], { relativeTo: this.route });
      this.validateTheForm();
    } else {
      this.globalSharedService.GettingId(this.parentTagId);
      this.globalSharedService.GettingString('edit');
      this.loadFormData();
    }
  }

  getCommIOTagDataForView() {
    this.gatewayCommIOTagView = true;
  }

  getGatewayCommIOTagByIdForView(id) {
    this.service.getGatewayCommIOTagById(id).subscribe(data => {
      this.showLoaderImage = false;
      this.setgatewayCommIOTagsDataSource(data.gatewayCommProtocolIOTags);
      this.commIOTagView = data;
      this.childCommIOTagListView = true;
    },
      (error: any) => {
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      }
    )
  }

  cancelGatewayCommIOTagView() {
    this.globalSharedService.GettingId(this.commProtocol.gateway.id);
    this.globalSharedService.GettingString('communication');
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  viewParentGatewayIOTag(id: number, msg: string) {
    this.commService.gatewayCommProtocol = this.commProtocol
    this.globalSharedService.GettingId(id);
    this.globalSharedService.GettingString(msg);
    this.loadFormData();
  }

  viewChildIOTag(id: number, msg: string) {
    this.commService.gatewayCommProtocol = this.commProtocol
    this.globalSharedService.GettingId(id);
    this.globalSharedService.GettingString(msg);
    this.loadFormData();
  }

  cancelGatewayCommIOTagChildForm(parentTagId) {
    this.parentTagId = parentTagId;
    if (this.commIOTagForm.dirty) {
      this.warningFlag = "cancelGatewayCommIOTagChildForm";
      this.modelNotification.alertMessage(this.globalService.messageType_Warning, 'You will not be able to recover the changes!');
    } else {
      this.formCancelConfirmGatewayCommIOTagChildForm();
    }
  }

  // Confirm redirect to CancelConfirmGatewayCommIOTagChildForm
  formCancelConfirmGatewayCommIOTagChildForm() {
    this.globalSharedService.GettingId(this.parentTagId);
    this.globalSharedService.GettingString('edit');
    this.loadFormData();
  }

  deleteChildIOTag(gatewayCommIOTag: GatewayCommProtocolIOTag) {
    this.commIOTagView = gatewayCommIOTag;
    // Trigger sweet alert danger alert
    this.modelNotification.alertMessage(this.globalService.messageType_Fail, 'You will not be able to recover this Gateway Comm IO Tag!');
  }

  ConfirmDeleteCommIOTag() {
    //this.commIOTagView.status
    let userId = sessionStorage.getItem('userId');
    this.commIOTagView.updated_by = parseInt(userId);
    this.commIOTagView.nodeCommProtocolId = this.commIOTagView.gatewayCommProtocol.id
    this.commIOTagView.nodeIoTagId = this.commIOTagView.gatewayIOTag.id;
    this.service.deleteGatewayCommIOTag(this.commIOTagView).subscribe(res => {
      // response handling
      this.modelNotification.alertMessage(res['messageType'], res['message']);
    }, (error) => {
      this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
    })

  }

  // Delete confirm
  confirmDelete() {
    this.commService.setGatewayCommProtocol(this.commProtocol);
    this.globalSharedService.GettingId(this.tagId);
    this.globalSharedService.GettingString(this.viewIOTag);
    this.loadFormData();
  }

  // cancelDelete() {
  //   $(".bd-example-modal-sm").modal('hide');
  // }


  closeSavePopup() {
    this.globalSharedService.GettingId(this.commProtocol.gateway.id);
    this.globalSharedService.GettingString('communication');
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  getTagLengthUnits() {
    this.service.getTagLengthUnits().subscribe(data => {
      this.tagLengthUnits = data;
      if (this.tagLengthUnits) {
        let Obj = {
          "value": "--Select--",
          "id":0
        }
        this.tagLengthUnits.push(Obj);
      }
    })
  }


  /*
  Material table paginator code starts here
*/
 // myPaginator;
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

    dataFormatsOnChange($event){
      if ($event.value) {
        this.commIOTagForm.controls['dataFormatId'].setValue($event.itemData.id);
      }else{
        this.commIOTagForm.controls['dataFormatId'].setValue(null);
      }
    }
    tagLengthUnitsOnChange($event){
      if ($event.value) {
        this.commIOTagForm.controls['tagLengthUnit'].setValue($event.itemData.id);
      }else{
        this.commIOTagForm.controls['tagLengthUnit'].setValue(null);
      }
    }
    parentNodeCommProtocolIoTagOnChange($event){
      if ($event.value) {
        this.commIOTagForm.controls['parentNodeCommProtocolIoTagId'].setValue($event.itemData.id);
      }
    }
    nodeIoTagOnChange($event){
      if ($event.value) {
        this.commIOTagForm.controls['nodeIoTagId'].setValue($event.itemData.id);
      }
    }
}

