import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalGatewayService } from 'src/app/shared/globalGatewayService/global-gateway-service.service';
import { globalSharedService } from 'src/app/shared/services/global/globalSharedService';
import { GatewayModel } from '../../../gateway-model/model/gateway-model';
import { GatewayTemplate } from '../../../gateway-template/model/gatewayTemplate';
import { GatewayType } from '../../../gateway-template/model/gatewayType';
import { Gateway } from '../../model/gateway';
import { GatewayService } from '../../services/gateway/gateway.service';
import { UIModalNotificationPage } from 'global';
import { EmitType } from '@syncfusion/ej2-base';
import { FilteringEventArgs } from '@syncfusion/ej2-dropdowns';
import { Query } from '@syncfusion/ej2-data';
import { globalShareServices } from 'src/app/shared/globalShareServices';
@Component({
  selector: 'app-download-template',
  templateUrl: './download-template.component.html',
  styleUrls: ['./download-template.component.css']
})
export class DownloadTemplateComponent implements OnInit, OnDestroy {

  downloadTemplate: FormGroup;
  // Importing child component to
  @ViewChild(UIModalNotificationPage) modelNotification;
  gatewayTypeList: GatewayType[];
  gatewayModelList: GatewayModel[];
  gatewayTemplates: GatewayTemplate[];
  GatewayIdObj: Gateway = new Gateway();
  assetTemplateList: any[];

  nodeTemplateList: GatewayTemplate[];
  editable = false;
  warningFlag: string;
  disableReviewAndSave = false;

  public gatewayTypeFields: Object = {
    text: 'name',
    value: 'id'
  };
  public gatewayModelFields: Object = {
    text: 'name',
    value: 'id'
  };
  public gatewayTemplateFields: Object = {
    text: 'name',
    value: 'id'
  };
  public assetTemplateFields: Object = {
    text: 'name',
    value: 'id'
  };
  // filtering event handler to filter a Menu Icon Name
  //pass the filter data source, filter query to updateData method.
  public onFilteringGatewayType: EmitType<FilteringEventArgs> = (e: FilteringEventArgs) => {
    this.filterData(e, this.gatewayTypeList);

  }

  public onFilteringGatewayModel: EmitType<FilteringEventArgs> = (e: FilteringEventArgs) => {
    this.filterData(e, this.gatewayModelList);
  }
  public onFilteringGatewayTemplates: EmitType<FilteringEventArgs> = (e: FilteringEventArgs) => {
    this.filterData(e, this.gatewayTemplates);
  }
  public onFilteringAssetTemplate: EmitType<FilteringEventArgs> = (e: FilteringEventArgs) => {
    this.filterData(e, this.assetTemplateList);
  }
  downloadTemplateBack: any;
  gatewayModelByGatewayTypeId: Map<number, GatewayModel[]>;
  gatewayTemplateByGatewayTypeId: Map<number, GatewayTemplate[]>;
  filterData(e: FilteringEventArgs, filterData) {
    let query: Query = new Query();
    //frame the query based on search string with filter type.
    query = (e.text !== '') ? query.where('name', 'contains', e.text, true) : query;
    e.updateData(filterData, query);
  }

  public sortDropDown: string = 'Ascending';
  gatewayTemplateId: any;
  gatewayModelId: any;
  gatewayTypeId: any;
  assetTemplateId: any;
  // set the placeholder to DropDownList input element
  public gatewayTypeWaterMark: string = 'Select Gateway Type';
  public gatewayModelWaterMark: string = 'Select Gateway Model';
  public gatewayTemplateWaterMark: string = 'Select Gateway Template';
  public assetTemplateWaterMark: string = 'Select Asset Template';
  public filterPlaceholder: string = 'Search';
  // set the height of the popup element
  public height: string = '220px';
  public locale: string;

  constructor(private formBuilder: FormBuilder,
    private gatewayService: GatewayService,
    private router: Router,
    private route: ActivatedRoute,
    private globalService: globalSharedService,
    private globalGatewayService: GlobalGatewayService,
    private globalServiceloc: globalShareServices,
  ) { }
  ngOnDestroy(): void {
    //  this.globalServiceloc.setGlobalObject('');
  }

