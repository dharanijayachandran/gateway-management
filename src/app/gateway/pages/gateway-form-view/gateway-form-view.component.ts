import { Component, EventEmitter, HostListener, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { DialogService } from 'src/app/shared/services/dialog/dialog.service';
import { globalSharedService } from 'src/app/shared/services/global/globalSharedService';
import { GatewayModel } from '../../../gateway-model/model/gateway-model';
import { GatewayTemplate } from '../../../gateway-template/model/gatewayTemplate';
import { GatewayType } from '../../../gateway-template/model/gatewayType';
import { Gateway } from '../../model/gateway';
import { GatewayService } from '../../services/gateway/gateway.service';
import { UIModalNotificationPage } from 'global';
import { GlobalGatewayService } from 'src/app/shared/globalGatewayService/global-gateway-service.service';
import { globalShareServices } from 'src/app/shared/globalShareServices';
import { EmitType } from '@syncfusion/ej2-base';
import { FilteringEventArgs } from '@syncfusion/ej2-dropdowns';
import { Query } from '@syncfusion/ej2-data';

@Component({
  selector: 'app-gateway-form-view',
  templateUrl: './gateway-form-view.component.html',
  styleUrls: ['./gateway-form-view.component.css']
})
export class GatewayFormViewComponent implements OnInit {
  // Importing child component to
  @ViewChild(UIModalNotificationPage) modelNotification;
  gatewayTemplateByGatewayTypeId: Map<number, GatewayTemplate[]>;
  gatewayModelByGatewayTypeId: Map<number, GatewayModel[]>;
  gatewayTemplate: any = []

  // It help to if there are no pending changes, just allow deactivation; else confirm first code starts here
  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    if (this.gatewayForm.dirty) {
      //let abc=this.dialogService.alertMessage('Warning', 'You will not be able to recover the changes!');
      // returning false will show a confirm dialog before navigating away
      if (this.validateNodeIdentifier) {
        this.dialogService.swalWarning('You will not be able to recover the changes!', this.gatewayForm.controls["nodeIdentifier"].value);
      }
      else {
        this.dialogService.alertMessage('Warning', 'You will not be able to recover the changes!');
      }
    } else {
      return true; // returning true will navigate without confirmation
    }
    return this.dialogService.navigateAwaySelection$;
  }
  // It help to if there are no pending changes, just allow deactivation; else confirm first code ends here

  gatewayList: Gateway[];
  existingGatewayIdentifier: String;
  GatewayId: any;
  addEditText: string;
  private Gateway: Gateway = new Gateway();
  gatewayForm: FormGroup;
  nodeTemplateList: GatewayTemplate[];
  gatewayModelList: GatewayModel[];
  gatewayTypeList: GatewayType[];
  gatewayTemplates: GatewayTemplate[];
  responseData: Gateway;
  restData: any;
  warningFlag: string;
  editable = false;
  autoGeneratedNodeIdentifier: String;
  nodeIdentifierDisabled = true;
  validateNodeIdentifier = true;
  disableReviewAndSave = false;
  checkNodeIdentifier = false;
  checkAvailability = "Check Availability"

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
 // filtering event handler to filter a Menu Icon Name
  //pass the filter data source, filter query to updateData method.
  public onFilteringGatewayType: EmitType<FilteringEventArgs> = (e: FilteringEventArgs) => {
    this.filterData(e,this.gatewayTypeList);
  }

  public onFilteringGatewayModel: EmitType<FilteringEventArgs> = (e: FilteringEventArgs) => {
    this.filterData(e,this.gatewayModelList);
  }
  public onFilteringGatewayTemplates: EmitType<FilteringEventArgs> = (e: FilteringEventArgs) => {
    this.filterData(e,this.gatewayTemplates);
  }
  filterData(e: FilteringEventArgs, filterData) {
    let query: Query = new Query();
    //frame the query based on search string with filter type.
    query = (e.text !== '') ? query.where('name', 'contains', e.text, true) : query;
    e.updateData(filterData, query);
  }

  public sortDropDown:string ='Ascending';
  nodeTemplateId:any;
  gatewayModelId:any;
  gatewayTypeId:any;
  // set the placeholder to DropDownList input element
  public gatewayTypeWaterMark: string = 'Select Gateway Type';
  public gatewayModelWaterMark: string = 'Select Gateway Model';
  public gatewayTemplateWaterMark: string = 'Select Gateway Template';
  public filterPlaceholder:string='Search';
 // set the height of the popup element
 public height: string = '220px';
 public locale: string;
 gatewayTypeChangeId:boolean;
 gatewaytypeChangeValue:number;

  constructor(private globalService: globalSharedService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private gatewayService: GatewayService,
    private globalGatewayService: GlobalGatewayService,
    private globalServiceloc: globalShareServices,
    private dialogService: DialogService, private globalShareSevice: globalSharedService) { }

  ngOnInit() {
    sessionStorage.setItem("nodeIdentifierCleared", "false");
    this.registerForm();
    this.gatewayTypes();
    this.GatewayId = this.globalServiceloc.assignId;
    this.gatewayList = this.globalService.listOfRow;
    if (this.GatewayId == null || this.GatewayId == undefined) {
      this.addEditText = "Add";
      if (null != this.globalService.listOfRow) {
        this.globalService.listOfRow.id = null;
      }
      if (this.globalServiceloc.globalObject != null) {
        this.addEditText = "Add";
        this.editGateway(this.globalServiceloc.globalObject);
      }
      this.globalServiceloc.globalObject = null;
    } else if (this.GatewayId != null) {
      this.addEditText = "Edit";
      this.editGateway(this.globalServiceloc.globalObject);
      this.restData = this.globalServiceloc.globalObject
      this.globalServiceloc.globalObject = null;
    }

  }

  // register the form
  registerForm() {
    this.gatewayForm = this.formBuilder.group({
      id: [null],
      isTemplate: [],
      fromTemplate: ['T'],
      gatewayTypeId: [null, [
        Validators.required
      ]],
      gatewayTypeName: [null],
      gatewayModelId: [null],
      gatewayModelName: [null],
      nodeTemplateId: [null, [
        Validators.required
      ]],
      nodeTemplateName: [null],
      name: [null, [
        Validators.required,
        Validators.pattern(this.globalService.getNamePatternForGatewayandAsset())]
      ],
      nodeIdentifier: [null, Validators.pattern("^[a-zA-Z0-9][ a-zA-Z0-9.:#@*&_-]*")],
      gatewayIdentifierFlag: ['AG'],
      description: [null],
      authToken: [null]
    })
    if (this.gatewayForm.get('gatewayIdentifierFlag').value == "AG") {
      this.disableReviewAndSave = true;
    }
    else {
      this.disableReviewAndSave = false;
    }
    this.gatewayForm.controls['nodeIdentifier'].valueChanges.subscribe(data => {
      if (!data || (typeof data === 'string' && data.length == 0)) {
        this.validateNodeIdentifier = true;
      }
      else {
        this.validateNodeIdentifier = false;
        if (this.gatewayForm.get('gatewayIdentifierFlag').value == "UP") {
          sessionStorage.setItem("gatewayIdentifier",data);
          this.disableReviewAndSave = false;
          this.checkAvailability = "Check Availability"
        }
        this.gatewayForm.controls["nodeIdentifier"].setValidators([Validators.required, Validators.pattern("^[a-zA-Z0-9][ a-zA-Z0-9.:#@*&_-]*")]);
      }
    });
  }

  // This method is used to remove the trailing and leading spaces
  public noWhitespace(control: FormControl) {
    let isWhitespace = (control.value || '').trim().length === 0;
    let isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true }
  }

  editGateway(editGatway) {
    this.responseData = editGatway;
    if (editGatway.gatewayTypeId != null) {
      this.getGatewayModelsByGatewayTypeId(editGatway.gatewayTypeId);
    }
    else {
      this.patchFormData();
    }
  }

  // This method is used to patch the data to form
  patchFormData() {
    if (this.responseData.isGatewayIdentifierProvided == true) {
      this.responseData.gatewayIdentifierFlag = "UP";
      this.globalServiceloc.setPreviousNodeIdentifier(this.responseData.nodeIdentifier);
    }
    else {
      this.responseData.gatewayIdentifierFlag = "AG";
    }
    this.autoGeneratedNodeIdentifier = this.responseData.nodeIdentifier;
    this.existingGatewayIdentifier = this.responseData.nodeIdentifier;
    if (this.existingGatewayIdentifier == null) {
      this.existingGatewayIdentifier = this.globalServiceloc.nodeIdentifier;
    }
    this.bindingRadioButton(this.responseData.gatewayIdentifierFlag);
    this.gatewayForm.patchValue({
      id: this.responseData.id,
      isTemplate: this.responseData.isTemplate,
      fromTemplate: this.isFromTemplate(this.responseData.nodeTemplateId),
      gatewayTypeId: this.responseData.gatewayTypeId,
      gatewayTypeName: this.responseData.gatewayTypeName,
      gatewayModelId: this.responseData.gatewayModelId,
      gatewayModelName: this.responseData.gatewayModelName,
      nodeTemplateId: this.responseData.nodeTemplateId,
      nodeTemplateName: this.responseData.gatewayTemplateName,
      name: this.responseData.name,
      gatewayIdentifierFlag: this.responseData.gatewayIdentifierFlag,
      nodeIdentifier: this.responseData.nodeIdentifier,
      description: this.responseData.description,
      authToken: this.responseData.authToken
    })
    if(this.gatewayTypeChangeId == true){
      this.gatewayForm.patchValue({
        gatewayTypeId:this.gatewaytypeChangeValue
      })
    }

    this.gatewayTypeChangeId = false;
  }

  isFromTemplate(nodeTemplateId: number): any {
    if (nodeTemplateId != null) {
      return 'T';
    }
    else {
      return 'NT';
    }
  }

  // This method is used to assign the form data to model object.
  @Output() navigateTemplate = new EventEmitter();
  previewGateway() {
    this.globalService.listOfRow = null;
    if (this.addEditText == "Add") {
      if (this.gatewayForm.get('gatewayIdentifierFlag').value == "UP") {
        this.gatewayForm.controls["nodeIdentifier"].value.trim();
      }
      else {
        this.gatewayForm.controls["nodeIdentifier"].setValue(null);
      }
    } else {
      if (this.responseData.gatewayIdentifierFlag == "UP") {
        if (this.gatewayForm.get('gatewayIdentifierFlag').value == "UP") {
          this.gatewayForm.controls["nodeIdentifier"].value.trim();
        }
        else {
          this.gatewayForm.controls["nodeIdentifier"].setValue(null);
        }
      }
      else {
        if (this.gatewayForm.controls["nodeIdentifier"].value) {
          this.gatewayForm.controls["nodeIdentifier"].value.trim();
        }
        else {
          this.gatewayForm.controls["nodeIdentifier"].setValue(null);
        }
      }
    }
    this.Gateway = <Gateway>this.gatewayForm.value;
    if (this.Gateway.gatewayIdentifierFlag == "AG") {
      this.Gateway.isGatewayIdentifierProvided = false;
    }
    else {
      this.Gateway.isGatewayIdentifierProvided = true;
    }
    this.globalService.listOfRow = this.Gateway;
    this.router.navigate(['../gateway-preview'], { relativeTo: this.route });
    this.registerForm();
  }


  // This method is used to cancel the form.
  cancelGatewayForm() {
    this.editable = false;
    this.globalService.backId = "";
    if (this.gatewayForm.dirty) {
      this.warningFlag = "cancel";
      this.formCancelConfirm();
    } else {
      this.formCancelConfirm();
    }
  }
  formCancelConfirm() {
    this.Gateway = <Gateway>this.gatewayForm.value;
    this.removeGatewayIdentifier(this.Gateway.nodeIdentifier);
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  // This method is used to reset the form.
  formResetConfirm() {
    this.globalService.backId = "";
    this.Gateway = <Gateway>this.gatewayForm.value;
    this.removeGatewayIdentifier(this.Gateway.nodeIdentifier);
    if (this.Gateway.id === null) {
      this.nodeIdentifierDisabled = true;
      this.checkNodeIdentifier=false;
      this.gatewayForm.reset();
      this.registerForm();
    } else {
      this.registerForm();
      this.editGateway(this.restData);
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

  // Form reset  confirm
  resetgatewayForm() {
    this.warningFlag = "reset";
    this.modelNotification.alertMessage('Warning', 'You will not be able to recover the changes!');
  }


  // Dropdown change gateway Type
  gatewayTypeChange($event) {
    let organizationId = sessionStorage.getItem('beId');

    if ($event.itemData.id === '0: null') {
      this.gatewayTemplates = [];
      this.nodeTemplateList = [];
      this.gatewayModelList = [];
      this.gatewayForm.controls['nodeTemplateId'].setValue(null);
    }
    else {
      this.gatewayTemplates = [];
      this.nodeTemplateList = [];
      this.gatewayTypeChangeId = true;
      this.gatewaytypeChangeValue = $event.itemData.id;
      this.gatewayForm.controls['gatewayModelId'].setValue(null);
      this.gatewayForm.controls['gatewayModelName'].setValue(null);
      this.gatewayForm.controls['nodeTemplateId'].setValue(null);
      this.gatewayForm.controls['nodeTemplateName'].setValue(null);
      this.gatewayForm.controls['nodeTemplateName'].setValue("");
      this.gatewayForm.controls['gatewayTypeName'].setValue($event.itemData.name);
      this.gatewayForm.controls['gatewayTypeId'].setValue($event.itemData.id);
      this.getGatewayModelsByGatewayTypeId($event.itemData.id);
    }
    this.getGatewayTemplatesByTypeIdAndBEId($event.itemData.id, organizationId);
    this.gatewayTypeChangeId = false;
  }
  getGatewayTemplatesByTypeIdAndBEId(id: any, organizationId: string) {
    this.gatewayTemplate = [];

    this.gatewayService.getGatewayTemplatesByTypeIdAndBEId(id, organizationId).subscribe((res) => {
      this.gatewayTemplate = this.getApplicationsToConsumerDropDown(res);
      this.gatewayForm.patchValue({
        nodeTemplateId:this.gatewayForm.value.nodeTemplateId,
        nodeTemplateName:this.gatewayForm.value.nodeTemplateName
      })
  });
  }

  getApplicationsToConsumerDropDown(res) {
    return this.getDataList(res);
  }

  getDataList(data) {
    if (data != null) {
      return data.map(function (l) {
        return {
          name: l.name,
          id: l.id,
        };
      });
    }
  }

  // Dropdown change gateway Model
  gatewayModelChange($event) {
    // To set node Template ID and Name null
    this.gatewayForm.controls['nodeTemplateId'].setValue(null);
    this.gatewayForm.controls['nodeTemplateName'].setValue(null);
    if($event.value){
      this.gatewayForm.controls['gatewayModelName'].setValue($event.itemData.name);
      this.gatewayTemplatesByGatewayTypeAndModelId($event.itemData.id);
    }else{
      this.gatewayForm.controls['gatewayModelName'].setValue("");
      this.gatewayForm.controls['gatewayModelId'].setValue(null);
      this.getGatewayModelsByGatewayTypeId(this.gatewayForm.controls['gatewayTypeId'].value);
    }

  }

  // Dropdown change node Template
  nodeTemplateChange($event) {
    if($event.item != null) {
      this.gatewayForm.controls['nodeTemplateName'].setValue($event.itemData.name);
      this.gatewayForm.controls['nodeTemplateId'].setValue($event.itemData.id);
    }
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


  //get gateway Model list
  getGatewayModelsByGatewayTypeId(gatewayTypeId) {
    this.gatewayTemplates = [];
    this.gatewayModelByGatewayTypeId= this.globalServiceloc.gatewayModelByGatewayTypeId;
    this.gatewayModelList= this.gatewayModelByGatewayTypeId.get(gatewayTypeId);
    this.gatewayTemplateByGatewayTypeId=this.globalServiceloc.gatewayTemplateByGatewayTypeId;
    this.nodeTemplateList=this.gatewayTemplateByGatewayTypeId.get(gatewayTypeId);
    this.gatewayTemplates = this.nodeTemplateList;

    if (this.responseData != null) {
      this.patchFormData();
    }
    if(!this.gatewayModelList){
      this.globalGatewayService.getGatewayModelsByGatewayTypeId(gatewayTypeId).subscribe((res) => {
        this.gatewayModelList = [];
        this.gatewayModelList = res;
        this.gatewayModelList= this.globalServiceloc.addSelectIntoList(this.gatewayModelList);
        if(!this.nodeTemplateList){
          this.gatewayTemplatesByGatewayTypeId(gatewayTypeId);
        }
      },
        (error: any) => {
          // If the service is not available
          this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
        }
      );
    }

  }

  // get nodeTemplate list
  gatewayTemplatesByGatewayTypeId(gatewayTypeId) {
    let organizationId = sessionStorage.getItem('beId');
    this.gatewayTemplates = [];
    this.gatewayService.getGatewayTemplatesByTypeIdAndBEId(gatewayTypeId, organizationId).subscribe((res) => {

      res.forEach(template => {
        if (template.gatewayModel === null) {
          template.gatewayModel = new GatewayModel();
        }
      })
      this.nodeTemplateList = res;
      this.gatewayTemplates = res;
      if (this.responseData != null) {
        this.patchFormData();
      }
    },
      (error: any) => {
        // If the service is not available
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      }
    );
  }

  gatewayTemplatesByGatewayTypeAndModelId(gatewayModelId) {
    if (gatewayModelId === 'null') {
      this.gatewayTemplates = this.nodeTemplateList;
    }
    else {
      this.gatewayTemplates = this.nodeTemplateList.filter(template => template.gatewayModel?.id === parseInt(gatewayModelId));
    }

    this.gatewayForm.controls['nodeTemplateId'].markAsDirty();
  }

  onKey(event: any) {
    let isDH = this.globalService.doubleHyphen(event);
    if (isDH) {
      this.gatewayForm.get('name').setErrors({
        pattern: true
      });
    }
  }

  handleChange(event) {
    this.bindingRadioButton(event.value);
  }
  bindingRadioButton(value) {
    if (this.addEditText == "Add") {
      if (value == "UP") {
        this.nodeIdentifierDisabled = false;
        this.enableNodeIdentifier(value);
      }
      else {
        this.clearValidators();
      }
    }
    else {
      this.nodeIdentifierDisabled = false;
      this.enableNodeIdentifier(value);
    }
  }

  enableNodeIdentifier(value) {
    if (value == "AG") {
      if (this.responseData.gatewayIdentifierFlag == "AG") {
        this.gatewayForm.clearValidators();
        this.gatewayForm.controls["nodeIdentifier"].setValidators([]);
        this.editable = false;
        if (this.autoGeneratedNodeIdentifier == null) {
          this.clearValidators();
        }
        else {
          this.gatewayForm.patchValue({
            nodeIdentifier: this.autoGeneratedNodeIdentifier
          });
        }
        this.disableReviewAndSave = true
      }
      else {
        this.clearValidators();
      }
    }
    else {
      this.autoGeneratedNodeIdentifier = null;
      this.editable = true;
      this.disableReviewAndSave = false;
      if (this.addEditText == "Add") {
        this.gatewayForm.patchValue({
          nodeIdentifier: null
        });
      }
      else {
        if (this.responseData.nodeIdentifier == null) {
          this.responseData.nodeIdentifier = this.globalServiceloc.nodeIdentifier;
        }
        this.gatewayForm.patchValue({
          nodeIdentifier: this.responseData.nodeIdentifier
        });
      }
    }
  }

  validateIdentifier() {
    let gatewayIdentifier = this.gatewayForm.get('nodeIdentifier').value;
    if (gatewayIdentifier) {
      gatewayIdentifier = gatewayIdentifier.trim();
    }
    if (this.existingGatewayIdentifier != gatewayIdentifier) {
      this.gatewayService.checkAvailability(gatewayIdentifier)
        .subscribe(
          res => {
            if (res == true) {
              this.disableReviewAndSave = false
              this.checkNodeIdentifier = true;
              this.validateNodeIdentifier = true;
            }
            else {
              this.disableReviewAndSave = true;
              this.checkNodeIdentifier = false;
              this.validateNodeIdentifier = true;
              this.checkAvailability = "Gateway identifier is available"
            }
          });
    }
    else {
      this.disableReviewAndSave = true;
      this.checkNodeIdentifier = false;
      this.validateNodeIdentifier = true;
      this.checkAvailability = "Gateway identifier is available"
    }
  }

  checkGatewayIdentifierValidation() {
    this.checkNodeIdentifier = false;
  }

  // confirmDelete
  removeGatewayIdentifier(gatewayIdentifier) {
    this.gatewayService.clearGatewayIdentifier(gatewayIdentifier).subscribe(res => {
    },
      (error: any) => {
      }
    );
  }
  clearValidators() {
    this.gatewayForm.clearValidators();
    this.gatewayForm.controls['nodeIdentifier'].reset();
    this.gatewayForm.controls["nodeIdentifier"].setValidators(null);
    this.gatewayForm.get('nodeIdentifier').updateValueAndValidity();
    this.gatewayForm.controls["nodeIdentifier"].setValidators([]);
    this.nodeIdentifierDisabled = true;
    this.disableReviewAndSave = true
  }
  gatewayTypeOnChange($event){
    this.gatewayTemplates = [];
    if ($event.value) {
       this.gatewayTypeChange($event.itemData.id);
      this.gatewayForm.controls['gatewayTypeId'].setValue($event.itemData.id);
    }else{
      this.gatewayForm.controls['gatewayTypeId'].setValue(null);
    }
  }
  gatewayModelOnChange($event){
    if ($event.value) {
      this.gatewayForm.controls['gatewayModelId'].setValue($event.itemData.id);
    }
  }
  timeZoneOnChange($event){
    if ($event.value) {
      this.gatewayForm.controls['nodeTemplateId'].setValue($event.itemData.name);
    }
  }
}