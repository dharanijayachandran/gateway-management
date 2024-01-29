import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmitType } from '@syncfusion/ej2-base';
import { Query } from '@syncfusion/ej2-data';
import { FilteringEventArgs } from '@syncfusion/ej2-dropdowns';
import { UIModalNotificationPage } from 'global';
import { Observable } from 'rxjs';
import { CommonUnitService } from 'src/app/shared/common-unit.service';
import { globalShareServices } from 'src/app/shared/globalShareServices';
import { DialogService } from 'src/app/shared/services/dialog/dialog.service';
import { globalSharedService } from 'src/app/shared/services/global/globalSharedService';
import { GatewayTemplateIOTag } from '../../model/gateway-template-io-tag';
import { GatewayTemplateIoTagService } from '../../services/gatewayTemplateIOTag/gateway-template-io-tag.service';
@Component({
  selector: 'app-gateway-template-io-tag-form',
  templateUrl: './gateway-template-io-tag-form.component.html',
  styleUrls: ['./gateway-template-io-tag-form.component.css']
})
export class GatewayTemplateIoTagFormComponent implements OnInit {

  // It help to if there are no pending changes, just allow deactivation; else confirm first code starts here
  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    if (this.hasOwnProperty('gatewayTemplateIOTagForm')) {
      if (this.gatewayTemplateIOTagForm.dirty) {
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

  IOTagFormView;
  IOTagReadModeView = false;
  dataTypes: any[];
  standardIOTags: any[];
  tagTypes: any[];
  engUnits: any[];
  gatewayTemplateId: number;
  gatewayTemplateIOTagForm: FormGroup;
   gatewayTemplateIOTag: GatewayTemplateIOTag = new GatewayTemplateIOTag();
  tagIOModes: any[];
  warningFlag: string;
  showLoaderImage = false;
  gatewayTemplateName: any;

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

  constructor(private gatewayTemplateIOTagService: GatewayTemplateIoTagService,
    private globalSharedService: globalShareServices,
    private commonUnitService: CommonUnitService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
    private globalService: globalSharedService,
    private dialogService: DialogService) { }

  ngOnInit() {
    this.gatewayTemplateName = this.globalSharedService.parenetName;
    this.getDataTypes();
    this.getTagTypes();
    this.getTagIOMode();
    this.getStandardIOTag();
    this.getEngineeringUnit();
    let id = Number(this.globalSharedService.assignId);
    let operation = this.globalSharedService.name;
    if (id != 0 && operation === 'Edit') {
      this.gatewayTemplateId = this.globalSharedService.assigngatewayTemplateIdId;
      this.IOTagFormValidation();
      this.getGatewayTemplateIOTagByTemplateIOTagId(id);
      this.IOTagFormView = true;
      this.IOTagReadModeView = false;
    } else {
      this.gatewayTemplateId = this.globalSharedService.assignId;
      this.IOTagFormValidation();
      this.IOTagFormView = true;
      this.IOTagReadModeView = false;
    }
  }
  IOTagFormValidation() {
    this.gatewayTemplateIOTagForm = this.formBuilder.group({
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
    this.commonUnitService.getDataTypes()
      .subscribe(
        res => {
          this.dataTypes = res as any[];
        },
        error => {
          this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
        });
  }

  getTagTypes(): void {
    this.commonUnitService.getTagTypes()
      .subscribe(
        res => {
          this.tagTypes = res as any[];
        },
        error => {
          this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
        });
  }
  getTagIOMode(): void {
    this.commonUnitService.getTagIOMode()
      .subscribe(
        res => {
          this.tagIOModes = res as any[];
        },
        error => {
          this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
        });
  }

  getStandardIOTag(): void {
    this.commonUnitService.getStandardIOTags()
      .subscribe(
        res => {
          this.standardIOTags = res as any[];
          this.standardIOTags= this.globalSharedService.addSelectIntoList(this.standardIOTags);
        },
        error => {
          this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
        });
  }

  // To get all Unit Id list for drop down
  getEngineeringUnit(): void {
    this.commonUnitService.getEnggUnits()
      .subscribe(
        res => {
          this.engUnits = res as any[];
          this.engUnits= this.globalSharedService.addSelectIntoList(this.engUnits);
        },
        error => {
          this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
        });
  }

  createOrUpdateGatewayTemplateIOTag(): void {
    this.showLoaderImage = true;
    this.gatewayTemplateIOTag = <GatewayTemplateIOTag>this.gatewayTemplateIOTagForm.value;
    let userId = +sessionStorage.getItem('userId');
    this.gatewayTemplateIOTag.nodeId = this.globalService.id;
    if (this.gatewayTemplateIOTag.id === null) {
      this.gatewayTemplateIOTag.created_by = userId;
      this.gatewayTemplateIOTagService.addGatewayTemplateIOTag(this.gatewayTemplateIOTag).subscribe((res) => {
        this.IOTagFormValidation();
        this.showLoaderImage = false;
        // response handling
        this.modelNotification.alertMessage(res['messageType'], res['message']);
      },
        (error: any) => {
          this.showLoaderImage = false;
          this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
        }
      );
    }
    else {
      this.gatewayTemplateIOTag.updated_by = userId;
      this.gatewayTemplateIOTagService.updateGatewayTemplateIOTag(this.gatewayTemplateIOTag).subscribe((res) => {
        this.IOTagFormValidation();
        this.showLoaderImage = false;
        // response handling
        this.modelNotification.alertMessage(res['messageType'], res['message']);
      },
        (error: any) => {
          this.showLoaderImage = false;
          // If the service is not available
          this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
        }
      );
    }
  }

  // redirectTo
  redirectTo() {
    this.router.navigate(['../'], { relativeTo: this.route });
    this.IOTagFormView = false;
    this.globalSharedService.GettingId(this.gatewayTemplateId);
    this.globalSharedService.GettingString('IOTag');
  }
  getGatewayTemplateIOTagByTemplateIOTagId(id: number) {
    this.gatewayTemplateIOTagService.getGatewayTemplateIOTagByIOTagId(id)
      .subscribe(data => {
        this.gatewayTemplateIOTagForm.patchValue({
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
      });
  }

  createIOTag(): void {
    this.IOTagFormView = false;
    this.IOTagReadModeView = true;
    this.gatewayTemplateIOTag = <GatewayTemplateIOTag>this.gatewayTemplateIOTagForm.value;
  }
  resetIOTagForm() {
    this.modelNotification.alertMessage(this.globalService.messageType_Warning, 'You will not be able to recover the changes!');
  }


  // Form reset  confirm
  formResetConfirm() {
    this.gatewayTemplateIOTag = <GatewayTemplateIOTag>this.gatewayTemplateIOTagForm.value;
    if (this.gatewayTemplateIOTag.id === null) {
      this.IOTagFormValidation();
    }
    else {
      this.IOTagFormValidation();
      this.getGatewayTemplateIOTagByTemplateIOTagId(this.gatewayTemplateIOTag.id);
    }
  }


  backButton(elementId) {

    this.IOTagFormView = true;
    this.IOTagReadModeView = false;
    window.scrollTo(0, 0);
    setTimeout(() => {
      if (elementId) {
        let item = document.getElementById(elementId);
        window.scrollBy({ top: item.offsetTop, behavior: 'smooth' })
      }
    });

  }
  cancelGatewayTemplateIOTagForm(event: Event) {
    this.formCancelConfirm();
  }

  // Confirm redirect to
  formCancelConfirm() {
    this.globalSharedService.GettingId(this.gatewayTemplateId);
    this.globalSharedService.GettingString('IOTag');
    this.globalSharedService.gettingName(this.gatewayTemplateName);
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  parseInt(id) {
    return parseInt(id);
  }
  onKey(event: any) {
    let isDH = this.globalService.doubleHyphen(event);
    if (isDH) {
      this.gatewayTemplateIOTagForm.get('name').setErrors({
        pattern: true
      });
    }
  }

  dataTypeOnChange($event){
    if ($event.value) {
      this.gatewayTemplateIOTagForm.controls['dataTypeId'].setValue($event.itemData.id);
    }
  }
  standardIOTagOnChange($event){
    if ($event.value) {
      this.gatewayTemplateIOTagForm.controls['dataProtocolStandardTagId'].setValue($event.itemData.id);
    }else{
      this.gatewayTemplateIOTagForm.controls['dataProtocolStandardTagId'].setValue(null);
    }
  }
  engUnitOnChange($event){
    if ($event.value) {
      this.gatewayTemplateIOTagForm.controls['engUnitId'].setValue($event.itemData.id);
    }else{
      this.gatewayTemplateIOTagForm.controls['engUnitId'].setValue(null);
    }
  }
}
