import { Component, ComponentFactoryResolver, HostListener, ViewChild, ViewContainerRef } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UIModalNotificationPage } from 'global';
import { Observable } from 'rxjs';
import { globalShareServices } from 'src/app/shared/globalShareServices';
import { DialogService } from 'src/app/shared/services/dialog/dialog.service';
import { globalSharedService } from 'src/app/shared/services/global/globalSharedService';
import { GatewayModelPin } from '../../model/gateway-model-pin';
import { GatewayModelService } from '../../services/gateway-model.service';
@Component({
  selector: 'app-gateway-model-pin',
  templateUrl: './gateway-model-pin.component.html',
  styleUrls: ['./gateway-model-pin.component.css']
})
export class GatewayModelPinComponent {
  numberOfPinsInputHasChanged: boolean;
  warningFlag: string;
  disableReset = true;
  disableReviewSave = true;
  pinForm: FormGroup;

  pinSectionShow = false;

  // It help to if there are no pending changes, just allow deactivation; else confirm first code starts here
  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    if (this.numberOfPinsInputHasChanged == true) {
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

  @ViewChild('dynamicContainer', { read: ViewContainerRef })
  container: ViewContainerRef;
  rowId: number;
  data: string;
  numberOfPins: number;
  prevNumberOfPins: number;
  embeddedViews: number = 0;
  gatewayModelId = Number(sessionStorage.getItem('gatewayModelId'));
  pinsList: Array<any> = [];
  enterPinInputFieldEditable = false;
  editPin = true;
  reset = false;
  disableSave = true;
  gatewayModelPin: GatewayModelPin = new GatewayModelPin();
  gatewayModelPins: GatewayModelPin[] = [];
  gatewayModelName: String;
  viewPinsDetails: any;
  minerrorMessage: boolean;
  maxerrorMessage: boolean;

  constructor(private comFacResolver: ComponentFactoryResolver, private gatewayModelService: GatewayModelService,
    private route: ActivatedRoute, private router: Router, private globalService: globalShareServices,
    private dialogService: DialogService,
    private globalSharedService: globalSharedService,
    private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.getGatewayModelByGatewayModelId(this.gatewayModelId);
    // this.numberOfPins=this.globalService.noofpins;
    if (this.globalService.isRequestFromPreviewBack) {
      this.numberOfPins = this.globalService.noofpins;
      this.viewPinsDetails = this.globalService.details;
      this.pinsList = this.globalService.pinsLists;
      this.editPin = false;
      this.enterPinInputFieldEditable = false;
      this.loadPinForm();
      this.createPinDivs(this.viewPinsDetails);
      this.pinSectionShow = true;
    } else {
      this.getPinByGatewayModelId(this.gatewayModelId);
    }
  }

  // Initiate register Pin form
  loadPinForm() {
    this.pinForm = this.formBuilder.group({
      gatewayModelId: this.gatewayModelId,
      pins: this.formBuilder.array([])
    })
  }


  getGatewayModelByGatewayModelId(gatewayModelId) {
    this.gatewayModelService.getGatewayModelByGatewayModelId(gatewayModelId)
      .subscribe(
        res => {
          this.gatewayModelName = res.name;
        },
        error => {
          // If the service is not available
          this.modelNotification.alertMessage(this.globalSharedService.messageType_Fail, error);
        });
  }
  getPinByGatewayModelId(gatewayModelId: number) {
    this.gatewayModelService.getGatewayModelPinsByGatewayModelId(gatewayModelId)
      .subscribe(
        res => {
          this.pinSectionShow = true;
          this.loadPinForm();
          if (res.length > 0) {
            this.numberOfPins = res.length;
            this.pinsList = JSON.parse(JSON.stringify(res));
            this.globalService.pinsLists = this.pinsList;
            this.editPin = false;
            this.enterPinInputFieldEditable = false;
            this.createPinDivs(res);
          } else {
            this.numberOfPins = 0;
            this.enterPinInputFieldEditable = true;
          }
        },
        error => {
          // If the service is not available
          this.modelNotification.alertMessage(this.globalSharedService.messageType_Fail, error);
        });
  }


  createPin(obj, pinCount): FormGroup {
    return this.formBuilder.group({
      id: [obj ? obj.id : null],
      status: [obj ? obj.status : null],
      name: [obj ? obj.name : pinCount,  [
        Validators.required,
        Validators.pattern(this.globalSharedService.getNamePattern())]],
      internalMap: [obj ? obj.internalMap : pinCount, [
        Validators.required,
        Validators.pattern(this.globalSharedService.getNamePattern())]],
    })
  }

  public noWhitespace(control: FormControl) {
    let isWhitespace = (control.value || '').trim().length === 0;
    let isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true }
  }


