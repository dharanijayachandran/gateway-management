import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { GatewayTemplateIoTagService } from '../../../gateway-template/services/gatewayTemplateIOTag/gateway-template-io-tag.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from 'src/app/shared/services/dialog/dialog.service';
import { globalSharedService } from 'src/app/shared/services/global/globalSharedService';
import { GatewayIOTag } from '../../../gateway-template/model/gatewayIOTag';
import { UIModalNotificationPage } from 'global';
import { globalShareServices } from 'src/app/shared/globalShareServices';
import { FilteringEventArgs } from '@syncfusion/ej2-dropdowns';
import { EmitType } from '@syncfusion/ej2-base';
import { Query } from '@syncfusion/ej2-data';

@Component({
  selector: 'app-gateway-io-tag-form',
  templateUrl: './gateway-io-tag-form.component.html',
  styleUrls: ['./gateway-io-tag-form.component.css']
})
export class GatewayIoTagFormComponent implements OnInit {
  GatewayIOTagObject: GatewayIOTag;
  GatewayIOTagId: any;
  addEditText: string;
  restObject: GatewayIOTag;

  // It help to if there are no pending changes, just allow deactivation; else confirm first code starts here
  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    if (this.hasOwnProperty('gatewayTemplateIOTagForm')) {
      if (this.gatewayIOTagForm.dirty) {
        this.dialogService.alertMessage('Warning', 'You will not be able to recover the changes!');
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

  dataTypes: any[];
  standardIOTags: any[];
  tagTypes: any[];
  engUnits: any[];
  gatewayTemplateId: number;
  dataSource: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  gatewayIOTagForm: FormGroup;
  // private gatewayIOTag: GatewayTemplateIOTag = new GatewayTemplateIOTag();
  tagIOModes: any[];
  warningFlag: string;
  showLoaderImage = false;

  public standardIOTagFields: Object = {
    text: 'name',
    value: 'id'
  };
  public dataTypeFields: Object = {
    text: 'name',
    value: 'id'
  };
  public engUnitFields: Object = {
    text: 'name',
    value: 'id'
  };
  // filtering event handler to filter a Menu Icon Name
  //pass the filter data source, filter query to updateData method.
  public onFilteringDataType: EmitType<FilteringEventArgs> = (e: FilteringEventArgs) => {
    this.filterData(e,this.standardIOTags);

  }

  public onFilteringStandardIOTag: EmitType<FilteringEventArgs> = (e: FilteringEventArgs) => {
    this.filterData(e,this.dataTypes);
  }
  public onFilteringEngUnit: EmitType<FilteringEventArgs> = (e: FilteringEventArgs) => {
    this.filterData(e,this.engUnits);
  }
  filterData(e: FilteringEventArgs, filterData) {
    let query: Query = new Query();
    //frame the query based on search string with filter type.
    query = (e.text !== '') ? query.where('name', 'contains', e.text, true) : query;
    e.updateData(filterData, query);
  }
  public sortDropDown:string ='Ascending';
  dataProtocolStandardTagId:any;
  dataTypeId:any;
  engUnitId:any;
  // set the placeholder to DropDownList input element
  public dataTypeWaterMark: string = 'Select Data Type';
  public standardIOTagWaterMark: string = 'Select StandardIOTag';
  public engUnitWaterMark: string = 'Select Engineering Unit';
  public filterPlaceholder: string = 'Search';
  // set the height of the popup element
  public height: string = '200px';
  public locale: string;

  constructor(private globalService: globalSharedService, private gatewayTemplateIOTagService: GatewayTemplateIoTagService,
    private globalSharedService: globalShareServices,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,

    private dialogService: DialogService) { }

  ngOnInit() {
    this.IOTagFormValidation();
    this.getDataTypes();
    this.getTagTypes();
    this.getTagIOMode();
    this.getStandardIOTag();
    this.getEngineeringUnit();
    this.GatewayIOTagId = this.globalSharedService.assignId;
    if (this.GatewayIOTagId != null && this.GatewayIOTagId != undefined) {
      this.addEditText = "Edit";
      this.GatewayIOTagObject = this.globalSharedService.globalObject
      this.restObject = this.GatewayIOTagObject
      this.editGatwayIoTag(this.globalSharedService.globalObject);
      this.globalSharedService.globalObject = null;
    }
    else {
      this.addEditText = "Add";
      if (null != this.globalService.listOfRow) {
        this.globalService.listOfRow.id = null;
      }
      if (this.globalSharedService.globalObject != null) {
        this.editGatwayIoTag(this.globalSharedService.globalObject);
      }
      this.globalSharedService.globalObject = null;
    }
  }
  IOTagFormValidation() {
    this.gatewayIOTagForm = this.formBuilder.group({
      id: [null],
      name: [null, [
        Validators.required,
        Validators.pattern(this.globalService.getNamePatternForGatewayandAsset())]],
      description: [null],
      tagKeyName: [null],
      dataTypeId: [1],
      engUnitId: [null],
      tagType: [1],
      dataProtocolStandardTagId: [null],
      status: ['Active'],
      tagIOMode: [1]
    });

  }

  getDataTypes(): void {
    this.dataTypes = this.globalSharedService.dataTypes;

  }

  getTagTypes(): void {

    this.tagTypes = this.globalSharedService.tagTypes;
  }
  getTagIOMode(): void {

    this.tagIOModes = this.globalSharedService.tagIOModes;
  }

  getStandardIOTag(): void {
    this.standardIOTags = this.globalSharedService.standardIOTags;
  }
  // To get all Unit Id list for drop down
  getEngineeringUnit(): void {
    this.engUnits = this.globalSharedService.engUnits;
  }

  previewIOTag() {
    this.globalService.listOfRow = null;
    this.GatewayIOTagObject = <GatewayIOTag>this.gatewayIOTagForm.value;
    if (+this.GatewayIOTagObject.tagType === 1) {
      this.GatewayIOTagObject.tagType = 'A';
    }
    else {
      this.GatewayIOTagObject.tagType = 'D';
    }


    if (+this.GatewayIOTagObject.tagIOMode === 1) {
      this.GatewayIOTagObject.tagIOMode = 'I';
    }
    else {
      this.GatewayIOTagObject.tagIOMode = 'O';
    }
    this.globalService.listOfRow = this.GatewayIOTagObject;
    this.globalSharedService.setGlobalObject(this.GatewayIOTagObject);
    this.globalSharedService.setGlobalId(this.GatewayIOTagObject.id);
    this.router.navigate(['../gateway-io-tag-preview'], { relativeTo: this.route });
  }


  editGatwayIoTag(data) {
    if (data.tagType === "A") {
      data.tagType = 1;
    }
    else if(data.tagType === "D"){
      data.tagType = 2;
    }
    if (data.tagIOMode === 'I') {
      data.tagIOMode = 1
    } else if(data.tagIOMode === 'O'){
      data.tagIOMode = 2
    }
    this.gatewayIOTagForm.patchValue({
      id: data.id,
      name: data.name,
      createdBy: data.created_by,
      description: data.description,
      tagKeyName: data.tagKeyName,
      tagType: data.tagType,
      dataTypeId: data.dataTypeId,
      engUnitId: data.engUnitId,
      dataProtocolStandardTagId: data.dataProtocolStandardTagId,
      tagIOMode: data.tagIOMode,
      status: data.status
    });

  }


  resetIOTagForm() {
    this.warningFlag = "reset"
    this.modelNotification.alertMessage(this.globalService.messageType_Warning, 'You will not be able to recover the changes!');
  }


  // Form reset  confirm
  formResetConfirm() {
    if (this.GatewayIOTagObject.id === null) {
      this.IOTagFormValidation();
    }
    else {
      this.IOTagFormValidation();
      this.editGatwayIoTag(this.restObject);
    }
  }


  backButton(elementId) {

    window.scrollTo(0, 0);
    setTimeout(() => {
      if (elementId) {
        let item = document.getElementById(elementId);
        window.scrollBy({ top: item.offsetTop, behavior: 'smooth' })
      }
    });

  }
  cancelGatewayIOTagForm(event: Event) {
    if (this.gatewayIOTagForm.dirty) {
      this.warningFlag = "cancel";
      this.modelNotification.alertMessage(this.globalService.messageType_Warning, 'You will not be able to recover the changes!');
    } else {
      this.formCancelConfirm();
    }
  }

  // Confirm redirect to
  formCancelConfirm() {
    this.globalSharedService.GettingString('IOTag');
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  parseInt(id) {
    return parseInt(id);
  }
  onKey(event: any) {
    let isDH = this.globalService.doubleHyphen(event);
    if (isDH) {
      this.gatewayIOTagForm.get('name').setErrors({
        pattern: true
      });
    }
  }

  alertRedirection() {
    if (this.warningFlag == "reset") {
      this.formResetConfirm();
    } else if (this.warningFlag == "cancel") {
      this.formCancelConfirm();
    }
    this.warningFlag = "";
  }

  dataTypeOnChange($event){
    if ($event.value) {
      this.gatewayIOTagForm.controls['dataTypeId'].setValue($event.itemData.id);
    }
  }
  standardIOTagOnChange($event){
    if ($event.value) {
      this.gatewayIOTagForm.controls['dataProtocolStandardTagId'].setValue($event.itemData.id);
    }else{
      this.gatewayIOTagForm.controls['dataProtocolStandardTagId'].setValue(null);
    }
  }
  engUnitOnChange($event){
    if ($event.value) {
      this.gatewayIOTagForm.controls['engUnitId'].setValue($event.itemData.id);
    }else{
      this.gatewayIOTagForm.controls['engUnitId'].setValue(null);
    }
  }
}
