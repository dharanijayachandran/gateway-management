import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { GatewayModel } from '../model/gateway-model';
import { GatewayModelPort } from '../model/gateway-model-port';
import { GatewayModelPin } from '../model/gateway-model-pin';
import { GatewayModelCommStandard } from '../model/gateway-model-comm-standard';
import { GatewayModelCommStandardMapping } from '../model/gateway-model-comm-standard-mapping';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};
@Injectable({
  providedIn: 'root'
})
export class GatewayModelService {
  apiurl = environment.baseUrl_gatewayManagement;
  constructor(private http: HttpClient) { }

  getGatewayTypes(): Observable<any[]> {
    return this.http.get<any[]>(this.apiurl + 'getGatewayTypes');
  }

  getPortTypes(): Observable<any[]> {
    return this.http.get<any[]>(this.apiurl + 'getPortTypes');
  }

  getGatewayModelList(organizationId): Observable<GatewayModel[]> {
    return this.http.get<GatewayModel[]>(this.apiurl + 'getAllGatewayModel/'+ organizationId);
  }
  getGatewayModelByGatewayModelId(gatewayModelId): Observable<GatewayModel> {
    return this.http.get<GatewayModel>(this.apiurl + 'getGatewayModelByGatewayModelId/' + gatewayModelId);
  }
  addGatewayModel(gatewayModel: GatewayModel): Observable<GatewayModel> {
    return this.http.post<GatewayModel>(`${this.apiurl + 'addGatewayModel'}`, gatewayModel, httpOptions);
  }
  updateGatewayModel(gatewayModel: GatewayModel): Observable<GatewayModel> {
    return this.http.put<GatewayModel>(`${this.apiurl + 'updateGatewayModel'}`, gatewayModel, httpOptions);
  }
  deleteGatewayModel(gatewayModelId, userId): Observable<GatewayModel> {
    return this.http.delete<GatewayModel>(`${this.apiurl + 'deleteGatewayModel/' + gatewayModelId + '/' + userId}`, httpOptions);
  }

  getGatewayModelPortByGatewayModelId(gatewayModelId): Observable<GatewayModelPort[]> {
    return this.http.get<GatewayModelPort[]>(this.apiurl + 'getAllGatewayModelPortByGatewayModelId/' + gatewayModelId);
  }
  getGatewayModelPortByGatewayModelPortId(gatewayModelPortId): Observable<GatewayModelPort> {
    return this.http.get<GatewayModelPort>(this.apiurl + 'getGatewayModelPortByGatewayModelPortId/' + gatewayModelPortId);
  }
  addGatewayModelPort(gatewayModelPort: GatewayModelPort): Observable<GatewayModelPort> {
    return this.http.post<GatewayModelPort>(`${this.apiurl + 'addGatewayModelPort'}`, gatewayModelPort, httpOptions);
  }
  updateGatewayModelPort(gatewayModelPort: GatewayModelPort): Observable<GatewayModelPort> {
    return this.http.put<GatewayModelPort>(`${this.apiurl + 'updateGatewayModelPort'}`, gatewayModelPort, httpOptions);
  }
  deleteGatewayModelPort(gatewayModelPortId, userId): Observable<GatewayModelPort> {
    return this.http.delete<GatewayModelPort>(`${this.apiurl + 'deleteGatewayModelPort/' + gatewayModelPortId + '/' + userId}`, httpOptions);
  }

  getGatewayModelPinsByGatewayModelId(gatewayModelId): Observable<GatewayModelPin[]> {
    return this.http.get<GatewayModelPin[]>(this.apiurl + 'getAllGatewayModelPinByGatewayModelId/' + gatewayModelId);
  }

  getGatewayModelPinsByGatewayModelPortId(gatewayModelPortId): Observable<GatewayModelPin[]> {
    return this.http.get<GatewayModelPin[]>(this.apiurl + 'getGatewayModelPinForPortPinMapping/' + gatewayModelPortId);
  }

  addGatewayModelPins(pinsDetails){
    return this.http.post(`${this.apiurl + 'addGatewayModelPin'}`, pinsDetails, httpOptions);
  }

  updateGatewayModelPins(pinsDetails) {
    return this.http.put(`${this.apiurl + 'updateGatewayModelPin'}`, pinsDetails, httpOptions);
  }

  getCommStandardsByGatewayModelId(gatewayModelId): Observable<GatewayModelCommStandard[]> {
    return this.http.get<GatewayModelCommStandard[]>(this.apiurl + 'getAllGatewayModelCommStandardByGatewayModelId/' + gatewayModelId);
  }

  addGatewayModelCommStandard(commStandardDetails){
    return this.http.post(`${this.apiurl + 'addGatewayModelCommStandard'}`, commStandardDetails, httpOptions);
  }

  updateGatewayModelCommStandard(commStandardDetails){
    return this.http.put(`${this.apiurl + 'updateGatewayModelCommStandard'}`, commStandardDetails, httpOptions);
  }

  deleteGatewayModelCommStandard(gatewayModelCommStandardId, userId): Observable<GatewayModelCommStandard> {
    return this.http.delete<GatewayModelCommStandard>(`${this.apiurl + 'deleteGatewayModelCommStandard/' + gatewayModelCommStandardId + '/'+userId}`, httpOptions);
  }

  getCommStandardMappingDataByDeviceModelId(gatewayModelId): Observable<GatewayModelCommStandardMapping[]> {
    return this.http.get<GatewayModelCommStandardMapping[]>(this.apiurl + 'getCommStandardMappingDataByGatewayModelId/' + gatewayModelId);
  }

  getCommunicationStandardsForDeviceModel(): Observable<any[]> {
    return this.http.get<any[]>(this.apiurl + 'getCommunicationStandardsForGatewayModel');
  }

  addGatewayModelPinPortForCommStd(commStandardDetails){
    return this.http.post(`${this.apiurl + 'addGatewayModelPinPortCommStd'}`, commStandardDetails, httpOptions);
  }

  updateGatewayModelPinPortForCommStd(commStandardDetails){
    return this.http.put(`${this.apiurl + 'updateGatewayModelPinPortCommStd'}`, commStandardDetails, httpOptions);
  }

  deleteGatewayModelPinPortForCommStd(gatewayModelPinPortCommStdId, userId): Observable<GatewayModelCommStandard> {
    return this.http.delete<GatewayModelCommStandard>(`${this.apiurl + 'deleteGatewayModelPinPortCommStd/' + gatewayModelPinPortCommStdId + '/'+userId}`, httpOptions);
  }

  addGatewayModelPortPinMapping(portPinDetail){
    return this.http.post(`${this.apiurl + 'addGatewayModelPortPin'}`, portPinDetail, httpOptions);
  }
  
  deleteGatewayModelPortPinMapping(gatewayModelPortPinId, userId): Observable<GatewayModelCommStandard> {
    return this.http.delete<GatewayModelCommStandard>(`${this.apiurl + 'deleteGatewayModelPortPin/' + gatewayModelPortPinId + '/'+userId}`, httpOptions);
  }
  getavailableStandardDataListSelected(gatewayModelId){
    return this.http.get<GatewayModelCommStandard[]>(this.apiurl + 'getAllGatewayModelCommStandardByGatewayModelId/' + gatewayModelId);
  }
}
