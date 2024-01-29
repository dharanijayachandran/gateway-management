import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { GatewayTemplate } from '../../model/gatewayTemplate';
import { GatewayCommProtocol } from '../../model/gatewayCommProtocol';
import { DataProtocol } from '../../model/dataProtocol';
import { GatewayType } from '../../model/gatewayType';
import { GatewayModel } from '../../../gateway-model/model/gateway-model';
import { GatewayTemplateService } from '../../services/gatewayTemplate/gateway-template.service';
import { Router, ActivatedRoute } from '@angular/router';
import { globalSharedService } from 'src/app/shared/services/global/globalSharedService';
import { Observable } from 'rxjs';
import { DialogService } from 'src/app/shared/services/dialog/dialog.service';
import { TimezoneService } from 'src/app/shared/services/timezone/timezone.service';
import { Query } from '@syncfusion/ej2-data';
import { EmitType } from '@syncfusion/ej2-base';
import { FilteringEventArgs } from '@syncfusion/ej2-dropdowns';
import { UIModalNotificationPage } from 'global';
import { globalShareServices } from 'src/app/shared/globalShareServices';
import { GlobalGatewayService } from 'src/app/shared/globalGatewayService/global-gateway-service.service';

@Component({
  selector: 'app-gateway-template-form',
  templateUrl: './gateway-template-form.component.html',
  styleUrls: ['./gateway-template-form.component.css']
})
export class GatewayTemplateFormComponent implements OnInit {
  showLoaderImage: boolean = false;
  //FiltertimeZone: Observable<unknown>;
  filteredOptions: Observable<any[]>;
  addEditText: string;
  gatewayModelsByGatewayTypeId: Map<number, GatewayModel[]>;

