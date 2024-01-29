import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';
import { CommunicationService } from '../../services/communication/communication.service';
import { GatewayCommProtocol } from '../../model/communication';
import { CommProtocolParam } from '../../model/commProtocolParam';
import { ErrorChecktype } from '../../model/errorCheckType';
import { ErrorCheckAlgorithm } from '../../model/errorCheckAlgorithm';
import { GatewayCommProtocolIOTag } from '../../model/gatewayCommIOTags';
import { GatewayIODataHandler } from '../../model/gatewayIODataHandler';
import { globalSharedService } from 'src/app/shared/services/global/globalSharedService';
import { GatewayIoDhService } from '../../services/gatewayIODataHandler/gateway-io-dh.service';
import { GatewayCommProtocolParamValue } from '../../model/gatewayCommProtocolParamValue';
import { CommProtocolParamGroup } from '../../model/commProtocolParamGroup';
import { ScrollbarDirective, UIModalNotificationPage } from 'global';
import { MatTablePaginatorComponent } from 'src/app/shared/components/mat-table-paginator/mat-table-paginator.component';
import { globalShareServices } from 'src/app/shared/globalShareServices';
import { EmitType } from '@syncfusion/ej2-base';
import { FilteringEventArgs } from '@syncfusion/ej2-dropdowns';
import { Query } from '@syncfusion/ej2-data';
@Component({
  selector: 'app-communication',
  templateUrl: './communication.component.html',
  styleUrls: ['./communication.component.css']
})

export class CommunicationComponent implements OnInit {

  // Importing child component to
  @ViewChild(UIModalNotificationPage) modelNotification;
  @ViewChild('myGatewayCommPaginator') myGatewayCommPaginator: MatTablePaginatorComponent;
  @ViewChild('myIODataHandlerPaginator') myIODataHandlerPaginator: MatTablePaginatorComponent;
  IODataHandlerPaginator;
  gatewayCommPaginator;
  @ViewChild(ScrollbarDirective) directiveRef?: ScrollbarDirective;

  commProtocol: GatewayCommProtocol = new GatewayCommProtocol()
  communicationReadModeView = false;
  communicationWriteModeView = true;
  gatewayCommIOTagsListView = true;
  IODataHandlersListView = true;
  errorCheckTypes: ErrorChecktype[];
  serviceGatewayCommProtocolParamValues: GatewayCommProtocolParamValue[];
  errorCheckAlgorithms: ErrorCheckAlgorithm[];
  gatewayCommProtocols: GatewayCommProtocol[];
  commProtocolParams: CommProtocolParam[] = [];
  uiComponentTypes: any[];
  commProtocolParamValues: any[];
  commParamValuesForRadio: any[];
  dataHandlerFormats: any[];
  activeLinkIndex = -1;
  apiurl = environment.baseUrl_MasterDataManagement;
  gatewayCommIOTagDataSource: any;
  IODataHandlerDataSource: any;
  gatewayCommIOTagDisplayedColumns: string[] = ['id', 'ioTag', 'index', 'length', 'lengthUnit', 'tagKeyName', 'dataFormat', 'parentTag', 'action'];
  IODHdisplayedColumns: string[] = ['id', 'name', 'dhIdentifier', 'operationMode', 'responseRequired', 'status', 'action'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatPaginator) paginatorForIOTags: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  gatewayCommProtocolForm: FormGroup;
  fb: FormGroup;
  param: CommProtocolParam = new CommProtocolParam();
  NoRecordsFoundIOTag: boolean = false;
  NoRecordsFoundIODH: boolean = false;
  gatewayIODataHandler: GatewayIODataHandler;
  gatewayIODHViewMode = false;
  gatewayId: any;
  serviceMessage: string;
  //this.confirmAlert = true;
  commIOTag: GatewayCommProtocolIOTag;
  commProtocolParamGroups: CommProtocolParamGroup[];
  createDeleteFlag: string;
  deleteGatewayID: any;
  gatewayDHId: any;
  warningFlag: string;
  resetgatewayCommProtocolFormObj: any;
  communicatinIOTags: GatewayCommProtocolIOTag[];
  showLoaderImage = false;
  dataTypes: any[];
  communicationForm: FormGroup;
  template: any;
  gatewayAndTemplateRoutingPath: string;
  addGatewayCommIoTagRoutingPath: string;
  IODataHandlerFormRoutingPath: string;
  gatewayIoDhTagRoutingPath: string;
  gatewayIoDhResponseTagRoutingPath: string;

  public dataHandlerFormatFields: Object = {
    text: 'name',
    value: 'id'
  };
  public errorCheckTypeFields: Object = {
    text: 'name',
    value: 'id'
  };
  public errorCheckAlgorithmFields: Object = {
    text: 'name',
    value: 'id'
  };
  // filtering event handler to filter a Menu Icon Name
  //pass the filter data source, filter query to updateData method.
  public onFilteringDataHandlerFormat: EmitType<FilteringEventArgs> = (e: FilteringEventArgs) => {
    this.filterData(e,this.dataHandlerFormats);

  }