  createPinDivs(obj) {
    if (this.numberOfPins == 0) {
      this.minerrorMessage = true;
    } else {
      this.minerrorMessage = false;

      // Getting form arra control
      const control = <FormArray>this.pinForm.controls['pins'];

      // Pin comes as a Response/Edit mode
      if (obj != null) {
        for (let i = 0; i < this.numberOfPins; i++) {
          control.push(this.createPin(obj[i],''));
        }
      } else { //Entered Total number of Pins
        if (this.editPin) {
          (<FormArray>this.pinForm.get('pins')).clear();
          // Clear the previous array total length
          for (let i = 0; i < this.numberOfPins; i++) {
            control.push(this.createPin(null, "PIN_"+(i+1)));
          }
        }

      }




      // if (this.numberOfPins != this.prevNumberOfPins || this.reset) {
      //   this.rowId = 1;
      //   this.container.clear();
      //   let rows = document.getElementById("dynamicContainer");
      //   let rowIdIndex = rows.innerHTML.indexOf("row");
      //   if (this.editPage) {
      //     this.pinsList.forEach(obj => {
      //       this.editPinDiv(obj);
      //     });
      //   } else {
      //     for (let i = 0; i < this.numberOfPins; i++) {
      //       if (this.viewPinsDetails != undefined && this.viewPinsDetails.length > 0) {
      //         this.addPinDiv(this.viewPinsDetails[i]);
      //       } else {
      //         //this.addPinDiv(null);
      //       }
      //     }
      //   }
      //   this.prevNumberOfPins = this.numberOfPins;
      // }
      if (this.numberOfPins > 0) {
        this.disableReset = false;
        this.disableReviewSave = false;
      } else {
        this.disableReset = true;
        this.disableReviewSave = true;
      }
    }
  }

  addPinDiv(pinData: any) {

  }

  // addPinDiv(pinData: any) {
  //   let comp = this.comFacResolver.resolveComponentFactory(GatewayModelPinFormComponent);
  //   let dynamicComp = this.container.createComponent(comp);
  //   dynamicComp.instance.reference = dynamicComp;

  //   dynamicComp.instance.index = this.rowId;
  //   if (null == pinData) {
  //     dynamicComp.instance.pinName = 'PIN_' + this.rowId;
  //     dynamicComp.instance.internalMap = 'PIN_' + this.rowId;
  //   } else {
  //     dynamicComp.instance.pinName = pinData.name;
  //     dynamicComp.instance.internalMap = pinData.internalMap;
  //   }

  //   this.rowId += 1;

  //   let com = this.container;
  //   if (com !== undefined) {
  //     this.embeddedViews = com['_embeddedViews'].length;
  //   }
  // }

  // editPinDiv(obj) {
  //   let comp = this.comFacResolver.resolveComponentFactory(GatewayModelPinFormComponent);
  //   let dynamicComp = this.container.createComponent(comp);
  //   dynamicComp.instance.reference = dynamicComp;
  //   let internalMap = "";
  //   if (obj.internalMap == undefined) {
  //     internalMap = "";
  //   } else {
  //     internalMap = obj.internalMap;
  //   }
  //   dynamicComp.instance.index = this.rowId;
  //   dynamicComp.instance.pinId = obj.id;
  //   dynamicComp.instance.pinName = obj.name;
  //   dynamicComp.instance.gatewayModelId = obj.gatewayModelId;
  //   dynamicComp.instance.status = obj.status;
  //   dynamicComp.instance.internalMap = internalMap;

  //   this.rowId += 1;

  //   let com = this.container;
  //   if (com !== undefined) {
  //     this.embeddedViews = com['_embeddedViews'].length;
  //   }
  // }
  //cont = this.container;

