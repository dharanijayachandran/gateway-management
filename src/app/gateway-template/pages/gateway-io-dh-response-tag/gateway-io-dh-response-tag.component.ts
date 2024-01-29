import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { CommunicationService } from '../../services/communication/communication.service';
import { GatewayIoDhResponseTagService } from '../../services/gatewayIODhResponseTag/gateway-io-dh-response-tag.service';
import { GatewayIOTag } from '../../model/gatewayIOTag';
import { GatewayCommProtocol } from '../../model/communication';
import { DataProtocolFormat } from '../../model/DataProtocolFormat';
import { GatewayIODHTag } from '../../model/gatewayIODHTag';
import { GatewayIODHResponseTag } from '../../model/gatewayIODhResponseTag';
import { GatewayIODataHandler } from '../../model/gatewayIODataHandler';
import { TagLengthUnit } from '../../model/tagLengthUnit';
import { globalSharedService } from 'src/app/shared/services/global/globalSharedService';
import { Observable } from 'rxjs';
import { DialogService } from 'src/app/shared/services/dialog/dialog.service';
import { UIModalNotificationPage } from 'global';
import { globalShareServices } from 'src/app/shared/globalShareServices';
@Component({
  selector: 'app-gateway-io-dh-response-tag',
  templateUrl: './gateway-io-dh-response-tag.component.html',
  styleUrls: ['./gateway-io-dh-response-tag.component.css']
})
export class GatewayIoDhResponseTagComponent implements OnInit {
  showLoaderImage: boolean;