  public onFilteringErrorCheckType: EmitType<FilteringEventArgs> = (e: FilteringEventArgs) => {
    this.filterData(e,this.errorCheckTypes);
  }
  public onFilteringErrorCheckAlgorithm: EmitType<FilteringEventArgs> = (e: FilteringEventArgs) => {
    this.filterData(e,this.errorCheckAlgorithms);
  }
  filterData(e: FilteringEventArgs, filterData) {
    let query: Query = new Query();
    //frame the query based on search string with filter type.
    query = (e.text !== '') ? query.where('name', 'contains', e.text, true) : query;
    e.updateData(filterData, query);
  }
  public sortDropDown:string ='Ascending';
  errorCheckTypeId:any;
  errorCheckAlgorithmId:any;
  dataFormatId:any;
  // set the placeholder to DropDownList input element
  public errorCheckAlgorithmWaterMark: string = 'Select Error Check Algorith';
  public errorCheckTypeWaterMark: string = 'Select Error Check Type';
  public dataHandlerFormatWaterMark: string = 'Select Data Handler Format';
  public filterPlaceholder: string = 'Search';
  // set the height of the popup element
  public height: string = '200px';
  public locale: string;

  constructor(private globalService: globalSharedService, private gatewayIODHService: GatewayIoDhService, private globalSharedService: globalShareServices, private router: Router, private formBuilder: FormBuilder, private service: CommunicationService) {

  }


  ngOnInit() {
    let requiredPath = document.location.href.split("gateway-config/");
    this.gatewayAndTemplateRoutingPath=this.globalService.setGatewayAndTemplateRoutingPath(requiredPath);
    this.loadFormData();
    this.addGatewayCommIoTagRoutingPath='../'+this.gatewayAndTemplateRoutingPath+'/gateway-comm-io-tag';
    this.IODataHandlerFormRoutingPath='../'+this.gatewayAndTemplateRoutingPath+'/IO-data-handler-form';
    this.gatewayIoDhTagRoutingPath='../'+this.gatewayAndTemplateRoutingPath+'/gateway-io-dh-tag';
    this.gatewayIoDhResponseTagRoutingPath='../'+this.gatewayAndTemplateRoutingPath+'/gateway-io-dh-response-tag';
  }


  // Refresh table
  refreshTableListFunction() {
    this.loadFormData();
  }

  loadFormData() {
    if (this.IODataHandlerDataSource) {
      this.IODataHandlerDataSource.data = [];
    }
    if (this.gatewayCommIOTagDataSource) {
      this.gatewayCommIOTagDataSource.data = [];
    }
    this.showLoaderImage = true;
    this.gatewayId = this.globalService.id;
    this.template = this.globalSharedService.isTemplate;


    this.communicationForm = this.formBuilder.group({
      gatewayTemplateName: [''],
    })
    this.communicationForm.patchValue({
      gatewayTemplateName: this.globalSharedService.parenetName
    })
    this.getDataTypes();
    this.validateCommPramValueForm();
    this.getDataHandlerFormats();
    this.getErrorCheckTypes();
    // IODataHandlerDataSource data
    this.getgatewayCommProtocols(this.gatewayId);
  }


  validateCommPramValueForm() {
    this.gatewayCommProtocolForm = this.formBuilder.group({
      dataFormatId: [[], Validators.required],
      tagSeparator: [null],
      startValidator: [null],
      endValidator: [null],
      errorCheckAlgorithmId: [null],
      errorCheckTypeId: [null],
      commProtocolId: [null],
      isEndValidatorCheckEnabled: [false],
      isStartValidatorCheckEnabled: [false],
      isErrorCheckEnabled: [false],
      isLengthCheckEnabled: [false],
      gatewayCommProtocolParamValues: this.formBuilder.array([
        this.addcommProtocolParamValueForumGroup()
      ])
    });
  }


  previewGatewayCommProtocolForm() {
    this.communicationWriteModeView = false;
    this.communicationReadModeView = true;
    this.gatewayCommIOTagsListView = false;
    this.IODataHandlersListView = false;
    this.commProtocol = <GatewayCommProtocol>this.gatewayCommProtocolForm.value;
    const commParamvalues = this.commProtocol.gatewayCommProtocolParamValues;
    for (let i = commParamvalues.length - 1; i >= 0; i--) {
      commParamvalues[i].commProtocolParamId = this.commProtocolParams[i].id;
    }
    this.commProtocol.gatewayCommProtocolParamValues = commParamvalues;
  }


