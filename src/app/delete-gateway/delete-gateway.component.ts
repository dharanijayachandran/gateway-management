import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { globalSharedService, ScrollbarDirective, UIModalNotificationPage } from 'global';
import { bulkGateway } from '../gateway/model/bulkGateway';
import { Gateway } from '../gateway/model/gateway';
import { GatewayService } from '../gateway/services/gateway/gateway.service';

@Component({
  selector: 'gateway-management-delete-gateway',
  templateUrl: './delete-gateway.component.html',
  styleUrls: ['./delete-gateway.component.css']
})
export class DeleteGatewayComponent implements OnInit {
  @ViewChild(ScrollbarDirective) directiveRef?: ScrollbarDirective;
  deleteGatewayForm: FormGroup;
  dataSource: any;
  matTableElement:any;
  gatewayName =[];
  settings = {};
  formatResponse:any;
  requireFormat:any;
  selectedItems = [];
  resetButtonEnable:boolean=false;
  deleteButtonEnable:boolean=false;
  showTableData:boolean=false;
  viewActionButton:boolean=false;
  gatewayIds:any[];
  value=[];
  deleteGatewayIds:any;
  responseData: Gateway;
  gatewayObj: bulkGateway = new bulkGateway();
  gatewayIdentifier:bulkGateway = new bulkGateway();;
  showLoaderImage:boolean=false;
  noRecordsFound:boolean=false;
  displayedColumns: string[] = ['id','name','nodeIdentifier','authToken','gatewayTypeName','gatewayModelName','gatewayTemplateName'];
  constructor(private formBuilder: FormBuilder,
    private gatewayService: GatewayService,private globalService: globalSharedService) { }
    @ViewChild(UIModalNotificationPage) modelNotification;

