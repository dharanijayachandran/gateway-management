import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UIModalNotificationPage } from 'global';
import { Observable } from 'rxjs';
import { globalShareServices } from 'src/app/shared/globalShareServices';
import { DialogService } from 'src/app/shared/services/dialog/dialog.service';
import { globalSharedService } from 'src/app/shared/services/global/globalSharedService';
import { GatewayCommProtocol } from '../../model/communication';
import { DataProtocolFormat } from '../../model/DataProtocolFormat';
import { GatewayIODataHandler } from '../../model/gatewayIODataHandler';
import { GatewayIODHTag } from '../../model/gatewayIODHTag';
import { GatewayIOTag } from '../../model/gatewayIOTag';
import { TagLengthUnit } from '../../model/tagLengthUnit';
import { CommunicationService } from '../../services/communication/communication.service';
import { GatewayIoDhTagService } from '../../services/gatewayIODHTag/gateway-io-dh-tag.service';
@Component({
  selector: 'app-gateway-io-dh-tag',
  templateUrl: './gateway-io-dh-tag.component.html',
  styleUrls: ['./gateway-io-dh-tag.component.css']
})
export class GatewayIoDhTagComponent implements OnInit {
  showLoaderImage: boolean;

  // It help to if there are no pending changes, just allow deactivation; else confirm first code starts here
  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    if (this.hasOwnProperty('gatewayIODHTagForm')) {
      if (this.gatewayIODHTagForm.dirty) {
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

  IODHTagError: boolean;
  warningFlag: string;

  constructor(private globalSharedService: globalShareServices,
    private router: Router, private formBuilder: FormBuilder,
    private commService: CommunicationService, private service: GatewayIoDhTagService
    , private globalService: globalSharedService,
    private dialogService: DialogService,
    private route: ActivatedRoute) { }

  gatewayIODHTagForm: FormGroup;
  gatewayIOTags: GatewayIOTag[];

  gatewayCommProtocol: GatewayCommProtocol;
  dataFormats: DataProtocolFormat[];
  gatewayIODHTags: GatewayIODHTag[];
  gatewayIODH: GatewayIODataHandler;
  saveGatewayIODH: GatewayIODataHandler;
  saveGatewayIODHTags: GatewayIODHTag[];
  patchGatewayIODHTags: GatewayIODHTag[];
  tagLengthUnits: TagLengthUnit[];
  ioDHId: any;
  //ioDHType: string;
  operationMode: any;
  gatewayId: number;
  //tagIOMode: string;
  saveSuccess = false;
  updateSucess = false;
  serviceMessage: string;
  previewIODHTagForm = false;
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
    //this.ioDHType = this.globalSharedService.name;
    this.validateTheGatewayIODHTagForm();
    this.getGatewayIODHByIODHId();
    this.getDataFormats();
    this.getTagLengthUnits();
  }

  validateTheGatewayIODHTagForm() {
    this.gatewayIODHTagForm = this.formBuilder.group({
      id: [null],
      templateName: [''],
      communication: [''],
      name: [''],
      operationMode: [''],
      displayIOTag: ['All'],
      nodeIoDhTags: this.formBuilder.array([
        this.addFormArray()
      ])
    })
  }

  addFormArray(): FormGroup {
    return this.formBuilder.group({
      id: [null],
      tagIndex: [null, [Validators.pattern("[0-9]*")]],
      tagLength: [null, [Validators.pattern("[0-9]*")]],
      tagLenthUnit: [null],
      tagKeyName: [null],
      dataFormatId: [null],
      parentNodeIoDhTagId: [null],
      tagSeparator: [null],
      isParticipantInLength: [false],
      isParticipantInErrorCheck: [false],
      nodeIoTagId: [null],
      nodeIoDhId: [null],
      isAssign: [false],
      dateTimeFormat: [''],
      defaultValue:null,
      status: ['Active']
    })
  }

  patchCommProtocolData() {
    this.gatewayIODHTagForm.patchValue({
      templateName: this.gatewayCommProtocol.gateway.name,
      communication: this.gatewayCommProtocol.commProtocol.name,
      name: this.gatewayIODH.name,
      id: this.gatewayIODH.id,
    })
    if (this.gatewayIODH.operationMode === 'R') {
      this.gatewayIODHTagForm.patchValue({
        operationMode: 'Read'
      })
    }
    else if (this.gatewayIODH.operationMode === 'W') {
      this.gatewayIODHTagForm.patchValue({
        operationMode: 'Write'
      })
    }
  }

  getGatewayIOTagsByTemplateId() {
    this.service.getGatewayIOTagsByTemplateId(this.gatewayCommProtocol.gateway.id, this.operationMode).subscribe(data => {
      this.gatewayIOTags = data;
      /* this.gatewayIOTags = this.gatewayIOTags.filter(ioTag => {
        if (ioTag.tagIOMode === this.operationMode) {
          return ioTag;
        }
      }) */
      this.createTheDynamicTableWithIOTags();
      this.setNodeIOTagDetails();
    },
      (error: any) => {
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      })
  }


  createTheDynamicTableWithIOTags() {
    const control = <FormArray>this.gatewayIODHTagForm.controls['nodeIoDhTags'];
    for (let i = control.length - 1; i >= 0; i--) {
      control.removeAt(i)
    }
    for (let ioTag of this.gatewayIOTags) {
      control.push(this.addFormArray());
    }
    if (this.patchGatewayIODHTags !== null && this.patchGatewayIODHTags.length !== 0) {
      this.gatewayIODHTagForm.setControl('nodeIoDhTags', this.patchFormArrayData());
    }
    else {
      this.IODHTagError = true;
    }
  }

  getDataFormats() {
    this.service.getDataFormats().subscribe(data => {
      this.dataFormats = data;
    })
  }

  getGatewayIODHByIODHId() {
    this.service.getGatewayIODHByIODHId(this.ioDHId).subscribe(data => {
      this.gatewayIODH = data;
      if (this.gatewayIODH.operationMode === 'R') {
        this.operationMode = 'I';
      }
      if (this.gatewayIODH.operationMode === 'W') {
        this.operationMode = 'O';
      }
      this.patchGatewayIODHTags = this.gatewayIODH.nodeIoDhTags;
      this.patchGatewayIODHTags.forEach(patchGatewayIODHTag=>{
        patchGatewayIODHTag.nodeIODHTagName=patchGatewayIODHTag.nodeIoTag.name;
      })
      this.getGatewayIOTagsByTemplateId();
      this.patchCommProtocolData();

    },
      (error: any) => {
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      })
  }
  setNodeIOTagDetails() {
    for(let gatewayIODHTag of this.patchGatewayIODHTags){
      if((gatewayIODHTag.nodeIoTag==null ||gatewayIODHTag.nodeIoTag==undefined )){
      for(let gatewayIOTag of this.gatewayIOTags){
        if(gatewayIOTag!=null){
          if(gatewayIODHTag.nodeIoTagId===gatewayIOTag.id){
            gatewayIODHTag.nodeIoTag=gatewayIOTag;
            break;
          }
        }
      }
    }
    }
  }

  aasignedGatewayIODHTags() {
    let fileterdArray: GatewayIOTag[] = [];
    this.patchGatewayIODHTags.forEach(ioDhTag => {
      for (let ioTag of this.gatewayIOTags) {
        if (ioTag.id === ioDhTag.nodeIoTagId) {
          fileterdArray.push(ioTag);
          break;
        }
      }
    })
    this.gatewayIOTags = fileterdArray
    this.createTheDynamicTableWithIOTags();
  }

  previewFormData() {

    this.saveGatewayIODH = <GatewayIODataHandler>this.gatewayIODHTagForm.value;
    this.saveGatewayIODH.gatewayId = this.gatewayCommProtocol.gateway.id;
    this.saveGatewayIODHTags = this.saveGatewayIODH.nodeIoDhTags;
    this.saveGatewayIODHTags = this.saveGatewayIODHTags.filter(ioDhTag => ioDhTag.isAssign);
    let temGateways = this.patchGatewayIODHTags;
    this.saveGatewayIODHTags.forEach(ioDHTag => {
      this.patchGatewayIODHTags = this.patchGatewayIODHTags.filter(pIODHtag => pIODHtag.id != ioDHTag.id);
    })

    if (this.patchGatewayIODHTags.length != 0) {
      this.patchGatewayIODHTags.forEach(pIODHtag => {
        pIODHtag.status = 'Deleted';
        this.saveGatewayIODHTags.push(pIODHtag);
      })
    }
    this.patchGatewayIODHTags = temGateways
    this.saveGatewayIODHTags.forEach(ioDhTag => {
      let dataFormatId = this.parseInt(ioDhTag.dataFormatId);
      for (let dataFormat of this.dataFormats) {
        let id = this.parseInt(dataFormat.id);
        if (id === dataFormatId) {
          ioDhTag.dataFormateName = dataFormat.name;
          break;
        }
      }
    })
    let userId = sessionStorage.getItem('userId');
    this.saveGatewayIODHTags.forEach(ioDhTag => {
      ioDhTag.created_by = this.parseInt(userId);
      ioDhTag.nodeIoDhId = this.saveGatewayIODH.id;
      ioDhTag.nodeIODHName = this.saveGatewayIODH.name;
      let nodeIoTagId = this.parseInt(ioDhTag.nodeIoTagId);
      let parentId = this.parseInt(ioDhTag.parentNodeIoDhTagId)
      for (let ioTag of this.gatewayIOTags) {
        let id = this.parseInt(ioTag.id);
        if (nodeIoTagId === id) {
          ioDhTag.tagName = ioTag.name;
        }
      }
    })
    this.saveGatewayIODHTags.forEach(innerIoDhTag => {
      for (let lengthUnit of this.tagLengthUnits) {
        if (lengthUnit.id === innerIoDhTag.tagLenthUnit) {
          innerIoDhTag.tagLenthUnitName = lengthUnit.value;
          break;
        }
      }
      for (let parent of this.saveGatewayIODHTags) {
        if(innerIoDhTag.id && parent.parentNodeIoDhTagId){
        if (innerIoDhTag.id == parent.parentNodeIoDhTagId) {
          let nodeIoTagId = this.parseInt(innerIoDhTag.nodeIoTagId);
          for (let ioTag of this.gatewayIOTags) {
            let id = this.parseInt(ioTag.id);
            if (nodeIoTagId === id) {
              parent.parentTagName = ioTag.name;
              break;
            }
          }
        }
      }
      }
    })


    // if (this.saveGatewayIODHTags !== null && this.saveGatewayIODHTags.length !== 0) {
    this.previewIODHTagForm = true;
    this.IODHTagForm = false;
    this.saveGatewayIODHTags = this.saveGatewayIODHTags.sort((a,b) => a.tagName.localeCompare(b.tagName))
    this.saveGatewayIODH.nodeIoDhTags = this.saveGatewayIODHTags;
    let tags = JSON.parse(JSON.stringify(this.saveGatewayIODHTags));

    this.dhTagMap.clear();
    tags.forEach(dspTag => {
      let parentId = parseInt(dspTag.parentNodeIoDhTagId);
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
      dspTag.childTags = [];
      if(this.dhTagMap.has(dspTag.id)){
        let childTags = this.dhTagMap.get(dspTag.id);
        childTags = this.checkChildTags(childTags);
        dspTag.childTags = childTags;
        this.dhTagMap.delete(dspTag.id);
      }
      if(!parseInt(dspTag.parentNodeIoDhTagId)){
        this.updatedTags.push(dspTag);
      }

    })

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
    if (this.gatewayIOTags !== null && this.gatewayIOTags.length !== 0) {
      this.gatewayIOTags = this.gatewayIOTags.sort((a,b) => a.name.localeCompare(b.name))
      this.gatewayIOTags.forEach(ioTag => {
        let matched = false;
        let index = 0;
        for (let ioDhTag of this.patchGatewayIODHTags) {
          if (ioTag.id === ioDhTag.nodeIoTagId) {
            matched = true;
            ioDhTag.isAssign = true;
            break;
          }
          else {
            ioDhTag.isAssign = false;
          }
          index++;
        }
        if (matched) {
          formArray.push(this.formBuilder.group({
            id: this.patchGatewayIODHTags[index].id,
            tagIndex: this.patchGatewayIODHTags[index].tagIndex,
            tagLength: this.patchGatewayIODHTags[index].tagLength,
            tagLenthUnit: this.patchGatewayIODHTags[index].tagLenthUnit,
            tagKeyName: this.patchGatewayIODHTags[index].tagKeyName,
            dataFormatId: this.patchGatewayIODHTags[index].dataFormatId,
            parentNodeIoDhTagId: this.patchGatewayIODHTags[index].parentNodeIoDhTagId,
            tagSeparator: this.patchGatewayIODHTags[index].tagSeparator,
            isParticipantInLength: this.patchGatewayIODHTags[index].isParticipantInLength,
            isParticipantInErrorCheck: this.patchGatewayIODHTags[index].isParticipantInErrorCheck,
            nodeIoTagId: this.patchGatewayIODHTags[index].nodeIoTagId,
            nodeIoDhId: this.patchGatewayIODHTags[index].nodeIoDhId,
            status: this.patchGatewayIODHTags[index].status,
            dateTimeFormat: this.patchGatewayIODHTags[index].dateTimeFormat,
            defaultValue:this.patchGatewayIODHTags[index].defaultValue,
            isAssign: true
          }))
        } else {
          formArray.push(this.formBuilder.group({
            id: null,
            tagIndex: null,
            tagLength: null,
            tagLenthUnit: '',
            tagKeyName: '',
            dataFormatId: null,
            parentNodeIoDhTagId: null,
            tagSeparator: '',
            isParticipantInLength: false,
            isParticipantInErrorCheck: false,
            nodeIoTagId: null,
            nodeIoDhId: null,
            dateTimeFormat: '',
            status: ['Active'],
            isAssign: false,
            defaultValue:null
          }))
        }
        this.patchGatewayIODHTags.filter(element => {
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


  parseInt(id) {
    if (isNaN(id)) {
      return id;
    }
    return parseInt(id);
  }

  getTagLengthUnits() {
    this.service.getTagLengthUnits().subscribe(data => {
      this.tagLengthUnits = data;
    })
  }

  cancelIODHTag() {
    this.formCancelConfirm();
  }

  // Confirm redirect to
  formCancelConfirm() {
    this.globalSharedService.GettingId(this.gatewayId);
    this.globalSharedService.GettingString('communication');
    this.router.navigate(['../'], { relativeTo: this.route });
  }


  onClickSaveGatewayIODH() {
    this.showLoaderImage = true;
    this.service.saveGatewayIODH(this.saveGatewayIODH).subscribe(res => {
      this.showLoaderImage = false;
      this.saveSuccess = true;
      this.updateSucess = false;
      // response handling
      this.modelNotification.alertMessage(res['messageType'], res['message']);
    }, error => {
      this.showLoaderImage = false;
      this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
    })
  }

  // Redirect to
  redirectTo() {
    this.previewIODHTagForm = false;
    this.IODHTagForm = true;
    this.globalSharedService.GettingId(this.saveGatewayIODH.gatewayId);
    this.globalSharedService.GettingString('communication');
    this.validateTheGatewayIODHTagForm();
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  backButton() {
    this.previewIODHTagForm = false;
    this.IODHTagForm = true;
  }

  resetDHIOTagForm(event) {
    this.modelNotification.alertMessage(this.globalService.messageType_Warning, 'You will not be able to recover the changes!');
  }

  // Form reset  confirm
  formResetConfirm() {
    this.commService.gatewayCommProtocol = this.gatewayCommProtocol;
    this.globalSharedService.GettingId(this.ioDHId);
    this.loadFormData();
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

  helpMessage() {
    let message;
    message = '<div class="sweatalert-help-block-message">' + 'It is the format in which date and/or time is coming in the data handler.' +
      'Example:<br/>' +
      '<ol>' +
      '<li>If date time is in millisecond then the format will be epochinmillis </li>' +
      '<li>If date time is in epoch then the format will be epoch </li>' +
      '<li>If date time is 1970-12-01 23:00:00.0 then the format will be yyyy-MM-dd HH:mm:ss.S </li>' +
      '<li>If date time is 1970-12-01 then the format will be yyyy-MM-dd </li>' +
      '</ol></div>'
    this.modelNotification.helpMessage(message);
  }

}