  createGatewayComProtocol(gatewayCommProtocol: GatewayCommProtocol) {
    this.showLoaderImage = true;
    this.communicationReadModeView = false;
    this.commProtocol = <GatewayCommProtocol>this.gatewayCommProtocolForm.value;
    const commParamvalues = this.commProtocol.gatewayCommProtocolParamValues;
    for (let i = commParamvalues.length - 1; i >= 0; i--) {
      commParamvalues[i].commProtocolParamId = this.commProtocolParams[i].id;
      commParamvalues[i].nodeCommProtocolId = gatewayCommProtocol.id;
    }
    this.serviceGatewayCommProtocolParamValues.forEach(dbParamValue => {
      commParamvalues.forEach(uiParamValue => {
        if (dbParamValue.commProtocolParamId === uiParamValue.commProtocolParamId) {
          uiParamValue.id = dbParamValue.id;
        }
      })
    });

    let userId = sessionStorage.getItem('userId');
    gatewayCommProtocol.createdBy = parseInt(userId);
    gatewayCommProtocol.gatewayCommProtocolParamValues = commParamvalues;
    gatewayCommProtocol.dataFormatId = this.commProtocol.dataFormatId;
    gatewayCommProtocol.errorCheckAlgorithmId = this.commProtocol.errorCheckAlgorithmId;
    gatewayCommProtocol.startValidator = this.commProtocol.startValidator;
    gatewayCommProtocol.endValidator = this.commProtocol.endValidator;
    gatewayCommProtocol.tagSeparator = this.commProtocol.tagSeparator;
    gatewayCommProtocol.isEndValidatorCheckEnabled = this.commProtocol.isEndValidatorCheckEnabled;
    gatewayCommProtocol.isStartValidatorCheckEnabled = this.commProtocol.isStartValidatorCheckEnabled;
    gatewayCommProtocol.isLengthCheckEnabled = this.commProtocol.isLengthCheckEnabled;
    gatewayCommProtocol.isErrorCheckEnabled = this.commProtocol.isErrorCheckEnabled;
    gatewayCommProtocol.commProtocolId = gatewayCommProtocol.commProtocol.id;
    gatewayCommProtocol.nodeId = gatewayCommProtocol.gateway.id;
    this.service.saveGatewayCommProtocol(gatewayCommProtocol).subscribe(res => {
      this.showLoaderImage = false;
      this.gatewayId = gatewayCommProtocol.gateway.id;
      this.createDeleteFlag = 'createGatewayCommProtocol';
      // response handling
      this.modelNotification.alertMessage(res['messageType'], res['message']);
    }, error => {
      this.showLoaderImage = false;
      this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
    });
    //this.communicationWriteModeView = true;
    //this.loadFormData();
  }


  gatewayCommProtocolFinalAction() {
    this.communicationWriteModeView = true;
    this.gatewayCommIOTagsListView = true;
    this.IODataHandlersListView = true;
  }


  public addcommProtocolParamValueForumGroup(): FormGroup {
    return this.formBuilder.group({
      id: [null],
      value: [null],
      commProtocolParamId: []
    })
  }


  public onChange(event: GatewayCommProtocol): void {  // event will give you full breif of action
    this.showLoaderImage = true;
    let id = event.gateway.id;
    if (this.IODataHandlerDataSource) {
      this.IODataHandlerDataSource.data = []
    }
    if (this.gatewayCommIOTagDataSource) {
      this.gatewayCommIOTagDataSource.data = []
    }
    this.serviceGatewayCommProtocolParamValues = event.gatewayCommProtocolParamValues;
    this.getGatewayCommIODHsByGatewayCommProtocolId(event.id);
    this.getGatewayCommIOTagsByGatewayCommProtocolId(event.id);
    this.gatewayCommProtocolForm.patchValue({
      dataFormatId: event.dataFormat.id,
      tagSeparator: event.tagSeparator,
      startValidator: event.startValidator,
      endValidator: event.endValidator,
      errorCheckAlgorithmId: event.errorCheckAlgorithmId,
      isEndValidatorCheckEnabled: event.isEndValidatorCheckEnabled,
      isStartValidatorCheckEnabled: event.isStartValidatorCheckEnabled,
      isErrorCheckEnabled: event.isErrorCheckEnabled,
      isLengthCheckEnabled: event.isLengthCheckEnabled,
    });
    if (event.errorCheckAlgorithm !== null) {
      if (event.errorCheckAlgorithm.errorCheckTypeId != null) {
        this.getErrorCheckAlgorithmOnPageLoad(event.errorCheckAlgorithm.errorCheckTypeId)
      }
      this.gatewayCommProtocolForm.patchValue({
        errorCheckTypeId: this.gatewayCommProtocols[0].errorCheckAlgorithm.errorCheckTypeId
      })
    }
    this.commProtocolParamGroups = event.commProtocol.commProtocolParamGroups;
    this.commProtocolParamGroups = this.commProtocolParamGroups.sort((a, b) => a.displayOrder - b.displayOrder)
    this.getComprotocolParams();
    this.showLoaderImage = false;
  }


