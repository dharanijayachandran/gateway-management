import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GatewayModel } from '../../model/gateway-model';
import { GatewayModelService } from '../../services/gateway-model.service';
import { Router, ActivatedRoute } from '@angular/router';
import { globalSharedService } from 'src/app/shared/services/global/globalSharedService';
import { Observable } from 'rxjs';
import { DialogService } from 'src/app/shared/services/dialog/dialog.service';
import { UIModalNotificationPage } from 'global';
import { globalShareServices } from 'src/app/shared/globalShareServices';
import { EmitType } from '@syncfusion/ej2-base';
import { FilteringEventArgs } from '@syncfusion/ej2-dropdowns';
import { Query } from '@syncfusion/ej2-data';
@Component({
  selector: 'app-gateway-model-form',
  templateUrl: './gateway-model-form.component.html',
  styleUrls: ['./gateway-model-form.component.css']
})
export class GatewayModelFormComponent implements OnInit {
  showLoaderImage: boolean;

  // It help to if there are no pending changes, just allow deactivation; else confirm first code starts here
  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    if(this.hasOwnProperty('gatewayModelForm')){
      if (this.gatewayModelForm.dirty) {
        this.dialogService.alertMessage(this.globalShareService.messageType_Warning, 'You will not be able to recover the changes!');
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

  gatewayModelFormDiv = true;
  gatewayModelReadModeView = false;
  gatewayViewMode = false;
  gatewayTypes: any[];
  dataSource: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  //pageSettings = pageSettings;
  gatewayModelForm: FormGroup;
   gatewayModel: GatewayModel = new GatewayModel();
  warningFlag: string;

  public gatewayTypeFields: Object = {
    text: 'name',
    value: 'id'
  };
  // filtering event handler to filter a Menu Icon Name
  //pass the filter data source, filter query to updateData method.
  public onFilteringGatewayType: EmitType<FilteringEventArgs> = (e: FilteringEventArgs) => {
    let query: Query = new Query();
    //frame the query based on search string with filter type.
    query = (e.text !== '') ? query.where('name', 'contains', e.text, true) : query;
    e.updateData(this.gatewayTypes, query);

  }
  public sortDropDown:string ='Ascending';
  gatewayTypeId:any;
  // set the placeholder to DropDownList input element
  public gatewayTypeWaterMark: string = 'Select Gateway Type';
  public filterPlaceholder: string = 'Search';
  // set the height of the popup element
  public height: string = '200px';
  public locale: string;

  constructor(
    private globalService: globalShareServices,
    private globalShareService: globalSharedService, private gatewayModelService: GatewayModelService, private formBuilder: FormBuilder, private router: Router,
    private dialogService: DialogService,
    private route:ActivatedRoute) { }

  ngOnInit() {
    this.getGatewayModelList();
    this.gatewayFormValidation();
    this.getGatewayTypes();
    let id = Number(this.globalService.assignId);
    let operation = this.globalService.name;
    if (id != 0 && operation === 'View') {
      this.getGatewayModelByGatewayModelIdForView(id);
      this.gatewayModelFormDiv = false;
      this.gatewayModelReadModeView = false;
      this.gatewayViewMode = true;
    }
    else if (id != 0 && operation === 'Edit') {
      this.gatewayFormValidation();
      this.getGatewayModelByGatewayModelIdForEdit(id);
      this.gatewayModelFormDiv = true;
      this.gatewayModelReadModeView = false;
      this.gatewayViewMode = false;
    }
    else {
      this.gatewayFormValidation();
      this.gatewayModelFormDiv = true;
      this.gatewayModelReadModeView = false;
      this.gatewayViewMode = false;
    }
  }
  gatewayFormValidation() {
    this.gatewayModelForm = this.formBuilder.group({
      id: [null],
      name: ['', [Validators.required, Validators.pattern(this.globalShareService.getNamePattern())]],
      description: [],
      gatewayTypeId: ['', Validators.required],
      isGeneric: []
    });

  }
  getGatewayModelByGatewayModelIdForEdit(gatewayModelId) {
    this.gatewayModelService.getGatewayModelByGatewayModelId(gatewayModelId)
      .subscribe(
        res => {
          this.gatewayModelForm.patchValue({
            id: res.id,
            name: res.name,
            gatewayTypeId: res.gatewayTypeId,
            isGeneric: res.isGeneric,
            description: this.getDescription(res),
            status: res.status
          });
        },
        error => {
          // If the service is not available
          this.modelNotification.alertMessage(this.globalShareService.messageType_Fail, error);
        });
  }
  getGatewayModelByGatewayModelIdForView(gatewayModelId) {
    this.gatewayModelService.getGatewayModelByGatewayModelId(gatewayModelId)
      .subscribe(data => {
        this.gatewayModel = data;
        if (data.status === 'A') {
          this.gatewayModel.status = 'Active';
        }
      });
  }

  getDescription(res: GatewayModel) {
    if ((res.description) != null) {
      return res.description;
    }
    else {
      return '';
    }
  }

  createGatewayModel() {
    this.gatewayModelFormDiv = false;
    this.gatewayModelReadModeView = true;
    this.gatewayViewMode = false;
    this.gatewayModel = <GatewayModel>this.gatewayModelForm.value;
  }


  createOrUpdateGatewayModel(): void {
    this.showLoaderImage=true;
    let userId = + sessionStorage.getItem('userId');
    this.gatewayModel = <GatewayModel>this.gatewayModelForm.value;
    if (this.gatewayModel.id === null) {
      let organizationId = sessionStorage.getItem('beId');
      this.gatewayModel.businessEntityId = parseInt(organizationId);
      this.gatewayModel.createdBy = userId;
      // this.gatewayModel.createdOn = new Date();
      this.gatewayModel.status = "A";
      this.gatewayModelService.addGatewayModel(this.gatewayModel).subscribe((res) => {
        this.showLoaderImage=false;
        // response handling
        this.modelNotification.alertMessage(res['messageType'], res['message']);
      },
        (error: any) => {
          this.showLoaderImage=false;
          // If the service is not available
          this.modelNotification.alertMessage(this.globalShareService.messageType_Fail, error);
        }
      );
    }
    else {
      let date = new Date();
      this.gatewayModel.status = "A";
      this.gatewayModel.updatedBy = userId;
      this.gatewayModelService.updateGatewayModel(this.gatewayModel).subscribe((res) => {
        this.showLoaderImage=false;
        // response handling
        this.modelNotification.alertMessage(res['messageType'], res['message']);
      },
        (error: any) => {
          this.showLoaderImage=false;
          // If the service is not available
          this.modelNotification.alertMessage(this.globalShareService.messageType_Fail, error);
        }
      );
    }
    // this.gatewayModelViewDiv = true;
    // this.gatewayModelFormDiv = false;
    // this.gatewayModelSection=false;
    this.gatewayModelForm.reset();
  }

  // Success redirect to
  redirectTo() {
    this.getGatewayModelList();
    this.router.navigate(['../'],{relativeTo:this.route});
  }

  parseInt(id) {
    return parseInt(id);
  }
  getGatewayTypes(): void {
    this.gatewayModelService.getGatewayTypes()
      .subscribe(
        res => {
          this.gatewayTypes = res as any[];
          this.gatewayTypes= this.globalService.addSelectIntoList(this.gatewayTypes);
        },
        error => {
          // If the service is not available
          this.modelNotification.alertMessage(this.globalShareService.messageType_Fail, error);
        });
  }

  getGatewayModelList() {
    let organizationId = sessionStorage.getItem('beId');
    this.gatewayModelService.getGatewayModelList(organizationId)
      .subscribe(
        res => {
          this.dataSource = new MatTableDataSource();
          this.dataSource.data = res;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;

        },
        error => {
          // If the service is not available
          this.modelNotification.alertMessage(this.globalShareService.messageType_Fail, error);
        });
  }

  //cancelButton
  cancelButton() {
    this.formCancelConfirm();
  }

  // Confirm redirect to
  formCancelConfirm() {
    this.router.navigate(['../'],{relativeTo:this.route});
  }

  backButton(elementId) {

    this.gatewayModelFormDiv = true;
    this.gatewayModelReadModeView = false;
    this.gatewayViewMode = false;
    window.scrollTo(0, 0);
    setTimeout(() => {
      if (elementId) {
        let item = document.getElementById(elementId);
        window.scrollBy({ top: item.offsetTop, behavior: 'smooth' })
      }
    });

  }
  resetGatewayModelForm() {
    this.modelNotification.alertMessage(this.globalShareService.messageType_Warning, 'You will not be able to recover the changes!');
  }


  // Form reset  confirm
  formResetConfirm() {
    this.gatewayModel = <GatewayModel>this.gatewayModelForm.value;
    if (this.gatewayModel.id === null) {
      this.gatewayFormValidation();
    }
    else {
      this.gatewayFormValidation();
      this.getGatewayModelByGatewayModelIdForEdit(this.gatewayModel.id);
    }
  }


  cancelGatewayModellView() {
    this.router.navigate(['../'],{relativeTo:this.route});
  }
  gotoGatewayModelList() {
    this.router.navigate(['../'],{relativeTo:this.route});
  }
  onKey(event: any) {
    let isDH = this.globalShareService.doubleHyphen(event);
    if (isDH) {
      this.gatewayModelForm.get('name').setErrors({
        pattern: true
      });
    }
  }
  gatewayTypeOnChange($event){
    if ($event.value) {
      this.gatewayModelForm.controls['gatewayTypeId'].setValue($event.itemData.id);
    }else{
      this.gatewayModelForm.controls['gatewayTypeId'].setValue(null);
    }
  }
}
