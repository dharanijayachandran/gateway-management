import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { start } from 'repl';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { GatewayCommProtocol } from '../../../gateway-template/model/gatewayCommProtocol';
import { GatewayTemplate } from '../../../gateway-template/model/gatewayTemplate';
import { Gateway } from '../../model/gateway';
import { ResponseObject } from '../../model/Response';
import { uploadGateway } from '../../model/uploadTemplate';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class GatewayService {

  apiurl = environment.baseUrl_gatewayManagement;
  assetApiUrl = environment.baseUrl_AssetManagement;

  constructor(private http: HttpClient) { }

  // To get all Gatway list
  getGateWayList(organizationId, offset, limit): Observable<ResponseObject> {
    return this.http.get<ResponseObject>(this.apiurl + 'organizations/' + organizationId + "/gateways?offset=" + offset + "&limit=" + limit);
  }
  deleteBulkGateway(organizationId, gateways) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: gateways
    };
    return this.http.delete<any>((this.apiurl + 'organizations/' + organizationId + '/' + 'gateways'), httpOptions);
  }

  //createGateway
  createGateway(gateway: Gateway[]): Observable<Gateway[]> {
    return this.http.post<Gateway[]>(`${this.apiurl + 'gateway'}`, gateway, httpOptions);
  }

  // updateGateway
  updateGateway(gateway): Observable<Gateway> {
    return this.http.put<Gateway>(`${this.apiurl + 'gateway'}`, gateway, httpOptions);
  }
  getGatewayById(gatewayId: any) {
    return this.http.get<Gateway>(this.apiurl + 'gatewayById/' + gatewayId);
  }
  getGatewayTemplatesByTypeIdAndBEId(gatewayTypeId: any, orgId: any): Observable<GatewayTemplate[]> {
    return this.http.get<GatewayTemplate[]>(this.apiurl + 'gatewayTemplates/' + gatewayTypeId + "/" + orgId);
  }
  saveGatewayCommProtocolParamValues(gatewayCommProtocol: any): Observable<GatewayCommProtocol> {
    return this.http.put<GatewayCommProtocol>(`${this.apiurl + 'gatewayCommProtocolParamValues'}`, gatewayCommProtocol, httpOptions);
  }
  deleteGateway(gatewayId, userId): Observable<void> {
    return this.http.delete<void>(`${this.apiurl + 'gateway/' + gatewayId + '/' + userId}`, httpOptions);

  }
  checkAvailability(nodeIdentifier): Observable<boolean> {
    return this.http.get<boolean>(this.apiurl + 'checkAvailability/' + nodeIdentifier);
  }
  uploadTemplate(formData, beId, userId): Observable<any> {
    return this.http.post<any>(`${this.apiurl + 'organizations/' + beId + '/upload-gateways?userId=' + userId}`, formData, httpOptions);
  }
  getAssetTemplates(gatewatTemplateId) {
    return this.http.get<any[]>(this.assetApiUrl + 'assetTemplatesByGatewayTemplateId/' + gatewatTemplateId);
  }
  downloadTemplateData(downloadTemplate: Gateway): Observable<any> {
    return this.http.post<any>(this.apiurl + 'downloadTemplate', downloadTemplate, { observe: 'response', responseType: 'blob' as 'json' });
  }
  clearGatewayIdentifier(gatewayIdentifier: string): Observable<void> {
    return this.http.delete<void>(`${this.apiurl + 'gateway/' + gatewayIdentifier}`, httpOptions);
  }
  getAuthToken(): Observable<string> {
    return this.http.get<string>(this.apiurl + 'gateway/authToken');
  }
  saveExcelGateways(gateways): Observable<any> {
    return this.http.post<any>(`${this.apiurl + 'gateways'}`, gateways, httpOptions);
  }
  getServiceRequest(organizationId, serviceRequest, startDate, endDate): Observable<any> {
    return this.http.post<any>(this.apiurl + 'organizations/' + organizationId + '/service-requests/criteria?start-date=' + startDate + '&end-date=' + endDate, serviceRequest);
  }
  getFieldDataFromServiceRequest(organizationId, serviceRequest): Observable<any> {
    return this.http.post<any>(this.apiurl + 'organizations/' + organizationId + '/service-requests/criteria', serviceRequest);
  }
  getGatewayFilterByData(organizationId, gatewayFilterObj) {
    return this.http.post<any>(this.apiurl + 'organizations/' + organizationId + '/gateways-filter?offset=0&limit=0', gatewayFilterObj)
  }
}