  // It help to if there are no pending changes, just allow deactivation; else confirm first code starts here
  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    if (this.gatewayTemplateForm && this.gatewayTemplateForm.dirty) {
      this.dialogService.alertMessage('Warning', 'You will not be able to recover the changes!');
      // returning false will show a confirm dialog before navigating away
    } else {
      return true; // returning true will navigate without confirmation
    }
    return this.dialogService.navigateAwaySelection$;
  }
  // It help to if there are no pending changes, just allow deactivation; else confirm first code ends here


  // Importing child component to
  @ViewChild(UIModalNotificationPage) modelNotification;

  gatewayTemplateFormView = false;
  gatewayTemplateViewMode = false;
  templateReadModeView = false;
  gatewayTemplateForm: FormGroup;
  gatewayTemplate: GatewayTemplate = new GatewayTemplate();
  commProtocols: GatewayCommProtocol[];
  selectedCommProtocols: GatewayCommProtocol[] = [];
  timeZoneList: any[] = [];
  gatewayTypes: GatewayType[] = [];
  gatewayModels: GatewayModel[] = [];
  selectedValue: any;
  incomingDataProtocols: DataProtocol[] = [];
  enableSave = false;
  errorMessage = false;
  gatewayCommProtocols: GatewayCommProtocol[];
  protocolView = false;
  warningFlag: string;
  timeZoneNames = []
  dataProtocols = new Set<DataProtocol>();
  dataProtocolIds = new Set<Number>();
  public data: { [key: string]: Object; }[] = []
  // maps the appropriate column to fields property
  public fields: Object = { text: 'Name' };
  // set the height of the popup element
  public height: string = '220px';
  // set the placeholder to DropDownList input element
  public watermark: string = '--Select--';
  // set the placeholder to filter search box input element
  public filterPlaceholder: string = 'Search';
  commProtocolMap = new Map();
  public gatewayTypeFields: Object = {
    text: 'name',
    value: 'id'
  };
  public gatewayModelFields: Object = {
    text: 'name',
    value: 'id'
  };
  public timeZoneFields: Object = {
    text: 'name',
    value: 'id'
  };
  // filtering event handler to filter a Menu Icon Name
  //pass the filter data source, filter query to updateData method.
  public onFilteringGatewayType: EmitType<FilteringEventArgs> = (e: FilteringEventArgs) => {
    this.filterData(e, this.gatewayTypes);

  }

  public onFilteringGatewayModel: EmitType<FilteringEventArgs> = (e: FilteringEventArgs) => {
    this.filterData(e, this.gatewayModels);
  }
  public onFilteringTimeZone: EmitType<FilteringEventArgs> = (e: FilteringEventArgs) => {
    this.filterData(e, this.timeZoneList);
  }
  filterData(e: FilteringEventArgs, filterData) {
    let query: Query = new Query();
    //frame the query based on search string with filter type.
    query = (e.text !== '') ? query.where('name', 'contains', e.text, true) : query;
    e.updateData(filterData, query);
  }

  public sortDropDown: string = 'Ascending';
  timeZoneId: any;
  gatewayModelId: any;
  gatewayTypeId: any;
  // set the placeholder to DropDownList input element
  public gatewayTypeWaterMark: string = 'Select Gateway Type';
  public gatewayModelWaterMark: string = 'Select Gateway Model';
  public timeZoneWaterMark: string = 'Select Time Zone';
  constructor(private gatewayTemplateService: GatewayTemplateService,
    private formBuilder: FormBuilder,
    private router: Router,
    private globalService: globalShareServices,
    private globalGatewayService: GlobalGatewayService,
    private globalShareService: globalSharedService,
    private globalSharedService: globalSharedService,
    private dialogService: DialogService,
    private route: ActivatedRoute,
    private timezoneService: TimezoneService) {

  }

  public locale: string;
  ngOnInit() {
    this.getCommProtocols();
    this.getGatewayTypes();
    this.locale = this.globalSharedService.getLanguage();
    this.enableSave = false;
    this.getTimeZoneList();
    let id = Number(this.globalService.assignId);
    let operation = this.globalService.name;
    if (id != 0 && operation === 'View') {
      this.getGatewayTemplateByTemplateIdForView(id);
      this.gatewayTemplateFormView = false;
      this.templateReadModeView = false;
      this.gatewayTemplateViewMode = true;
      this.protocolView = true;
    }
    else if (id != 0 && operation === 'Edit') {
      this.addEditText = "Edit";
      this.gatewayTemplateFormValidation();
      this.getGatewayTemplateByTemplateIdForEdit(id);
      this.gatewayTemplateFormView = true;
      this.templateReadModeView = false;
      this.gatewayTemplateViewMode = false;
    }
    else {
      this.addEditText = "Add";
      this.gatewayTemplateFormValidation();
      this.gatewayTemplateFormView = true;
      this.templateReadModeView = false;
      this.gatewayTemplateViewMode = false;
    }
  }
  timeZoneFilter() {
    if (this.timeZoneList) {
      let Obj = {
        "Name": "--Select--",
      }
      this.data.push(Obj);;
    }

    this.timeZoneList.forEach(e => {
      let Obj = {
        "Name": e.name,
      }
      this.data.push(Obj);
    })
  }
  // filtering event handler to filter a Country
  public onFiltering: EmitType<FilteringEventArgs> = (e: FilteringEventArgs) => {
    let query: Query = new Query();
    //frame the query based on search string with filter type.
    query = (e.text !== '') ? query.where('Name', 'contains', e.text, true) : query;
    //pass the filter data source, filter query to updateData method.
    e.updateData(this.data, query);
  }
  gatewayTemplateFormValidation() {
    this.gatewayTemplateForm = this.formBuilder.group({
      id: [null],
      name: [[null], [Validators.required, Validators.pattern(this.globalShareService.getNamePatternForGatewayandAsset())]],
      gatewayTypeId: [null, [Validators.required]],
      gatewayModelId: [null],
      timeZoneId: null,
      commProtocols: this.formBuilder.array([
        this.addcommProtocolsFormGroup()
      ]),
      dataProtocolId: [null],
      status: ['A'],
    });
  }

  public addcommProtocolsFormGroup(): FormGroup {
    return this.formBuilder.group({
      commProtocolId: [null],
      value: [false]
    })
  }

  cancelGatewayTemplateForm(event: Event) {
    this.formCancelConfirm();
  }

  // Confirm redirect to
  formCancelConfirm() {
    this.enableSave = false;
    this.errorMessage = false;
    this.makeDropdownsNUll();
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  makeDropdownsNUll() {
    this.commProtocols = null;
    this.dataProtocols = null;
    this.gatewayTypes = null;
    this.gatewayModels = null;
    this.selectedCommProtocols = [];
  }

  //Review and Save method
  previewGatewayTemplate(): void {
    this.gatewayTemplateFormView = false;
    this.templateReadModeView = true;
    this.gatewayTemplateViewMode = false;
    this.gatewayTemplate = <GatewayTemplate>this.gatewayTemplateForm.value;
    if (this.gatewayTemplate.timeZoneId == '--Select--') {
      this.gatewayTemplate.timeZoneId = null;
    }

  }

  parseInt(id) {
    if (isNaN(id)) {
      return id;
    }
    return parseInt(id);
  }

  // back Button
  backButton(elementId) {
    this.gatewayTemplateFormView = true;
    this.templateReadModeView = false;
    this.gatewayTemplateViewMode = false;
    window.scrollTo(0, 0);
    setTimeout(() => {
      if (elementId) {
        let item = document.getElementById(elementId);
        window.scrollBy({ top: item.offsetTop, behavior: 'smooth' })
      }
    });
  }

  createOrUpdateGatewayTemplate(): void {
    this.showLoaderImage = true;
    let userId = sessionStorage.getItem('userId');
    let beId = sessionStorage.getItem('beId');
    if (this.gatewayTemplate.id === null) {
      this.gatewayTemplate.created_by = userId;
      this.gatewayTemplate.businessEntityId = parseInt(beId);
      this.gatewayTemplate.gatewayCommProtocols = this.selectedCommProtocols;
      this.gatewayTemplateService.addGatewayTemplate(this.gatewayTemplate).subscribe((res) => {
        // response handling
        this.showLoaderImage = false;
        this.modelNotification.alertMessage(res['messageType'], res['message']);
      },
        (error: any) => {
          this.showLoaderImage = false;
          this.modelNotification.alertMessage(this.globalSharedService.messageType_Fail, error);
        }
      );
    }
    else {
      this.gatewayTemplate.updated_by = Number(userId);
      this.gatewayTemplate.businessEntityId = parseInt(beId);
      this.gatewayTemplate.gatewayCommProtocols = this.selectedCommProtocols;
      this.gatewayTemplateService.updateGatewayTemplate(this.gatewayTemplate).subscribe((res) => {
        // response handling
        this.showLoaderImage = false;
        this.modelNotification.alertMessage(res['messageType'], res['message']);
      },
        (error: any) => {
          this.showLoaderImage = false;
          this.modelNotification.alertMessage(this.globalSharedService.messageType_Fail, error);
        }
      );
    }
  }

  // redirectTo
  redirectTo() {
    this.gatewayTemplateForm.reset();
    this.makeDropdownsNUll();
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  getGatewayTemplateByTemplateIdForView(id) {
    this.gatewayTemplateService.getGatewayTemplateByTemplateId(id)
      .subscribe(data => {
        this.gatewayTemplate = data;
        // for newly creted templates if commProtocol object is null
        //then based on the id we are setting comm protocol Object
        if (this.gatewayTemplate.gatewayCommProtocols) {
          this.gatewayTemplate.gatewayCommProtocols.forEach(obj => {
            if (obj.commProtocol == null || obj.commProtocol == undefined) {
              let commProtocol = this.commProtocolMap.get(obj.commProtocolId)
              obj.commProtocol = commProtocol
            }

          })
        }
      });
  }

  getGatewayTemplateByTemplateIdForEdit(id) {
    this.gatewayTemplateService.getGatewayTemplateByTemplateId(id).subscribe(
      res => {
        this.selectedCommProtocols = [];
        this.gatewayCommProtocols = res.gatewayCommProtocols
        this.gatewayModelsByGatewayTypeId = this.globalService.gatewayModelByGatewayTypeId;
        this.gatewayModels = this.gatewayModelsByGatewayTypeId.get(Number(res.gatewayTypeId));
        if (!this.gatewayModels) {
          this.getGatewayModelsByGatewayTypeId(Number(res.gatewayTypeId));
        }
        // For newly created Templates  if commProtocol comes null
        //then based id we are adding comm Protocol
        this.gatewayCommProtocols.forEach(obj => {
          if (obj.commProtocol == null || obj.commProtocol == undefined) {
            let commProtocolId = obj.commProtocolId
            let commProtocol = this.commProtocolMap.get(commProtocolId)
            obj.commProtocol = commProtocol
          }
        })
        // adding comm procol ends here
        this.gatewayCommProtocols = this.gatewayCommProtocols.filter(coProtocol => coProtocol.status !== 'D');
        this.gatewayCommProtocols = this.gatewayCommProtocols.sort((a, b) => a.id - b.id);
        this.gatewayCommProtocols.forEach(commProtocol => {
          commProtocol.commProtocolId = commProtocol.commProtocol.id;
          commProtocol.name = commProtocol.commProtocol.name;
          this.selectedCommProtocols.push(commProtocol);
          this.getDataProtocolsByCommProtocolId(commProtocol.commProtocol.id);
        })
        this.enableSave = true;
        let modelId = this.getId(res.gatewayModel)
        if (null != modelId) {
          modelId = this.parseInt(modelId)
        }
        let protocolId = this.getId(res.dataProtocol)
        if (null != protocolId) {
          protocolId = this.parseInt(protocolId)
        }
        if (this.gatewayCommProtocols != null && this.gatewayCommProtocols.length != 0) {
          this.gatewayTemplateForm.setControl('commProtocols', this.patchFormArray());
        }
        this.gatewayTemplateForm.patchValue({
          id: res.id,
          name: res.name,
          gatewayTypeId: res.gatewayTypeId,
          gatewayModelId: modelId,
          timeZoneId: res.timeZoneId,
          dataProtocolId: protocolId,
          status: res.status
        });

      }, (error: any) => {
        this.modelNotification.alertMessage(this.globalSharedService.messageType_Fail, error);
      })
  }

  getId(object) {
    if (object === null) {
      return null;
    }
    else {
      return object.id;
    }
  }

  patchFormArray(): FormArray {
    const formArray = new FormArray([]);
    if (this.commProtocols != null && this.commProtocols.length != 0) {
      var tempArray = this.commProtocols;
      tempArray.forEach(cProtocol => {
        let isSelected = false;
        this.gatewayCommProtocols.forEach(commmProtocol => {
          if (cProtocol.id === commmProtocol.commProtocol.id) {
            isSelected = true;
          }
        });
        if (isSelected) {
          formArray.push(this.formBuilder.group({
            commProtocolId: cProtocol.id,
            value: true
          }))
        }
        else {
          formArray.push(this.formBuilder.group({
            commProtocolId: cProtocol.id,
            value: false
          }))
        }
      })
    }
    return formArray;
  }

  resetGatewayTemplateForm() {
    this.modelNotification.alertMessage(this.globalSharedService.messageType_Warning, 'You will not be able to recover the changes!');
  }


  // Form reset  confirm
  formResetConfirm() {
    this.gatewayTemplate = <GatewayTemplate>this.gatewayTemplateForm.value;
    this.enableSave = false;
    this.errorMessage = false;
    if (this.gatewayTemplate.id === null) {
      this.selectedCommProtocols = [];
      this.dataProtocols.clear()
      this.dataProtocolIds.clear();
      this.gatewayTemplateForm.reset();
      this.gatewayTemplateForm.get('status').setValue('Active');
    }
    else {
      this.gatewayTemplateFormValidation();
      this.getGatewayTemplateByTemplateIdForEdit(this.gatewayTemplate.id);
    }
  }

  getCommProtocols() {
    this.gatewayTemplateService.getCommProtocols().subscribe(
      res => {
        this.commProtocols = res;
        this.commProtocols.forEach(commProtocol => {
          this.commProtocolMap.set(commProtocol.id, commProtocol)
        })
        this.commProtocols = this.commProtocols.sort((a, b) => a.id - b.id);
        const control = <FormArray>this.gatewayTemplateForm.controls['commProtocols'];
        for (let i = control.length - 1; i >= 0; i--) {
          control.removeAt(i)
        }
        for (let commProtocol of this.commProtocols) {
          (<FormArray>this.gatewayTemplateForm.get('commProtocols')).push(this.addcommProtocolsFormGroup());
        }
      },
      (error: any) => {
        this.modelNotification.alertMessage(this.globalSharedService.messageType_Fail, error);
      }
    );
  }

  /*  getDataProtocols() {
     this.gatewayTemplateService.getDataProtocols().subscribe(
       res => {
         this.dataProtocols = res;
       },
       (error: any) => {
         this.modelNotification.alertMessage(this.globalSharedService.messageType_Fail, error);
       }
     );
   } */

  getGatewayTypes() {
    this.globalGatewayService.getGatewayTypes().subscribe(
      res => {
        this.gatewayTypes = res;
        this.gatewayTypes = this.globalService.addSelectIntoList(this.gatewayTypes);
      },
      (error: any) => {
        this.modelNotification.alertMessage(this.globalSharedService.messageType_Fail, error);
      }
    );
  }

  getTimeZoneList() {
    this.timezoneService.getTimeZoneList().subscribe(
      res => {
        this.timeZoneList = res;
        if (this.timeZoneList) {
          this.timeZoneFilter()
        }
      },
      (error: any) => {
        this.modelNotification.alertMessage(this.globalSharedService.messageType_Fail, error);
      }
    );
  }

  public onChange(gatewayTypeId): void {
    this.selectedValue = gatewayTypeId;
    this.getGatewayModelByGatewayType(this.gatewayTypes);
  }

  getGatewayModelByGatewayType(gatewayTypes: GatewayType[]) {
    gatewayTypes.forEach((gatewayType) => {
      if (gatewayType.id == this.selectedValue)
        this.getGatewayModelsByGatewayTypeId(gatewayType.id);
    });
  }

  getGatewayModelsByGatewayTypeId(gatewayTypeId: number) {
    this.globalGatewayService.getGatewayModelsByGatewayTypeId(gatewayTypeId).subscribe(
      res => {
        this.gatewayModels = res;
        this.gatewayModels = this.globalService.addSelectIntoList(this.gatewayModels);
      },
      (error: any) => {
        this.modelNotification.alertMessage(this.globalSharedService.messageType_Fail, error);
      }
    );
  }

  isSelected(commProtocol, event) {
    if (event.checked) {
      commProtocol.commProtocolId = commProtocol.id;
      this.selectedCommProtocols.push(commProtocol);
      this.getDataProtocolsByCommProtocolId(commProtocol.id);
    }
    else {
      for (let com of this.selectedCommProtocols) {
        if (null != com.commProtocol && commProtocol.id == com.commProtocol.id) {
          let i = this.selectedCommProtocols.indexOf(com);
          this.selectedCommProtocols.splice(i, 1);
        } else if (com.id == commProtocol.id) {
          let i = this.selectedCommProtocols.indexOf(com);
          this.selectedCommProtocols.splice(i, 1);
        }
      }
    }
    this.errorMessage = this.selectedCommProtocols.length > 0 ? false : true;
    if (this.errorMessage) {
      this.enableSave = false;
      this.errorMessage = true;
      this.gatewayTemplateForm.get('commProtocols').reset();
      this.dataProtocols.clear();
      this.dataProtocolIds.clear();
      //   this.incomingDataProtocols = [];
    }
    else {
      this.enableSave = true;
      this.removeDataProtocol(commProtocol.id);
    }
  }

  removeDataProtocol(commProtocolId: number) {
    this.dataProtocols.forEach(dataProtocol => {
      if (dataProtocol.commProtocolId == commProtocolId) {
        this.dataProtocols.delete(dataProtocol);
      }
    })
  }

  getDataProtocolsByCommProtocolId(commProtocolId: number): void {
    this.gatewayTemplateService.getDataProtocolsByCommProtocolId(commProtocolId).subscribe(
      res => {
        this.showDataProtocols(res, commProtocolId);
      },
      (error: any) => {
        this.modelNotification.alertMessage(this.globalSharedService.messageType_Fail, error);
      }
    );
  }
  showDataProtocols(dataProtocolsList, commProtocolId) {
    dataProtocolsList = dataProtocolsList.sort((a, b) => a.name.localeCompare(b.name))
    dataProtocolsList.forEach(dataProtocol => {
      if (!this.dataProtocolIds.has(dataProtocol.id)) {
        this.dataProtocolIds.add(dataProtocol.id);
        dataProtocol.commProtocolId = commProtocolId;
        this.dataProtocols.add(dataProtocol);
      }
    })
  }

  cancelGatewayTemplateView() {
    this.makeDropdownsNUll();
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  onKey(event: any) {
    let isDH = this.globalShareService.doubleHyphen(event);
    if (isDH) {
      this.gatewayTemplateForm.get('name').setErrors({
        pattern: true
      });
    }
  }
  gatewayTypeOnChange($event) {
    this.gatewayModels = [];
    if ($event.value) {
      this.onChange($event.itemData.id);
      this.gatewayTemplateForm.controls['gatewayTypeId'].setValue($event.itemData.id);
    } else {
      this.gatewayTemplateForm.controls['gatewayTypeId'].setValue(null);
      this.gatewayModels = [];
    }
  }
  gatewayModelOnChange($event) {
    if ($event.value) {
      this.gatewayTemplateForm.controls['gatewayModelId'].setValue($event.itemData.id);
    } else {
      this.gatewayTemplateForm.controls['gatewayModelId'].setValue(null);
    }
  }
  timeZoneOnChange($event) {
    if ($event.value) {
      this.gatewayTemplateForm.controls['timeZoneId'].setValue($event.itemData.name);
    } else {
      this.gatewayTemplateForm.controls['timeZoneId'].setValue(null);
    }
  }
}
