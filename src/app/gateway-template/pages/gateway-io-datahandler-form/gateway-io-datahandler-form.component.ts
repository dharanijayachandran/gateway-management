import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GatewayIODataHandler } from '../../model/gatewayIODataHandler';
import { DataProtocolFormat } from '../../model/DataProtocolFormat';
import { GatewayTemplate } from '../../model/gatewayTemplate';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { GatewayIoDhService } from '../../services/gatewayIODataHandler/gateway-io-dh.service';
import { GatewayCommProtocol } from '../../model/communication';
import { CommunicationService } from '../../services/communication/communication.service';
import { globalSharedService } from 'src/app/shared/services/global/globalSharedService';
import { Observable } from 'rxjs';
import { DialogService } from 'src/app/shared/services/dialog/dialog.service';
import { UIModalNotificationPage } from 'global';
import { globalShareServices } from 'src/app/shared/globalShareServices';
import { EmitType } from '@syncfusion/ej2-base';
import { FilteringEventArgs } from '@syncfusion/ej2-dropdowns';
import { Query } from '@syncfusion/ej2-data';
@Component({
  selector: 'app-gateway-io-datahandler-form',
  templateUrl: './gateway-io-datahandler-form.component.html',
  styleUrls: ['./gateway-io-datahandler-form.component.css']
})
export class GatewayIODatahandlerFormComponent implements OnInit {
  showLoaderImage: boolean;