  ngOnInit() {
    this.getGateWayList();
    this.loadForm();
    this.loadMultiSelectDropDownProperties();
  }
  loadForm(){
  this.deleteGatewayForm = this.formBuilder.group({
    gatewayId: [null, Validators.pattern("^[a-zA-Z0-9][ a-zA-Z0-9.:#@*&_-]*")],
    nodeIdentifier: [null],
  });
}
loadMultiSelectDropDownProperties(){
    this.settings = {
      enableSearchFilter: true,
      text: $localize`:@@multiSelectDropdown.select:--Select--`,
      noDataLabel: $localize`:@@multiSelectDropdown.noDataLabel:No Data Available`,
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      classes: "myclass custom-class",
      badgeShowLimit: 0,
    };
}
getGateWayList() {
  this.selectedItems=[];
  let organizationId = sessionStorage.getItem('beId');
  this.gatewayName=[];
  this.gatewayService.getGateWayList(organizationId,0,0).subscribe(res => {
       this.requireFormat=this.requiredFormat(res.object);
        this.requireFormat.forEach(data=>{
                 this.gatewayName.push({ id: data.id, itemName: data.itemName,nodeIdentifier:data.nodeIdentifier,
                  authToken:data.authToken, gatewayTypeName:data.gatewayTypeName,
                  gatewayModelName:data.gatewayModelName,
                  gatewayTemplateName:data.gatewayTemplateName, 
               });
        })
    },
    error => {
      console.log(error)
    });
}
requiredFormat(data) {
  return data.map(function (l) {
    return {
      "id": l.id,
      "itemName": l.name,
      "nodeIdentifier":l.nodeIdentifier,
      "authToken":l.authToken,
      "gatewayTypeName":l.gatewayTypeName,
      "gatewayModelName":l.gatewayModelName,
      "gatewayTemplateName":l.gatewayTemplateName
    };
});
}
onKey(event: any) {
  this.selectedItems=[];
  this.deleteGatewayForm.controls["gatewayId"].setValue(null);
  this.deleteGatewayForm.controls['gatewayId'].disable();
  this.viewActionButton=true;
  this.resetButtonEnable=true;
}
onItemSelect(item: any) {
  if(undefined!=this.gatewayIdentifier){
  if(this.gatewayIdentifier.length>0){
    this.gatewayIdentifier.length=0;
    this.selectedItems=[];
  }}
  this.selectedItems.push(item);
  this.viewActionButton=true;
  this.resetButtonEnable=true;
  this.deleteGatewayForm.controls["nodeIdentifier"].setValue(null);
  this.deleteGatewayForm.value.nodeIdentifier=null;
  this.deleteButtonEnable=true;
}
OnItemDeSelect(item: any) {
  this.selectedItems = this.selectedItems.filter(obj => obj !== item);
  if(this.selectedItems.length==0){
    this.deleteGatewayForm.controls['nodeIdentifier'].enable();
    this.deleteButtonEnable=false;
    this.viewActionButton=true;
    this.matTableElement.data=[]; 
  }
}
onSelectAll(items: any) {
  this.deleteGatewayForm.controls["nodeIdentifier"].setValue(null);
  this.selectedItems = items;
  this.deleteButtonEnable=true;
  this.resetButtonEnable=true;
  this.viewActionButton=true;
}
onDeSelectAll() {
  this.selectedItems = [];
  this.matTableElement.data=[]; 
  this.deleteButtonEnable=false;
  this.resetButtonEnable=true;
  this.viewActionButton=false;
  this.showTableData=false;
}
onPaginateViewScrollToTop() {
  if (this.directiveRef) {
    this.directiveRef.scrollToTop();
    this.directiveRef.update();
  }
}
getGatewayDeletionList(){
}
onClickViewTable(){
  if(null!=this.deleteGatewayForm.value.nodeIdentifier){
    this.patchFormArrayData();
  }
  this.showTableData=true;
  let requireFormat=this.selectedItems;
  let getDataSource = requireFormat.sort((a, b) => a.id - b.id);
  this.matTableElement = new MatTableDataSource();
  this.matTableElement.data  = getDataSource; 
  this.deleteGatewayIds=this.matTableElement.data;
  if(this.selectedItems.length<=0){
    this.noRecordsFound=true;
    this.deleteButtonEnable=false;
  }
  else{
    this.noRecordsFound=false;
  }
}
patchFormArrayData(){
  this.deleteButtonEnable=true;
  this.resetButtonEnable=true;
  this.selectedItems = [];
  this.gatewayIdentifier=this.deleteGatewayForm.value.nodeIdentifier;
  this.gatewayIdentifier=this.deleteGatewayForm.value.nodeIdentifier.split(",");
  for (let idx = 0; idx < this.gatewayIdentifier.length; idx++) {
       this.requireFormat.forEach(data=>{
       if(data.nodeIdentifier==this.gatewayIdentifier[idx]){
        this.selectedItems.push(data);
       }
    })
  } 
}
resetForm() {
  this.deleteGatewayForm.controls['nodeIdentifier'].enable();
  this.loadForm();
  this.selectedItems = [];
  this.matTableElement.data=[];
  this.showTableData=false;
  this.resetButtonEnable=false;
  this.deleteButtonEnable=false;
  this.viewActionButton=false;
}
clickDeleteBulkGateways(){
  this.modelNotification.alertMessage(this.globalService.messageType_Error, 'You will not be able to recover this Gateway!');
}
confirmDeleteBulkGateways(){
  this.gatewayIds=[];
  let organizationId = sessionStorage.getItem('beId');
  this.iterateGatewayList(this.selectedItems);
  let userId = sessionStorage.getItem('userId');
  this.gatewayObj.gatewayIds = this.gatewayIds;
  this.gatewayObj.userId = Number(userId);
  let gateways:bulkGateway;
  gateways=this.gatewayObj;
  this.showLoaderImage=true;
  this.showTableData=false;
  this.resetButtonEnable=false;
  this.viewActionButton=false;
  this.gatewayService.deleteBulkGateway(organizationId,gateways).subscribe(res => {
  this.showLoaderImage=false;
  this.modelNotification.alertMessage(res['messageType'], res['message']);
  this.getGateWayList();
  this.resetForm();
    },
    error => {
      this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
    })
}
iterateGatewayList(data: any[]) {
  let ids:any;
  data.forEach(e => {
    if (data.length != 0) {
      ids=e.id;
    }
    this.gatewayIds.push(ids)
  })
}
}