  getgatewayCommProtocols(gatewayId) {
    this.service.getGatewayCommProtocolsByGatewayId(gatewayId).subscribe(data => {
      this.showLoaderImage = false;
      this.gatewayCommProtocols = data;
      this.gatewayCommProtocols = this.gatewayCommProtocols.sort((a, b) => a.commProtocolId - b.commProtocolId);
      this.serviceGatewayCommProtocolParamValues = this.gatewayCommProtocols[0].gatewayCommProtocolParamValues;
      this.getGatewayCommIODHsByGatewayCommProtocolId(this.gatewayCommProtocols[0].id);
      this.getGatewayCommIOTagsByGatewayCommProtocolId(this.gatewayCommProtocols[0].id);
      this.gatewayCommProtocolForm.patchValue({
        dataFormatId: this.gatewayCommProtocols[0].dataFormat.id,
        tagSeparator: this.gatewayCommProtocols[0].tagSeparator,
        startValidator: this.gatewayCommProtocols[0].startValidator,
        endValidator: this.gatewayCommProtocols[0].endValidator,
        isEndValidatorCheckEnabled: this.gatewayCommProtocols[0].isEndValidatorCheckEnabled,
        isStartValidatorCheckEnabled: this.gatewayCommProtocols[0].isStartValidatorCheckEnabled,
        isErrorCheckEnabled: this.gatewayCommProtocols[0].isErrorCheckEnabled,
        isLengthCheckEnabled: this.gatewayCommProtocols[0].isLengthCheckEnabled,
        errorCheckAlgorithmId: this.gatewayCommProtocols[0].errorCheckAlgorithmId
      });
      if (this.gatewayCommProtocols[0].errorCheckAlgorithm !== null) {
        if (this.gatewayCommProtocols[0].errorCheckAlgorithm.errorCheckTypeId != null) {
          this.getErrorCheckAlgorithmOnPageLoad(this.gatewayCommProtocols[0].errorCheckAlgorithm.errorCheckTypeId)
        }
        this.gatewayCommProtocolForm.patchValue({
          errorCheckTypeId: this.gatewayCommProtocols[0].errorCheckAlgorithm.errorCheckTypeId
        })
      }
      this.commProtocolParamGroups = this.gatewayCommProtocols[0].commProtocol.commProtocolParamGroups;
      this.commProtocolParamGroups = this.commProtocolParamGroups.sort((a, b) => a.displayOrder - b.displayOrder);
      this.getComprotocolParams();

    })
  }


  getGatewayCommIODHsByGatewayCommProtocolId(gatewayCommProtocolId) {
    this.service.getGatewayCommIODHsByGatewayCommProtocolId(gatewayCommProtocolId).subscribe(data => {
      this.setIODataHandlerDataSource(data);
    })
  }

  getGatewayCommIOTagsByGatewayCommProtocolId(gatewayCommProtocolId) {
    this.service.getGatewayCommIOTagsByGatewayCommProtocolId(gatewayCommProtocolId).subscribe(data => {
      this.communicatinIOTags = data;
      this.setgatewayCommIOTagsDataSource(data);
    })
  }

  setgatewayCommIOTagsDataSource(gatewayCommIOTags: any[]) {
    if (Array.isArray(gatewayCommIOTags) && gatewayCommIOTags.length) {
      gatewayCommIOTags.sort((a, b) => b.id - a.id);

      gatewayCommIOTags.forEach(commIOTag => {
        this.dataHandlerFormats.forEach(format => {
          if (commIOTag.dataFormatId == format.id) {
            commIOTag.dataFormatName = format.name;
          }
        })
        if (commIOTag.parentNodeCommProtocolIoTagId) {
          gatewayCommIOTags.forEach(parentIoTag => {
            if (commIOTag.parentNodeCommProtocolIoTagId == parentIoTag.id) {
              commIOTag.parentTagName = parentIoTag.gatewayIOTag.name
            }
          })
        }
        if (!commIOTag.dataFormatName) {
          commIOTag.dataFormatName = ''
        }
        if (!commIOTag.parentTagName) {
          commIOTag.parentTagName = ''
        }
        // if (!commIOTag.tagIndex) {
        //   commIOTag.tagIndex = ''
        // }
        if (!commIOTag.tagLength) {
          commIOTag.tagLength = ''
        }
        if (!commIOTag.tagLengthUnit) {
          commIOTag.tagLengthUnit = ''
        } if (!commIOTag.tagKeyName) {
          commIOTag.tagKeyName = ''
        }
       //commIOTag.tagIndex = commIOTag.tagIndex + ''
      })

      this.gatewayCommIOTagDataSource = new MatTableDataSource();
      this.gatewayCommIOTagDataSource.filterPredicate = function (data, filter: string): boolean {
        return data.gatewayIOTag.name.toLowerCase().includes(filter)
          || data.tagIndex.toString().toLowerCase().includes(filter)
          || data.tagLength.toString().toLowerCase().includes(filter)
          || data.tagLengthUnit.toLowerCase().includes(filter)
          || data.tagKeyName.toLowerCase().includes(filter)
          || data.parentTagName.toLowerCase().includes(filter)
          || data.dataFormatName.toLowerCase().includes(filter);
      };

      this.gatewayCommIOTagDataSource.data = gatewayCommIOTags;

       // To get paginator events from child mat-table-paginator to access its properties
       this.gatewayCommPaginator = this.myGatewayCommPaginator.getDatasource();
       this.gatewayCommIOTagDataSource.paginator = this.gatewayCommPaginator;
       this.gatewayCommIOTagDataSource.paginator.length = this.gatewayCommIOTagDataSource.data.length;
       this.gatewayCommPaginator.sort = this.sort;
       this.NoRecordsFoundIOTag = false;
    }
    else {
      this.NoRecordsFoundIOTag = true;
      this.showLoaderImage = false;
    }
  }