  // It help to if there are no pending changes, just allow deactivation; else confirm first code starts here
  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    if(this.hasOwnProperty('gatewayIODHForm')){
      if (this.gatewayIODHForm.dirty) {
        this.dialogService.alertMessage(this.globalService.messageType_Warning, 'You will not be able to recover the changes!');
        // returning false will show a confirm dialog before navigating away
      } else {
        return true; // returning true will navigate without confirmation
      }
      return this.dialogService.navigateAwaySelection$;
    }else return true;
  }
  // It help to if there are no pending changes, just allow deactivation; else confirm first code ends here

  // Importing child component to
  @ViewChild(UIModalNotificationPage) modelNotification;

  gatewayIODHFormView = true;
  gatewayIODHReadModeView = false;
  gatewayIODHViewMode = true;
  gatewayIODHForm: FormGroup;
  gatewayIODataHandler: GatewayIODataHandler = new GatewayIODataHandler();
  dataProtocolFormats: DataProtocolFormat[];
  selectedValue: any;
  gatewayTemplateData: GatewayTemplate;
  gatewayCommProtocol: GatewayCommProtocol;
  templateName: string;
  communication: string;
  warningFlag: string;

  public dataProtocolFormatsFields: Object = {
    text: 'name',
    value: 'id'
  };
  public onFilteringDataProtocolFormats: EmitType<FilteringEventArgs> = (e: FilteringEventArgs) => {
    this.filterData(e,this.dataProtocolFormats);
  }
  filterData(e: FilteringEventArgs, filterData) {
    let query: Query = new Query();
    //frame the query based on search string with filter type.
    query = (e.text !== '') ? query.where('name', 'contains', e.text, true) : query;
    e.updateData(filterData, query);
  }
  public sortDropDown:string ='Ascending';
  responseFormatId:any;
  public dataProtocolFormatsWaterMark: string = 'Select Data Format';
  public filterPlaceholder: string = 'Search';
  // set the height of the popup element
  public height: string = '200px';
  public locale: string;

  constructor(private globalService: globalSharedService, private commService: CommunicationService, private globalSharedService: globalShareServices, private gatewayIODHService: GatewayIoDhService, private formBuilder: FormBuilder, private http: HttpClient, private router: Router, private route: ActivatedRoute, private dialogService: DialogService) { }

  ngOnInit() {
    this.getDataProtocolFormats();
    this.gatewayCommProtocol = this.commService.gatewayCommProtocol;
    this.templateName = this.gatewayCommProtocol.gateway.name;
    this.communication = this.gatewayCommProtocol.commProtocol.name;
    let id = this.globalSharedService.assignId;
    let operation = this.globalSharedService.name;
    if (id != null && operation === 'view') {
      this.getGatewayIODataHandlerByIdForView(id);
      this.gatewayIODHFormView = false;
      this.gatewayIODHReadModeView = false;
      this.gatewayIODHViewMode = true;
    }
    else if (id != null && operation === 'edit') {
      this.gatewayIODHFormValidation();
      this.getGatewayIODataHandlerByIdForEdit(id);
      this.gatewayIODHFormView = true;
      this.gatewayIODHReadModeView = false;
      this.gatewayIODHViewMode = false;
    }
    else {
      this.gatewayIODHFormValidation();
      this.gatewayIODHFormView = true;
      this.gatewayIODHReadModeView = false;
      this.gatewayIODHViewMode = false;
    }
  }

  gatewayIODHFormValidation() {
    this.gatewayIODHForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.pattern(this.globalService.getNamePatternForGatewayandAsset())]],
      dhCode: [null, [Validators.required]],
      description: [null],
      operationMode: [null, [Validators.required]],
      publishIntervalMs: [null],
      retryCount: [null],
      retryTimeoutMs: [null],
      sendResponse: [null],
      responseFormat: [null],
      responseFormatId: [null],
      responseTagSeperator: [null],
      status: ['Active'],
      isEndValidatorCheckEnabled: this.gatewayCommProtocol.isEndValidatorCheckEnabled,
      isStartValidatorCheckEnabled: this.gatewayCommProtocol.isStartValidatorCheckEnabled,
      isErrorCheckEnabled: this.gatewayCommProtocol.isErrorCheckEnabled,
      isLengthCheckEnabled: this.gatewayCommProtocol.isLengthCheckEnabled
    });
  }

  getDataProtocolFormats() {
    this.gatewayIODHService.getDataProtocolFormats().subscribe(res => {
      this.dataProtocolFormats = res;
      this.dataProtocolFormats= this.globalSharedService.addSelectIntoList(this.dataProtocolFormats);
    },
      error => {
        this.modelNotification.alertMessage(this.globalService.messageType_Warning, error);
      })
  }

  cancelGatewayIODHForm(event: Event) {
    this.gatewayIODHForm.reset();
    this.globalSharedService.GettingId(this.gatewayCommProtocol.gateway.id);
    this.globalSharedService.GettingString('communication');
  }

  //Review and Save method
  createGatewayIODataHandler(): void {
    this.gatewayIODHFormView = false;
    this.gatewayIODHReadModeView = true;
    this.gatewayIODataHandler = <GatewayIODataHandler>this.gatewayIODHForm.value;
  }

  // back Button
  backButton(elementId) {
    this.gatewayIODHFormView = true;
    this.gatewayIODHReadModeView = false;
    window.scrollTo(0, 0);
    setTimeout(() => {
      if (elementId) {
        let item = document.getElementById(elementId);
        window.scrollBy({ top: item.offsetTop, behavior: 'smooth' })
      }
    });
  }

  createOrUpdateGatewayIODataHandler(): void {
    this.showLoaderImage=true;
    let userId = sessionStorage.getItem('userId');
    if (this.gatewayIODataHandler.id === null) {
      this.gatewayIODataHandler.createdBy = parseInt(userId);
      this.gatewayIODataHandler.nodeCommProtocolId = this.gatewayCommProtocol.id;
      this.gatewayIODHService.addGatewayIODataHndler(this.gatewayIODataHandler).subscribe((res) => {
        this.showLoaderImage=false;
        this.globalSharedService.GettingId(this.gatewayCommProtocol.gateway.id);
        this.globalSharedService.GettingString('communication');
        // response handling
        this.modelNotification.alertMessage(res['messageType'], res['message']);
      },
        (error: any) => {
          this.showLoaderImage=false;
          this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
        }
      );
    }
    else {
      this.gatewayIODataHandler.updatedBy = parseInt(userId);
      this.gatewayIODataHandler.nodeCommProtocolId = this.gatewayCommProtocol.id;
      this.gatewayIODHService.updateGatewayIODataHndler(this.gatewayIODataHandler).subscribe((res) => {
        this.showLoaderImage=false;
        this.globalSharedService.GettingId(this.gatewayCommProtocol.gateway.id);
        this.globalSharedService.GettingString('communication');
        // response handling
        this.modelNotification.alertMessage(res['messageType'], res['message']);
      },
        (error: any) => {
          this.showLoaderImage=false;
          this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
        }
      );
    }
  }

  // Redirect to
  redirectTo() {
    this.router.navigate(['../'],{relativeTo:this.route});
    this.gatewayIODHForm.reset();
  }

  parseInt(id) {
    return parseInt(id);
  }

  cancelGatewayIODHView() {
    this.globalSharedService.GettingId(this.gatewayCommProtocol.gateway.id);
    this.globalSharedService.GettingString('communication');
    this.router.navigate(['../'],{relativeTo:this.route});
  }

  getGatewayIODataHandlerByIdForView(id) {
    this.gatewayIODHService.getGatewayIODataHandlerById(id)
      .subscribe(data => {
        this.gatewayIODataHandler = data;
        if (data.status === 'A') {
          this.gatewayIODataHandler.status = 'Active';
        }
      });
  }

  getGatewayIODataHandlerByIdForEdit(id) {
    this.gatewayIODHService.getGatewayIODataHandlerById(id)
      .subscribe(data => {
        let formatId = null;
        if (null != data.responseFormat) {
          formatId = data.responseFormat.id
        }
        if (data.status === 'A') {
          data.status = 'Active'
        }
        else {
          data.status = 'In_Active'
        }
        this.gatewayIODHForm.patchValue({
          id: data.id,
          name: data.name,
          dhCode: data.dhCode,
          description: data.description,
          operationMode: data.operationMode,
          publishIntervalMs: data.publishIntervalMs,
          retryCount: data.retryCount,
          retryTimeoutMs: data.retryTimeoutMs,
          sendResponse: data.sendResponse,
          responseFormatId: formatId,
          responseTagSeperator: data.responseTagSeperator,
          status: data.status,
          isEndValidatorCheckEnabled: data.isEndValidatorCheckEnabled,
          isStartValidatorCheckEnabled: data.isStartValidatorCheckEnabled,
          isErrorCheckEnabled: data.isErrorCheckEnabled,
          isLengthCheckEnabled: data.isLengthCheckEnabled
        })
      });
  }
  onKey(event: any) {
    let isDH = this.globalService.doubleHyphen(event);
    if (isDH) {
      this.gatewayIODHForm.get('name').setErrors({
        pattern: true
      });
    }
  }

  // Cancel button
  cancelButton() {
    this.router.navigate(['../'],{relativeTo:this.route});
  }

  // Reset
  resetGatewayTemplateForm() {
    this.modelNotification.alertMessage(this.globalService.messageType_Warning, 'You will not be able to recover the changes!');
  }

  // Form reset  confirm
  formResetConfirm() {
    this.gatewayIODataHandler = <GatewayIODataHandler>this.gatewayIODHForm.value;
    if (this.gatewayIODataHandler.id === null) {
      this.gatewayIODHFormValidation();
    }
    else {
      this.gatewayIODHFormValidation();
      this.getGatewayIODataHandlerByIdForEdit(this.gatewayIODataHandler.id);
    }
  }
  dataProtocolFormatsOnChange($event){
    if ($event.value) {
      this.gatewayIODHForm.controls['responseFormatId'].setValue($event.itemData.id);
    }else{
      this.gatewayIODHForm.controls['responseFormatId'].setValue(null);
    }
  }
}