  savePins() {
    let pinFormValue = this.pinForm;
    pinFormValue.value['createdBy'] = +sessionStorage.getItem('userId');
    this.globalService.SetPinDetails(pinFormValue.value.pins, JSON.stringify(pinFormValue['value']));
    this.globalService.GettingId(this.gatewayModelId);
    this.router.navigate(['../gateway-model/gateway-model-pin-preview'],{relativeTo:this.route});
    this.globalService.SetPins(this.numberOfPins);
    this.globalService.setPinsList(this.pinsList);

    // let comp = this.container;
    // this.data = "";
    // let userId = +sessionStorage.getItem('userId');
    // if (comp !== undefined) {
    //   if (comp['_embeddedViews'].length != 0) {
    //     let pinsDetails = "";
    //     pinsDetails = pinsDetails + '{"gatewayModelId":' + this.gatewayModelId + ',"pins":[';
    //     for (let i = 0; i < comp['_embeddedViews'].length; i++) {
    //       if (comp['_embeddedViews'][i] != undefined) {
    //         let jsonRow: String = "";
    //         let pinName = comp['_embeddedViews'][i].nodes[1].instance.pinName ==
    //           undefined ? "" : comp['_embeddedViews'][i].nodes[1].instance.pinName;
    //         let internalMap = comp['_embeddedViews'][i].nodes[1].
    //           instance.internalMap == undefined ? "" :
    //           comp['_embeddedViews'][i].nodes[1].instance.internalMap;
    //         let pinId = comp['_embeddedViews'][i].nodes[1].instance.pinId ==
    //           '' ? "" : comp['_embeddedViews'][i].nodes[1].instance.pinId;
    //         let status = comp['_embeddedViews'][i].nodes[1].instance.status;

    //         pinsDetails = pinsDetails + '{';
    //         if (this.editPage) {
    //           pinsDetails = pinsDetails + '"id":' + pinId + ', "status":"' + status + '", ';
    //         } else {
    //           pinsDetails = pinsDetails + '"status":"A", ';
    //         }
    //         pinsDetails = pinsDetails + '"name":"' + pinName + '","internalMap":"' + internalMap + '"},'
    //         let gatewayModelPin = new GatewayModelPin();
    //         gatewayModelPin.name = pinName;
    //         gatewayModelPin.internalMap = internalMap;
    //         this.gatewayModelPins.push(gatewayModelPin);
    //       }
    //     }
    //     if (pinsDetails.endsWith(",")) {
    //       pinsDetails = pinsDetails.substring(0, (pinsDetails.length - 1));
    //     }
    //     pinsDetails = pinsDetails + '],"createdBy":' + userId + '}';
    //     this.globalService.SetPinDetails(this.gatewayModelPins, pinsDetails);
    //     this.globalService.GettingId(this.gatewayModelId);
    //     this.router.navigate(['/gateway-model-pin-preview'])
    //     this.globalService.SetPins(this.numberOfPins);
    //     this.globalService.setPinsList(this.pinsList);
    //   }
    // }
  }

  backToGatewayModel() {
    if (this.numberOfPins != 0) {
      this.warningFlag = "cancel";
      this.modelNotification.alertMessage(this.globalSharedService.messageType_Warning, 'You will not be able to recover the changes!');
    } else {
      this.formCancelConfirm();
    }
  }

  // Confirm redirect to
  formCancelConfirm() {
    //this.router.navigate(['gateway-model']);
    let gatewayModelList = document.getElementById('gatewayModelList');
    gatewayModelList.click();
  }

  resetGatewayModelPins() {
    this.warningFlag = "reset";
    this.modelNotification.alertMessage(this.globalSharedService.messageType_Warning, 'You will not be able to recover the changes!');
  }


  // Checkbox reset  confirm
  formResetConfirm() {
    this.reset = true;
    this.numberOfPinsInputHasChanged = false;
    this.disableReset = true;
    this.disableReviewSave = true;
    this.globalService.noofpins = 0;
    this.getPinByGatewayModelId(this.gatewayModelId);
  }

  redirectPins() {
    this.globalService.GettingId(this.gatewayModelId);
    this.router.navigate(['../gateway-model-pin-form'],{relativeTo:this.route});
    this.globalService.SetPins(this.numberOfPins);
    // this.globalService.SetContainer(this.cont);
  }

  alertRedirection() {
    if (this.warningFlag == "reset") {
      this.formResetConfirm();
    } else if (this.warningFlag == "cancel") {
      this.formCancelConfirm();
    }
    this.warningFlag = "";
  }

  numberOfPinsInputStatus() {
    this.numberOfPinsInputHasChanged = true;
    this.disableReset = false;
    this.disableReviewSave = true;
  }
}