  setIODataHandlerDataSource(nodeIoDhs: GatewayIODataHandler[]) {
    this.prepareIODHs(nodeIoDhs);
    nodeIoDhs = nodeIoDhs.sort((a, b) => b.id - a.id);
    if (Array.isArray(nodeIoDhs) && nodeIoDhs.length) {
      // this.IODataHandlerDataSource = new MatTableDataSource();
      this.IODataHandlerDataSource = new MatTableDataSource();
      this.IODataHandlerDataSource.filterPredicate = function (data, filter: string): boolean {
        return data.name.toLowerCase().includes(filter) || data.dhCode.toLowerCase().includes(filter)
          || data.operationMode.toLowerCase().includes(filter) || data.sendResponse.toLowerCase().includes(filter)
          || data.status.toLowerCase().includes(filter);

      };
      this.IODataHandlerDataSource.data = nodeIoDhs;

      // To get paginator events from child mat-table-paginator to access its properties
      this.IODataHandlerPaginator = this.myIODataHandlerPaginator.getDatasource();
      this.IODataHandlerDataSource.paginator = this.IODataHandlerPaginator;
      this.IODataHandlerDataSource.paginator.length = this.IODataHandlerDataSource.data.length;
      this.IODataHandlerPaginator.sort = this.sort;
      this.NoRecordsFoundIODH = false;
    }
    else {
      this.NoRecordsFoundIODH = true;
      this.showLoaderImage = false;
    }
  }

  prepareIODHs(nodeIoDhs: GatewayIODataHandler[]) {
    nodeIoDhs.forEach(nodeIODH => {
      if (nodeIODH.operationMode === 'R') {
        nodeIODH.operationMode = 'Read'
      }
      else if (nodeIODH.operationMode === 'W') {
        nodeIODH.operationMode = 'Write'
      }

      if (nodeIODH.sendResponse === true) {
        nodeIODH.sendResponse = 'Yes'
      }
      else if (nodeIODH.sendResponse === false) {
        nodeIODH.sendResponse = 'No'
      }
      if (nodeIODH.status === 'A') {
        nodeIODH.status = 'Active'
      }
      else if (nodeIODH.status === 'D') {
        nodeIODH.status = 'In-Active'
      }
    })
  }


  patchFormArray(): FormArray {
    const formArray = new FormArray([]);
    if (this.commProtocolParams != null && this.commProtocolParams.length != 0) {
      this.commProtocolParams.forEach(app => {
        if (this.dataTypes) {
          this.dataTypes.forEach(type => {
            if (type.id == app.dataTypeId) {
              app.dataTypeName = type.name;
            }
          })
        }
        let isSelected = false;
        let index = 0;
        if (null !== this.serviceGatewayCommProtocolParamValues && this.serviceGatewayCommProtocolParamValues.length != 0) {
          for (let paramValue of this.serviceGatewayCommProtocolParamValues) {
            if (app.id === paramValue.commProtocolParamId) {
              isSelected = true;
              break;
            }
            index++;
          }
        }

        /* this.serviceGatewayCommProtocolParamValues.every(paramValue => {
          if (app.id === paramValue.commProtocolParamId) {
            isSelected = true;
            return false;
          }
          index++;
        }); */
        if (isSelected) {
          if (app.isNull) {
            if (app.uiComponentTypeId == '1') {
              formArray.push(this.formBuilder.group({
                id: this.serviceGatewayCommProtocolParamValues[index].id,
                value: [this.serviceGatewayCommProtocolParamValues[index].value, Validators.pattern(this.globalService.getPatternForCommunication(app.dataTypeName))],
                commProtocolParamId: this.serviceGatewayCommProtocolParamValues[index].commProtocolParamId
              }))
            }
            else {
              formArray.push(this.formBuilder.group({
                id: this.serviceGatewayCommProtocolParamValues[index].id,
                value: [this.serviceGatewayCommProtocolParamValues[index].value],
                commProtocolParamId: this.serviceGatewayCommProtocolParamValues[index].commProtocolParamId
              }))
            }
          } else {
            if (app.uiComponentTypeId == '1') {
              formArray.push(this.formBuilder.group({
                id: this.serviceGatewayCommProtocolParamValues[index].id,
                value: [this.serviceGatewayCommProtocolParamValues[index].value, [Validators.required, Validators.pattern(this.globalService.getPatternForCommunication(app.dataTypeName))]],
                commProtocolParamId: this.serviceGatewayCommProtocolParamValues[index].commProtocolParamId
              }))
            } else {
              formArray.push(this.formBuilder.group({
                id: this.serviceGatewayCommProtocolParamValues[index].id,
                value: [this.serviceGatewayCommProtocolParamValues[index].value, [Validators.required]],
                commProtocolParamId: this.serviceGatewayCommProtocolParamValues[index].commProtocolParamId
              }))
            }

          }

        }
        else {
          let defaultValue = app.defaultValue;
          if (null == defaultValue) {
            for (let value of app.commProtocolParamValues) {
              if (value.isDefaultValue) {
                defaultValue = value.value;
                break;
              }
            }
          }
          if (app.isNull) {
            if (app.uiComponentTypeId == '1') {
              formArray.push(this.formBuilder.group({
                id: null,
                value: [defaultValue, Validators.pattern(this.globalService.getPatternForCommunication(app.dataTypeName))],
                commProtocolParamId: app.id
              }))
            } else {
              formArray.push(this.formBuilder.group({
                id: null,
                value: [defaultValue],
                commProtocolParamId: app.id
              }))
            }

          } else {
            if (app.uiComponentTypeId == '1') {
              formArray.push(this.formBuilder.group({
                id: null,
                value: [defaultValue, [Validators.required, Validators.pattern(this.globalService.getPatternForCommunication(app.dataTypeName))]],
                commProtocolParamId: app.id
              }))
            } else {
              formArray.push(this.formBuilder.group({
                id: null,
                value: [defaultValue, [Validators.required]],
                commProtocolParamId: app.id
              }))
            }

          }

        }
      });
    }
    return formArray;
  }