  // It help to if there are no pending changes, just allow deactivation; else confirm first code starts here
  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    if(this.hasOwnProperty('gatewayIODHResponseTagForm')){
      if (this.gatewayIODHResponseTagForm.dirty) {
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
  warningFlag: string;
  constructor(private globalSharedService: globalShareServices,
    private router: Router, private formBuilder: FormBuilder,
    private commService: CommunicationService, private service: GatewayIoDhResponseTagService,
    private globalService: globalSharedService,
    private dialogService: DialogService,
    private route:ActivatedRoute) { }

  gatewayIODHResponseTagForm: FormGroup;
  gatewayIOTags: GatewayIOTag[];
  gatewayCommProtocol: GatewayCommProtocol;
  dataFormats: DataProtocolFormat[];
  gatewayIODHTags: GatewayIODHTag[];
  gatewayIODHResponseTags: GatewayIODHResponseTag[]=[];
  gatewayIODH: GatewayIODataHandler;
  saveGatewayIODH: GatewayIODataHandler;
  saveGatewayIODHResponseTags: GatewayIODHResponseTag[];
  ioDHId: any;
  ioDHType: string;
  tagLengthUnits: TagLengthUnit[];
  gatewayId: number;
  saveSuccess = false;
  updateSucess = false;
  serviceMessage: string;
  IODHTagError: boolean;
  previewIODHResponseTagForm = false;
  IODHTagForm = true;
  assignedTags = new Set();
  dhTagMap = new Map<number, any[]>();
  updatedTags = [];
  isAssign:boolean;
  ngOnInit() {
    this.loadFormData();
  }

  loadFormData() {
    this.gatewayCommProtocol = this.commService.gatewayCommProtocol;
    this.gatewayId = this.gatewayCommProtocol.gateway.id;
    this.ioDHId = this.globalSharedService.assignId;
    this.ioDHType = this.globalSharedService.name;
    this.validateTheGatewayIODHResponseTagForm();
    this.getGatewayIOTagsByTemplateId();
    this.getGatewayIODHByIODHId();
    this.getDataFormats();
    this.getTagLengthUnits();
  }

  validateTheGatewayIODHResponseTagForm() {
    this.gatewayIODHResponseTagForm = this.formBuilder.group({
      id: [null],
      templateName: [''],
      communication: [''],
      name: [''],
      operationMode: [''],
      displayIOTag: ['All'],
      nodeIoDhResponseTags: this.formBuilder.array([
        this.addFormArray()
      ])
    })
  }

  addFormArray(): FormGroup {
    return this.formBuilder.group({
      id: [null],
      //parentIOTag:[''],
      tagIndex: [null, [Validators.pattern("[0-9]*")]],
      tagLength: [null, [Validators.pattern("[0-9]*")]],
      tagLengthUnit: [null],
      tagKeyName: [null],
      gatewayIODHResponseTagFormatId: [null],
      parentGatewayIODHResponseTagId: [null],
      tagSeparator: [null],
      isParticipantInLength: [false],
      isParticipantInErrorCheck: [false],
      nodeIoTagId: [null],
      nodeIoDhId: [null],
      defaultValue:null,
      status: [null],
      isAssign: [false]
    })
  }

  getDataFormats() {
    this.service.getDataFormats().subscribe(data => {
      this.dataFormats = data;
    },
      (error: any) => {
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      })
  }

  getGatewayIODHByIODHId() {
    this.service.getGatewayIODHByIODHId(this.ioDHId).subscribe(data => {
      this.gatewayIODH = data;
      this.gatewayIODHTags = this.gatewayIODH.nodeIoDhTags;
      this.gatewayIODHResponseTags = this.gatewayIODH.nodeIoDhResponseTags;
      this.gatewayIODHResponseTags.forEach(gatewayIODHResponseTag=>{
        gatewayIODHResponseTag.gatewayIODHResponseTagName=gatewayIODHResponseTag.gatewayIOTag.name;
      })
      this.createTheDynamicTableWithIOTags();
      this.patchCommProtocolData();
    },
      (error: any) => {
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      })
  }

  getGatewayIOTagsByTemplateId() {
    this.service.getGatewayIOTagsByTemplateId(this.gatewayCommProtocol.gateway.id).subscribe(data => {
      this.gatewayIOTags = data;
      //this.createTheDynamicTableWithIOTags();
    },
      (error: any) => {
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      })
  }

  createTheDynamicTableWithIOTags() {
    const control = <FormArray>this.gatewayIODHResponseTagForm.controls['nodeIoDhResponseTags'];
    for (let i = control.length - 1; i >= 0; i--) {
      control.removeAt(i)
    }
    for (let ioTag of this.gatewayIODHTags) {
      control.push(this.addFormArray());
      //(<FormArray>this.gatewayIODHTagForm.get('ioTagsFormArray')).push(this.addFormArray());
    }
    this.gatewayIODHResponseTagForm.setControl('nodeIoDhResponseTags', this.patchFormArrayData());
    if (this.gatewayIODHResponseTags !== null && this.gatewayIODHResponseTags.length !== 0) {

    }
    else {
      this.IODHTagError = true;
    }
  }

  patchCommProtocolData() {
    if (this.globalSharedService.isGateway) {
      this.gatewayIODHResponseTagForm.patchValue({
        templateName: this.globalSharedService.gatewayTemplateName,
        communication: this.gatewayCommProtocol.commProtocol.name,
        name: this.gatewayIODH.name,
        id: this.gatewayIODH.id
      })
    }
    if (this.globalSharedService.isGatewayTemplate) {
      this.gatewayIODHResponseTagForm.patchValue({
        templateName: this.globalSharedService.gatewayTemplateNameInGatewayTemplatePage,
        communication: this.gatewayCommProtocol.commProtocol.name,
        name: this.gatewayIODH.name,
        id: this.gatewayIODH.id
      })
    }
    if (this.gatewayIODH.operationMode === 'R') {
      this.gatewayIODHResponseTagForm.patchValue({
        operationMode: 'Read'
      })
    }
    else if (this.gatewayIODH.operationMode === 'W') {
      this.gatewayIODHResponseTagForm.patchValue({
        operationMode: 'Write'
      })
    }
  }

  previewFormData() {
    this.saveGatewayIODH = <GatewayIODataHandler>this.gatewayIODHResponseTagForm.value;
    this.gatewayIODH.gatewayId = this.gatewayCommProtocol.gateway.id;
    this.saveGatewayIODHResponseTags = this.saveGatewayIODH.nodeIoDhResponseTags;
    this.saveGatewayIODHResponseTags = this.saveGatewayIODHResponseTags.filter(ioDhTag => ioDhTag.isAssign);
    let tempTags = this.gatewayIODHResponseTags ;
    this.saveGatewayIODHResponseTags.forEach(ioDHRtag => {
      this.gatewayIODHResponseTags = this.gatewayIODHResponseTags.filter(pIODHRtag => pIODHRtag.id != ioDHRtag.id)
    })

    if (this.gatewayIODHResponseTags.length != 0) {
      this.gatewayIODHResponseTags.forEach(ioDHRtag => {
        ioDHRtag.status = 'Deleted';
        this.saveGatewayIODHResponseTags.push(ioDHRtag);
      })
    }
    this.gatewayIODHResponseTags = tempTags
    this.saveGatewayIODHResponseTags.forEach(ioDhResponseTag => {
      let dataFormatId = this.parseInt(ioDhResponseTag.gatewayIODHResponseTagFormatId);
      for (let dataFormat of this.dataFormats) {
        let id = this.parseInt(dataFormat.id);
        if (id === dataFormatId) {
          ioDhResponseTag.dataFormateName = dataFormat.name;
          break;
        }
      }
    })
    let userId = sessionStorage.getItem('userId');
    this.saveGatewayIODHResponseTags.forEach(ioDhResponseTag => {
      ioDhResponseTag.created_by = this.parseInt(userId);
      ioDhResponseTag.nodeIoDhId = this.saveGatewayIODH.id;
      ioDhResponseTag.nodeIODHName = this.saveGatewayIODH.name;
      let nodeIoTagId = this.parseInt(ioDhResponseTag.nodeIoTagId);
      for (let ioDhTag of this.gatewayIODHTags) {
        let id = this.parseInt(ioDhTag.nodeIoTag.id);
        if (nodeIoTagId === id) {
          ioDhResponseTag.tagName = ioDhTag.nodeIoTag.name;
        }
      }
    })
    this.saveGatewayIODHResponseTags.forEach(ioDhResponseTag => {
      for (let lengthUnit of this.tagLengthUnits) {
        if (lengthUnit.id === ioDhResponseTag.tagLengthUnit) {
          ioDhResponseTag.tagLengthUnitName = lengthUnit.value;
          break;
        }
      }
      let parentId = ioDhResponseTag.parentGatewayIODHResponseTagId;
      this.saveGatewayIODHResponseTags.forEach(respTag =>{
        if(respTag.id){
          if(respTag.id == parentId){
            this.gatewayIODHTags.forEach(ioTag=>{
              let id = this.parseInt(ioTag.nodeIoTag.id);
              if(respTag.nodeIoTagId == id){
                ioDhResponseTag.parentTagName = ioTag.nodeIoTag.name
              }
            })
          }
        }
      })
    })

      this.gatewayIODH.nodeIoDhResponseTags = this.saveGatewayIODHResponseTags;
      this.previewIODHResponseTagForm = true;
      this.IODHTagForm = false;
      this.saveGatewayIODHResponseTags = this.saveGatewayIODHResponseTags.sort((a,b)=>a.tagName.localeCompare(b.tagName))
      let tags = JSON.parse(JSON.stringify(this.saveGatewayIODHResponseTags));
      this.dhTagMap.clear();
      tags.forEach(dspTag => {
        let parentId = parseInt(dspTag.parentGatewayIODHResponseTagId);
        if (parentId) {
          if (this.dhTagMap.has(parentId)) {
            let childTags = this.dhTagMap.get(parentId);
            childTags.push(dspTag);
            this.dhTagMap.set(parentId, childTags);
          } else {
            let childTags = [];
            childTags.push(dspTag);
            this.dhTagMap.set(parentId, childTags);
          }
        }
      })
      this.updatedTags =[];
      tags.forEach(dspTag=>{
        dspTag.childTags =[];
        if(this.dhTagMap.has(dspTag.id)){
          let childTags = this.dhTagMap.get(dspTag.id);
          childTags = this.checkChildTags(childTags);
          dspTag.childTags = childTags;
          this.dhTagMap.delete(dspTag.id);
        }
        if(!parseInt(dspTag.parentGatewayIODHResponseTagId)){
          this.updatedTags.push(dspTag);
        }

      })
      console.log("form -> " + JSON.stringify(this.gatewayIODHResponseTagForm.value));
  }

  checkChildTags(dspTags: any[]) {
    dspTags.forEach(dspTag => {
      if(this.dhTagMap.has(dspTag.id)){
        let childTags = this.dhTagMap.get(dspTag.id);
        childTags = this.checkChildTags(childTags);
        dspTag.childTags = childTags;
        this.dhTagMap.delete(dspTag.id);
      }
    })
    return dspTags;
  }

  patchFormArrayData(): FormArray {
    const formArray = new FormArray([]);
    if (this.gatewayIODHTags !== null && this.gatewayIODHTags.length !== 0) {
      this.gatewayIODHTags = this.gatewayIODHTags.sort((a,b) =>a.nodeIoTag.name.localeCompare(b.nodeIoTag.name))
      this.gatewayIODHTags.forEach(ioDhTag => {
        let matched = false;
        let index = 0;
        for (let ioDhResponseTag of this.gatewayIODHResponseTags) {
          if (ioDhTag.nodeIoTagId === ioDhResponseTag.nodeIoTagId) {
            matched = true;
            ioDhResponseTag.isAssign = true;
            break;
          }
          else {
            ioDhResponseTag.isAssign = false;
          }
          index++;
        }
        if (matched) {
          formArray.push(this.formBuilder.group({
            id: this.gatewayIODHResponseTags[index].id,
            tagIndex: this.gatewayIODHResponseTags[index].tagIndex,
            tagLength: this.gatewayIODHResponseTags[index].tagLength,
            tagLengthUnit: this.gatewayIODHResponseTags[index].tagLengthUnit,
            tagKeyName: this.gatewayIODHResponseTags[index].tagKeyName,
            gatewayIODHResponseTagFormatId: this.gatewayIODHResponseTags[index].gatewayIODHResponseTagFormatId,
            parentGatewayIODHResponseTagId: this.gatewayIODHResponseTags[index].parentGatewayIODHResponseTagId,
            tagSeparator: this.gatewayIODHResponseTags[index].tagSeparator,
            isParticipantInLength: this.gatewayIODHResponseTags[index].isParticipantInLength,
            isParticipantInErrorCheck: this.gatewayIODHResponseTags[index].isParticipantInErrorCheck,
            nodeIoTagId: this.gatewayIODHResponseTags[index].nodeIoTagId,
            nodeIoDhId: this.gatewayIODHResponseTags[index].nodeIoDhId,
            defaultValue:this.gatewayIODHResponseTags[index].defaultValue,
            status: this.gatewayIODHResponseTags[index].status,
            isAssign: true
          }))
        } else {
          formArray.push(this.formBuilder.group({
            id: [null],
            tagIndex: [null],
            tagLength: [null],
            tagLengthUnit: [null],
            tagKeyName: [null],
            gatewayIODHResponseTagFormatId: [null],
            parentGatewayIODHResponseTagId: [null],
            tagSeparator: [null],
            isParticipantInLength: false,
            isParticipantInErrorCheck: false,
            nodeIoTagId: [null],
            nodeIoDhId: [null],
            status: [null],
            defaultValue:null,
            isAssign: false
          }))
        }
        this.gatewayIODHResponseTags.filter(element => {
          if (element.isAssign == true) {
            this.assignedTags.add(element.nodeIoTagId)
          }
        });
        if (this.assignedTags.size > 0) {
          this.IODHTagError = false;
        }
        else {
          this.IODHTagError = true;
        }
      })
    }
    return formArray
  }

  aasignedGatewayIODHResonseTags() {
    let filteredArray: GatewayIODHTag[] = [];
    this.gatewayIODHResponseTags.forEach(responseTag => {
      for (let ioDhTag of this.gatewayIODHTags) {
        if (responseTag.nodeIoTagId === ioDhTag.nodeIoTagId) {
          filteredArray.push(ioDhTag);
          break;
        }
      }
    })
    this.gatewayIODHTags = filteredArray;
    this.createTheDynamicTableWithIOTags();
  }

  parseInt(id) {
    if (isNaN(id)) {
      return id;
    }
    return parseInt(id);
  }

  cancelIODHRespnseTag() {
    this.formCancelConfirm();
  }

  // Confirm redirect to
  formCancelConfirm() {
    this.globalSharedService.GettingId(this.gatewayId);
    this.globalSharedService.GettingString('communication');
    this.validateTheGatewayIODHResponseTagForm();
    this.router.navigate(['../'],{relativeTo:this.route});
  }

  getTagLengthUnits() {
    this.service.getTagLengthUnits().subscribe(data => {
      this.tagLengthUnits = data;
    })
  }

  resetDHIOTagForm() {
    this.modelNotification.alertMessage(this.globalService.messageType_Warning, 'You will not be able to recover the changes!');
  }

  // Form reset  confirm
  formResetConfirm() {
    this.validateTheGatewayIODHResponseTagForm();
    this.commService.gatewayCommProtocol = this.gatewayCommProtocol;
    this.globalSharedService.GettingId(this.ioDHId);
    this.loadFormData();
  }


  alertRedirection() {
    if (this.warningFlag == "reset") {
      this.formResetConfirm();
    } else if (this.warningFlag == "cancel") {
      this.formCancelConfirm();
    }
    this.warningFlag = "";
  }

  onClickSaveGatewayIODH() {
    this.showLoaderImage=true;
    this.service.saveGatewayIODH(this.gatewayIODH).subscribe(res => {
      this.showLoaderImage=false;
      this.saveSuccess = true;
      this.updateSucess = false;
      // response handling
      this.modelNotification.alertMessage(res['messageType'], res['message']);
      this.validateTheGatewayIODHResponseTagForm();
    }, error => {
      this.showLoaderImage=false;
      this.saveSuccess = true;
      this.updateSucess = false;
      this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
    })
  }

  // redirectTo
  redirectTo() {
    this.formResetConfirm();
    this.previewIODHResponseTagForm = false;
    this.IODHTagForm = true;
   /*  this.globalSharedService.GettingString('communication');
    this.router.navigate(['../'],{relativeTo:this.route}); */
    // $(".bd-example-modal-sm").modal('hide');
  }

  backButton() {
    this.previewIODHResponseTagForm = false;
    this.IODHTagForm = true;
  }
  tagSelected(selectedTag, event) {
    if (event.checked === true) {
      this.assignedTags.add(selectedTag)
    }
    else {
      if (this.assignedTags.has(selectedTag)) {
        this.assignedTags.delete(selectedTag)
      }
    }
    if (this.assignedTags.size > 0) {
      this.IODHTagError = false;
    }
    else {
      this.IODHTagError = true;
    }
  }
}