  ngOnInit(): void {
    this.downloadTemplateBack = this.globalService.listOfRow;

    this.registerForm()
    this.gatewayTypes()
    // if(this.downloadTemplateBack) {
    //   this.getAssetTemplates(this.downloadTemplateBack.gatewayTemplateId);
    //   this.gatewayModelByGatewayTypeId= this.globalServiceloc.gatewayModelByGatewayTypeId;
    //   this.gatewayModelList= this.gatewayModelByGatewayTypeId.get(this.downloadTemplateBack.gatewayTypeId);
    //   this.gatewayTemplateByGatewayTypeId=this.globalServiceloc.gatewayTemplateByGatewayTypeId;
    //   this.nodeTemplateList=this.gatewayTemplateByGatewayTypeId.get(this.downloadTemplateBack.gatewayTypeId);
    //   this.gatewayTemplates = this.nodeTemplateList;
    //   if(!this.gatewayModelList){
    //     this.getGatewayModelsByGatewayTypeId(this.downloadTemplateBack.gatewayTypeId);
    //   }
    //   this.patchData(this.downloadTemplateBack);
    // }
  }
  patchData(downloadTemplateBack) {
    this.downloadTemplate.patchValue({
      id: downloadTemplateBack.id,
      gatewayTypeId: downloadTemplateBack.gatewayTypeId,
      gatewayModelId: downloadTemplateBack.gatewayModelId,
      gatewayTypeName: downloadTemplateBack.gatewayTypeName,
      gatewayModelName: downloadTemplateBack.gatewayModelName,
      gatewayTemplateId: downloadTemplateBack.gatewayTemplateId,
      gatewayTemplateName: downloadTemplateBack.gatewayTemplateName,
      assetTemplateId: downloadTemplateBack.assetTemplateId,
      assetTemplateName: downloadTemplateBack.assetTemplateName,
    })
  }

  registerForm() {
    this.downloadTemplate = this.formBuilder.group({
      gatewayTypeId: [null, [
        Validators.required
      ]],
      gatewayModelId: [null],
      gatewayTypeName: [null],
      gatewayModelName: [null],
      gatewayTemplateName: [null],
      gatewayTemplateId: [null, [
        Validators.required
      ]],
      assetTemplateId: [null],
      assetTemplateName: [null]
    })
  }

  // Get gatewayType list
  gatewayTypes() {
    this.globalGatewayService.getGatewayTypes().subscribe(res => {
      this.gatewayTypeList = res;
    },
      (error: any) => {
        // If the service is not available
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      }
    );
  }
  // Dropdown change gateway Type
  gatewayTypeChange($event) {
    if ($event.itemData.id === '0: null') {
      this.gatewayTemplates = [];
      this.nodeTemplateList = [];
      this.gatewayModelList = [];
    }
    else {
      this.downloadTemplate.controls['gatewayModelId'].setValue(null);
      this.downloadTemplate.controls['gatewayModelName'].setValue(null);
      this.downloadTemplate.controls['gatewayTemplateId'].setValue(null);
      this.downloadTemplate.controls['gatewayTemplateName'].setValue(null);
      this.downloadTemplate.controls['assetTemplateId'].setValue(null);
      this.downloadTemplate.controls['assetTemplateName'].setValue(null);
      this.downloadTemplate.controls['gatewayTypeName'].setValue($event.itemData.name);

      this.getGatewayModelsByGatewayTypeId($event.itemData.id);
    }
  }
  //get gateway Model list
  getGatewayModelsByGatewayTypeId(gatewayTypeId) {
    this.globalGatewayService.getGatewayModelsByGatewayTypeId(gatewayTypeId).subscribe((res) => {
      this.gatewayModelList = res;
      this.gatewayModelList = this.globalServiceloc.addSelectIntoList(this.gatewayModelList);
      this.gatewayTemplatesByGatewayTypeId(gatewayTypeId);
    },
      (error: any) => {
        // If the service is not available
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      }
    );
  }