  getComprotocolParams() {
    const control = <FormArray>this.gatewayCommProtocolForm.controls['gatewayCommProtocolParamValues'];
    for (let i = control.length - 1; i >= 0; i--) {
      control.removeAt(i)
    }
    this.commProtocolParams = [];
    this.commProtocolParamGroups = this.commProtocolParamGroups.sort((a, b) => a.displayOrder - b.displayOrder)
    for (let commProtocolParamGroup of this.commProtocolParamGroups) {
      let i = 0;
      let params : CommProtocolParam[] = []
      let commProtocolParams = commProtocolParamGroup.commProtocolParams;
      // commProtocolParams = commProtocolParams.sort((a, b) => a.displayOrder - b.displayOrder);
      for (let commProtocolParam of commProtocolParams) {
        // if (i == 0) {
        //   commProtocolParam.commProtocolParamGroupName = commProtocolParamGroup.name;
        // }
        // this.commProtocolParams.push(commProtocolParam);
        params.push(commProtocolParam);
        i++;
      }
      params = params.sort((a, b) => a.displayOrder - b.displayOrder);
      if(params.length > 0){
        params[0].commProtocolParamGroupName = params[0].commProtocolParamGroup.name;
      }
      this.commProtocolParams = this.commProtocolParams.concat(params);
    }

    for (let comProtocolParam of this.commProtocolParams) {
      comProtocolParam.commProtocolParamValues.sort((a, b) => a.id - b.id);
      (<FormArray>this.gatewayCommProtocolForm.get('gatewayCommProtocolParamValues')).push(this.addcommProtocolParamValueForumGroup());
    }
    //if (this.serviceGatewayCommProtocolParamValues != null && this.serviceGatewayCommProtocolParamValues.length != 0) {
    this.gatewayCommProtocolForm.setControl('gatewayCommProtocolParamValues', this.patchFormArray());
    // }
  }

  public onclickGetComprotocolParamValues(id) {
    //
    this.service.getCommProtocolParamValue(id).subscribe(data => {
      this.commProtocolParamValues = data;
    })
  }

  getDataHandlerFormats() {
    this.service.getDataHandlerFormats().subscribe(data => {
      this.dataHandlerFormats = data;
      this.dataHandlerFormats= this.globalSharedService.addSelectIntoList(this.dataHandlerFormats);
    })
  }

  getErrorCheckTypes() {
    this.service.getErrorCheckTypes().subscribe(data => {
      this.errorCheckTypes = data;
      this.errorCheckTypes= this.globalSharedService.addSelectIntoList(this.errorCheckTypes);
    })
  }

  getErrorCheckAlgorithm(errorCheckTypeId) {

    this.errorCheckAlgorithms = [];
    this.gatewayCommProtocolForm.controls['errorCheckAlgorithmId'].setValidators([Validators.required]);
    this.gatewayCommProtocolForm.controls['errorCheckAlgorithmId'].setValue(null);
    this.gatewayCommProtocolForm.controls['errorCheckAlgorithmId'].markAsTouched();
    this.gatewayCommProtocolForm.controls['errorCheckAlgorithmId'].updateValueAndValidity();
    this.gatewayCommProtocolForm.controls['errorCheckAlgorithmId'].setErrors({
      'required': true
    })

    if (isNaN(errorCheckTypeId)) {
      this.gatewayCommProtocolForm.controls['errorCheckAlgorithmId'].clearValidators();
      this.gatewayCommProtocolForm.controls['errorCheckAlgorithmId'].updateValueAndValidity();
    }
    else {
      this.service.getErrorCheckAlgorithmByErrorCheckTypeId(errorCheckTypeId).subscribe(data => {
        this.errorCheckAlgorithms = data;
        this.errorCheckAlgorithms= this.globalSharedService.addSelectIntoList(this.errorCheckAlgorithms);
      })
    }

  }

  getErrorCheckAlgorithmOnPageLoad(errorCheckTypeId) {
    this.service.getErrorCheckAlgorithmByErrorCheckTypeId(errorCheckTypeId).subscribe(data => {
      this.errorCheckAlgorithms = data;
      this.errorCheckAlgorithms= this.globalSharedService.addSelectIntoList(this.errorCheckAlgorithms);
    })
  }

  parseInt(id) {
    if (isNaN(id)) {
      return id;
    }
    return parseInt(id);
  }

  backButton() {
    this.communicationWriteModeView = true;
    this.communicationReadModeView = false;
    this.gatewayCommIOTagsListView = true;
    this.IODataHandlersListView = true;
    window.scrollTo(0, 0);
  }


  commParamValuesForRadioButton(id) {
    this.service.getCommProtocolParamValue(id).subscribe(data => {
      this.commParamValuesForRadio = data;
    })
  }

