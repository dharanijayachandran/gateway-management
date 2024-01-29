import { DatePipe, formatDate } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ScrollbarDirective, UIModalNotificationPage } from 'global';
import { MatTablePaginatorComponent } from 'src/app/shared/components/mat-table-paginator/mat-table-paginator.component';
import { globalShareServices } from 'src/app/shared/globalShareServices';
import { serviceRequest } from '../../model/serviceRequest';
import { ServiceRequestCriteria } from '../../model/ServiceRequestCriteria';

import { uploadTemplateValue } from '../../model/uploadTemplate';
import { GatewayService } from '../../services/gateway/gateway.service';

@Component({
  selector: 'gateway-management-service-request',
  templateUrl: './service-request.component.html',
  styleUrls: ['./service-request.component.css']
})
export class ServiceRequestComponent implements OnInit {
  @ViewChild(ScrollbarDirective, { static: false }) directiveRef?: ScrollbarDirective;
  @ViewChild('myPaginatorChildComponent') myPaginatorChildComponent: MatTablePaginatorComponent;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  uploadedExcel: string;
  showLoaderImage: boolean = false;
  dataSource:any;
  dateForm:FormGroup;
  endDate: { month: number; day: number; year: number; };
  minDate: { month: number; day: number; year: number; };
  todayDate: { month: number; day: number; year: number; };
  curDate: string;
  bulkGateway:uploadTemplateValue;
  validateTime = false;
  validateEndTime: boolean;
  myPaginator;
  pageIndex: number;
  pageSize: number;
  length: number;
  viewGatewayObj:any=[];
  displayTable:boolean;
  noRecordFound:boolean;
  uploadGatewaysObject:any;
  errorRecordsObject:any=[];
  enableButton:boolean;
  validateFromDateField:boolean;
  startDateFormat:any;
  endDateFormat:any;
  errorRecordTable:boolean;
  errorRecordPanel:string;
  @ViewChild(UIModalNotificationPage) modelNotification;
  displayedColumns: string[] = ['serialnumber','serviceRequest','url','httpMethod','status','action'];
  displayErrorRecordColumns: string[] = ['sno','name','identifier','errorMessage'];
  organizationName = sessionStorage.getItem('beName');
  showErrorLoaderImage:boolean;
  gatewayTemplate:any;
  assetTemplate:any;
  organizationId = sessionStorage.getItem('beId');
  constructor( private globalShareService: globalShareServices,private formBuilder: FormBuilder,private gatewayService: GatewayService,
    public datepipe: DatePipe) { }
  ngOnInit(): void {
    this.uploadedExcel = 'serviceRequestForm';
    this.dataSource = new MatTableDataSource();
    this.loadForm();
    this.futureDateDisabled();
    if(null != this.globalShareService.uploadTemplateObj){
    this.setTemplateObject(this.globalShareService.uploadTemplateObj);}
  }
  loadForm() {
    this.dateForm = this.formBuilder.group({
      serviceRequest:[null],
      fromDate:[null],
      tillDate:[null],
      fromTime:[null],
      tillTime:[null]
    });
  }
  setTemplateObject(uploadTemplateResponse){
    this. displayTable = true;
    this.uploadGatewaysObject = [];
    this.uploadGatewaysObject.push(this.iterate(uploadTemplateResponse));
    this.dataSource = new MatTableDataSource();
    this.dataSource.data = this.uploadGatewaysObject;
}
iterate(data) {
  let returnObj;
  return returnObj= {
      "serviceRequestNumber": data.serviceRequestNumber,
      "url":data.url,
      "httpMethod":data.httpMethod,
      "status":data.status,
      "totalRecords":data.totalRecords,
      "inValidRecords":data.inValidRecords,
      "validRecords":data.validRecords,
 }}
 formatServiceRequestNumber(data){
    return data = {
        "serviceRequestNumbers": data.serviceRequestNumbers,
        "status":data.status
    }}
 getFieldData(value,id){
      this.showErrorLoaderImage = true;
      this.noRecordFound = false;
      this.errorRecordPanel = id;
      this.errorRecordsObject = [];
       let serviceRequest:ServiceRequestCriteria = new ServiceRequestCriteria();
       serviceRequest.serviceRequestNumbers = [value];
       serviceRequest.status = id;
      this.gatewayService.getFieldDataFromServiceRequest(this.organizationId, serviceRequest).subscribe((res) => {
        this.errorRecordTable = true;
        this.showErrorLoaderImage = false;
        if(null != res){
          this.noRecordFound = false;
          this.errorRecordsObject = (res.map(t=>t.serviceRequestDetails)[0]);
          let gatewayTemp:any= JSON.stringify(res[0].gatewayTemplate);
          gatewayTemp = JSON.stringify(JSON.parse(gatewayTemp));
          gatewayTemp = gatewayTemp.split(":");
          this.gatewayTemplate = JSON.stringify(gatewayTemp[1]).replace(/[&\/\\#, +()$~%.'":*?<>{}]/g, '');
          let assetTemp:any = JSON.stringify(res[0].assetTemplate);
          assetTemp = JSON.stringify(JSON.parse(assetTemp));
          assetTemp = assetTemp.split(":");
          this.assetTemplate = JSON.stringify(assetTemp[1]).replace(/[&\/\\#, +()$~%.'":*?<>{}]/g, '');
        }else{
        this.noRecordFound = true;
        }
      },  error => {
        console.log(error)
      });
  }
getServiceRequest(serviceRequestValue){
  this.showLoaderImage = true;
    this.displayTable = true;
    this.gatewayService.getServiceRequest(this.organizationId, serviceRequestValue,this.startDateFormat,this.endDateFormat).subscribe
    ((res:serviceRequest[]) => {
      this.showLoaderImage = false;
      if (res !=null){
        this.noRecordFound=false;
        this.dataSource = new MatTableDataSource();
        this.dataSource.data = res;
     } else {
        this.noRecordFound=true;
        this.dataSource = 0;
     }
    },  error => {
      console.log(error)
    });
}
onClickViewTable(){
  let serviceRequestCriteria :ServiceRequestCriteria = new ServiceRequestCriteria();
  let serviceRequestNumbersInput = this.dateForm.value.serviceRequest;
 if(serviceRequestNumbersInput){
  serviceRequestCriteria.serviceRequestNumbers = serviceRequestNumbersInput.split(",");
 }
 this.getDateTime();
 this.getServiceRequest(serviceRequestCriteria)
}
getDateTime(){
  if(this.dateForm.value.tillDate){
    if (this.dateForm.value.tillTime === null) {
      this.dateForm.value.tillTime = '23:59';
    }
  this.endDateFormat = Date.parse(this.dateForm.value.tillDate.year+'/'+this.dateForm.value.tillDate.month+'/'+this.dateForm.value.tillDate.day+' ' +this.dateForm.value.tillTime);
}
if(this.dateForm.value.fromDate){
  if (this.dateForm.value.fromTime === null) {
    this.dateForm.value.fromTime = '00:00';
  }
  if(this.dateForm.value.tillDate == null){
    this.dateForm.value.tillDate = formatDate(new Date(), 'MM/dd/yyyy', 'en') +' 23:59';
}
  this.startDateFormat = Date.parse(this.dateForm.value.fromDate.year+'/'+this.dateForm.value.fromDate.month+'/'+this.dateForm.value.fromDate.day+' ' +this.dateForm.value.fromTime);
}
if(this.startDateFormat == null){
  this.startDateFormat ='';
}
if(this.endDateFormat == null){
  this.endDateFormat ='';
}
}
  backButton(event) {
    this.noRecordFound = false;
    this.errorRecordTable = false;
    this.uploadedExcel = 'serviceRequestForm';
  }
  onKey(event: any) {
   if(this.dateForm.value.serviceRequest.length > 0 || this.dateForm.value.fromDate){
      this.enableButton = true;
   }
   if(this.dateForm.value.tillDate && this.dateForm.value.fromDate == null){
      this.enableButton = false;
   }
    }
  clickToView(event) {
    this.assetTemplate = [];
    this.gatewayTemplate = [];
    this.showLoaderImage = true;
    let serviceRequestCriteria :ServiceRequestCriteria = new ServiceRequestCriteria();
    serviceRequestCriteria.serviceRequestNumbers = [event.serviceRequestNumber];
    this.gatewayService.getServiceRequest(this.organizationId,serviceRequestCriteria,'','').subscribe
    ((res:serviceRequest[]) => {
    this.showLoaderImage = false;
    if(null!=res){
    this.uploadedExcel='readView';
    this.viewGatewayObj = res[0];
    }
    },error => {
      console.log(error)})
    }
    validateFromStartFromEndDate() {
      let date = this.fetchEndDateFromPicker();
      if (null != date) {
        let fullDate = date.split('/');
        this.endDate =
        {
          month: parseInt(fullDate[0]),
          day: parseInt(fullDate[1]),
          year: parseInt(fullDate[2]),
        }
        this.addMinDateValue();
      }
    }
    fetchEndDateFromPicker() {
      if (null != this.dateForm.value.tillDate) {
        let newDay = this.dateForm.value.tillDate.day;
        if (newDay <= 9) {
          newDay = '0' + newDay;
        }
        let newMon = this.dateForm.value.tillDate.month;
        if (newMon <= 9) {
          newMon = '0' + newMon;
        }
        let newYrs = this.dateForm.value.tillDate.year;
        let reqDateFormat = newMon + '/' + newDay + '/' + newYrs;
        return reqDateFormat;
      }
    }
    fetchStartDateFromPicker() {
      if (null != this.dateForm.value.fromDate) {
        let newYrs = this.dateForm.value.fromDate.year;
        let newDay = this.dateForm.value.fromDate.day;
        if (newDay <= 9) {
          newDay = '0' + newDay;
        }
        let newMon = this.dateForm.value.fromDate.month;
        if (newMon <= 9) {
          newMon = '0' + newMon;
        }
        let reqDateFormat = newMon + '/' + newDay + '/' + newYrs;
        return reqDateFormat;
      }
    }
    addMinDateValue() {
      let startDate = this.fetchStartDateFromPicker();
      if (null != startDate) {
        let fullDate = startDate.split('/');
        this.minDate =
        {
          month: parseInt(fullDate[0]),
          day: parseInt(fullDate[1]),
          year: parseInt(fullDate[2]),
        }
      }
    }
    validateFromDate() {
      let startDay = this.dateForm.value.fromDate.day;
      let endDay = this.dateForm.value.tillDate.day;
      if (startDay > endDay) {
        this.dateForm.patchValue({
          fromDate: this.fetchStartDateFromPicker()
        }, { emitEvent: false });
      }
      let endMonth = this.dateForm.value.tillDate.month;
      let startMonth = this.dateForm.value.fromDate.month;
      if (endMonth > startMonth) {
        this.dateForm.patchValue({
          fromDate: this.fetchStartDateFromPicker()
        }, { emitEvent: false });
      }
    }
    changeStartDate(event: any){
      this.validateFromDateField = false;
      if(null != this.dateForm.value.serviceRequest){
      this.enableButton = true;
      }
      if(this.dateForm.value.tillDate && this.dateForm.value.fromDate){
        this.enableButton = true;
      }
      this.validateStartAndEndTime('fromTime');
    }
    changeEndDate(event:any){
      if(this.dateForm.value.tillDate){
        if(this.dateForm.value.fromDate == null){
        this.enableButton = false;
        this.validateFromDateField = true;
        this.dateForm.controls['fromDate'].markAsTouched();
        this.dateForm.controls['fromDate'].updateValueAndValidity();
        this.dateForm.controls['fromDate'].setErrors({
          'required': true,
        })
      }
    }
    if(this.dateForm.value.tillDate && this.dateForm.value.fromDate){
      this.enableButton = true;
    }
      this.validateStartAndEndTime('tillTime');
    }
    futureDateDisabled() {
      this.curDate = formatDate(new Date(), 'MM/dd/yyyy', 'en');
      let fullDate = this.curDate.split('/');
      this.todayDate =
      {
        month: parseInt(fullDate[0]),
        day: parseInt(fullDate[1]),
        year: parseInt(fullDate[2])
      }
      this.minDate = this.dateForm.value.fromDate;
      this.endDate = this.todayDate
    }
    validateStartAndEndTime(id:any) {
      this.resetTimeValidationControlls()
        let startDate = this.fetchStartDateFromPicker()
        let endDate = this.fetchEndDateFromPicker()
        if (startDate === endDate) {
          this.bulkGateway = <uploadTemplateValue>this.dateForm.value;
          let startTime = this.bulkGateway.fromTime;
          let endTime = this.bulkGateway.tillTime;
          let strtHr, strtMin, endHr, endMin;
          if(startTime!=null){
          if (startTime.length != 0) {
            let startTimeArray = startTime.split(':')
            strtHr = parseInt(startTimeArray[0]);
            strtMin = parseInt(startTimeArray[1]);
          }}
          if(endTime!=null){
          if (endTime.length != 0) {
            let endTimeTimeArray = endTime.split(':')
            endHr = parseInt(endTimeTimeArray[0]);
            endMin = parseInt(endTimeTimeArray[1]);
          }}
          if (id == 'fromTime'){
            if (strtHr >= endHr) {
              if (strtMin >= endMin) {
                this.validateTime = true
                this.dateForm.controls['fromTime'].markAsTouched();
                this.dateForm.controls['fromTime'].updateValueAndValidity();
                this.dateForm.controls['fromTime'].setErrors({
                  'required': true
                })
              } if (strtHr > endHr) {
                this.validateTime = true
                this.dateForm.controls['fromTime'].markAsTouched();
                this.dateForm.controls['fromTime'].updateValueAndValidity();
                this.dateForm.controls['fromTime'].setErrors({
                  'required': true
                })
              }
            }
          }
          else if(id=='tillTime'){
            if (strtHr >= endHr) {
              if (strtMin >= endMin) {
                this.validateEndTime = true
                this.dateForm.controls['tillTime'].markAsTouched();
                this.dateForm.controls['tillTime'].updateValueAndValidity();
                this.dateForm.controls['tillTime'].setErrors({
                  'required': true
                })
              } if (strtHr > endHr) {
                this.validateEndTime = true
                this.dateForm.controls['tillTime'].markAsTouched();
                this.dateForm.controls['tillTime'].updateValueAndValidity();
                this.dateForm.controls['tillTime'].setErrors({
                  'required': true
                })
              }
            }
          }
        }
      }
      resetTimeValidationControlls() {
        this.validateTime = false;
        this.validateEndTime = false;
        this.dateForm.controls['fromTime'].markAsUntouched()
        this.dateForm.controls['fromTime'].markAsPristine()
        this.dateForm.controls['fromTime'].updateValueAndValidity();
        this.dateForm.controls['tillTime'].markAsUntouched()
        this.dateForm.controls['tillTime'].markAsPristine()
        this.dateForm.controls['tillTime'].updateValueAndValidity();
      }
      refreshTableListFunction() {
      }
      onPaginateViewScrollToTop() {
        this.directiveRef.scrollToTop();
        this.directiveRef.update();
      }
      resetForm(){
        this.loadForm();
        this.validateFromDateField = false;
        this.startDateFormat = null;
        this.endDateFormat = null;
        this.enableButton = false;
        this.displayTable = false;
        this.noRecordFound = false;
        this.dataSource = 0;
        this.viewGatewayObj = [];
      }
}