  // Dropdown change gateway Model
  gatewayModelChange($event) {
    this.downloadTemplate.controls['gatewayTemplateId'].setValue(null);
    this.downloadTemplate.controls['gatewayTemplateName'].setValue(null);
    this.downloadTemplate.controls['assetTemplateId'].setValue(null);
    this.downloadTemplate.controls['assetTemplateName'].setValue(null);
    if ($event.value) {
      this.downloadTemplate.controls['gatewayModelName'].setValue($event.itemData.name);
      this.gatewayTemplatesByGatewayTypeAndModelId($event.itemData.id);
    }else{
      this.downloadTemplate.controls['gatewayModelName'].setValue("");
      this.downloadTemplate.controls['gatewayModelId'].setValue(null);
      this.getGatewayModelsByGatewayTypeId(this.downloadTemplate.controls['gatewayTypeId'].value);
    }

  }


  gatewayTemplatesByGatewayTypeAndModelId(gatewayModelId) {
    if (gatewayModelId === 'null') {
      this.gatewayTemplates = [];
    }
    else {
      this.gatewayTemplates = this.nodeTemplateList.filter(template => template.gatewayModel?.id === parseInt(gatewayModelId));
    }
  }
  // Dropdown change node Template
  nodeTemplateChange($event) {
    this.downloadTemplate.controls['assetTemplateId'].setValue(null);
    this.downloadTemplate.controls['assetTemplateName'].setValue(null);
    this.downloadTemplate.controls['gatewayTemplateName'].setValue($event.itemData.name);
    this.getAssetTemplates($event.itemData.id);


  }
  assetTemplateChange($event) {
    this.downloadTemplate.controls['assetTemplateName'].setValue($event.itemData.name);

  }

  getAssetTemplates(gatewayTemplateId) {
    this.gatewayService.getAssetTemplates(gatewayTemplateId).subscribe(res => {
      this.assetTemplateList = res;
    },
      (error: any) => {
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
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
      this.gatewayTemplates = res;

    },
      (error: any) => {
        // If the service is not available
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      }
    );
  }

  // Cancel button
  cancelGatewayForm() {
    this.editable = false;
    this.globalService.backId = "";
    if (this.downloadTemplate.dirty) {
      this.warningFlag = "cancel";
      this.formCancelConfirm();
      // this.modelNotification.alertMessage(this.globalService.messageType_Warning, 'You will not be able to recover the changes!');
    } else {
      this.formCancelConfirm();
    }
  }
  formCancelConfirm() {
    this.router.navigate(['../'], { relativeTo: this.route });
    // this.navigateTemplate.emit('gatewayList');
  }
  // Form reset  confirm
  resetgatewayForm() {
    this.warningFlag = "reset";
    this.modelNotification.alertMessage('Warning', 'You will not be able to recover the changes!');
  }
  formResetConfirm() {
    this.globalService.backId = "";
    this.GatewayIdObj = <Gateway>this.downloadTemplate.value;
    if (this.GatewayIdObj.id === null) {
      // this.editable = false;
      this.downloadTemplate.reset();
      this.registerForm();
    } else {
      this.gatewayTemplates = [],
        this.gatewayModelList = [],
        this.registerForm();
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

  previewGateway() {
    this.globalService.listOfRow = null;
    this.GatewayIdObj = <Gateway>this.downloadTemplate.value;
    this.globalService.listOfRow = this.GatewayIdObj;
    //this.navigateTemplate.emit('gatewayFormPreview');
    this.router.navigate(['../download-template-preview'], { relativeTo: this.route });
    this.registerForm();
  }
  gatewayTypeOnChange($event) {
    if ($event.value) {
      this.gatewayTypeChange($event.itemData.id);
      this.downloadTemplate.controls['gatewayTypeId'].setValue($event.itemData.id);
    }
  }
  gatewayModelOnChange($event) {
    if ($event.value) {
      this.downloadTemplate.controls['gatewayModelId'].setValue($event.itemData.id);
    }
  }
  // nodeTemplateChange($event){
  //   if ($event.value) {
  //     this.downloadTemplate.controls['gatewayTemplateId'].setValue($event.itemData.name);
  //   }
  // }
}