  resetgatewayCommProtocolForm(gatewayCommProtocol) {
    this.resetgatewayCommProtocolFormObj = gatewayCommProtocol;
    if (this.gatewayCommProtocolForm.dirty) {
      this.warningFlag = "reset";
      this.modelNotification.alertMessage(this.globalService.messageType_Warning, 'You will not be able to recover the changes!');
    }
  }


  // Form reset  confirm
  formResetConfirm() {
    this.commProtocol = <GatewayCommProtocol>this.gatewayCommProtocolForm.value;
    if (this.commProtocol.id === null) {
      this.validateCommPramValueForm();
    }
    else {
      this.validateCommPramValueForm();
      this.onChange(this.resetgatewayCommProtocolFormObj);
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

  setGatewayCommProtocolData(gatewayCommProtocol: GatewayCommProtocol, id, operation) {
    this.service.setGatewayCommProtocol(gatewayCommProtocol);
    this.globalSharedService.GettingId(id);
    this.globalSharedService.GettingString(operation);
  }

  deleteGatewayIODataHandler(gatewayId, id) {
    this.deleteGatewayID = gatewayId;
    this.gatewayDHId = id;
    this.modelNotification.alertMessage(this.globalService.messageType_Error, 'You will not be able to recover this Gateway I/O Data Handler!');
    this.createDeleteFlag = "gatewayIODataHandler";

  }

  // IODataHandler confirm delete
  confirmDeleteIODataHandler() {
    let userId = sessionStorage.getItem('userId');
    this.service.deleteGatewayIODataHandler(this.gatewayDHId, Number(userId)).subscribe(res => {
      this.globalSharedService.GettingId(this.deleteGatewayID);
      // response handling
      this.modelNotification.alertMessage(res['messageType'], res['message']);
    },
      (error: any) => {
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      }
    );
  }


  addChildIOTagData(gatewayCommProtocol: GatewayCommProtocol, id, view: string) {
    this.service.setGatewayCommProtocol(gatewayCommProtocol);
    this.globalSharedService.GettingId(id);
    this.globalSharedService.GettingString(view);
  }

  cancelCommunicationTab() {
    if (this.gatewayCommProtocolForm.dirty) {
      this.warningFlag = "cancel";
      this.modelNotification.alertMessage(this.globalService.messageType_Warning, 'You will not be able to recover the changes!');
    } else {
      this.formCancelConfirm();
    }
  }


  // Confirm redirect to
  formCancelConfirm() {
    let myTab = document.getElementById('gatewayList');
    myTab.click();
  }


  deleteCommIOTag(gatewayCommProtocol: GatewayCommProtocolIOTag) {
    this.commIOTag = gatewayCommProtocol;
    this.modelNotification.alertMessage(this.globalService.messageType_Error, 'You will not be able to recover this Gateway Communication I/O Tag!');
    this.createDeleteFlag = "gatewayCommIOTag";
  }


  // confirmDelete
  confirmDelete() {
    // If delete is gatewayCommIOTag
    if (this.createDeleteFlag == 'gatewayCommIOTag') {
      this.confirmDeleteCommIOTag();
    } else if (this.createDeleteFlag == 'gatewayIODataHandler') { // // If delete is gatewayIODataHandler
      this.confirmDeleteIODataHandler();
    }
  }

  // success Delete
  successCreateDeleteHandling() {
    if (this.createDeleteFlag == 'gatewayCommIOTag') {
      this.gatewayIOTagSuccess();
    } else if (this.createDeleteFlag == 'gatewayIODataHandler') {
      this.loadFormData();
    } else if (this.createDeleteFlag == "createGatewayCommProtocol") {
      this.gatewayCommProtocolFinalAction();
    }
    this.createDeleteFlag = '';
  }

  confirmDeleteCommIOTag() {
    let userId = sessionStorage.getItem('userId');
    this.commIOTag.updated_by = parseInt(userId);
    if (!this.commIOTag.tagLength) {
      this.commIOTag.tagLength =null;
    }
    this.service.deleteGatewayCommIOTag(this.commIOTag).subscribe(res => {
      // response handling
      this.modelNotification.alertMessage(res['messageType'], res['message']);
    })
  }

  // Gateway comm IO Tag success
  gatewayIOTagSuccess() {
    this.globalSharedService.GettingId(this.gatewayId);
    this.loadFormData();
  }

  searchButton() {
    let x = <HTMLInputElement>document.getElementById("IODataHandlerDataSource");
    if (x.style.display === "none") {
      x.style.display = "inline-block";
    } else {
      x.style.display = "none";
    }
  }

  getDataTypes(): void {
    this.service.getDataTypes()
      .subscribe(
        res => {
          this.dataTypes = res as any[];
        },
        error => {
          this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
        });
  }

  /*
    Material table paginator code starts here
  */
  myPaginator;
  pageIndex: number;
  pageSize: number;
  length: number;

  /*
    Material pagination getting pageIndex, pageSize, length through
    events(On change page, Next,Prev, Last, first) */
    matTablePaginator(myPaginator) {
      this.pageIndex = myPaginator.pageIndex;
      this.pageSize = myPaginator.pageSize;
      this.length = myPaginator.length;
    }


    /* Load table data always to the Top of the table
when change paginator page(Next, Prev, Last, First), Page size  */
  onPaginateViewScrollToTop() {
    this.directiveRef.scrollToTop();
    this.directiveRef.update();
  }

  /*
    Material table paginator code ends here
  */

    validateStartValidator(event) {
      if (event.checked) {
        if (!this.gatewayCommProtocolForm.controls['startValidator'].value) {
          this.assignErrorToEStartValidator();
        }
      }
      else {
        this.gatewayCommProtocolForm.controls['startValidator'].clearValidators();
        this.gatewayCommProtocolForm.controls['startValidator'].updateValueAndValidity();
      }
    }

    validateEndValidator(event) {
      if (event.checked) {
        if (!this.gatewayCommProtocolForm.controls['endValidator'].value) {
          this.assignErrorToEndValidator()
        }
      }
      else {
        this.gatewayCommProtocolForm.controls['endValidator'].clearValidators();
        this.gatewayCommProtocolForm.controls['endValidator'].updateValueAndValidity();
      }
    }

    validateStartValidatorText(value) {
      if (!value) {
        if (this.gatewayCommProtocolForm.controls['isStartValidatorCheckEnabled'].value) {
          this.assignErrorToEStartValidator();
        } else {
          this.gatewayCommProtocolForm.controls['startValidator'].clearValidators();
          this.gatewayCommProtocolForm.controls['startValidator'].updateValueAndValidity();
        }
      }
    }


    assignErrorToEStartValidator() {
      this.gatewayCommProtocolForm.controls['startValidator'].setValidators([Validators.required]);
      // this.gatewayCommProtocolForm.controls['startValidator'].setValue(null);
      this.gatewayCommProtocolForm.controls['startValidator'].markAsTouched();
      this.gatewayCommProtocolForm.controls['startValidator'].updateValueAndValidity();
      this.gatewayCommProtocolForm.controls['startValidator'].setErrors({
        'required': true
      })
    }


    validateEndValidatorText(value) {
      if (!value) {
        if (this.gatewayCommProtocolForm.controls['isEndValidatorCheckEnabled'].value) {
          this.assignErrorToEndValidator();
        } else {
          this.gatewayCommProtocolForm.controls['endValidator'].clearValidators();
          this.gatewayCommProtocolForm.controls['endValidator'].updateValueAndValidity();
        }
      }
    }

    assignErrorToEndValidator() {
      this.gatewayCommProtocolForm.controls['endValidator'].setValidators([Validators.required]);
      // this.gatewayCommProtocolForm.controls['startValidator'].setValue(null);
      this.gatewayCommProtocolForm.controls['endValidator'].markAsTouched();
      this.gatewayCommProtocolForm.controls['endValidator'].updateValueAndValidity();
      this.gatewayCommProtocolForm.controls['endValidator'].setErrors({
        'required': true
      })
    }

    validateErrorCheck(event) {
      if (event.checked) {
        if (!this.gatewayCommProtocolForm.controls['errorCheckTypeId'].value) {
          this.assignErrorToErrorCheckType()
        }
      }
      else {
        this.gatewayCommProtocolForm.controls['errorCheckTypeId'].clearValidators();
        this.gatewayCommProtocolForm.controls['errorCheckTypeId'].updateValueAndValidity();
      }
    }


    assignErrorToErrorCheckType() {
      this.gatewayCommProtocolForm.controls['errorCheckTypeId'].setValidators([Validators.required]);
      // this.gatewayCommProtocolForm.controls['startValidator'].setValue(null);
      this.gatewayCommProtocolForm.controls['errorCheckTypeId'].markAsTouched();
      this.gatewayCommProtocolForm.controls['errorCheckTypeId'].updateValueAndValidity();
      this.gatewayCommProtocolForm.controls['errorCheckTypeId'].setErrors({
        'required': true
      })
    }

    validateErrorCheckType(value) {
      if (!value) {
        if (this.gatewayCommProtocolForm.controls['isErrorCheckEnabled'].value) {
          this.assignErrorToErrorCheckType();
        } else {
          this.gatewayCommProtocolForm.controls['errorCheckTypeId'].clearValidators();
          this.gatewayCommProtocolForm.controls['errorCheckTypeId'].updateValueAndValidity();
        }
      }
    }
    dataHandlerFormatOnChange($event){
      if ($event.value) {
        this.gatewayCommProtocolForm.controls['dataSubProtocolFormatID'].setValue(Number($event.itemData.id));
      }else{
        this.gatewayCommProtocolForm.controls['dataSubProtocolFormatID'].setValue(null);
      }
    }
    errorCheckTypeOnChange($event){
      if ($event.value) {
        this.getErrorCheckAlgorithm(Number($event.itemData.id));
        this.gatewayCommProtocolForm.controls['errorCheckTypeId'].setValue(Number($event.itemData.id));
      }else{
        this.gatewayCommProtocolForm.controls['errorCheckTypeId'].setValue(null);
      }
    }
    errorCheckAlgorithmOnChange($event){
      if ($event.value) {
        this.gatewayCommProtocolForm.controls['errorCheckAlgorithmId'].setValue(Number($event.itemData.id));
      }else{
        this.gatewayCommProtocolForm.controls['errorCheckAlgorithmId'].setValue(null);
      }
    }

}
